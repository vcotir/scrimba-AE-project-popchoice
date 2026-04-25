/*
    This script seeds the database with movie embeddings.

    Flow: 
        Grabs movies.txt file string
        Splits w/ langChain text splitter
        Loops through to create openai embedding for each
        Stores list of embeddings into supabase table

    Prereq:
        Ensure movies table is declared in supabase database
    
*/
import { readFile } from 'node:fs/promises'
import { openai, supabase } from "../config.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

console.log(process.cwd())

async function main() { 
    const documents = await splitDocument()
    await createAndStoreEmbeddings(documents)
}

async function getText(fileName) {
    try {
        const fileText = await readFile(fileName, "utf8");
        return fileText
    } catch (err) { 
        console.error('issue with getting text:', err.message)
        throw err
    }
}

async function splitDocument () { 
    try {
      const fileText = await getText("./movies.txt");

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 350,
        chunkOverlap: 25,
      });
        
        const documents = await splitter.createDocuments([
          fileText
      ]);
        
      return documents;
    } catch (err) {
      console.error('issue with splitting documents:', err.message);
      throw err;
    }
}

async function createAndStoreEmbeddings(documents) { 
    const chunkEmbeddings = await Promise.all(
        documents.map(async (doc, i) => {
            try {
                const embedding = await openai.embeddings.create({
                    model: 'text-embedding-ada-002',
                    input: doc.pageContent
                })

                return {
                    content: documents[i].pageContent,
                    embedding: embedding.data[0].embedding,
                };
            } catch (err) { 
                console.error(err)
                throw err
            }
        })
    )

    try {
        const { error } = await supabase.from("movies").insert(chunkEmbeddings)

        if (error) throw error
        console.log('successfully stored embeddings')
    } catch (err) { 
        console.error('issue with storing embeddings', err)
        throw err
    }
}

main()