import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  TAX_NOT_FOUND
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Getting all tax', () => {
  it('should return all the tax data', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/tax`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { body } = res;
        expect(body).to.be.an('array');
        expect(body[0].tax_id).to.equal(1);
        expect(body[1].tax_id).to.equal(2);
        done();
      });
  });
});

describe('Getting tax by id', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/tax/2`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        const { body } = res;
        expect(body.tax_id).to.equal(2);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/tax/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if tax with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/tax/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(404);
        expect(res.body.error.code).to.equal(TAX_NOT_FOUND);
        expect(res.body.error.message).to.equal('Tax with Id does not exist');
        done();
      });
  });
});
