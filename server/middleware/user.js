// import dependencies
import Joi from 'joi';

// create middleware class
class user {
  // creating validator
  static validator(body, completion) {
    // creating schema
    const schema = Joi.object().keys({
      firstname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label('Enter your firstname'),
      lastname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label('Enter your Lastname'),
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
        .label('Choose a valid type'),
      isAdmin: Joi.string()
        .valid('false')
        .label('Account can not be set to Admin')
    });

    // validate
    const { error } = Joi.validate(body, schema);

    completion(error);
  }

  // creating validator
  static staffValidator(req, completion) {
    // creating schema
    const schema = Joi.object().keys({
      firstname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label('Enter your firstname'),
      lastname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label('Enter your Lastname'),
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
        .valid('staff')
        .min(4)
        .required()
        .label('Choose a valid type'),
      isAdmin: Joi.string()
        .valid('false', 'true')
        .label('Identify if staff is an Admin or not')
    });

    // validate
    const { error } = Joi.validate(req.body, schema);

    completion(error);
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

    // validate fields
    const { error } = Joi.validate(req.body, schema);

    // return validation
    completion(error);
  }
}
// export middleware
export default user;
