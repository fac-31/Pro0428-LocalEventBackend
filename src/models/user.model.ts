import { ObjectId } from 'npm:mongodb@6.1.0';

export interface User {
  name_first: string;
  name_last: string;
  email: string;
  username: string;
  password: string;
  saved_events: ObjectId[];
}
