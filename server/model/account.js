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
        // query text
        const queryText = `INSERT INTO accounts(accountNumber, owner, type, status, balance) VALUES('${accountNumber}', '${owner}', '${type}', '${status}', '${balance}') RETURNING *`;

        // pooling
        pool
            .query(queryText)
            .then(res => {
                completion({
                    success: true,
                    data: res.rows[0]
                });
            })
            .catch(err => {
                completion({
                    success: false,
                    data: err.message
                });
            });
        return null;
    }

    // get a single account model
    static getSingleAccount(accountNumber, completion) {
        // query text
        const queryText = `SELECT * FROM accounts WHERE accountNumber = '${accountNumber}'`;

        // pooling
        pool
            .query(queryText)
            .then(res => {
                completion({
                    success: true,
                    data: res.rows[0]
                });
            })
            .catch(err => {
                completion({
                    success: false,
                    data: err.message
                });
            });
        return null;
    }

    // get all account model
    static getAllAccount(completion) {
        // query text
        const queryText = `SELECT * FROM accounts`;

        // pooling
        pool
            .query(queryText)
            .then(res => {
                completion({
                    success: true,
                    data: res.rows
                });
            })
            .catch(err => {
                completion({
                    success: false,
                    data: err.message
                });
            });
        return null;
    }

    // activate or deactivate account model
    static activateDeactivateAccount(user, status, completion) {
        // query text
        const queryText = `UPDATE accounts SET status = '${status}' WHERE email = '${user.email}' RETURNING *`;

        // pooling
        pool
            .query(queryText)
            .then(res => {
                completion({
                    pass: true
                    info: res.rows[0]
                });
            })
            .catch(err => {
                completion({
                    pass: false,
                    info: err.message
                });
            });
        return null;
    }

    // debit account model
    static debitCreditAccount(userAccount, oldBalance, accountNumber, amount, cashier, transactionType, accountBalance, completion) {
        // query text
        const queryText = `INSERT INTO accounts(type, accountNumber, amount, oldbalance, balance) VALUES('${transactionType}', '${accountNumber}', '${type}', '${status}', '${balance}') RETURNING *`;

        // pooling
        pool
            .query(queryText)
            .then(res => {
                completion({
                    success: true,
                    data: res.rows[0]
                });
            })
            .catch(err => {
                completion({
                    success: false,
                    data: err.message
                });
            });
        return null;
    }

    // delete route
    static delete(account, completion) {
            // query text
            const queryText = `DELETE * FROM accounts WHERE ${transactionType}', '${accountNumber}', '${type}', '${status}', '${balance}') RETURNING * 
        d =

            // pooling
            pool
            .query(queryText)
            .then(res => {
                completion({
                    success: true,
                    data: res.rows[0]
                });
            })
            .catch(err => {
                completion({
                    success: false,
                    data: err.message
                });
            });
        return null;
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