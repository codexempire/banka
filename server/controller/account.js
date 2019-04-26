import model from '../model/account';
import middleware from '../middleware/account';

// account controller
class Account {
  // account creation controller handle
  static createUserAccount(req, res) {
    middleware.verifyAccountCreationData(req, (error, request) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });// check for error

      const accountNumber = Math.floor(Math.random() * 899999999 + 100000000);
      const status = 'active';
      const balance = parseFloat(0);
      const owner = req.data.id;
      
      model.createUserAccount(request, owner, status, balance, accountNumber, ({ success, data }) => {
        if (!success) return res.status(500).json({ status: 500, error: data.message });// server error

        return res.status(201).json({ status: 201, data: data[0] });// return the user data
      });
    });
    return;
  }

  // activate or deactivate account
  static activateDeactivateAccount(req, res) {    
    const accountNumber = parseInt(req.params.accountNumber, 10);// collect account number from header
    middleware.checkAccountStatus(req, accountNumber, (error, request) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });// check for error
      
      model.getSingleUserAccount(request.accountNumber, ({ success, data }) => {
        if (!data) return res.status(404).json({ status: 404, error: data.message });
        
        // call the activate or deactivate users account
        model.activateDeactivateAccount(request.accountNumber, request.status, ({ pass, info }) => {
          if (!pass) return res.status(500).json({ status: 500, error: info.message });// check if it failed

          return res.status(200).json({ status: 200, data: info });// if successful
        });
      });
    });
    return;
  }

  // delete account controller
  static deleteAccount(req, res) {
    const accountNumber = parseInt(req.params.accountNumber, 10);
        
    middleware.checkAccountNumber(accountNumber, (error, validAccountNumber) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label }); // error

      model.getSingleUserAccount(validAccountNumber, ({ success, data }) => {
        if (!data) return res.status(404).json({ status: 404, error: data.message });// account not found
        
        model.deleteAccount(validAccountNumber, ({ pass, info }) => {
          if (!pass) return res.status(500).json({ status: 500, error: 'Server Error' });
          
          return res.status(200).json({ status: 200, message: info.message });
        });
      });
    });
    return;
  }

  // get single account details
  static getSingleUserAccount(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);

    middleware.checkAccountNumber(accountNumber, (error, validAccountNumber) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label }); // error

      model.getSingleUserAccount(validAccountNumber, ({ success, data }) => {
        // account not found
        if (success && !data) return res.status(404).json({ status: 404, error: 'Account not found' });

        return res.status(200).json({ status: 200, data });
      });
    });
    return;
  }
  
  // get all list of all account
  static getAllAccounts(req, res) {
    let status = req.query.status;
    if (status) {
      status = status.toLowerCase();
      if (status !== 'active' && status !== 'dormant') return res.status(400).json({ status: 400, error: 'Accounts can either be active or dormant' });
      model.getActiveDormantAccounts(status, ({ success, data }) => {
        if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });
        // if no active account found
        if (success && data.length === 0) return res.status(404).json({ status: 404, error: `No ${status} account found` });
        // if active account found
        return res.status(200).json({ status: 200, data });
      });
      return;
    }
    model.getAllAccounts(({ success, data }) => {
      if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });
      if (success && data.length === 0) return res.status(404).json({ status: 404, error: 'No accounts found' });// no account Found

      return res.status(200).json({ status: 200, data });
    });
    return;
  }

  // get all transactions for a single user controller
  static getAllTransactionsSpecificAccount(req, res) {
    const accountNumber = parseInt(req.params.accountNumber, 10);// get user account number for params

    middleware.checkAccountNumber(accountNumber, (error, validAccountNumber) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });
      model.fetchAllTransactionsForSpecificAccount(validAccountNumber, ({ success, data }) => {
        // server error
        if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });

        if (data.length === 0) return res.status(404).json({ status: 404, error: `No transaction found` });

        // data found
        return res.status(200).json({ status: 200, data });
      });
    });
    return;
  }
}

export default Account;// export controller
