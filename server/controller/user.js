// import dependencies
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// import files
import model from '../model/user';
import middleware from '../middleware/user';


// create controller class
class user {
  // create signup controller handle
  static signup(req, res) {
    try {
      if (req.body.firstname) req.body.firstname = req.body.firstname.replace(/\s+/g, '').trim();

      // Remove white spaces
      if (req.body.lastname) req.body.lastname = req.body.lastname.replace(/\s+/g, '').trim();

      // Remove white spaces
      if (req.body.email) req.body.email = req.body.email.replace(/\s+/g, '').trim().toLowerCase();

      // Remove white spaces
      if (req.body.password) req.body.password = req.body.password.replace(/\s+/g, '').trim();

      // Remove white spaces
      if (req.body.type) req.body.type = req.body.type.replace(/\s+/g, '').trim().toLowerCase();

    } catch (error) { }

    middleware.validator(req, (error) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

      // set is Admin to false
      const isAdmin = false;

      // hash password
      bcrypt.hash(req.body.password, 10, (_, result) => {
        // Failed to hash password
        if (!result) return res.status(500).json({ status: 500, error: 'Server Error' });

        // check if user with the same email exists
        model.fetchUserByEmail(req.body.email, ({ success, data }) => {
          // server error
          if (!success) return res.status(500).json({ status: 500, error: data.message });
          
          // email has been used
          if (success && data) return res.status(409).json({ status: 409, error: 'Email has been used' });
          
          model.signup(req.body, result, isAdmin, ({ pass, info }) => {
            // Server Error
            if (!pass) return res.status(500).json({ status: 500, error: info.message });

            // Sign user token
            const token = jwt.sign({ data: info }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });

            // Failed to sign user token
            if (!token) return res.status(500).json({ status: 500, error: 'Failed to generate token' });
            
            return res.status(201).json({ status: 201, data: { token, info } });
          });
          return null;
        });
        return null;
        });
        return null;
      });
      return null;
  }

  // create staff or admin signup controller handle
  static createStaffAdmin(req, res) {
    // Remove white spaces
    try {
      if (req.body.firstname) req.body.firstname = req.body.firstname.replace(/\s+/g, '').trim();

      // Remove white spaces
      if (req.body.lastname) req.body.lastname = req.body.lastname.replace(/\s+/g, '').trim();

      // Remove white spaces
      if (req.body.email) req.body.email = req.body.email.replace(/\s+/g, '').trim().toLowerCase();

      // Remove white spaces
      if (req.body.password) req.body.password = req.body.password.replace(/\s+/g, '').trim();

      // Remove white spaces
      if (req.body.type) req.body.type = req.body.type.replace(/\s+/g, '').trim().toLowerCase();

    } catch (error) {}

    middleware.staffValidator(req, (error) => {
      // check for error
      if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });
    
      let isAdmin = req.body.isAdmin;

      // check if account is an admins account or not
      isAdmin === undefined || isAdmin !== 'true' ? isAdmin = false : isAdmin = true    

      // hash password
      bcrypt.hash(req.body.password, 10, (_, result) => {
        // failed to hash password
        if (!result) return res.status(500).json({ status: 500, error: 'Server Error' });

        // check if user with the same email exists
        model.fetchUserByEmail(req.body.email, ({ success, data }) => {
          // server error
          if (!success) return res.status(500).json({ status: 500, error: data.message });

          // Email has been used
          if (success && data) return res.status(409).json({ status: 409, error: 'Email has been used' });
          model.signup(req.body, result, isAdmin, ({ pass, info }) => {
            // server error
            if (!pass) return res.status(500).json({ status: 500, error: 'Failed to create user' });

            // sign the token for user
            const token = jwt.sign({ data: info }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });
            
            if (!token) return res.status(500).json({ status: 500, error: 'Failed to generate token' });
            return res.status(201).json({ status: 201, data: { token, info } });
          });
          return null;
        });
        return null;
      });
      return null;
    });
    return null;
  }

  // create signin controller handle
  static signin(req, res) {

    try {
      // Remove white spaces
      if (req.body.email) {
        req.body.email = req.body.email.replace(/\s+/g, '').trim().toLowerCase();
      }

      // Remove white spaces
      if (req.body.password) {
        req.body.password = req.body.password.replace(/\s+/g, '').trim();
      }
    } catch (error) { }

    // middleware to verify fields
    middleware.verifyFields(req, (error) => {
      // check for errors
      if (error) {
        // respond with status 400 and relevant error message
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      
      // check if user with the email exists
      model.fetchUserByEmail(req.body.email, ({ success, data }) => {
        // check for errors
        if (!success) {
          // server error
          return res.status(500).json({ status: 500, error: data.message });
        }
        if (success && !data) {
          // user not found
          return res.status(404).json({ status: 404, error: 'Invalid Email or Password' });
        }
        
        bcrypt.compare(req.body.password, data.password, (_, result) => {
          if (!result) {
            // password do not match
            return res.status(401).json({ status: 401, error: `Invalid Email or Password` });
          }

          // create token
          const token = jwt.sign({ data: data }, process.env.TOKEN_KEY);

          if (!token) {
            // failed to generate token
            return res.status(500).json({ status: 500, error: 'Failed to generate token' });
          }

          // success response
          return res.status(200).json({ status: 200, data:{ token, data }});
        });
        return null;
      });
      return null;
    });
    return null;
  }

  // get all users accounts
  static getAll(req, res) {
    const email = req.params.userEmailAddress.toLowerCase().replace(/\s+/g, '').trim();

    if (!email) res.status(400).json({ status: 400, error: 'Enter a valid Email' });

    middleware.verifyEmail(email, error=>{
      // check for error
      if (error) return res.status(400).json({ status: 400, error: 'Enter a valid Email' });

      model.getAccounts(email, ({ success, data }) => {
        // server error
        if (!success) return res.status(500).json({ status: 500, error: 'Server Error' });

        // if no accounts found
        if (data.length === 0) return res.status(404).json({ status: 404, error: 'No accounts found for this user' });

        // found accounts
        return res.status(200).json({ status: 200, data });
      });
      return null;
    });
    return null;
  }
}

// export controller
export default user;