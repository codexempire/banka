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
        .label("Enter your firstname"),
      lastname: Joi.string()
        .min(3)
        .max(20)
        .required()
        .label("Enter your Lastname"),
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
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .min(4)
        .required()
        .label("Choose a valid account type")
    });

    // validate
    const { error } = Joi.validate(req.body, schema);

    completion(error);
  }
}
// export middleware
export default user;
