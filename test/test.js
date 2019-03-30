// import dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

// import app
import app from '../server/index';

// instantiate dependencies
chai.use(chaiHttp);
chai.should();

// define variables
let accountNumber;
const accountNumberError = 567749889785;

describe('Users', () => {
  // test signup route
  // return 400 if fields are empty
  it('Should return status 400', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'make',
        firstname: 'malleten',
        lastname: 'molten',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  // return 201 if user was created
  it('Should return status 201', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'malleten',
        lastname: 'molten',
        email: 'test@hotmail.com',
        password: 'password400',
        type: 'user'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property("email");
        res.body.data.should.have.property("password");
        res.body.data.should.have.property("type");
        done();
      });
  });
  // return 409 if user with the same email exists
  it('Should return status 409', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'malleten',
        lastname: 'molten',
        email: 'test@hotmail.com',
        password: 'password400',
        type: 'user'
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  // test signin route
  // return 400 if fields are empty
  it('Should return status 400', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'make'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  // return 200 if user exists
  it('Should return status 200', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@hotmail.com',
        password: 'password400'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property("email");
        res.body.data.should.have.property("password");
        res.body.data.should.have.property("type");
        done();
      });
  });
  // return 404 if user with the same email was not found
  it('Should return status 404', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@hotail.com',
        password: 'password00'
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  // return 401 if password does not match
  it('Should return status 401', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@hotmail.com',
        password: 'password00'
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});

describe('Accounts', () => {
  // test post create account route
  // it should respond with status 401 and relevant error message
  it('respond with 401', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'currents'
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      });
  });

  // it should respond with status 400 and relevant error message
  it('respond with 400', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'currents'
      })
      .set("x-access-token", process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error");
        done();
      });
  });

  // it should respond with status 200
  it('respond with 200', done => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'current',
        owner: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        accountNumber = res.body.data.accountNumber;
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('accountNumber');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('type').eql('current');
        res.body.data.should.have.property('openingBalance').eql(0);
        done();
      });
  });


  // it should respond with status 400 and relevant error message
  it('respond with 409', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'savings',
        owner: 1
      })
      .set("x-access-token", process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.property("error");
        done();
      });
  });

  // testing activate or deactivate account route
  // it should respond with status 401 and relevant error message
  it('respond with 401 for activate', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/accounts/${accountNumber}`)
      .send({
        status: 'dormant'
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      });
  });

  // it should respond with status 400 and relevant error message
  it("respond with 400 for activate", done => {
    chai
      .request(app)
      .patch(`/api/v1/accounts/${accountNumber}`)
      .send({
        status: 'front'
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  // it should respond with status 200
  it("respond with 200 for activate", done => {
    chai
      .request(app)
      .patch(`/api/v1/accounts/${3451585830}`)
      .send({
        status: 'dormant'
      })
      .set("x-access-token", process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("data");
        res.body.data.should.have.property("accountNumber");
        res.body.data.should.have.property("status").eql("dormant");
        done();
      });
  });


  // it should respond with status 404 and relevant error message
  it('respond with 404 for activate', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/accounts/${accountNumberError}`)
      .send({
        status: 'dormant'
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  // debit account route tests
  // if token is not in the head return 401
  it('return 401 if no token', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/debit`)
      .send({
        cashier: 2
      })
      .end((err, res)=>{
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      });
  });

  // if the fields are not filled
  it('return 400 for empty field',(done)=>{
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/debit`)
      .send({
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err,res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  // if account not found
  it('should return 404 if the account is not found', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585831}/debit`)
      .send({
        amount: 4000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  // return 409 if funds are insufficient
  it('should return 409 if balance is insufficient', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/debit`)
      .send({
        amount: 10000000000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('error');
        done();
      });
  });

  // return 200 status and data
  it('should return 200 and data', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/debit`)
      .send({
        amount: 1000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('transactionId');
        res.body.data.should.have.property('accountNumber').eql(3451585830);
        res.body.data.should.have.property('amount').eql(1000);
        res.body.data.should.have.property('cashier').eql(2);
        res.body.data.should.have.property('transactionType').eql('debit');
        res.body.data.should.have.property('accountBalance');
        done();
      })
  });

  // test the credit route
  // return 401 if no token
  it('should return 401 if unauthorised', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/credit`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("error");
        done();
      });
  });

  // return 400 if no input
  it('should return 400 if no field', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/credit`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error");
        done();
      });
  });

  // if account not found
  it('should return 404 if the account is not found', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585831}/credit`)
      .send({
        amount: 4000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  // return 200 status and data
  it('should return 200 and data', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accounts/${3451585830}/credit`)
      .send({
        amount: 1000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('transactionId');
        res.body.data.should.have.property('accountNumber').eql(3451585830);
        res.body.data.should.have.property('amount').eql(1000);
        res.body.data.should.have.property('cashier').eql(2);
        res.body.data.should.have.property('transactionType').eql('credit');
        res.body.data.should.have.property('accountBalance');
        done();
      });
  });

  // the delete route tests
  // should return 401 if no token
  it('should return 401 if  no token', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/accounts/${657465784689}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      });
  });

  // should respond with 404
  it('should respond with 404 if account is not found', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/accounts/${657465784689}`)
      .set("x-access-token", process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("error");
        done();
      });
  });

  // respond with status 200
  it('should respond with 200 if it is successful', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/accounts/${3451585830}`)
      .set("x-access-token", process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
  });
});
