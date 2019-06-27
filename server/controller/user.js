// import dependencies
import jwt from 'jsonwebtoken';
import bcrypt from '../middleware/bcrypt';

// import files
import model from '../model/user';
import middleware from '../middleware/user';


// create controller class
class user {
  // create signup controller handle
  static signup(req, res) {
    middleware.validator(req, (error, request) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });// check for error
      
      const type = 'user';
      const isAdmin = false;// setting is Admin to false
      // hash password
      bcrypt.hashPassword(request.password, result => {
        if (!result) return res.status(500).json({ status: 500, error: 'Server Error' });// Failed to hash password
        // check if user with the same email exists
        model.fetchUserByEmail(request.email, ({ success, data }) => {
          if (!success) return res.status(500).json({ status: 500, error: data.message });// server error          
          if (success && data) return res.status(409).json({ status: 409, error: 'Email has been used' });// email has been used          
          model.signup(request, type, result, isAdmin, ({ pass, info }) => {
            if (!pass) return res.status(500).json({ status: 500, error: info.message });// server error
            delete info.password;
            const token = jwt.sign({ data: info }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });
            return res.status(201).json({ status: 201, data: { token, data: info } });// successful
          });
        });
      });
    });
    return;
  }

  // create staff or admin signup controller handle
  static createStaffAdminUser(req, res) {
    middleware.staffValidator(req, (error, request) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });// check for error

      let isAdmin = req.body.isAdmin;// isAdmin
      const type = 'staff';
      isAdmin === undefined || isAdmin !== 'true' ? isAdmin = false : isAdmin = true  // check if account is an admins account or not

      // hash password
      bcrypt.hashPassword(request.password, result => {
        if (!result) return res.status(500).json({ status: 500, error: 'Server Error' });// Failed to hash password
        // check if user with the same email exists
        model.fetchUserByEmail(request.email, ({ success, data }) => {
          if (!success) return res.status(500).json({ status: 500, error: data.message });// server error   
          console.log(data);
          if (success && data) return res.status(409).json({ status: 409, error: 'Email has been used' });// email has been used          
          model.signup(request, type, result, isAdmin, ({ pass, info }) => {
            console.log(info);
            if (!pass) return res.status(500).json({ status: 500, error: info.message });// server error
            const token = jwt.sign({ data: info }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });
            console.log(token);
            return res.status(201).json({ status: 201, data: { token, data: info } });// successful
          });
        });
      });
    });
    return;
  }

  // create signin controller handle
  static signin(req, res) {
    middleware.verifyFields(req, (error, request) => {
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });// respond with status 400 and relevant error message
      
      model.fetchUserByEmail(request.email, ({ success, data }) => {
        // check for errors
        if (!success) return res.status(500).json({ status: 500, error: data.message });

        if (success && !data) return res.status(404).json({ status: 404, error: 'Invalid Email or Password' });// user not found
        
        bcrypt.comparePassword(request.password, data, result => {
          if (!result) return res.status(401).json({ status: 401, error: `Invalid Email or Password` });// password do not match

          delete data.password;
          // create token
          const token = jwt.sign({ data: data }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });

          if (!token) return res.status(500).json({ status: 500, error: 'Failed to generate token' });
          
          return res.status(200).json({ status: 200, data: { token, data } });// success response
        });
      });
    });
    return;
  }

  // get all users accounts
  static getAllSpecificUserAccounts(req, res) {
    const email = req.params.userEmailAddress;

    middleware.verifyEmail(email, (error, request)=>{
      // check for error
      if (error) return res.status(400).json({ status: 400, error: 'Enter a valid Email' });

      if (req.data.type !== 'staff' && req.data.email !== email) return res.status(403).json({ status: 403, error: 'Forbidden to access another users accounts' });
      model.getAccounts(request.email, ({ success, data }) => {
       if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });// server error

       if (data.length === 0) return res.status(404).json({ status: 404, error: 'No accounts found for this user' });// if no accounts found

       return res.status(200).json({ status: 200, data });// found accounts
      });
    });
    return;
  }
}

// export controller
export default user;
