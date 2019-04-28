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

      const amount = parseFloat(request.amount, 10);
      const transactionType = 'debit';

      // get account details
      model.getSingleUserAccount(request.accountNumber, ({ passed, datar }) => {
        if (passed && !datar) return res.status(404).json({ status: 404, error: 'Account not found' });
        
        if (datar.status === 'dormant') return res.status(400).json({ status: 400, error: 'Cannot debit a dormant account' });
        if(datar.balance < amount) return res.status(400).json({ status: 400, error: 'Insufficient Funds' });

        const accountBalance = parseFloat(datar.balance - amount, 10);

        // debit account model
        model.debitCreditAccount(accountBalance, datar, accountNumber, req.data.id, datar.balance, amount, transactionType, ({ pass, info }) => {
          console.log(pass+' '+info.message);
          if (!pass) return res.status(500).json({ status: 500, error: info.message });// server error

          if (pass && !info) return res.status(501).json({ status: 501, error: 'Transaction Failed' });// server error

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: info[0] });
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
      console.log(typeof amount);
      const transactionType = 'credit';
      
      model.getSingleUserAccount(request.accountNumber, ({ passed, datar }) => {
        console.log(passed);
        if (passed && !datar) return res.status(404).json({ status: 404, error: 'Account not Found' });
        
        const accountBalance = parseFloat(datar.balance + amount, 10);
        console.log(accountBalance); console.log(datar.balance);

        model.debitCreditAccount(accountBalance, datar, accountNumber, req.data.id, datar.balance, amount, transactionType, ({ pass, info }) => {
          if (!pass) return res.status(500).json({ status: 500, error: info.message });// server error

          if (pass && !info) return res.status(501).json({ status: 501, error: 'Transaction Failed' });// server error

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: info[0] });
        });
      });
    });
    return;
  }
  
  // view a specific account transaction
  static getSingleTransaction(req, res) {
    const id = parseInt(req.params.id, 10);
    // check if there is an id
    if (!id || id <= 0 ) return res.status(400).json({ status: 400, error: 'No id found in the request parameter' });
    
    // call the model
    model.getSingleTransaction(id, ({ success, data }) => {
      model.getSingleUserAccount(data[0].accountnumber, ({ passed, datar }) => {
        if (passed, datar) {
          if (req.data.type !== 'staff' && req.data.id !== datar.owner) return res.status(403).json({ status: 403, error: 'Forbidden to see another users transactions' });
        }
        if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });

        if (success && !data) return res.status(404).json({ status: 404, error: 'Transaction not found' });
        // success
        return res.status(200).json({ status: 200, data: data[0] });
      });
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
