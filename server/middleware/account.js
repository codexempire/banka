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
        .label('Account type should be savings or current'),
      ownerEmail: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
        .label('Enter a valid Email')
    });
    const request = {
      type: req.body.type,
      ownerEmail: req.body.ownerEmail.trim().replace(/\s+/g, '').toLowerCase()
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
        .required()
        .label('No Account Number Found'),
      amount: Joi.number()
        .min(1)
        .required()
        .label('Enter an amount'),
      cashier: Joi.number()
        .min(1)
        .required()
        .label('Enter your user id')
    });// create schema
    const request = {
      accountNumber: accountNumber,
      amount: req.body.amount.trim().replace(/\s+/g, ''),
      cashier: req.body.cashier.trim().replace(/\s+/g, '')
    };
    const { error } = Joi.validate(request, schema);// validate request body
    completion(error, request);
    return;
  }

  // checking for the account number in the parameters for the delete route
  static checkAccountNumber(accountNumber, completion) {
    const schema = Joi.object().keys({
      accountNumber: Joi.number()
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
