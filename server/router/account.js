// import dependencies
import { Router } from 'express';

// import files
import account from '../controller/account';
import authentication from '../middleware/auth';

// instantiate route
const route = Router();

// account creation route
route
  .post('/', authentication.isUser, account.createUserAccount);

// activation and deactivation of account route
route
  .patch('/:accountNumber', authentication.isStaff, account.activateDeactivate);

// delete account route
route
  .delete('/:accountNumber', authentication.isStaff, account.delete);

// get single account details
route
  .get('/:id', authentication.isUser, account.getSingleAccount);

// get single account details
route
  .get('/', authentication.isStaff, account.getAllAccount);

// get all dormant accounts
route
  .get('/status/dormant', authentication.isStaff, account.dormantAccount);

// get all active bank account
route
  .get('/status/active', authentication.isStaff, account.activeAccounts);

// get all transactions for a single user
route
  .get('/:accountNumber/transactions', authentication.isUser, account.getAllTransactionsSpecific);

// export route
export default route;
