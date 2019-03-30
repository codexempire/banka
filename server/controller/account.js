// import dependencies

// import files
import model from '../model/account';
import middleware from '../middleware/account';

// account controller
class account {
  // account creation controller handle
  static createUserAccount(req, res){
    // middleware to verify input fields
    middleware.verifyAccountCreation(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      // get body
      const type = req.body.type;

      const owner = parseInt(req.body.owner, 10);
      // verify type
      if (type !== 'savings' && type !== 'current') {
        return res.status(400).json({ status:400, error:error.details[0].context.label });
      }

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

      if (status !== 'active' && status !== 'dormant') {
        return res.status(400).json({ status: 400, error: 'Enter a valid account status' });
      }

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

        const accountBalance = data.balance - amount;

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

        const accountBalance = data.balance + amount;

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
}
// export controller
export default account;
