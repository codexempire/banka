// import pool
import { config } from 'dotenv';
import { Pool } from 'pg';

config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.connect((err) => {
    if (err) console.log('daels')
})

let queryText;

const dropUsersTable = () => {
    queryText = `DROP TABLE IF EXISTS users`;

    pool
        .query(queryText)
        .then(res => pool.end())
        .catch(err => console.log('1' + err.message));
};

const dropAccountsTable = () => {
    queryText = `DROP TABLE IF EXISTS accounts`;

    pool
        .query(queryText)
        .then(res => dropUsersTable())
        .catch(err => console.log('2' + err.message));
};

const dropTransactionsTable = () => {
    queryText = `DROP TABLE IF EXISTS transactions`;

    pool
        .query(queryText)
        .then(res => dropAccountsTable())
        .catch(err => console.log(err.message));
}

dropTransactionsTable();