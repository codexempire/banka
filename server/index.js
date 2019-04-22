// import dependencies
import  express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.json';

// import routes
import user from './router/user';
import uesrAccount from './router/userAccount';
import account from './router/account';
import transaction from './router/transaction';

// config
config();

// instantiate app
const app = express();

// port
const port = process.env.PORT || 3000;

// use midddleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// using swagger documentation
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDoc));

//use routes
app.use('/api/v1/auth', user);
app.use('/api/v1/user', uesrAccount);
app.use('/api/v1/accounts', account);
app.use('/api/v1/transactions', transaction);

// error handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    msg: `Url Not Found`
  });
});

// listen
app.listen(port, (err) => {
  if (err) console.log(err.message);
  console.log(`Running on port: ${port}`);
});

export default app;// for testing
