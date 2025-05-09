import 'https://deno.land/std@0.224.0/dotenv/load.ts';
import { Application } from 'https://deno.land/x/oak/mod.ts';
import './database/connect.ts';
import router from './routes/index.ts';

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
