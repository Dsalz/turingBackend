import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import { USR_INVALID_SHIPPING_ID } from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Getting all shipping regions', () => {
  it('should return all the shipping regions', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shipping/regions`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body[0].shipping_region_id).to.equal(1);
        expect(body[1].shipping_region_id).to.equal(2);
        expect(body[2].shipping_region_id).to.equal(3);
        done();
      });
  });
});

describe('Getting shipping regions by id', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shipping/regions/2`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body[0].shipping_region_id).to.equal(2);
        expect(body[1].shipping_region_id).to.equal(2);
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shipping/regions/zz`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(404);
        expect(body.error.message).to.equal('Endpoint not found');
        done();
      });
  });
  it('should fail if region with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/shipping/regions/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(404);
        const { code, message } = body.error;
        expect(code).to.equal(USR_INVALID_SHIPPING_ID);
        expect(message).to.equal('Shipping Region with Id does not exist');
        done();
      });
  });
});
