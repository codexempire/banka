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
route.patch("/:accountNumber", authentication.isUser, account.activateDeactivate);

// export route
export default route;;
