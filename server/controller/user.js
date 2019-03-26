// import dependencies
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// import files
import model from '../model/user';
import middleware from '../middleware/user';

// config
config();

// create controller class
class user {
  // create signup controller handle
  static signup(req, res) {
    middleware.validator(req, (error) => {
      // error from joi
      if (error) {
        res.status(400).json({
          status: 400,
          error: error.details[0].context.label
        });
      }

      // check type value
      if (req.body.type !== 'user' && req.body.type !== 'staff') {
        res.status(400).json({
          status: 400,
          error: "Choose a valid account type"
        });
      }

      // destructure body
      const { firstname, lastname, email, password, type } = req.body;

      // model
      model.signup({ firstname, lastname, email, password, type }, ({ success, data }) => {
        // check for error
        if (!success) {
          // server error
          res.status(500).json({
            status: 500,
            error: data.message
          });
        }
        if (success && data.message) {
          // user already exists
          res.status(409).json({
            status: 409,
            error: data.message
          });
        }

        // data value
        const info = {
          id: data.id,
          name: data.firstname,
          email: data.email
        }

        // success response
        res.status(201).json({
          status: 201,
          data: {
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
    });
  }
}

// export controller
export default user;
