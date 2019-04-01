// import dependencies
import { Router } from 'express';

// import files
import account from '../controller/account';
import authentication from '../middleware/auth';

// instantiate route
const route = Router();

// credit account route
route
  .post('/:accountNumber/credit', authentication.isStaff, account.creditAccount);

// debit account route
route
  .post('/:accountNumber/debit', authentication.isStaff, account.debitAccount);

// get all transactions for a single user
route
  .get('/:accountNumber', authentication.isUser, account.getAllTransactionsSpecific);

// export route
export default route;
