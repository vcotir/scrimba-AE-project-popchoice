import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import { openai, supabase } from "./config.js";

const app = new Hono();

app.use(
  "/recommendation",
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);
app.get("/", () => new Response("Hono!"));

app.post("/recommendation", async (c) => {
  const body = await c.req.json();
  console.log("body", body);

  const response = await main(body);
  console.log('right before returning', response)
  return c.json({ completion: response });
});

serve({
  fetch: app.fetch,
  port: 3000,
  overrideGlobalObjects: false,
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  process.exit(0);
});

async function main(input) {
  try {
    const string = splay(input)
    const embedding = await createEmbedding(string);
    const matchStr = await findNearestMatch(embedding);
    const response = await getChatCompletion(matchStr, string);
    return response;
  } catch (err) {
    console.error("Issue in main function: ", err);
    throw new Error(err);
  }
}

function splay(input) { 
  return `Favorite movie: ${input.favorite_movie}. New or classic: ${input.newness}.Fun or serious: ${input.fun_or_serious}`

}

// Create an embedding vector representing the query
async function createEmbedding(input) {

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });
  return embeddingResponse.data[0].embedding;
}

// Query Supabase and return a semantically matching text chunk
async function findNearestMatch(embedding) {
  console.log(embedding)
  console.log('finding nearest match')
  try {
    const { data, error } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 4,
    });

    console.log('data', data);
    console.log('error', error)
     if (error) {
      console.error('Error in supabase match_movies', error)
      throw error;
     }

    const content = data.map((val) => {
      return val.content;
    });
    console.log('content', content, "typeof", typeof content, "isArray", Array.isArray(content));
    
   
    return content.join("\n");
  } catch (err) {
    console.error('Error finding nearest match', err)
    throw err
   }
}

// Use OpenAI to make the response conversational
async function getChatCompletion(text, query) {
  const chatMessages = [
    {
      role: "system",
      content: `You are an enthusiastic movie expert who loves recommending movies to people. 
    You will be given two pieces of information - some context about movies and a question.
    Your main job is to formulate a short answer to the question using the provided context.
    If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer."
    Please do not make up the answer.`,
    },
  ];

  chatMessages.push({
    role: "user",
    content: `Context: ${text} Question: ${query}`,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: chatMessages,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });
  console.log(response.choices[0].message.content);

  return response.choices[0].message.content;
}
