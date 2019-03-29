// import dependencies
import  express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { config } from 'dotenv';

// import routes
import user from './router/user';
import account from './router/account';

// config
config();

// instantiate app
const app = express();

// port
const port = process.env.PORT || 5000;

// use midddleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

//use routes
app.use('/api/v1/auth', user);
app.use('/api/v1/accounts', account);

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
