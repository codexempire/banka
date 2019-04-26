import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';
import {config} from 'dotenv';

config();

chai.use(chaiHttp);
chai.should();
let token;
let email;
const completeData = {
 firstname: 'Martins',
 lastname: 'Williams',
 email: 'martinswilliams@email.com',
 password: 'newman00',
 type: 'user'
};
const incompleteData = {
 firstname: 'Martins',
 lastname: '',
 email: 'om',
 password: 'newma00',
 type: 'user'
}

describe('users signup route', () => {
 it('should return 400 if bad request', (done) => {
  chai.request(app)
   .post('/api/v1/auth/signup')
   .send(incompleteData)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 201 if successful', (done) => {
  chai.request(app)
   .post('/api/v1/auth/signup')
   .send(completeData)
   .end((err, res) => {
    res.should.have.status(201);
    res.body.should.have.property('data');
    res.body.data.should.have.property('token');
    res.body.data.should.have.property('data');
    res.body.data.data.firstname.should.eql('Martins');
    done();
   });
 });
 it('should return 409 if user exists', (done) => {
  chai.request(app)
   .post('/api/v1/auth/signup')
   .send(completeData)
   .end((err, res) => {
    res.should.have.status(409);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('users signin route', () => {
 it('should return 400 if bad request', (done) => {
  chai.request(app)
   .post('/api/v1/auth/signin')
   .send(incompleteData)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 200 if successful', (done) => {
  chai.request(app)
   .post('/api/v1/auth/signin')
   .send(completeData)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data.should.have.property('token');
    res.body.data.should.have.property('data');
    res.body.data.data.firstname.should.eql('Martins');
    done();
   });
 });
 it('should return 404 if user exists', (done) => {
  completeData.email = 'nothing@email.com';
  chai.request(app)
   .post('/api/v1/auth/signin')
   .send(completeData)
   .end((err, res) => {
    res.should.have.status(404);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 401 if user exists', (done) => {
  completeData.email = 'martinswilliams@email.com';
  completeData.password = 'nothingmailcom';
  chai.request(app)
   .post('/api/v1/auth/signin')
   .send(completeData)
   .end((err, res) => {
    res.should.have.status(401);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staff signup route', () => {
 it('should return 400 if bad request', (done) => {
  chai.request(app)
   .post('/api/v1/auth/signup/staff')
   .set('x-access-token', process.env.TEST_TOKEN)
   .send(incompleteData)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 201 if successful', (done) => {
  completeData.email = 'martinbe00st@email.com';
  completeData.type = 'staff';
  completeData.isAdmin = 'true'
  chai.request(app)
   .post('/api/v1/auth/signup/staff')
   .set('x-access-token', process.env.TEST_TOKEN)
   .send(completeData)
   .end((err, res) => {
    token = res.body.data.token.value;
    email = res.body.data.data.email.value;
    res.should.have.status(201);
    res.body.should.have.property('data');
    res.body.data.should.have.property('token');
    res.body.data.should.have.property('data');
    res.body.data.data.firstname.should.eql('Martins');
    done();
   });
 });
 it('should return 409 if staff exists', (done) => {
  completeData.email = 'martinswilliams@email.com';
  chai.request(app)
   .post('/api/v1/auth/signup/staff')
   .send(completeData)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(409);
    res.body.should.have.property('error');
    done();
   });
 });
});