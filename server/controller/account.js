// import dependencies

// import files
import model from '../model/account';
import middleware from '../middleware/account';

// account controller
class account {
  // account creation controller handle
  static createUserAccount(req, res) {
    // Remove white spaces
    try{
      if (req.body.type) {
        req.body.type = req.body.type.trim().replace(/\s+/g, '');
      }
      if (req.body.owner) {
        req.body.owner = req.body.owner.trim().replace(/\s+/g, '');
      }
    } catch(err) {}
    // middleware to verify input fields
    middleware.verifyAccountCreation(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      // get body
      const type = req.body.type;

      const owner = parseInt(req.body.owner, 10);

      const date = new Date;
      const day = date.getDate();
      const arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = arr[date.getMonth()];      
      const year = date.getFullYear();
      let hour = date.getHours();
      if(hour.length < 2){
        hour = '0'+ hour;
      }
      let minute = date.getMinutes();
      if(minute.length < 2){
        minute = '0'+ minute;
      }
      const accountNumber = Math.floor(Math.random()*8999999999+1000000000);
      const createdOn = day+' '+month+' '+year+' '+hour+':'+minute;
      const status = 'active';
      const value = 0;
      const balance = parseFloat(value);
      
      model.createUserAccount(type, owner, createdOn, status, balance, accountNumber,({ success, data }) => {
        if (!success) {
          // account already exists
          return res.status(500).json({ status: 500, error: data.message });
        }

        if (success && data.message) {
          // account number exists
          return res.status(409).json({ status: 409, error: data.message });
        }
        // return the user data
        return res.status(200).json({ status: 200, data: data });
      });
      return null;
    });
    return null;
  }

  // activate or deactivate account
  static activateDeactivate(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);
    // Remove white spaces
    try {
      if (req.body.status) {
        req.body.status = req.body.status.trim().replace(/\s+/g, '');
      }
    } catch(err){}

    // check accountNumber
    if (!accountNumber) {
      return res.status(400).json({ status: 400, error: 'No Account Number Found' });
    }

    // check the header and body for data
    middleware.checkAccount(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      // get the status
      const status = req.body.status;

      // calling model get single account
      model.getSingleAccount(accountNumber, ({ success, data }) => {
        if (!success) {
          return res.status(404).json({ status: 404, error: data.message });
        }

        // call the activate or deactivate users account
        model.activateDeactivateAccount(data, status, ({ pass, dataa }) => {
          // check if it failed
          if (!pass) {
            return res.status(500).json({ status: 500, error: dataa.message });
          }

          // if successful
          return res.status(200).json({ status: 200, data: dataa });
        });
        return null;
      })
      return null;
    });
    return null;
  }

  // debit account controller
  static debitAccount(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);
    // Remove white spaces
    try {
      if (req.body.amount) {
        req.body.amount = req.body.amount.trim().replace(/\s+/g, '');
      }

      // Remove white spaces
      if (req.body.cashier) {
        req.body.cashier = req.body.cashier.trim().replace(/\s+/g, '');
      }
    } catch(err){}

    // check accountNumber
    if (!accountNumber) {
      return res.status(400).json({ status: 400, error: 'No Account Number Found' });
    }

    // call middleware
    middleware.debitCreditVerve(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }


      const date = new Date;
      const day = date.getDate();
      const arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = arr[date.getMonth()];
      const year = date.getFullYear();
      let hour = date.getHours();
      if (hour.length < 2) {
        hour = `0${hour}`;
      }
      let minute = date.getMinutes();
      if (minute.length < 2) {
        minute = `0${minute}`;
      }

      const cashier = parseInt(req.body.cashier,10);
      const amount = parseFloat(req.body.amount, 10);
      
      // set transaction type to debit
      const transactionType = 'debit';

      const createdOn = day + ' ' + month + ' ' + year + ' ' + hour + ':' + minute;
      
      // get account details
      model.getSingleAccount(accountNumber, ({success,data})=>{
        if(!success){
          // account was not found
          return res.status(404).json({ status: 404, error: data.message });
        }

        // check if account balance
        if(data.balance < amount){
          return res.status(409).json({ status: 409, error: 'Insufficient Funds' });
        }

        let accountBalance = data.balance - amount;
        accountBalance = parseFloat(accountBalance, 10);

        // debit account model
        model.debitCreditAccount(data,createdOn, data.balance, accountNumber, amount, cashier, transactionType, accountBalance, ({pass,dataa})=>{
          if(!pass){
            // server error
            return res.status(500).json({ status: 500, error: dataa.message });
          }

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: dataa });
        });
        return null;
      });
      return null;
    });
    return null;
  }

  // credit account controller
  static creditAccount(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);
    // Remove white spaces
    try {
      if (req.body.amount) {
        req.body.amount = req.body.amount.trim().replace(/\s+/g, '');
      }

      // Remove white spaces
      if (req.body.cashier) {
        req.body.cashier = req.body.cashier.trim().replace(/\s+/g, '');
      }
    } catch (err) { }

    // check accountNumber
    if (!accountNumber) {
      return res.status(400).json({ status: 400, error: 'No Account Number Found' });
    }

    // call middleware
    middleware.debitCreditVerve(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }


      const date = new Date;
      const day = date.getDate();
      const arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = arr[date.getMonth()];
      const year = date.getFullYear();
      let hour = date.getHours();
      if (hour.length < 2) {
        hour = '0' + hour;
      }
      let minute = date.getMinutes();
      if (minute.length < 2) {
        minute = '0' + minute;
      }

      const cashier = parseInt(req.body.cashier, 10);
      const amount = parseFloat(req.body.amount, 10);
      
      // set transaction type to debit
      const transactionType = 'credit';

      const createdOn = day + ' ' + month + ' ' + year + ' ' + hour + ':' + minute;
      
      // get account details
      model.getSingleAccount(accountNumber, ({success,data})=>{
        if(!success){
          // account was not found
          return res.status(404).json({ status: 404, error: data.message });
        }

        let accountBalance = data.balance + amount;
        accountBalance = parseFloat(accountBalance, 10);

        // debit account model
        model.debitCreditAccount( data, createdOn, data.balance, accountNumber, amount, cashier, transactionType, accountBalance, ({pass,dataa})=>{
          if(!pass){
            // server error
            return res.status(500).json({ status: 500, error: dataa.message });
          }

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: dataa });
        });
        return null;
      });
      return null;
    });
    return null;
  }

  // delete account controller
  static delete(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);

    // check accountNumber
    if (!accountNumber) {
      return res.status(400).json({ status: 400, error: 'No Account Number Found' });
    }

    // call model
    model.getSingleAccount(accountNumber, ({ success, data }) => {
      if (!success) {
        // account not found
        return res.status(404).json({ status: 404, error: data.message });
      }

      // call delete model
      model.delete(data, ({ success, data }) => {
        return res.status(200).json({ status: 200, message: data.message });
      });
      return null;
    });
    return null;
  }

  // get single account details
  static getSingleAccount(req, res) {
    // collect account number from header
    const id = parseInt(req.params.id, 10);

    // check accountNumber
    if (!id) {
      return res.status(400).json({ status: 400, error: 'No ID Found' });
    }

    // call model
    model.getSingleAccount(id, ({ success, data }) => {
      if (!success) {
        // account not found
        return res.status(404).json({ status: 404, error: data.message });
      }

      // call delete model
      model.userInfo(data, ({ success, data }) => {
        if (!success) {
          // failed to get user
          return res.status(404).json({ status: 404, error: data.message });
        }
        
        return res.status(200).json({ status: 200, data: data });
      });
      return null;
    });
    return null;
  }

  // get all list of all account
  static getAllAccount(req, res) {
    model.getAllAccount(({ success, data }) => {
      if (!success) {
        // no account Found
        return res.status(404).json({ status: 404, error: data.message });
      }

      return res.status(200).json({ status: 200, data });
    });
    return null;
  }
  
  // get all transactions for a single user controller
  static getAllTransactionsSpecific(req, res) {
    // get user account number for params
    const accountNumber = parseInt(req.params.accountNumber, 10);

    if (!accountNumber) {
      // no account number
      return res.status(400).json({ status: 400, error: 'No id found' });
    }

    // call model
    model.fetchAllTransactions(accountNumber, ({ success, data }) => {
      // if the data is empty
      if (data.length === 0) {
        // no transaction found
        return res.status(404).json({ status: 404, error: `No transaction found` });
      }

      // data found
      return res.status(200).json({ status: 200, data });
    });
    return null;
  }
}
// export controller
export default account;
