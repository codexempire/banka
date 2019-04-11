// import dependencies
// import files
import db from './database/account';
import userDb from './database/user';
import transact from './database/transaction';

// account model
class account {
  // create account model
  static createUserAccount(type, owner, createdOn, status, balance, accountNumber, completion) {
    // search if account number exists
    const exists = db.find(
      account => account.type === type && account.owner === owner
    );

    // if exists
    if (exists) {
      completion({ success: true, data: new Error('Account type exists with the same owner') });
      return null;
    }

    // new account
    const newAccount = {
      id: db.length + 1,
      accountNumber,
      createdOn,
      owner,
      type,
      status,
      balance
    };

    if (db.push(newAccount)) {
      // get owner details
      const userOwned = userDb.find(own => own.id === owner);
      
      if (userOwned !== undefined) {
        const details = {
          accountNumber: newAccount.accountNumber,
          firstname: userOwned.firstname,
          lastname: userOwned.lastname,
          email: userOwned.email,
          type: newAccount.type,
          openingBalance: newAccount.balance
        };

        completion({ success: true, data: details });
        return null;
      }
      completion({ success: false, data: new Error('User Not Found') });
      return null;
    }
    
    return null;
  }

  // get a single account model
  static getSingleAccount(accountNumber, completion) {
    // find single account
    const oneUser = db.find(account => account.accountNumber === accountNumber || account.owner === accountNumber);

    if (oneUser) {
      completion({ success: true, data: oneUser });
      return null;
    }

    completion({ success: false, data: new Error('Account Not Found') });
    return null;
  }

  // get all account model
  static getAllAccount(completion) {
    if (db.length === 0) {
      //  no account has been created
      completion({ success: false, data: new Error('No Account has Been Created') });
      return null;
    }

    // found account
    completion({ success: true, data: db });
    return null;
  }

  // activate or deactivate account model
  static activateDeactivateAccount(user, status, completion) {
    user.status = status;

    if (user.status === status) {
      completion({ pass: true, dataa: { accountNumber: user.accountNumber, status: user.status } });
      return null;
    }

    completion({ pass: false, dataa: new Error(`Failed to ${status} account`) });
    return null;
  }

  // debit account model
  static debitCreditAccount(userAccount, createdOn, oldBalance, accountNumber, amount, cashier, transactionType, accountBalance, completion) {
    // create a transaction
    const newTransaction = {
      id: transact.length + 1,
      createdOn,
      type: transactionType,
      accountNumber,
      cashier,
      amount,
      oldBalance,
      newBalance: accountBalance
    };


    if (transact.push(newTransaction)) {
      // change the user account balance
      userAccount.balance = accountBalance;
      console.log(accountBalance);

      // create account details
      const transactionDetails = {
        transactionId: newTransaction.id,
        accountNumber,
        amount,
        cashier,
        transactionType,
        accountBalance
      };

      // pass to the callback function
      completion({ pass: true, dataa: transactionDetails });
      return null;
    }

    // if it failed to push to database
    completion({ pass: false, dataa: new Error('Transaction Failed') });
    return null;
  }

  // delete route
  static delete(account, completion) {
    // get the index of the account
    const index = db.indexOf(account);

    // if account exists remove
    db.splice(index, 1);

    // callback
    completion({ success: true, data: new Error('Account successfully deleted') });
  }

  // get a single account
  static userInfo(user, completion) {
    // get the user for the account
    const userInfo = userDb.find(users => users.id === user.owner);

    // check if user
    if (!userInfo) {
      completion({ success: false, data: new Error('No user found') });
      return null;
    }

    const accountDetails = {
      accountName: userInfo.firstname + ' ' + userInfo.lastname,
      accountNumber: user.accountNumber,
      accountStatus: user.status,
      accountBalance: user.balance,
      accountType: user.type,
      openingDate: user.createdOn
    };

    completion({ success: true, data: accountDetails });
    return null;
  }

  // get all transactions for a specific user model
  static fetchAllTransactions(accountNumber, completion) {
    // filter through the database and find the users transaction
    const transactions = transact.filter(transaction => transaction.accountNumber === accountNumber);

    // callback
    completion({ success: true, data: transactions });
    return null;
  }
}

// export model
export default account;
