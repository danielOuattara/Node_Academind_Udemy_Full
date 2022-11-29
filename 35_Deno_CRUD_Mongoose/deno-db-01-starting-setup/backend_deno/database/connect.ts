import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

//------------------------------------------------------------------
let db: Database;

export async function connectToDB() {
  const client = new MongoClient();
  await client.connect(config().MONGO_URI);
  db = client.database();
  console.log(`Connected to ${db.name} database`);
}

export function getDB() {
  return db;
}
