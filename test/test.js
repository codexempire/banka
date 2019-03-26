// import dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

// import app
import app from '../server/index';

// instantiate dependencies
chai.use(chaiHttp);
chai.should();

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
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property("email");
        res.body.data.should.have.property("password");
        res.body.data.should.have.property("type");
        done();
      });
  });
  // return 409 if user was created
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
});