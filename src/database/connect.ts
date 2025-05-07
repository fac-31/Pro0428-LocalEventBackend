import { Db, MongoClient } from 'npm:mongodb@6.1.0';

const dbConnString = Deno.env.get('DB_CONN_STRING');
const dbName = Deno.env.get('DB_NAME');

console.log(dbConnString);
console.log(dbName);

if (!dbConnString) {
  throw new Error('DB_CONN_STRING environment variable not set.');
}
if (!dbName) {
  throw new Error('DB_NAME environment variable not set.');
}

const client = new MongoClient(dbConnString);

console.log('Connecting to MongoDB...');
await client.connect();
console.log('✅ Connected to MongoDB');

const db: Db = client.db(dbName);

export { client, db };
