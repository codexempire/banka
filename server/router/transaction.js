// import dependencies
import { Router } from 'express';

// import files
import account from '../controller/transactions';
import authentication from '../middleware/auth';

// instantiate route
const route = Router();

// credit account route
route
  .post('/:accountNumber/credit', authentication.isStaff, account.creditAccount);

// debit account route
route
  .post('/:accountNumber/debit', authentication.isStaff, account.debitAccount);

// get specific transaction
route
  .get('/:id', authentication.isUser, account.oneTransaction);

// export route
export default route;
