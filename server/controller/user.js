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
      if (req.body.firstname) {
        req.body.firstname = req.body.firstname.replace(/\s+/g, '').trim();
      }

      // Remove white spaces
      if (req.body.lastname) {
        req.body.lastname = req.body.lastname.replace(/\s+/g, '').trim();
      }

      // Remove white spaces
      if (req.body.email) {
        req.body.email = req.body.email.replace(/\s+/g, '').trim().toLowerCase();
      }

      // Remove white spaces
      if (req.body.password) {
        req.body.password = req.body.password.replace(/\s+/g, '').trim();
      }

      // Remove white spaces
      if (req.body.type) {
        req.body.type = req.body.type.replace(/\s+/g, '').trim().toLowerCase();
      }
    } catch (error) { }

    middleware.validator(req, (error) => {

      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      let isAdmin = req.body.isAdmin;

      // set isAdmin to false
      isAdmin = false;

      // hash password
      bcrypt.hash(req.body.password, 10, (_, result) => {
        if (!result) {
          // did not hash the password
          return res.status(500).json({ status: 500, error: 'Server Error' });
        }

        // calling model
        model.signup(req.body, result, isAdmin, ({ success, data }) => {

          if (success && data.message) {
            // user already exists
            return res.status(409).json({ status: 409, error: data.message });
          }

          if (!success) {
            // server error
            return res.status(500).json({ status: 500, error: data.message });
          }

          // create token
          const token = jwt.sign({ data: data }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });

          if (!token) {
            // failed to generate token
            return res.status(500).json({ status: 500, error: 'Failed to generate token' });
          }

          // success response
          return res.status(201).json({
            status: 201,
            data: {
              token,
              id: data.id,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              password: data.password,
              type: data.type,
              isAdmin: data.isAdmin
            }
          });
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
      if (req.body.firstname) {
        req.body.firstname = req.body.firstname.replace(/\s+/g, '').trim();
      }

      // Remove white spaces
      if (req.body.lastname) {
        req.body.lastname = req.body.lastname.replace(/\s+/g, '').trim();
      }

      // Remove white spaces
      if (req.body.email) {
        req.body.email = req.body.email.replace(/\s+/g, '').trim().toLowerCase();
      }

      // Remove white spaces
      if (req.body.password) {
        req.body.password = req.body.password.replace(/\s+/g, '').trim();
      }

      // Remove white spaces
      if (req.body.type) {
        req.body.type = req.body.type.replace(/\s+/g, '').trim().toLowerCase();
      }
    } catch (error) {}

    middleware.staffValidator(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }
    
      let isAdmin = req.body.isAdmin;

      // check for is Admin
      if (isAdmin === undefined || isAdmin !== 'true') {
        isAdmin = false;
      } else {
        // if it is an admins account
        isAdmin = true;
      }

      

      // hash password
      bcrypt.hash(req.body.password, 10, (_, result) => {
        if (!result) {
          // did not hash the password
          return res.status(500).json({ status: 500, error: 'Server Error' });
        }

        // calling model
        model.signup(req.body, result, isAdmin, ({ success, data }) => {
          
          if(!success){
            // server error
            return res.status(500).json({ status: 500, error: data.message });
          }

          if(success && data.message){
            // user already exists
            return res.status(409).json({status:409,error:data.message});
          }

          // create token
          const token = jwt.sign({ data: data }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });

          if (!token) {
            // failed to generate token
            return res.status(500).json({ status: 500, error: 'Failed to generate token' });
          }

          // success response
          return res.status(201).json({
            status: 201,
            data: {
              token,
              id: data.id,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              password: data.password,
              type: data.type,
              isAdmin: data.isAdmin
            }
          });
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
          // user not found
          return res.status(404).json({ status: 404, error: data.message });
        }
        
        bcrypt.compare(req.body.password, data.password, (_, result) => {
          if(!result){
            // password do not match
            return res.status(401).json({ status: 401, error: `Invalid Email or Password` });
          }

          // create token
          const token = jwt.sign({ data: data }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });

          if (!token) {
            // failed to generate token
            return res.status(500).json({ status: 500, error: 'Failed to generate token' });
          }

          // success response
          return res.status(200).json({
            status: 200,
            data: {
              token,
              id: data.id,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              password: data.password,
              type: data.type,
              isAdmin: data.isAdmin
            }
          });
        });
        return null;
      });
      return null;
    });
    return null;
  }
}

// export controller
export default user;