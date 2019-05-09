import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  USR_REQUIRED_FIELD,
  AUT_EMPTY_CODE,
  AUT_UNAUTHORIZED,
  USR_INVALID_FIELD,
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

let userToken = '';
const wrongToken = 'Bearer jdhdhfhf';

before((done) => {
  const newUser = {
    name: 'Damola Makinaki',
    email: 'ordertestemail@yahoo.com',
    password: '12345'
  };
  chai.request(app)
    .post(`${currApiPrefix}/customers`)
    .send(newUser)
    .end((err, res) => {
      should.not.exist(err);
      expect(res.status).to.equal(200);
      userToken = res.body.accessToken;
      done();
    });
});

describe('Creating an order', () => {
  it('should succeed if all values are valid', (done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.orderId).to.be.a('number');
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${wrongToken}`)
      .send(newOrder)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('The apikey is invalid');
        expect(res.body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .send(newOrder)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('There is no api key');
        expect(res.body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if cart id is not provided', (done) => {
    const newOrder = {
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(res.body.error.message).to.equal('The cart id is required');
        done();
      });
  });
  it('should fail if cart id is invalid', (done) => {
    const newOrder = {
      cart_id: 23,
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid Cart Id');
        done();
      });
  });
  it('should fail if shipping id is not provided', (done) => {
    const newOrder = {
      cart_id: '22',
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(res.body.error.message).to.equal('The shipping id is required');
        done();
      });
  });
  it('should fail if shipping id is invalid', (done) => {
    const newOrder = {
      cart_id: '23',
      shipping_id: '21',
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid Shipping Id');
        done();
      });
  });
  it('should fail if tax_id is not provided', (done) => {
    const newOrder = {
      cart_id: '22',
      shipping_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(res.body.error.message).to.equal('The tax id is required');
        done();
      });
  });
  it('should fail if tax id is invalid', (done) => {
    const newOrder = {
      cart_id: '23',
      shipping_id: 21,
      tax_id: '222',
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid Tax Id');
        done();
      });
  });
  it('should fail if comment is invalid', (done) => {
    const newOrder = {
      cart_id: '23',
      shipping_id: 21,
      tax_id: 222,
      comments: 93756,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid Comment');
        done();
      });
  });
});

describe('Getting short order details', () => {
  let orderId;
  before((done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        // eslint-disable-next-line prefer-destructuring
        orderId = res.body.orderId;
        done();
      });
  });
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/${orderId}`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.order_id).to.equal(orderId);
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/${orderId}`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('The apikey is invalid');
        expect(res.body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/${orderId}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('There is no api key');
        expect(res.body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if id is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/o11c2`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
});

describe('Getting full order details', () => {
  let orderId;
  before((done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
      comments: 'bring it fast',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        // eslint-disable-next-line prefer-destructuring
        orderId = res.body.orderId;
        done();
      });
  });
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/${orderId}`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.order_id).to.equal(orderId);
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/${orderId}`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('The apikey is invalid');
        expect(res.body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/${orderId}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('There is no api key');
        expect(res.body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if id is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/o11c2`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
});

describe('Getting all customer orders', () => {
  it('should succeed if api key is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/inCustomer`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.orders).to.be.an('array');
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/inCustomer`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('The apikey is invalid');
        expect(res.body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/inCustomer`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('There is no api key');
        expect(res.body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
});
