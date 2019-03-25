// import dependencies
import  express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { config } from 'dotenv';

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

// error handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    msg: err.message
  });
});

// listen
app.listen(port, (err) => {
  if (err) console.log(err.message);
  console.log(`Running on port: ${port}`);
});
