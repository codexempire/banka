// import pool
import pool from '../model/db';
let queryText;

const dropUsersTable = () => {
  queryText = `DROP TABLE IF EXISTS users`;

  pool
    .query(queryText)
    .then(res => console.log('done'))
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