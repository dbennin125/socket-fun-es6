import app from './lib/app.js';
import pool from './lib/utils/pool.js';

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

process.on('exit', () => {
  // eslint-disable-next-line no-console
  console.log('Goodbye!');
  pool.end();
});
