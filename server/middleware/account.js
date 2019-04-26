// import dependencies
import Joi from 'joi';

// account middleware
class Account {
  // validate account creation input fields
  static verifyAccountCreationData(req, completion) {
    const schema = Joi.object().keys({
      type: Joi.string() 
        .valid('current', 'savings')
        .min(7)
        .required()
        .label('Account type should be savings or current')
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
      accountNumber: Joi.number()
        .min(100)
        .required()
        .label('No Account Number Found'),
      status: Joi.string()
        .valid('active', 'dormant')
        .min(5)
        .required()
        .label('Account status should be active or  dormant')
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
      accountNumber: Joi.number()
        .min(100)
        .required()
        .label('No Account Number Found'),
      amount: Joi.number()
        .min(1)
        .required()
        .label('Amount cannot be negative or zero enter an amount'),
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
      accountNumber: Joi.number()
        .min(100)
        .required()
        .label('No Account Number Found')
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
