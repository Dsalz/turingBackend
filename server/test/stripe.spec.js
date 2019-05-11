import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  USR_REQUIRED_FIELD,
  USR_INVALID_FIELD,
  ORD_NOT_FOUND
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Posting a stripe charge', () => {
  let userToken, realOrderId;
  const fakeOrderId = 10202938334334;
  before((done) => {
    const newUser = {
      name: 'Damola Makin',
      email: 'stripetestemail@yahoo.com',
      password: '12345'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        userToken = body.accessToken;
        const newOrder = {
          cart_id: '2',
          shipping_id: 21,
          tax_id: 222,
        };
        chai.request(app)
          .post(`${currApiPrefix}/orders`)
          .set('USER-KEY', `${userToken}`)
          .send(newOrder)
          .end((err, response) => {
            should.not.exist(err);
            expect(response.status).to.equal(200);
            realOrderId = Number(response.body.orderId);
            done();
          });
      });
  });
  it('should create the charge successfully if all fields are valid', (done) => {
    const newCharge = {
      stripeToken: 'tok_visa',
      order_id: realOrderId,
      description: 'Test order',
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body.status).to.equal('succeeded');
        expect(body.metadata.order_id).to.equal(String(newCharge.order_id));
        done();
      });
  });
  it('should fail if stripeToken field is not provided', (done) => {
    const newCharge = {
      order_id: realOrderId,
      description: 'Test order',
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Stripe token is required');
        done();
      });
  });
  it('should fail if stripeToken is invalid', (done) => {
    const newCharge = {
      stripeToken: 1,
      order_id: realOrderId,
      description: 'Test order',
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid stripe token');
        done();
      });
  });
  it('should fail if order id field is not provided', (done) => {
    const newCharge = {
      stripeToken: 'tok_visa',
      description: 'Test order',
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Order id is required');
        done();
      });
  });
  it('should fail if order id is invalid', (done) => {
    const newCharge = {
      stripeToken: 'tok-visa',
      order_id: 'yhhh',
      description: 'Test order',
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid order id');
        done();
      });
  });
  it('should fail if order does not exist in database', (done) => {
    const newCharge = {
      stripeToken: 'tok-visa',
      order_id: fakeOrderId,
      description: 'Test order',
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(404);
        const { code, message } = body.error;
        expect(code).to.equal(ORD_NOT_FOUND);
        expect(message).to.equal('Order with Id does not exist');
        done();
      });
  });
  it('should fail if description field is not provided', (done) => {
    const newCharge = {
      stripeToken: 'tok_visa',
      order_id: realOrderId,
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Description is required');
        done();
      });
  });
  it('should fail if description field is invalid', (done) => {
    const newCharge = {
      stripeToken: 'tok-visa',
      order_id: realOrderId,
      description: 344,
      amount: 200
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid description');
        done();
      });
  });
  it('should fail if amount field is not provided', (done) => {
    const newCharge = {
      stripeToken: 'tok_visa',
      order_id: realOrderId,
      description: 'abcd'
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Amount is required');
        done();
      });
  });
  it('should fail if amount field is invalid', (done) => {
    const newCharge = {
      stripeToken: 'tok-visa',
      order_id: realOrderId,
      description: 'abcd',
      amount: '3b'
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid amount');
        done();
      });
  });
  it('should fail if currency field is invalid', (done) => {
    const newCharge = {
      stripeToken: 'tok-visa',
      order_id: realOrderId,
      description: 'abcd',
      amount: 500,
      currency: 345
    };
    chai.request(app)
      .post(`${currApiPrefix}/stripe/charge`)
      .set('USER-KEY', `${userToken}`)
      .send(newCharge)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        const { code, message } = body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid currency');
        done();
      });
  });
});
