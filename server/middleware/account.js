// import dependencies
import Joi from 'joi';

// account middleware
class Account {
  // validate account creation input fields
  static verifyAccountCreationData(req, completion) {
    const schema = Joi.object().keys({
      type: Joi.string().valid('current', 'savings').min(7).required()
    });
    const request = {
      type: req.body.type
    };
    
    // validate request body
    const { error } = Joi.validate(request, schema);

    completion(error, request);
    return;
  }

  // change account status middleware
  static checkAccountStatus(req, accountNumber, completion) {
    const schema = Joi.object().keys({
      accountNumber: Joi.number().min(100).required(),
      status: Joi.string().valid('active', 'dormant').min(5).required()
    });
    const request = {
      accountNumber: accountNumber,
      status: req.body.status.toLowerCase().trim().replace(/\s+/g, '')
    };

    // validate request body
    const { error } = Joi.validate(request, schema);

    completion(error, request);
    return;
  }

  // debit account status middleware
  static debitCreditVerve(req, accountNumber, completion) {
    const schema = Joi.object().keys({
      accountNumber: Joi.number().min(100).required(),
      amount: Joi.number().min(1).required()
    });// create schema
    const request = {
      accountNumber: accountNumber,
      amount: req.body.amount
    };
    const { error } = Joi.validate(request, schema);// validate request body
    completion(error, request);
    return;
  }

  // checking for the account number in the parameters for the delete route
  static checkAccountNumber(accountNumber, completion) {
    const schema = Joi.object().keys({
      accountNumber: Joi.number().min(100).required()
    });
    const request = {
      accountNumber: accountNumber
    };

    // validate request body
    const { error } = Joi.validate(request, schema);

    completion(error, request.accountNumber);
    return;
  }
}
// export middleware
export default Account;
