// import dependencies
import query from './query';

// account model
class Account {
  // create account model
  static createUserAccount(request, owner, status, balance, accountNumber, completion) {
   // write sql insertion sting
    const usersDetails = `SELECT * FROM users WHERE id = '${owner}'`;    

    query(usersDetails, ({ success, data }) => {
      if (success) {
        let ownerEmail = data[0].email;
        const text = `INSERT INTO accounts(accountNumber, owner, ownerEmail, type, status, balance) VALUES ('${accountNumber}', '${owner}', '${ownerEmail}', '${request.type}', '${status}', '${balance}') RETURNING *`;
        query(text, ({ success, data }) => {
          completion({ success, data });
          return;
        });
      } else {
        completion({ success, data });
        return;
      }
    });
    return;
  }

  // get a single account model
  static getSingleUserAccount(accountNumber, completion) {
    // write sql to get a single account 
    const sql = `SELECT * FROM accounts WHERE accountNumber = '${accountNumber}'`;

    query(sql, ({ success, data }) => {
      if(success){
        completion({ passed: success, datar: data[0] });
        return;
      }
      completion({ passed: success, datar: new Error('Account not found') });
      return;
    });
    return;
  }

  // get all account model
  static getAllAccounts(completion) {
    // sql query to get all accounts
    const sql = `SELECT * FROM accounts`;

    query(sql, ({ success, data }) => {
      completion({ success, data });
      return;
    });
    return;;
  }

  // activate or deactivate account model
  static activateDeactivateAccount(accountnumber, status, completion) {
    // write sql to update account status in the accounts table
    const text = `UPDATE accounts SET status = '${status}' WHERE accountNumber = '${accountnumber}' RETURNING *`;

    query(text, ({ success, data }) => {
      if (success) {
        completion({ pass: success, info: data[0] });
        return;
      }
      completion({ pass: success, info: data });
    });
    return;
  }

  // debit account model
  static debitCreditAccount(newBalance, data, accountNumber, cashier, oldBalance, amount, transactionType, completion) {
    // sql for creating new transactions
    const sql = `INSERT INTO transactions(type,accountNumber,cashierId,amount,oldBalance, newBalance) VALUES('${transactionType}', '${accountNumber}', '${cashier}', '${amount}', '${oldBalance}', '${newBalance}') RETURNING *`;
    
    // sql to update account balance of the account table
    const text = `UPDATE accounts SET balance = '${newBalance}' WHERE accountNumber = '${data.accountnumber}'`;


    query(sql, ({ success, data }) => {
      let success1 = success;
      let data1 = data;
      if(success){
        query(text, ({ success, data }) => {
          if (success) {
            completion({ pass: success1, info: data1 });
            return;
          }
          completion({ pass: success, info: data });
          return;
        });
        return;
      }
      completion({ pass: success, info: data });
    });
    return;
  }

  // delete route
  static deleteAccount(account, completion) {
    // sql to delete account
    const sql = `DELETE FROM accounts WHERE accountNumber = '${account}'`;

    query(sql, ({ success, data }) => {
      if (success) {
        completion({ pass: success, info: new Error('Account successfully deleted') });
        return;
      }
      completion({ pass: success, info: data });
      return;
    });
    return;
  }

  // get all active account
  static getActiveDormantAccounts(status, completion) {
    // sql
    const sql = `SELECT * FROM accounts WHERE status = '${status}'`;

    query(sql, ({ success, data }) => {
      completion({ success, data });
      return;
    });
    return;
  }

  // get all transactions for a specific user model
  static fetchAllTransactionsForSpecificAccount(accountNumber, completion) {
    // filter through the database and find the users transaction
    const sql = `SELECT * FROM transactions WHERE accountnumber = '${accountNumber}'`;

    query(sql, ({ success, data }) => {
      completion({ success, data });
      return;
    });
    return;
  }

  // get a specific transaction for a user account
  static getSingleTransaction(id, completion) {
    // sql
    const sql = `SELECT * FROM transactions WHERE id = '${id}'`;

    query(sql, ({ success, data }) => {
      completion({ success, data });
      return;
    });
    return;
  }

  // get all transactions
  static getAllTransactions(completion) {
    const sql = `SELECT * FROM transactions`;
    query(sql, ({ success, data }) => {
      completion({ success, data });
      return;
    });
    return;
  } 
}

// export model
export default Account;
