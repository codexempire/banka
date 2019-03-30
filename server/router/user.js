// import dependencies
import { Router } from 'express';

// import files
import user from '../controller/user';
import authentication from '../middleware/auth';

// inostantiate route
const route = Router();

// signup route
route
  .post('/signup', user.signup);

// signup route
route
  .post('/signup/staff', authentication.isAdmin, user.signup);

// log in route
route
  .post('/signin', user.signin);


// export route
export default route;
