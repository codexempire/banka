// import dependencies
import pool from './db';

// import files
import db from './database/account';
import userDb from './database/user';
import transact from './database/transaction';

// account model
class account {
  // create account model
  static createUserAccount(type, owner, status, balance, accountNumber, completion) {
   // write sql insertion sting
    const text = `INSERT INTO accounts(accountNumber, ownerEmail, type, status, balance) VALUES('${accountNumber}', '${owner}', '${type}', '${status}', '${balance}') RETURNING *`;

    // create pool
    pool
      .query(text)
      .then(res => completion({ success: true, data: res.rows[0] }))
      .catch(err => completion({ success: false, data: err }));
    
    return null;
  }

  // get a single account model
  static getSingleAccount(accountNumber, completion) {
    // write sql to get a single account 
    const sql = `SELECT * FROM accounts WHERE accountNumber = '${accountNumber}'`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ success: true, data: res.rows[0] }))
      .catch(err => completion({ success: false, data: err }));
    return null;
  }

  // get all account model
  static getAllAccount(completion) {
    // sql query to get all accounts
    const sql = `SELECT * FROM accounts`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ success: true, data: res.rows }))
      .catch(err => completion({ success: false, data: err }));
    return null;
  }

  // activate or deactivate account model
  static activateDeactivateAccount(user, status, completion) {
    // write sql to update account status in the accounts table
    const text = `UPDATE accounts SET status = '${status}' WHERE accountNumber = '${user.accountnumber}' RETURNING *`;

    // POOL
    pool
      .query(text)
      .then(res => completion({ pass: true, info: res.rows[0] }))
      .catch(err => completion({ pass: false, info: err }));
    
    return null;
  }

  // debit account model
  static debitCreditAccount(userAccount, oldBalance, accountNumber, amount, transactionType, accountBalance, completion) {
    console.log(isNaN(accountNumber));
    // sql for creating new transactions
    const sql = `INSERT INTO transactions(type,accountNumber,amount,oldBalance, newBalance) VALUES('${transactionType}', ${accountNumber}, '${amount}', '${oldBalance}', '${accountBalance}') RETURNING *`;
    
    // sql to update account balance of the account table
    const text = `UPDATE accounts SET balance = '${accountBalance}' WHERE accountNumber = '${userAccount.accountnumber}'`;


    // POOL to update the account balance
    pool
      .query(text)
      .then(res => {
        // insert the transactions
        pool
          .query(sql)
          .then(res => completion({ pass: true, info: res.rows[0] }))
          .catch(err => completion({ pass: false, info: err }));
      })
      .catch(err => completion({ pass: false, info: err }));
    
    return null;
  }

  // delete route
  static delete(account, completion) {
    // sql to delete account
    const sql = `DELETE FROM accounts WHERE accountNumber = '${account.accountnumber}'`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ pass: true, info: new Error('Account successfully deleted') }))
      .catch(err => completion({ pass: false, info: err.message }));
    
    return;
  }

  // get all transactions for a specific user model
  static fetchAllTransactions(accountNumber, completion) {
    // filter through the database and find the users transaction
    const sql = `SELECT * FROM transactions WHERE accountNumber = '${accountNumber}'`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ succes: true, data: res.rows }))
      .catch(err => completion({ success: false, data: err }));
    return null;
  }
}

// export model
export default account;
