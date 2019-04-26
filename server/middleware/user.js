// import dependencies
import Joi from 'joi';

// create middleware class
class user {
  // creating validator
  static validator(req, completion) {
    // creating schema
    const schema = Joi.object().keys({
      firstname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label('Enter your firstname of at least 3 to 20 characters'),
      lastname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label('Enter your Lastname of at least 3 to 20 characters'),
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
        .label('Enter a valid Email'),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .min(8)
        .required()
        .label('Enter a password of not less than 8 characters'),
      type: Joi.string()
        .valid('user')
        .min(4)
        .required()
        .label('Type should be user'),
      isAdmin: Joi.string()
    });
    const request = {
      firstname: req.body.firstname.trim().replace(/\s+/g, ''),
      lastname: req.body.lastname.trim().replace(/\s+/g, ''),
      email: req.body.email.trim().replace(/\s+/g, '').toLowerCase(),
      password: req.body.password.trim().replace(/\s+/g, ''),
      type: req.body.type.trim().replace(/\s+/g, ''),
      isAdmin: req.body.isAdmin
    };

    // validate
    const { error } = Joi.validate(request, schema);

    completion(error, request);
  }

  // creating validator
  static staffValidator(req, completion) {
    // creating schema
    const schema = Joi.object().keys({
      firstname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label("Enter your firstname of at least 3 to 20 characters"),
      lastname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label("Enter your Lastname of at least 3 to 20 characters"),
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
        .label("Enter a valid Email"),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .min(8)
        .required()
        .label("Enter a password of not less than 8 characters"),
      type: Joi.string()
        .valid("staff")
        .min(4)
        .required()
        .label("Type should be staff"),
      isAdmin: Joi.string()
        .valid("false", "true")
        .label("Identify if staff is an Admin or not")
    });
    const request = {
      firstname: req.body.firstname.trim().replace(/\s+/g, ''),
      lastname: req.body.lastname.trim().replace(/\s+/g, ''),
      email: req.body.email.trim().replace(/\s+/g, '').toLowerCase(),
      password: req.body.password.trim().replace(/\s+/g, ''),
      type: req.body.type.trim().replace(/\s+/g, ''),
      isAdmin: req.body.isAdmin
    };

    // validate
    const { error } = Joi.validate(request, schema);

    completion(error, request);
  }

  // create signin middleware
  static verifyFields(req, completion) {
    // define schema
    const schema = Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
        .label('Enter a valid Email'),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .min(8)
        .required()
        .label('Enter a password of not less than 8 characters')
    });
    const request = {
      email: req.body.email.trim().replace(/\s+/g, '').toLowerCase(),
      password: req.body.password.trim().replace(/\s+/g, '')
    };

    // validate fields
    const { error } = Joi.validate(request, schema);

    // return validation
    completion(error, request);
  }

  // create get accounts for user middleware
  static verifyEmail(email, completion) {
    // define schema
    const schema = Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
    });
    const request = { email: email.toLowerCase().trim().replace(/\s+/g, '') };

    // validate fields
    const { error } = Joi.validate(request, schema);

    // return validation
    completion(error, request);
  }
}
// export middleware
export default user;
