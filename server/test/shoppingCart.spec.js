import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  USR_REQUIRED_FIELD,
  USR_INVALID_FIELD,
  CAR_NOT_FOUND,
  PRO_NOT_FOUND,
  ITM_NOT_FOUND
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Shopping Cart Routes', () => {
  let realCartId, realItemId;
  const fakeCartId = 'kgfdsdfghyuijuhgfddf';
  const fakeItemId = 303884843444;
  it('should generate a cart id', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/generateUniqueId`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body.cart_id).to.be.a('string');
        realCartId = body.cart_id;
        done();
      });
  });
  it('should add a product to cart if fields are valid', (done) => {
    const newProduct = {
      cart_id: realCartId,
      product_id: 92,
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body[0].quantity).to.equal(1);
        realItemId = body[0].item_id;
        done();
      });
  });
  it('should not add a product to cart if cart_id is not provided', (done) => {
    const newProduct = {
      product_id: 92,
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Cart id is required');
        done();
      });
  });
  it('should not add a product to cart if cart_id is invalid', (done) => {
    const newProduct = {
      cart_id: true,
      product_id: 92,
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid cart id');
        done();
      });
  });
  it('should not add a product to cart if cart does not exist in database', (done) => {
    const newProduct = {
      cart_id: fakeCartId,
      product_id: 92,
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(404);
        expect(code).to.equal(CAR_NOT_FOUND);
        expect(message).to.equal('Cart with Id does not exist');
        done();
      });
  });
  it('should not add a product to cart if product_id is not provided', (done) => {
    const newProduct = {
      cart_id: realCartId,
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Product id is required');
        done();
      });
  });
  it('should not add a product to cart if product_id is invalid', (done) => {
    const newProduct = {
      cart_id: realCartId,
      product_id: '33j1',
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid product id');
        done();
      });
  });
  it('should not add a product to cart if product does not exist in database', (done) => {
    const newProduct = {
      cart_id: realCartId,
      product_id: 2387467467,
      attributes: 'jhhfjfjf'
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(404);
        expect(code).to.equal(PRO_NOT_FOUND);
        expect(message).to.equal('Product with Id does not exist');
        done();
      });
  });
  it('should not add a product to cart if attributes field is not provided', (done) => {
    const newProduct = {
      cart_id: realCartId,
      product_id: 92
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Attributes are required');
        done();
      });
  });
  it('should not add a product to cart if attributes field is invalid', (done) => {
    const newProduct = {
      cart_id: realCartId,
      product_id: 33,
      attributes: 867567
    };
    chai.request(app)
      .post(`${currApiPrefix}/shoppingcart/add`)
      .send(newProduct)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid attributes');
        done();
      });
  });
  it('should update cart if quantity and item id are valid', (done) => {
    const newUpdate = {
      quantity: 5
    };
    chai.request(app)
      .put(`${currApiPrefix}/shoppingcart/update/${realItemId}`)
      .send(newUpdate)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body[0].quantity).to.equal(5);
        done();
      });
  });
  it('should not update cart if item id is invalid', (done) => {
    const newUpdate = {
      quantity: 5
    };
    chai.request(app)
      .put(`${currApiPrefix}/shoppingcart/update/${fakeItemId}`)
      .send(newUpdate)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(404);
        expect(code).to.equal(ITM_NOT_FOUND);
        expect(message).to.equal('Item with Id does not exist');
        done();
      });
  });
  it('should not update cart if quantity is invalid', (done) => {
    const newUpdate = {
      quantity: '5b'
    };
    chai.request(app)
      .put(`${currApiPrefix}/shoppingcart/update/${realItemId}`)
      .send(newUpdate)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid quantity');
        done();
      });
  });
  it('should get total amount if cart id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/totalAmount/${realCartId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body.total_amount).to.be.a('number');
        done();
      });
  });
  it('should get items in cart if cart id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/${realCartId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        done();
      });
  });
  it('should not get total amount if cart id is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/totalAmount/${fakeCartId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(404);
        expect(code).to.equal(CAR_NOT_FOUND);
        expect(message).to.equal('Cart with Id does not exist');
        done();
      });
  });
  it('should save item for later if item id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/saveForLater/${realItemId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status } = res;
        expect(status).to.equal(200);
        done();
      });
  });
  it('should get saved items if cart id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/getSaved/${realCartId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body[0].item_id).to.equal(realItemId);
        done();
      });
  });
  it('should move back to cart if item id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shoppingcart/moveToCart/${realItemId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status } = res;
        expect(status).to.equal(200);
        done();
      });
  });
  it('should remove item from cart if item id is valid', (done) => {
    chai.request(app)
      .delete(`${currApiPrefix}/shoppingcart/removeProduct/${realItemId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status } = res;
        expect(status).to.equal(200);
        done();
      });
  });
  it('should not remove item from cart if item id is invalid', (done) => {
    chai.request(app)
      .delete(`${currApiPrefix}/shoppingcart/removeProduct/${fakeItemId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(404);
        expect(code).to.equal(ITM_NOT_FOUND);
        expect(message).to.equal('Item with Id does not exist');
        done();
      });
  });
  it('should empty cart if cart id is valid', (done) => {
    chai.request(app)
      .delete(`${currApiPrefix}/shoppingcart/empty/${realCartId}`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(0);
        done();
      });
  });
});
