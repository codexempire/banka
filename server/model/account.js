// import dependencies
// import files
import db from './database/account';
import userDb from './database/user';
import transaction from './database/transaction';

// account model
class account {
  // create account model
  static createUserAccount(
    type,
    owner,
    createdOn,
    status,
    balance,
    accountNumber,
    completion
  ) {
    // search if account number exists
    const exists = db.find(
      account => account.type === type && account.owner === owner
    );

    // if exists
    if (exists) {
      completion({
        success: true,
        data: new Error("Account type exists with the same owner")
      });
      return null;
    }


    const newAccount = {
      id: db.length + 1,
      accountNumber,
      createdOn,
      owner,
      type,
      status,
      balance
    };

    db.push(newAccount);

    if (db.push(newAccount)) {
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
      completion({success:false,data:new Error('User Not Found')})
      return null;
    }

    completion({ success: false, data: new Error("Failed to create Account") });
    return null;
  }

  // get a single account model
  static getSingleAccount(accountNumber, completion) {
    // find single account
    const oneUser = db.find(account => account.accountNumber === accountNumber);

    if (oneUser) {
      completion({ success: true, data: oneUser });
      return null;
    }

    completion({ success: false, data: new Error('Account Not Found') });
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
  static debitAccount(userAccount, createdOn, oldBalance, accountNumber, amount, cashier, transactionType, accountBalance, completion) {
    // create a transaction
    const newTransaction = {
      id: transaction.length + 1,
      createdOn,
      type: transactionType,
      accountNumber,
      cashier,
      amount,
      oldBalance,
      newBalance: accountBalance
    };

    // push into the database
    transaction.push(newTransaction);

    if (transaction.push(newTransaction)) {
      // change the user account balance
      userAccount.balance = accountBalance;

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
}

// export model
export default account;