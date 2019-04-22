// import dependencies
import middleware from '../middleware/account';
import model from '../model/account';

// transactions class
class transactions{
 // debit account controller
 static debitAccount(req, res) {
    // collect account number from header
    const accountNumber = parseInt(req.params.accountNumber, 10);
    // Remove white spaces
    try {
      if (req.body.amount) req.body.amount = req.body.amount.trim().replace(/\s+/g, '');

      // Remove white spaces
      if (req.body.cashier) req.body.cashier = req.body.cashier.trim().replace(/\s+/g, '');
    } catch(err){}

    // check accountNumber
    if (!accountNumber) return res.status(400).json({ status: 400, error: 'No Account Number Found' });

    // call middleware
    middleware.debitCreditVerve(req, (error) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      const amount = parseFloat(req.body.amount, 10);
      
      // set transaction type to debit
      const transactionType = 'debit';

      // get account details
      model.getSingleAccount(accountNumber, ({ success, data }) => {
        // account was not found
        if(success && !data) return res.status(404).json({ status: 404, error: 'Account not found' });

        // check if account balance
        if(data.balance < amount) return res.status(409).json({ status: 409, error: 'Insufficient Funds' });

        const accountBalance = parseFloat(data.balance - amount, 10);

        // debit account model
        model.debitCreditAccount(data, data.balance, accountNumber, amount, transactionType, accountBalance, ({ pass, info }) => {
          // server error
          if(!pass) return res.status(500).json({ status: 500, error: dataa.message });

          // server error
          if (pass && !info) return res.status(501).json({ status: 501, error: 'Transaction Failed' });

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: info });
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
      if (req.body.amount) req.body.amount = req.body.amount.trim().replace(/\s+/g, '');

      // Remove white spaces
      if (req.body.cashier) req.body.cashier = req.body.cashier.trim().replace(/\s+/g, '');
    } catch (err) { }

    // check accountNumber
    if (!accountNumber) return res.status(400).json({ status: 400, error: 'No Account Number Found' });

    // call middleware
    middleware.debitCreditVerve(req, (error) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      const amount = parseFloat(req.body.amount, 10);
      
      // set transaction type to debit
      const transactionType = 'credit';

      // get account details
      model.getSingleAccount(accountNumber, ({ success, data }) => {
        // account was not found
        if(success && !data) return res.status(404).json({ status: 404, error: 'Account not Found' });

        const accountBalance = parseFloat(data.balance + amount, 10);

        // debit account model
        model.debitCreditAccount(data, data.balance, accountNumber, amount, transactionType, accountBalance, ({ pass, info }) => {
          // server error
          if (!pass) return res.status(500).json({ status: 500, error: info.message });

          // server error
          if (pass && !info) return res.status(501).json({ status: 501, error: 'Transaction Failed' });

          // respond with the transaction details
          return res.status(200).json({ status: 200, data: info });
        });
        return null;
      });
      return null;
    });
    return null;
 } 
}

// export class
export default transactions;
