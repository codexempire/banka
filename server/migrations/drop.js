// import pool
import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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