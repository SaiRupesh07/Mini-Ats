
import 'dotenv/config';
import app from './app';

const port = Number(process.env.PORT || process.env.API_PORT || 4000);

app.listen(port, '0.0.0.0', () => {
  console.log(`Mini ATS API listening on port ${port}`);
});
