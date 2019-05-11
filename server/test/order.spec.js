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
  ORD_NOT_FOUND
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
      const { status, body } = res;
      expect(status).to.equal(200);
      userToken = body.accessToken;
      done();
    });
});

describe('Creating an order', () => {
  it('should succeed if all values are valid', (done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body.orderId).to.be.a('number');
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${wrongToken}`)
      .send(newOrder)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('The apikey is invalid');
        expect(body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    const newOrder = {
      cart_id: '2',
      shipping_id: 21,
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .send(newOrder)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('There is no api key');
        expect(body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if cart id is not provided', (done) => {
    const newOrder = {
      shipping_id: 21,
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(body.error.message).to.equal('The cart id is required');
        done();
      });
  });
  it('should fail if cart id is invalid', (done) => {
    const newOrder = {
      cart_id: 23,
      shipping_id: 21,
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.code).to.equal(USR_INVALID_FIELD);
        expect(body.error.message).to.equal('Invalid Cart Id');
        done();
      });
  });
  it('should fail if shipping id is not provided', (done) => {
    const newOrder = {
      cart_id: '22',
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(body.error.message).to.equal('The shipping id is required');
        done();
      });
  });
  it('should fail if shipping id is invalid', (done) => {
    const newOrder = {
      cart_id: '23',
      shipping_id: '21',
      tax_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.code).to.equal(USR_INVALID_FIELD);
        expect(body.error.message).to.equal('Invalid Shipping Id');
        done();
      });
  });
  it('should fail if tax_id is not provided', (done) => {
    const newOrder = {
      cart_id: '22',
      shipping_id: 222,
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(body.error.message).to.equal('The tax id is required');
        done();
      });
  });
  it('should fail if tax id is invalid', (done) => {
    const newOrder = {
      cart_id: '23',
      shipping_id: 21,
      tax_id: '222',
    };
    chai.request(app)
      .post(`${currApiPrefix}/orders`)
      .set('USER-KEY', `${userToken}`)
      .send(newOrder)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.code).to.equal(USR_INVALID_FIELD);
        expect(body.error.message).to.equal('Invalid Tax Id');
        done();
      });
  });
});

describe('Getting short order details', () => {
  let realOrderId;
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
        const { status, body } = res;
        expect(status).to.equal(200);
        // eslint-disable-next-line prefer-destructuring
        realOrderId = body.orderId;
        done();
      });
  });
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/${realOrderId}`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body.order_id).to.equal(realOrderId);
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/${realOrderId}`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('The apikey is invalid');
        expect(body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/${realOrderId}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('There is no api key');
        expect(body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if id is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/shortDetail/o11c2`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(404);
        expect(body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
});

describe('Getting full order details', () => {
  let realOrderId;
  before((done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/generateUniqueId`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        const newOrder = {
          cart_id: body.cart_id,
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
            realOrderId = res.body.orderId;
            done();
          });
      });
  });
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/${realOrderId}`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        done();
      });
  });
  it('should fail if order does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/300092344858`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(404);
        expect(body.error.code).to.equal(ORD_NOT_FOUND);
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/${realOrderId}`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('The apikey is invalid');
        expect(body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/${realOrderId}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('There is no api key');
        expect(body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if id is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/o11c2`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(404);
        expect(body.error.message).to.equal('Endpoint not found');
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
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/inCustomer`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('The apikey is invalid');
        expect(body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/orders/inCustomer`)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(401);
        expect(body.error.message).to.equal('There is no api key');
        expect(body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
});
