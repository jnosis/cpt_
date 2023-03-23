import { json, opine } from 'opine';
const app = opine();

app.use(json());

app.get('/', (_req, res) => {
  res.send('Welcome to CPT');
});

app.listen({ port: 3000 }, () => {
  console.log(`Server is started...`);
});
