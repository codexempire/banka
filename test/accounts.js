import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';
import { config } from 'dotenv';

config();

chai.use(chaiHttp);
chai.should();
let accountNumber;
let email;
const completeData = {
 type: 'savings',
 amount: 20000,
 status: 'active',
 accountNumber: ''
};
const incompleteData = {
 type: 'savifrongs',
 amount: -20000,
 status: 'activate',
}

describe('create account route', () => {
 it('should return 400 if bad request', (done) => {
  chai.request(app)
   .post('/api/v1/accounts')
   .set('x-access-token', process.env.TEST_TOKEN)
   .send(incompleteData)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 201 if successful', (done) => {
  chai.request(app)
   .post('/api/v1/accounts')
   .set('x-access-token', process.env.TEST_TOKEN)
   .send({ type: completeData.type })
   .end((err, res) => {
    accountNumber = res.body.data.accountnumber;
    email = res.body.data.owneremail;
    res.should.have.status(201);
    res.body.should.have.property('data');
    res.body.data.should.have.property('type').eql(completeData.type);
    done();
   });
 });
});

describe('activate or deactivate account route', () => {
 it('should return 400 if bad request', (done) => {
  chai.request(app)
   .patch(`/api/v1/accounts/${0}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .send(incompleteData)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 200 if successful', (done) => {
  chai.request(app)
   .patch(`/api/v1/accounts/${accountNumber}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .send(completeData)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    done();
   });
 });
});

describe('users should be able to get a specific account',()=>{
 it('should return 400 if account number fails', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${10}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 200 if account found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${accountNumber}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data.should.have.property('accountnumber').eql(accountNumber);
    done();
   });
 });
 it('should return 404 if accounts not found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${1000}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(404);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 403 if no token', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${10}`)
   .end((err, res) => {
    res.should.have.status(403);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('users should be able to get all transactions for specific account', () => {
 it('should return 400 if account number fails', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${10}/transactions`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
 it('should return 404 if accounts not found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${1000}/transactions`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
     res.body.should.have.property('data');
     res.body.should.have.property('message');
    done();
   });
 });
 it('should return 403 if no token', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts/${10}/transactions`)
   .end((err, res) => {
    res.should.have.status(403);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('users should be able to get all their accounts details', () => {
 it('should return 200', (done) => {
  chai.request(app)
   .get(`/api/v1/user/${email}/accounts`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    done();
   });
 });
 it('should return 400', (done) => {
  chai.request(app)
   .get(`/api/v1/user/${0}/accounts`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staff should be able to credit an account', ()=>{
 it('should return 200 if credit', (done)=>{
  chai.request(app)
   .post(`/api/v1/transactions/${accountNumber}/credit`)
   .send({amount: completeData.amount})
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err,res)=>{
    res.body.should.have.status(200);
    res.body.should.have.property('data');
    done();
   });
 });
 it('should return 400 if credit', (done) => {
  chai.request(app)
   .post(`/api/v1/transactions/${accountNumber}/credit`)
   .send({ amount: -completeData.amount })
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.body.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staff should be able to debit an account', () => {
 it('should return 200 if debit', (done) => {
  chai.request(app)
   .post(`/api/v1/transactions/${accountNumber}/debit`)
   .send({ amount: 500 })
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.body.should.have.status(200);
    res.body.should.have.property('data');
    done();
   });
 });
 it('should return 400 if debit error', (done) => {
  chai.request(app)
   .post(`/api/v1/transactions/${accountNumber}/debit`)
   .send({ amount: -completeData.amount })
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.body.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('users should beable to get a specific transaction details', () => {
 it('should return 200', (done) => {
  chai.request(app)
   .get(`/api/v1/transactions/${1}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    done();
   });
 });
 it('should return 400', (done) => {
  chai.request(app)
   .get(`/api/v1/transactions/${0}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staff should be able to get all transaction details', () => {
 it('should return 200', (done) => {
  chai.request(app)
   .get(`/api/v1/transactions`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    done();
   });
 });
});

describe('staffs should be able to get all accounts', () => {
 it('should return 200 if account found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data[0].should.have.property('accountnumber');
    done();
   });
 });
 it('should return 403 if no token', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts`)
   .end((err, res) => {
    res.should.have.status(403);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staffs should be able to get all accounts', () => {
 it('should return 200 if account found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data[0].should.have.property('accountnumber');
    done();
   });
 });
 it('should return 403 if no token', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts`)
   .end((err, res) => {
    res.should.have.status(403);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staffs should be able to get all active accounts', () => {
 it('should return 200 if account found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts?status=active`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data[0].should.have.property('accountnumber');
    done();
   });
 });
 it('should return 400 if status is not valid', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts?status=great`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('staffs should be able to get all dormant accounts', () => {
  it('should return 200 if successful', (done) => {
    completeData.status = 'dormant';
    chai.request(app)
      .patch(`/api/v1/accounts/${accountNumber}`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .send(completeData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        done();
      });
  });
 it('should return 200 if account found', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts?status=dormant`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data[0].should.have.property('accountnumber');
    done();
   });
 });
 it('should return 400 if status is not valid', (done) => {
  chai.request(app)
   .get(`/api/v1/accounts?status=great`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});

describe('delete account route', () => {
 it('should respond with 200 status if deleted', (done) => {
  chai.request(app)
   .delete(`/api/v1/accounts/${accountNumber}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(200);
    res.body.should.have.property('message');
    done();
   });
 });
 it('should respond with status 400 if no account number found', (done) => {
  chai.request(app)
   .delete(`/api/v1/accounts/${'a'}`)
   .set('x-access-token', process.env.TEST_TOKEN)
   .end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property('error');
    done();
   });
 });
});
