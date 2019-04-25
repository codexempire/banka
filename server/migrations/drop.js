// import pool
import { Pool } from 'pg';
import { config } from 'dotenv';

config();

let database;

process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' ? database = process.env.DATABASE_URL : database = process.env.TEST_URL

// instantiate pool
const pool = new Pool({ connectionString: database });


let queryText;

const dropUsersTable = () => {
  queryText = `DROP TABLE IF EXISTS users`;

  pool
    .query(queryText)
    .then(res => pool.end())
    .catch(err => console.log(err.message));
};

const dropAccountsTable = () => {
  queryText = `DROP TABLE IF EXISTS accounts`;

  pool
    .query(queryText)
    .then(res => dropUsersTable())
    .catch(err => console.log(err.message));
};

const dropTransactionsTable = () => {
  queryText = `DROP TABLE IF EXISTS transactions`;

  pool
    .query(queryText)
    .then(res => dropAccountsTable())
    .catch(err => console.log(err.message));
}

dropTransactionsTable();