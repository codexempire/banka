// import dependencies
import Joi from 'joi';

// import files
// account middleware
class account {
  // validate account creation input fields
  static verifyAccountCreation(req, completion){
    // create schema
    const schema = Joi.object().keys({      
      type: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .min(7)
        .required()
        .label('Choose a valid account type'),
      owner: Joi.number()
        .min(1)
        .required()
        .label('Enter your user id')
    });

    // validate request body
    const { error } = Joi.validate(req.body,schema);

    completion(error);
  }

  static checkAccount(req, completion) {
    // create schema
    const schema = Joi.object().keys({
      status: Joi.string()
        .min(5)
        .required()
        .label('Enter an valid account status')
    });

    // validate request body
    const { error } = Joi.validate(req.body, schema);

    completion(error);
  }
}
// export middleware
export default account;
