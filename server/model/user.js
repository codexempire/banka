// import dependencies
import pool from './db';
import db from './database/user';

// create middleware class
class user {
  // creating validator
  static signup(data, result, isAdmin, completion) {
    const text = `INSERT INTO users(firstname,lastname,email,password,type,isAdmin) VALUES ('${data.firstname}', '${data.lastname}', '${data.email}', '${result}', '${data.type}', ${isAdmin}) RETURNING *`;
    
    pool
      .query(text)
      .then(res => completion({ pass: true, info: res.rows[0] }))
      .catch(err => completion({ pass: false, info: err }));
    return null;
  }

  // fetch user by emailmodel
  static fetchUserByEmail(email, completion) {
    const text = `SELECT * FROM users WHERE email = '${email}'`;
    
    pool
      .query(text)
      .then(res => completion({ success: true, data: res.rows[0] }))
      .catch(err => completion({ success: false, data: err }));
    return null;
  }
}
// export middleware
export default user;
