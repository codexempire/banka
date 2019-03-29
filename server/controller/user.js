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
    middleware.validator(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }
      
      // destructure request body
      let { firstname, lastname, email, password, type, isAdmin } = req.body;
      
      // verify the type
      if (type !== 'user' && type !== 'staff') {
        return res.status(400).json({ status: 400, error: 'Choose a valid type' });
      }

      // verify isAdmin
      if (isAdmin === undefined || isAdmin !== 'true') {
        // isAdmin is false
        isAdmin = false
      }

      if (isAdmin === 'true') {
        // if isAdmin
        isAdmin = true
      }
      // hash password
      bcrypt.hash(password, 10, (err, result) => {
        if (!result) {
          // did not hash the password
          return res.status(500).json({ status: 500, error: 'Server Error' });
        }

        // calling model
        model.signup(firstname, lastname, email, result, type, isAdmin, ({ success, data }) => {
          
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
    // middleware to verify fields
    middleware.verifyFields(req, (error) => {
      // check for errors
      if (error) {
        // respond with status 400 and relevant error message
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      // destructure request body
      const { email, password } = req.body;

      // check if user with the email exists
      model.fetchUserByEmail(email, ({ success, data }) => {
        // check for errors
        if (!success) {
          // user not found
          return res.status(404).json({ status: 404, error: data.message });
        }
        
        bcrypt.compare(password, data.password, (err, result) => {
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
