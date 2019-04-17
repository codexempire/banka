// import dependencies
import db from './database/user';

// create middleware class
class user {
  // creating validator
  static signup(values, completion) {
    // creating pool
    const queryText = `INSERT INTO users(firstname,lastname,email,password,type) VALUES('${values.firstname}', '${values.lastname}', '${values.email}', ${values.password}, ${values.type})`;
    
  }

  // fetch user by emailmodel
  static fetchUserByEmail(email, completion) {
    // check if user exists
    const user = db.find(oneUser => oneUser.email === email);

    if(user){
      completion({ success: true, data: user });
      return null;
    }
    
    completion({ success: false, data: new Error('Invalid Email or Password') });
    return null;
  }
}
// export middleware
export default user;
