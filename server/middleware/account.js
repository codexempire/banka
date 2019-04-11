// import dependencies
import Joi from 'joi';

// import files
// account middleware
class account {
  // validate account creation input fields
  static verifyAccountCreation(req, completion) {
    // create schema
    const schema = Joi.object().keys({
      type: Joi.string()
        .valid('current', 'savings')
        .min(7)
        .required()
        .label('Account type should be savings or current'),
      owner: Joi.number()
        .min(1)
        .required()
        .label('Enter your user id')
    });

    // validate request body
    const { error } = Joi.validate(req.body, schema);

    completion(error);
  }

  // change account status middleware
  static checkAccount(req, completion) {
    // create schema
    const schema = Joi.object().keys({
      status: Joi.string()
        .valid('active', 'dormant')
        .min(5)
        .required()
        .label('Account status should be active or  dormant')
    });

    // validate request body
    const { error } = Joi.validate(req.body, schema);

    completion(error);
  }

  // debit account status middleware
  static debitCreditVerve(req, completion) {
    // create schema
    const schema = Joi.object().keys({
      amount: Joi.number()
        .min(1)
        .required()
        .label('Enter an amount'),
      cashier: Joi.number()
        .min(1)
        .required()
        .label('Enter your user id')
    });

    // validate request body
    const { error } = Joi.validate(req.body, schema);

    completion(error);
  }
}
// export middleware
export default account;
