// import dependencies
import pool from './db';

// account model
class Account {
  // create account model
  static createUserAccount(request, status, balance, accountNumber, completion) {
   // write sql insertion sting
    const text = `INSERT INTO accounts(accountNumber, ownerEmail, type, status, balance) VALUES('${accountNumber}', '${request.ownerEmail}', '${request.type}', '${status}', '${balance}') RETURNING *`;

    // create pool
    pool
      .query(text)
      .then(res => completion({ success: true, data: res.rows[0] }))
      .catch(err => completion({ success: false, data: err }));
    
    return null;
  }

  // get a single account model
  static getSingleUserAccount(accountNumber, completion) {
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
  static getAllAccounts(completion) {
    // sql query to get all accounts
    const sql = `SELECT * FROM accounts`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ success: true, data: res.rows }))
      .catch(err => completion({ success: false, data: err }));
    return;
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
    
    return;
  }

  // debit account model
  static debitCreditAccount(userAccount, oldBalance, transactionData, amount, transactionType, accountBalance, completion) {
    // sql for creating new transactions
    const sql = `INSERT INTO transactions(type,accountNumber,cashierId,amount,oldBalance, newBalance) VALUES('${transactionType}', '${transactionData.accountNumber}', '${transactionData.cashier}', '${amount}', '${oldBalance}', '${accountBalance}') RETURNING *`;
    
    // sql to update account balance of the account table
    const text = `UPDATE accounts SET balance = '${accountBalance}' WHERE accountNumber = '${userAccount.accountnumber}'`;


    // POOL to insert the transactions
    pool
      .query(sql)
      .then(res => {
        // update the account balance
        pool
          .query(text)
          .then(response => completion({ pass: true, info: res.rows[0] }))
          .catch(err => completion({ pass: false, info: err }));
      })
      .catch(err => completion({ pass: false, info: err }));
    
    return;
  }

  // delete route
  static deleteAccount(account, completion) {
    // sql to delete account
    const sql = `DELETE FROM accounts WHERE accountNumber = '${account.accountnumber}'`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ pass: true, info: new Error('Account successfully deleted') }))
      .catch(err => completion({ pass: false, info: err.message }));
    
    return;
  }

  // get all active account
  static getActiveDormantAccounts(status, completion) {
    // sql
    const sql = `SELECT * FROM accounts WHERE status = '${status}'`;

    // query
    pool
      .query(sql)
      .then(res => {
        completion({ success: true, data: res.rows });
      })
      .catch(err => completion({ success: false, data: err }));
    
    return;
  }

  // get all transactions for a specific user model
  static fetchAllTransactionsForSpecificAccount(accountNumber, completion) {
    // filter through the database and find the users transaction
    const sql = `SELECT * FROM transactions WHERE accountnumber = '${accountNumber}'`;

    // POOL
    pool
      .query(sql)
      .then(res => completion({ success: true, data: res.rows }))
      .catch(err => completion({ success: false, data: err }));
    return;
  }

  // get a specific transaction for a user account
  static getSingleTransaction(id, completion) {
    // sql
    const sql = `SELECT * FROM transactions WHERE id = '${id}'`;

    // Pool
    pool
      .query(sql)
      .then(res => completion({ success: true, data: res.rows[0] }))
      .catch(err => completion({ success: false, data: err }));
    
    return;
  }

  // get all transactions
  static getAllTransactions(completion) {
    const sql = `SELECT * FROM transactions`;
    pool
      .query(sql)
      .then(res => completion({ success: true, data: res.rows }))
      .catch(err => completion({ success: false, data: err }));
    return;
  }
}

// export model
export default Account;
