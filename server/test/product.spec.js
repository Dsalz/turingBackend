import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  PRO_NOT_FOUND,
  USR_INVALID_FIELD,
  USR_REQUIRED_FIELD,
  AUT_UNAUTHORIZED,
  AUT_EMPTY_CODE,
  CAT_NOT_FOUND,
  DEP_NOT_FOUND
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Getting all products', () => {
  it('should return all the projects', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows, total } = res.body;
        expect(rows).to.be.an('array');
        expect(rows.length).to.be.greaterThan(1);
        expect(total).to.be.a('number');
        expect(total).to.equal(rows.length);
        done();
      });
  });
  it('should paginate the projects when pagination parameters are present', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products?limit=2&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows, total } = res.body;
        expect(rows).to.be.an('array');
        expect(rows.length).to.equal(2);
        expect(total).to.be.a('number');
        expect(total).to.not.equal(rows.length);
        done();
      });
  });
  it('should shorten the description to value specified in query', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products?limit=8&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows } = res.body;
        expect(rows[0].description.split('...')[0].length).to.equal(3);
        expect(rows[1].description.split('...')[0].length).to.equal(3);
        expect(rows[2].description.split('...')[0].length).to.equal(3);
        done();
      });
  });
  it('should fail when page is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products?limit=8&page=1c&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid page');
        done();
      });
  });
  it('should fail when limit is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products?limit=8d&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid limit');
        done();
      });
  });
  it('should fail when description length is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products?limit=8&page=1&description_length=3x`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid description length');
        done();
      });
  });
});

describe('Getting product by id', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.product_id).to.equal(1);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if product with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(PRO_NOT_FOUND);
        expect(res.body.error.message).to.equal('Product with Id does not exist');
        done();
      });
  });
});

describe('Getting product details', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/1/details`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.product_id).to.equal(1);
        expect(res.body.name).to.be.a('string');
        expect(res.body.description).to.be.a('string');
        expect(res.body.image).to.be.a('string');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/zz/details`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if product with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/10000000/details`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(PRO_NOT_FOUND);
        expect(res.body.error.message).to.equal('Product with Id does not exist');
        done();
      });
  });
});

describe('Getting product location data', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/1/locations`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.category_name).to.be.a('string');
        expect(res.body.department_name).to.be.a('string');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/zz/locations`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if product with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/10000000/locations`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(PRO_NOT_FOUND);
        expect(res.body.error.message).to.equal('Product with Id does not exist');
        done();
      });
  });
});

describe('Getting product reviews', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/1/reviews`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/zz/reviews`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if product with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/10000000/reviews`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(PRO_NOT_FOUND);
        expect(res.body.error.message).to.equal('Product with Id does not exist');
        done();
      });
  });
});

describe('Posting product review', () => {
  let userToken;
  const wrongToken = 'jdfhfhf';
  before((done) => {
    const newUser = {
      name: 'Damola Makin',
      email: 'reviewtestemail@yahoo.com',
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
  it('should succeed if id, body and api key are valid', (done) => {
    const newReview = {
      review: 'great',
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should fail if api key is invalid', (done) => {
    const newReview = {
      review: 'great',
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .set('USER-KEY', `${wrongToken}`)
      .send(newReview)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('The apikey is invalid');
        expect(res.body.error.code).to.equal(AUT_UNAUTHORIZED);
        done();
      });
  });
  it('should fail if api key is not provided', (done) => {
    const newReview = {
      review: 'great',
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .send(newReview)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error.message).to.equal('There is no api key');
        expect(res.body.error.code).to.equal(AUT_EMPTY_CODE);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    const newReview = {
      review: 'great',
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/zz/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if product with id does not exist', (done) => {
    const newReview = {
      review: 'great',
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/100000/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(PRO_NOT_FOUND);
        expect(res.body.error.message).to.equal('Product with Id does not exist');
        done();
      });
  });
  it('should fail if review is not given', (done) => {
    const newReview = {
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(res.body.error.message).to.equal('Review is required');
        done();
      });
  });
  it('should fail if review is invalid', (done) => {
    const newReview = {
      review: 77,
      rating: 4
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid review');
        done();
      });
  });
  it('should fail if rating is not given', (done) => {
    const newReview = {
      review: 'abcd',
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_REQUIRED_FIELD);
        expect(res.body.error.message).to.equal('Rating is required');
        done();
      });
  });
  it('should fail if rating is invalid', (done) => {
    const newReview = {
      review: 'abdc',
      rating: 'zzzz'
    };
    chai.request(app)
      .post(`${currApiPrefix}/products/1/reviews`)
      .set('USER-KEY', `${userToken}`)
      .send(newReview)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(USR_INVALID_FIELD);
        expect(res.body.error.message).to.equal('Invalid rating');
        done();
      });
  });
});

describe('Getting product by category', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inCategory/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.total).to.be.a('number');
        expect(res.body.rows).to.be.an('array');
        done();
      });
  });
  it('should paginate response when pagination query is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inCategory/1?limit=2&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { total, rows } = res.body;
        expect(total).to.be.a('number');
        expect(rows).to.be.an('array');
        expect(rows.length).to.equal(2);
        done();
      });
  });
  it('should shorten the description to value specified in query', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inCategory/1?limit=2&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows } = res.body;
        expect(rows[0].description.split('...')[0].length).to.equal(3);
        expect(rows[1].description.split('...')[0].length).to.equal(3);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inCategory/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if category with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inCategory/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        const { error } = res.body;
        expect(error.code).to.equal(CAT_NOT_FOUND);
        expect(error.message).to.equal('Category with id does not exist');
        done();
      });
  });
});

describe('Getting product by department', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inDepartment/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.total).to.be.a('number');
        expect(res.body.rows).to.be.an('array');
        done();
      });
  });
  it('should paginate response when pagination query is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inDepartment/1?limit=2&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { total, rows } = res.body;
        expect(total).to.be.a('number');
        expect(rows).to.be.an('array');
        expect(rows.length).to.equal(2);
        done();
      });
  });
  it('should shorten the description to value specified in query', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inDepartment/1?limit=2&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows } = res.body;
        expect(rows[0].description.split('...')[0].length).to.equal(3);
        expect(rows[1].description.split('...')[0].length).to.equal(3);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inDepartment/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if department with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/inDepartment/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        const { error } = res.body;
        expect(error.code).to.equal(DEP_NOT_FOUND);
        expect(error.message).to.equal('Department with Id does not exist');
        done();
      });
  });
});

describe('Searching for product', () => {
  it('should return search for the project when query string is provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?query_string=Coat`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows, total } = res.body;
        expect(rows).to.be.an('array');
        expect(rows[0].name).to.contain('Coat');
        expect(total).to.be.a('number');
        expect(total).to.equal(rows.length);
        done();
      });
  });
  it('should paginate the projects when pagination parameters are present', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?query_string=Coat&limit=1&page=1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows, total } = res.body;
        expect(rows).to.be.an('array');
        expect(rows.length).to.equal(1);
        expect(rows[0].name).to.contain('Coat');
        expect(total).to.be.a('number');
        done();
      });
  });
  it('should shorten the description to value specified in query', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?query_string=Coat&limit=2&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { rows } = res.body;
        expect(rows[0].description.split('...')[0].length).to.equal(3);
        expect(rows[1].description.split('...')[0].length).to.equal(3);
        done();
      });
  });
  it('should fail when query_string is not provided', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?limit=8&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_REQUIRED_FIELD);
        expect(message).to.equal('Query string is required');
        done();
      });
  });
  it('should fail when page is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?query_string=Coat&limit=8&page=1c&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid page');
        done();
      });
  });
  it('should fail when limit is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?query_string=Coat&limit=8d&page=1&description_length=3`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid limit');
        done();
      });
  });
  it('should fail when description length is invalid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/products/search?query_string=Coat&limit=8&page=1&description_length=3x`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        const { code, message } = res.body.error;
        expect(code).to.equal(USR_INVALID_FIELD);
        expect(message).to.equal('Invalid description length');
        done();
      });
  });
});
