import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  ATT_NOT_FOUND
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Getting all attribute', () => {
  it('should return all the attributes', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.attributes).to.be.an('array');
        expect(res.body.attributes[0].attribute_id).to.equal(1);
        expect(res.body.attributes[0].name).to.equal('Size');
        expect(res.body.attributes[1].attribute_id).to.equal(2);
        expect(res.body.attributes[1].name).to.equal('Color');
        done();
      });
  });
});

describe('Getting attribute by id', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.attribute_id).to.equal(1);
        expect(res.body.name).to.equal('Size');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if attribute with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(ATT_NOT_FOUND);
        expect(res.body.error.message).to.equal('Attribute with Id does not exist');
        done();
      });
  });
});

describe('Getting attribute values', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/values/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].attribute_id).to.equal(1);
        expect(res.body[0].value).to.equal('S');
        expect(res.body[1].attribute_id).to.equal(1);
        expect(res.body[1].value).to.equal('M');
        expect(res.body[2].attribute_id).to.equal(1);
        expect(res.body[2].value).to.equal('L');
        expect(res.body[3].attribute_id).to.equal(1);
        expect(res.body[3].value).to.equal('XL');
        expect(res.body[4].attribute_id).to.equal(1);
        expect(res.body[4].value).to.equal('XXL');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/values/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
});

describe('Getting attribute by product', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/inProduct/1`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { body } = res;
        expect(body).to.be.an('array');
        expect(body[0].attribute_name).to.equal('Color');
        expect(body[0].attribute_value_id).to.equal(6);
        expect(body[0].attribute_value).to.equal('White');
        expect(body[1].attribute_name).to.equal('Color');
        expect(body[1].attribute_value_id).to.equal(7);
        expect(body[1].attribute_value).to.equal('Black');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/attributes/inProduct/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
});
