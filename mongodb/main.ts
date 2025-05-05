import { MongoClient, Db, Collection } from "npm:mongodb@6.1.0";

import { User } from "./users.ts";

export async function connectToDatabase() {
    // Connect to mongoDB
    const client: MongoClient = new MongoClient(Deno.env.get("DB_CONN_STRING"));
    
    console.log("Connecting to MongoDB...");
    
    await client.connect();
    
    // Go to the database from variable given
    const db: Db = client.db(Deno.env.get("DB_NAME"));

    console.log(`Successfully connected to database: ${db.databaseName}`);
    
    const users: Collection<User> = db.collection<User>("users");

    // Insert user to collection
    const user: User = {
        name_first: "First Name",
        name_last: "Last Name",
        email: "example@gmail.com",
        username: "UniqueName",
        password: "password1",
    }

    await users.insertOne(user);
    
    // Print out the current amount of inserted values
    let list: Array = await users.find({}).toArray();
    console.log(`users count: ${list.length}`);
}

 connectToDatabase();