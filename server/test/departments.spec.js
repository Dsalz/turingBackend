/* eslint-disable camelcase */
import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  DEP_INVALID_ID,
  DEP_NOT_FOUND
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Getting all departments', () => {
  it('should return all the departments', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/departments`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body[0].department_id).to.equal(1);
        expect(body[1].department_id).to.equal(2);
        expect(body[2].department_id).to.equal(3);
        done();
      });
  });
});

describe('Getting department by id', () => {
  it('should succeed if id is valid', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/departments/1`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { department_id, name, description } = body;
        expect(status).to.equal(200);
        expect(department_id).to.equal(1);
        expect(name).to.equal('Regional');
        expect(description).to.equal('Proud of your country? Wear a T-shirt with a national symbol stamp!');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/departments/zz`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(400);
        expect(code).to.equal(DEP_INVALID_ID);
        expect(message).to.equal('Invalid department id');
        done();
      });
  });
  it('should fail if department with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/departments/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        const { status, body } = res;
        const { code, message } = body.error;
        expect(status).to.equal(404);
        expect(code).to.equal(DEP_NOT_FOUND);
        expect(message).to.equal('Department with Id does not exist');
        done();
      });
  });
});
