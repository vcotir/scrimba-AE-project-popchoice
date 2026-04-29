import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import { openai, supabase } from "./config.js";

const app = new Hono();

app.use(
  cors({
    origin: "*",
    allowedMethods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: "Content-Type",
  }),
);
app.get("/", (c) => c.text("Hono!"));

app.post("/recommendation", async (c) => {
  const body = await c.req.json();
  console.log("body", body);

  await main(body)
  // return something here
  return true
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});

