import { Collection, Db, MongoClient } from 'npm:mongodb@6.1.0';

import { Event } from './events.ts';
import { User } from './users.ts';

export async function connectToDatabase() {
  // Connect to mongoDB
  const client: MongoClient = new MongoClient(Deno.env.get('DB_CONN_STRING'));

  console.log('Connecting to MongoDB...');

  await client.connect();

  // Go to the database from variable given
  const db: Db = client.db(Deno.env.get('DB_NAME'));

  console.log(`Successfully connected to database: ${db.databaseName}`);

  // Insert user to collection
  const user: User = {
    name_first: 'First Name',
    name_last: 'Last Name',
    email: 'example@gmail.com',
    username: 'UniqueName',
    password: 'password1',
  };

  const users: Collection<User> = db.collection<User>('users');
  await users.insertOne(user);

  // Print out the current amount of inserted values
  let list: Array = await users.find({}).toArray();
  console.log(`users count: ${list.length}`);

  // Insert event to collection
  const event: Event = {
    mode: 'Sports',
    name: 'Event Header',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec congue eros, scelerisque vestibulum ante.',
    location: 'Finsbury Park',
    date: new Date(2025, 5, 5),
    price: 1000.00,
    url: 'https://www.greatevent.com',
  };

  const events: Collection<Event> = db.collection<User>('events');
  const result = await events.insertOne(event);

  // After obtaining id of newly created event (result.insertedId), update user we just created to have it as saved event
  await users.updateOne(
    { username: user.username }, // filter, _id could be used instead of username
    {
      $set: {
        saved_events: [result.insertedId],
      },
    },
  );
}

connectToDatabase();
