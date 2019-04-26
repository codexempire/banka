// import config from dotenv
import { config } from 'dotenv';

// import Pool from pg
import { Pool } from 'pg';

// call config
config();
let database;

process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' ? database = process.env.DATABASE_URL : database = process.env.TEST_URL

// instantiate pool
const pool = new Pool({ connectionString: database });

// test pool connection for error
pool.connect((err) => {
  if (err) console.log(err.message);
  console.log(`pool working connecting to ${process.env.DATABASE_URL}`);
});

// export the pool for use in other parts of the API
export default pool;
