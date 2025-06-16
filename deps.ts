// Oak - URL
export {
  Application,
  Context,
  Router,
  Status,
} from 'https://deno.land/x/oak@v17.1.4/mod.ts';
export type {
  Next,
  RouterContext,
} from 'https://deno.land/x/oak@v17.1.4/mod.ts';

// AI SDK - JSR
export { OpenAI } from '@openai/openai';
export { zodTextFormat } from '@openai/openai/helpers/zod';

// CORS - URL
export { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

// DJWT - URL
export {
  create,
  getNumericDate,
  verify,
} from 'https://deno.land/x/djwt@v3.0.2/mod.ts';
export type { Payload } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';

// MongoDB - NPM
export { Db, MongoClient, ObjectId } from 'npm:mongodb@6.1.0';
export type { OptionalId } from 'npm:mongodb@6.1.0';

//more stable version of bycrypt
export {
  compareSync,
  hashSync,
} from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

// Shared

export {
  toSafeUser,
  UserLogInSchema,
  UserSignUpSchema,
} from 'https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/user.model.ts';

export type {
  NewUser,
  UserInDB,
  UserLogInInput,
  UserSignUpInput,
} from 'https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/user.model.ts';

export {
  eventFilterSchema,
  eventsArraySchema,
  eventSchema,
} from 'https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/event.model.ts';

export type {
  CompleteEventType,
  Event,
  EventFilter,
  EventMode,
  FrequencyObject,
  FullEvent,
} from 'https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/event.model.ts';
