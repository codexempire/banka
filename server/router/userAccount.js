// import dependencies
import { Router } from 'express';

// import files
import user from '../controller/user';
import authentication from '../middleware/auth';

// inostantiate route
const route = Router();

// signup route
route
 .get('/:userEmailAddress/accounts', authentication.isUser, user.getAllSpecificUserAccounts);

// export route
export default route;
