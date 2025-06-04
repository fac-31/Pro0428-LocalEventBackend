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

export { compare, hash } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
