// import config from dotenv
import { config } from 'dotenv';
// call config
config();
let database;

process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' ? database = process.env.DATABASE_URL : database = process.env.TEST_URL
export default database;
