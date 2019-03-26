// import dependencies
import db from './database/user';

// create middleware class
class user {
  // creating validator
  static signup({ firstname, lastname, email, password, type }, completion) {
    // creating schema
    const exist = db.find(user => user.email === email);

    // check if user exists
    if (exist) {
      completion({ success: true, data: new Error('User with the same email already exists') });
    }

    const newUser = {
      id: db.length + 1,
      firstname,
      lastname,
      email,
      password,
      type,
      isAdmin: false
    };

    db.push(newUser);

    // if successfull
    if (db.push(newUser)) {
      completion({ success: true, data: newUser });
    } else {
      // internal server error
      completion({ success: false, data: new Error('Internal Server Error') });
    }
  }
}
// export middleware
export default user;
