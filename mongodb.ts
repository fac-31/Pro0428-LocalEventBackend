import mongoDB from "mongodb";
import dotenv from "dotenv";

export async function connectToDatabase () {
    dotenv.config();
 
    // Connect to mongoDB
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    
    // Go to the database and collection from variable given
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
    const collection: mongoDB.Collection = db.collection(process.env.GAMES_COLLECTION_NAME);

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${collection}`);
    
    // Insert value to collection
    await collection.insertOne({"key": "value"});
    
    // Print out the current amount of inserted values
    let list: Array = await collection.find({}).toArray();
    console.log(`collections count: ${list.length}`);
}

 connectToDatabase();