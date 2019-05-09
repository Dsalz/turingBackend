import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  CAT_NOT_FOUND,
  PRO_NOT_FOUND,
  PAG_ORDER_NOT_MATCHED,
  USR_INVALID_FIELD
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Getting all categories', () => {
  it('should return all the categories when no pagination query is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { categories, page } = res.body;
        expect(categories).to.be.an('array');
        expect(categories[0]).to.be.an('object');
        expect(page).to.equal(1);
        done();
      });
  });
  it('should paginate the categories when pagination query is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=DESC&limit=4&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { categories, page, limit, total } = res.body;
        expect(categories).to.be.an('array');
        expect(categories.length).to.equal(4);
        expect(categories[0]).to.be.an('object');
        expect(page).to.equal(1);
        expect(limit).to.equal(4);
        expect(total).to.be.a('number');
        done();
      });
  });
  it('should show the second page when page pagination query is set to 2', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=DESC&limit=4&page=2`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { categories, page, limit, total } = res.body;
        expect(categories).to.be.an('array');
        expect(categories[0]).to.be.an('object');
        expect(page).to.equal(2);
        expect(limit).to.equal(4);
        expect(total).to.be.a('number');
        done();
      });
  });
  it('should sort in ascending order when order pagination query is set to ASC', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=ASC&limit=4&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { categories, page, limit, total } = res.body;
        expect(categories[0].category_id).to.equal(1);
        expect(categories).to.be.an('array');
        expect(categories[0]).to.be.an('object');
        expect(page).to.equal(1);
        expect(limit).to.equal(4);
        expect(total).to.be.a('number');
        done();
      });
  });
  it('should sort in descending order when order pagination query is set to DESC', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=DESC&limit=4&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { categories, page, limit, total } = res.body;
        expect(categories[0].category_id).to.equal(total);
        expect(categories).to.be.an('array');
        expect(categories[0]).to.be.an('object');
        expect(page).to.equal(1);
        expect(limit).to.equal(4);
        expect(total).to.be.a('number');
        done();
      });
  });
  it('should fail if invalid order is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=abc&limit=4&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(PAG_ORDER_NOT_MATCHED);
        expect(res.body.error.message).to.equal('Invalid order');
        done();
      });
  });
  it('should fail if invalid limit is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=ASC&limit=4b&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid limit');
        done();
      });
  });
  it('should fail if invalid page is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories?order=ASC&limit=4&page=1b`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid page');
        done();
      });
  });
});

describe('Getting category by id', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.category_id).to.equal(1);
        expect(res.body.name).to.equal('French');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if category with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(CAT_NOT_FOUND);
        expect(res.body.error.message).to.equal('Category with id does not exist');
        done();
      });
  });
});

describe('Getting category by product id', () => {
  it('should succeed if product id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/inProduct/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].category_id).to.equal(1);
        expect(res.body[0].name).to.equal('French');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/inProduct/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if product with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/inProduct/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(PRO_NOT_FOUND);
        expect(res.body.error.message).to.equal('Product with id does not exist');
        done();
      });
  });
});

describe('Getting category by department id', () => {
  it('should succeed if department id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/inDepartment/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].department_id).to.equal(1);
        expect(res.body[1].department_id).to.equal(1);
        expect(res.body[2].department_id).to.equal(1);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/categories/inDepartment/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
});
