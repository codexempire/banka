// import pool
import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let queryText;

const createTransactionsTable = () => {
  queryText = `CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    createdOn DATE NOT NULL DEFAULT CURRENT_DATE,
    type VARCHAR(7) NOT NULL,
    accountNumber INTEGER NOT NULL REFERENCES accounts(accountNumber) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    oldBalance FLOAT NOT NULL,
    newBalance FLOAT NOT NULL
  )`;

  pool
    .query(queryText)
    .then(res => pool.end())
    .catch(err => console.log(err.message));
}

const createAccountsTable = () => {
  queryText = `CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    accountNumber INTEGER UNIQUE NOT NULL,
    createdOn DATE NOT NULL DEFAULT CURRENT_DATE,
    ownerEmail VARCHAR(150) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    type VARCHAR(8) NOT NULL,
    status VARCHAR(9) NOT NULL,
    balance FLOAT NOT NULL
  )`;

  pool
    .query(queryText)
    .then(res => createTransactionsTable())
    .catch(err => console.log(err.message));
}

const createUsersTable = () => {
  queryText = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(15) NOT NULL,
    lastname VARCHAR(15) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    type VARCHAR(6) NOT NULL,
    isAdmin BOOLEAN DEFAULT false
  )`;

  pool
    .query(queryText)
    .then(res => {
      // create a user
      queryText = `INSERT INTO users (firstname, lastname, email, password, type, isAdmin) VALUES ('Princewill', 'Michael', 'princewillifeanyi1999@gmail.com', '$2b$10$gCU.pMQUpjs1D3Q1SRMco.g7ydXiWcOuYneQiDZT7DcTHfjDwRbVu', 'staff', true)`;
      pool
        .query(queryText)
        .then(res => createAccountsTable())
        .catch(err => createAccountsTable());
    })
    .catch(err => {
      // error creating table
      console.log(err.messsage);;
    });
}

createUsersTable();