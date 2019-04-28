// import config from dotenv
import database from './config';

// import Pool from pg
import { Pool } from 'pg';

// instantiate pool
const pool = new Pool({ connectionString: database });

// test pool connection for error
pool.connect((err) => {
  if (err) console.log(err.message);
  console.log(`pool working connecting to ${process.env.DATABASE_URL}`);
});

// export the pool for use in other parts of the API
export default pool;
