// import dependencies
import db from './database/user';

// create middleware class
class user {
  // creating validator
  static signup(datta, password, isAdmin, completion) {
    // creating schema
    const exist = db.find(user => user.email === datta.email);

    // check if user exists
    if (exist) {
      completion({
        success: true,
        data: new Error('User with the same email already exists')
      });
      return null;
    }
    // create a new user object
    const newUser = {
      id: db.length + 1,
      firstname: datta.firstname,
      lastname: datta.lastname,
      email: datta.email,
      password,
      type: datta.type,
      isAdmin
    };

    // if successfull
    if (db.push(newUser)) {
      completion({ success: true, data: newUser });
      return null;
    }

    // internal server error
    completion({ success: false, data: new Error('Internal Server Error') });
    return null;
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
