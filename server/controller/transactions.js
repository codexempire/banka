// import dependencies
import middleware from '../middleware/account';
import model from '../model/account';

// transactions class
class Transactions{
 // debit account controller
 static debitAccount(req, res) {
   const accountNumber = parseInt(req.params.accountNumber, 10);
   
    middleware.debitCreditVerve(req, accountNumber, (error, request) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      const amount = parseFloat(req.body.amount, 10);
      const transactionType = 'debit';

      // get account details
      model.getSingleUserAccount(request.accountNumber, ({ success, data }) => {
        if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });

        if(success && !data) return res.status(404).json({ status: 404, error: 'Account not found' });
        
        if (data.status === 'dormant') return res.status(400).json({ status: 400, error: 'Cannot debit a dormant account' });
        if(data.balance < amount) return res.status(400).json({ status: 400, error: 'Insufficient Funds' });

        const accountBalance = parseFloat(data.balance - amount, 10);

        // debit account model
        model.debitCreditAccount(accountBalance, data, accountNumber, req.data.id, data.balance, amount, transactionType, ({ pass, info }) => {
          if (!pass) return res.status(500).json({ status: 500, error: info.message });// server error

          if (pass && !info) return res.status(501).json({ status: 501, error: 'Transaction Failed' });// server error

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: info });
        });
      });
    });
    return;
 }

 // credit account controller
  static creditAccount(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);

    // call middleware
    middleware.debitCreditVerve(req, accountNumber, (error, request) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      const amount = parseFloat(request.amount, 10);
      const transactionType = 'credit';
      
      model.getSingleUserAccount(request.accountNumber, ({ success, data }) => {
        if (success && !data) return res.status(404).json({ status: 404, error: 'Account not Found' });

        const accountBalance = parseFloat(data.balance + amount, 10);

        model.debitCreditAccount(accountBalance, data, accountNumber, req.data.id, data.balance, amount, transactionType, ({ pass, info }) => {
          if (!pass) return res.status(500).json({ status: 500, error: info.message });// server error

          if (pass && !info) return res.status(501).json({ status: 501, error: 'Transaction Failed' });// server error

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: info });
        });
      });
    });
    return;
  }
  
  // view a specific account transaction
  static getSingleTransaction(req, res) {
    const id = parseInt(req.params.id, 10);
    // check if there is an id
    if (!id || id<0) return res.status(400).json({ status: 400, error: 'No id found in the request parameter' });
    
    // call the model
    model.getSingleTransaction(id, ({ success, data }) => {
      console.log(success + ''+ data);
      if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });

      if (success && !data) return res.status(404).json({ status: 404, error: 'Transaction not found' }); console.log(data[0].owner);
      if (req.data.type !== 'staff' && req.data.id !== data[0].owner) return res.status(403).json({ status: 403, error: 'Forbidden' });
      // success
      return res.status(200).json({ status: 200, data: data[0] });
    });
    return;
  }

  // get all transactions
  static getAllTransactions(req, res) {
    model.getAllTransactions(({ success, data }) => {
      if (!success) return res.status(500).json({ status: 500, error: 'Sever Error' });
      if (data.length === 0) return res.status(404).json({ status: 404, error: 'No transaction Found' });
      return res.status(200).json({ status: 200, data });
    });
    return;
  }
}

// export class
export default Transactions;
