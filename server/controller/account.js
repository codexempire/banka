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
      if (req.body.type) req.body.type = req.body.type.trim().replace(/\s+/g, '');

      if (req.body.owner) req.body.owner = req.body.owner.trim().replace(/\s+/g, '');

    } catch(err) {}
    // middleware to verify input fields
    middleware.verifyAccountCreation(req, (error) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      // get body
      // startup account informations
      const type = req.body.type;
      const accountNumber = Math.floor(Math.random() * 8999 + 1000);
      const status = 'active';
      const value = 0;
      const balance = parseFloat(value);
      
      model.createUserAccount(type, req.body.ownerEmail, status, balance, accountNumber, ({ success, data }) => {
        // server error
        if (!success) return res.status(500).json({ status: 500, error: data.message });

        // return the user data
        return res.status(201).json({ status: 201, data: data });
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
      if (req.body.status) req.body.status = req.body.status.trim().replace(/\s+/g, '');
    } catch(err){}

    // check accountNumber
    if (!accountNumber) return res.status(400).json({ status: 400, error: 'No Account Number Found' });

    // check the header and body for data
    middleware.checkAccount(req, (error) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      // get the status
      const status = req.body.status;

      // calling model get single account
      model.getSingleAccount(accountNumber, ({ success, data }) => {
        if (!data) return res.status(404).json({ status: 404, error: data.message });

        // call the activate or deactivate users account
        model.activateDeactivateAccount(data, status, ({ pass, info }) => {
          // check if it failed
          if (!data) return res.status(500).json({ status: 500, error: info.message });

          // if successful
          return res.status(200).json({ status: 200, data: info });
        });
        return null;
      })
      return null;
    });
    return null;
  }

  // delete account controller
  static delete(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);

    // check accountNumber
    if (!accountNumber) return res.status(400).json({ status: 400, error: 'No Account Number Found' });

    // call model
    model.getSingleAccount(accountNumber, ({ success, data }) => {
      // account not found
      if (!data) return res.status(404).json({ status: 404, error: data.message });

      // call delete model
      model.delete(data, ({ pass, info }) => {
        if (!pass) return res.status(500).json({ status: 500, error: 'Server Error' });

        return res.status(200).json({ status: 200, message: info.message });
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
    if (!id) return res.status(400).json({ status: 400, error: 'No ID Found' });

    // call model
    model.getSingleAccount(id, ({ success, data }) => {
      // account not found
      if (success && !data) return res.status(404).json({ status: 404, error: 'Account not found' });
      
      return res.status(200).json({ status: 200, data });
    });
    return null;
  }

  // view all account which status is active
  static activeAccounts(req, res) {
    const status = 'active';
    // call model
    model.getActiveAccount(status, ({success, data}) => {
      if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });
      // if no active account found
      if (success && data.length === 0) return res.status(404).json({ status: 404, error: 'No active account found' });
      // if active account found
      return res.status(200).json({ status: 200, data });
    });
    return null;
  }

  // view a list of dormant accounts
  static dormantAccount(req, res) {
    const status = 'dormant';
    // call model
    model.getActiveAccount(status, ({ success, data }) => {
      if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });
      // if no active account found
      if (success && data.length === 0) return res.status(404).json({ status: 404, error: 'No active account found' });
      
      // if active account found
      return res.status(200).json({ status: 200, data });
    });
    return null;
  }

  // get all list of all account
  static getAllAccount(req, res) {
    model.getAllAccount(({ success, data }) => {
      // no account Found
      if (success && data.length === 0) return res.status(404).json({ status: 404, error: 'No accounts found' });

      return res.status(200).json({ status: 200, data });
    });
    return null;
  }

  // get all transactions for a single user controller
  static getAllTransactionsSpecific(req, res) {
    // get user account number for params
    const accountNumber = parseInt(req.params.accountNumber, 10);

    // no account number
    if (!accountNumber) return res.status(400).json({ status: 400, error: 'No id found' });

    // call model
    model.fetchAllTransactions(accountNumber, ({ success, data }) => {
      // if the data is empty
      // no transaction found
      if (success && data.length === 0) return res.status(404).json({ status: 404, error: `No transaction found` });

      // data found
      return res.status(200).json({ status: 200, data });
    });
    return null;
  }
}
// export controller
export default account;
