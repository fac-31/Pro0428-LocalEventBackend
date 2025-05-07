import { Db, MongoClient } from 'npm:mongodb@6.1.0';

const dbConnString = Deno.env.get('DB_CONN_STRING');
const dbName = Deno.env.get('DB_NAME');

if (!dbConnString || !dbName) {
  throw new Error('DB_CONN_STRING or DB_NAME environment variable(s) not set.');
}

const client = new MongoClient(dbConnString);

console.log('Connecting to MongoDB...');
await client.connect();
console.log('✅ Connected to MongoDB');

const db: Db = client.db(dbName);

export { client, db };
