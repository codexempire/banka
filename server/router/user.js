// import dependencies
import { Router } from 'express';

// import files
import user from '../controller/user';

// inostantiate route
const route = Router();

// signup route
route
  .post('/signup', user.signup);



// export route
export default route;
