import { type CorsOptions, opineCors } from 'cors';
import { json, opine } from 'opine';
import { elmedenoMiddleware } from '~/middleware/elmedeno.ts';
import config from '~/config.ts';

const { cors } = config;

const app = opine();

const corsOptions: CorsOptions = {
  origin: cors.origin,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(json());
app.use(elmedenoMiddleware);
app.use(opineCors(corsOptions));

app.get('/', (_req, res) => {
  res.send('Welcome to CPT');
});

app.listen({ port: 3000 }, () => {
  console.log(`Server is started...`);
});
