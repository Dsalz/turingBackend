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
        expect(res.status).to.equal(200);
        expect(res.body.departments).to.be.an('array');
        expect(res.body.departments[0].department_id).to.equal(1);
        expect(res.body.departments[1].department_id).to.equal(2);
        expect(res.body.departments[2].department_id).to.equal(3);
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
        expect(res.status).to.equal(200);
        expect(res.body.department_id).to.equal(1);
        expect(res.body.name).to.equal('Regional');
        expect(res.body.description).to.equal('Proud of your country? Wear a T-shirt with a national symbol stamp!');
        done();
      });
  });
  it('should fail if id is not a number', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/departments/zz`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(DEP_INVALID_ID);
        expect(res.body.error.message).to.equal('Invalid department id');
        done();
      });
  });
  it('should fail if department with id does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/departments/10000000`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal(DEP_NOT_FOUND);
        expect(res.body.error.message).to.equal('Department with Id does not exist');
        done();
      });
  });
});
