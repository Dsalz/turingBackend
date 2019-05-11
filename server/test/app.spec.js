import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Navigating to an invalid route', () => {
  it('should return 404 response', () => {
    chai.request(app)
      .get(`${currApiPrefix}/totallynotexistingroute`)
      .end((err, res) => {
        const { status, body } = res;
        should.not.exist(err);
        expect(status).to.equal(404);
        expect(body.message).to.equal('Route not found');
      });
  });
});
