// import dependencies
import Joi from 'joi';

// create middleware class
class user {
  // creating validator
  static validator(req, completion) {
    // creating schema
    const schema = Joi.object().keys({
      firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(8).required(),
    });
    const request = {
      firstname: req.body.firstname.trim().replace(/\s+/g, ''),
      lastname: req.body.lastname.trim().replace(/\s+/g, ''),
      email: req.body.email.trim().replace(/\s+/g, '').toLowerCase(),
      password: req.body.password.trim().replace(/\s+/g, ''),
    };

    // validate
    const { error } = Joi.validate(request, schema);

    completion(error, request);
  }

  // creating validator
  static staffValidator(req, completion) {
    // creating schema
    const schema = Joi.object().keys({
      firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(8).required(),
    });
    const request = {
      firstname: req.body.firstname.trim().replace(/\s+/g, ''),
      lastname: req.body.lastname.trim().replace(/\s+/g, ''),
      email: req.body.email.trim().replace(/\s+/g, '').toLowerCase(),
      password: req.body.password.trim().replace(/\s+/g, ''),
    };

    // validate
    const { error } = Joi.validate(request, schema);

    completion(error, request);
  }

  // create signin middleware
  static verifyFields(req, completion) {
    // define schema
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(8).required()
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
