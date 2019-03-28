// import dependencies
// import files
import db from "./database/account";

// account model
class account {
  // create account model
  static createUserAccount(type, owner, createdOn, status, balance, accountNumber, completion) {
    // search if account number exists
    const exists = db.find(account => account.type === type && account.owner === owner);

    // if exists
    if (exists) {
      completion({ success: true, data: new Error('Account type exists with the same owner') });
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

    if(db.push(newAccount)){
      completion({ success: true, data: newAccount });
      return null;
    }

    completion({ success: false, data: new Error('Failed to create Account') });
    return null;
  }
}

// export model
export default account;
