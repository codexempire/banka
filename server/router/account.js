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
  .patch('/:accountNumber', authentication.isStaff, account.activateDeactivateAccount);

// delete account route
route
  .delete('/:accountNumber', authentication.isStaff, account.deleteAccount);

// get single account details
route
  .get('/:accountNumber', authentication.isUser, account.getSingleUserAccount);

// get single account details
route
  .get('/', authentication.isStaff, account.getAllAccounts);

// get all transactions for a single user
route
  .get('/:accountNumber/transactions', authentication.isUser, account.getAllTransactionsSpecificAccount);

// export route
export default route;
