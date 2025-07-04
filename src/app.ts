import 'https://deno.land/std@0.224.0/dotenv/load.ts';
import { Application, oakCors } from '../deps.ts';
import './database/connect.ts';
import './cron.ts';
import router from './routes/index.ts';
import logRequest from './middleware/logRequest.ts';

const app = new Application();

app.use(
  oakCors({
    origin: ['https://the-locals.netlify.app', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
  }),
); // Allow local frontend to bypass cors requirement
app.use(logRequest);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
