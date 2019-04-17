// import config from dotenv
import { config } from 'dotenv';

// import Pool from pg
import { Pool } from 'pg';

// call config
config();

// instantiate pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// test pool connection for error
pool.connect((err) => {
  if (err) console.log(err.message);
  console.log(`pool working connecting to ${process.env.DATABASE_URL}`);
});

// export the pool for use in other parts of the API
export default pool;
