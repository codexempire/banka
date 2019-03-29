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
});
