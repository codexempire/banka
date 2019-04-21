// import dependencies
import chai from 'chai';
import { config } from 'dotenv';
import chaiHttp from 'chai-http';

config();
// import app
import app from '../server/index';
console.log(process.env.TEST_TOKEN);
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
        firstname: '',
        lastname: 'molten',
        email: 'make',
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
        firstname: 'Micke',
        lastname: 'Fren',
        email: 'michaelFremj@mailer.com',
        password: 'makinh100',
        type: 'user'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('info');
        done(err);
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
        email: 'michaelfremj@mailer.com',
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

  // test signup route
  // return 401 if fields are empty
  it('Should return status 401', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup/staff')
      .send({
        email: 'make',
        firstname: 'malleten',
        lastname: 'molten',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done(err);
      });
  });
  // return 400 if fields are empty
  it('Should return status 400', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup/staff')
      .send({
        email: 'make',
        firstname: 'malleten',
        lastname: 'molten',
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done(err);
      });
  });
  // return 201 if user was created
  it('Should return status 201', done => {
    chai
      .request(app)
      .post("/api/v1/auth/signup/staff")
      .send({
        firstname: 'malleten',
        lastname: 'molten',
        email: 'test1@hotmail.com',
        password: 'password400',
        type: 'staff'
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('info');
        done(err);
      });
  });
  // return 409 if user with the same email exists
  it('Should return status 409', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup/staff')
      .send({
        firstname: 'malleten',
        lastname: 'molten',
        email: 'test1@hotmail.com',
        password: 'password400',
        type: 'staff'
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
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
      .post("/api/v1/auth/signin")
      .send({
        email: "michaelFremj@mailer.com",
        password: "makinh100"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("data");
        res.body.data.should.have.property("token");
        res.body.data.should.have.property("data");
        done();
      });
  });
  // return 404 if user with the same email was not found
  it('Should return status 404', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'tst@hotail.com',
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
        email: 'michaelFremj@mailer.com',
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

  // it should respond with status 201
  it('respond with 201', done => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'current',
        ownerEmail: 'princewillifeanyi1999@gmail.com',
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        accountNumber = JSON.parse(res.body.data.accountnumber);
        res.should.have.status(201);
        res.body.should.have.property('data');
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
        done();
      });
  });

  // test the credit route
  // return 401 if no token
  it('should return 401 if unauthorised', (done) => {
    chai
      .request(app)
      .post(`/api/v1/transactions/${3451585830}/credit`)
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
      .post(`/api/v1/transactions/${3451585830}/credit`)
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
      .post(`/api/v1/transactions/${9}/credit`)
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
      .post(`/api/v1/transactions/${accountNumber}/credit`)
      .send({
        amount: 1000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // get a single account detail
  // should return 401 if no token
  it('should return 401 if account not found', (done) => {
    chai
      .request(app)
      .get(`/api/v1/accounts/${0}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      })
  });

  // should return 200 if found
  it('should return 200 if account found', (done) => {
    chai
      .request(app)
      .get(`/api/v1/accounts/${accountNumber}`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        done();
      })
  });

  // should return 404 if account is not found
  it('should return 404 if account not found', (done) => {
    chai
      .request(app)
      .get(`/api/v1/accounts/${3}`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      })
  });

  // get all transactions of a specific account
  // if no token
  it('should return 401 if token is not found in the header1', (done)=>{
    chai
      .request(app)
      .get(`/api/v1/transactions/${476780976987}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      });
  });


  // it should return a status 200
  it('should return with a status of 200 if transaction found', (done) => {
    chai
      .request(app)
      .get(`/api/v1/transactions/${accountNumber}`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        done();
      });
  });


  // debit account route tests
  // if token is not in the head return 401
  it('return 401 if no token', (done) => {
    chai
      .request(app)
      .post(`/api/v1/transactions/${3451585830}/debit`)
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
      .post(`/api/v1/transactions/${3451585830}/debit`)
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
      .post(`/api/v1/transactions/${9009}/debit`)
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
      .post(`/api/v1/transactions/${accountNumber}/debit`)
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
      .post(`/api/v1/transactions/${accountNumber}/debit`)
      .send({
        amount: 1000,
        cashier: 2
      })
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        done();
      })
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

  // respond with status 200
  it('should respond with 200 if it is successful', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/accounts/${657465784689}`)
      .set("x-access-token", process.env.TEST_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
