import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import { USR_REQUIRED_FIELD, USR_INVALID_EMAIL, USR_INVALID_EMAIL_PASSWORD, USR_EMAIL_ALREADY_EXISTS, USR_INVALID_PHONE, USR_INVALID_CARD, USR_EMAIL_NOT_FOUND } from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

before((done) => {
  const newUser = {
    name: 'Damola Makinaki',
    email: 'duplicationtestemail@yahoo.com',
    password: '12345'
  };
  chai.request(app)
    .post(`${currApiPrefix}/customers`)
    .send(newUser)
    .end((err, res) => {
      should.not.exist(err);
      expect(res.status).to.equal(200);
      done();
    });
});

describe('An Attempt to SignUp', () => {
  it('should succeed if fields are valid and not return password', () => {
    const newUser = {
      name: 'Damola Makinaki',
      email: 'jjjjemail@yahoo.com',
      password: '12345'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('User successfully created');
        should.not.exist(res.body.customer.schema.password);
        expect(res.body.customer.schema.email).to.equal(newUser.email);
        expect(res.body.customer.schema.name).to.equal(newUser.name);
      });
  });

  it('should fail if name is not provided', () => {
    const newUser = {
      email: 'makina@yahoo.com',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The name field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });

  it('should fail if name is an empty string', () => {
    const newUser = {
      name: ' ',
      email: 'makina@yahoo.com',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The name field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if email is an empty string', () => {
    const newUser = {
      name: 'jfjfj',
      email: ' ',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The email field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if email is not provided', () => {
    const newUser = {
      name: 'jfjfj',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The email field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if email is invalid', () => {
    const newUser = {
      name: 'jfjfj',
      email: 2,
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Email');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL);
      });
  });
  it('should fail if password is not given', () => {
    const newUser = {
      name: 'jfjfj',
      email: 'makina@yahoo.com',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The password field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if password is invalid', () => {
    const newUser = {
      name: 'jfjfj',
      email: 'makina@yahoo.com',
      password: true
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Password');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL_PASSWORD);
      });
  });
  it('should fail if day_phone is invalid', () => {
    const newUser = {
      name: 'jfjfj',
      day_phone: '09736',
      email: 'makina@yahoo.com',
      password: 'hdghdhdj'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid phone number');
        expect(res.body.code).to.equal(USR_INVALID_PHONE);
      });
  });
  it('should fail if eve_phone is invalid', () => {
    const newUser = {
      name: 'jfjfj',
      eve_phone: '09736',
      email: 'makina@yahoo.com',
      password: 'hdghdhdj'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid phone number');
        expect(res.body.code).to.equal(USR_INVALID_PHONE);
      });
  });
  it('should fail if mob_phone is invalid', () => {
    const newUser = {
      name: 'jfjfj',
      mob_phone: '09736',
      email: 'makina@yahoo.com',
      password: 'hdghdhdj'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid phone number');
        expect(res.body.code).to.equal(USR_INVALID_PHONE);
      });
  });
  it('should fail if credit card is invalid', () => {
    const newUser = {
      name: 'jfjfj',
      credit_card: '1238df',
      email: 'makina@yahoo.com',
      password: 'hdghdhdj'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid credit card details');
        expect(res.body.code).to.equal(USR_INVALID_CARD);
      });
  });
  it('should fail if user with email already exists', () => {
    const newUser = {
      name: 'Damola Makinaki',
      email: 'duplicationtestemail@yahoo.com',
      password: '12345'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Email already exists');
        expect(res.body.code).to.equal(USR_EMAIL_ALREADY_EXISTS);
      });
  });
});

describe('An Attempt to Log in', () => {
  it('should succeed if fields are valid and not return password', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      password: '12345'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(user)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('User successfully logged in');
        should.not.exist(res.body.customer.schema.password);
        expect(res.body.customer.schema.email).to.equal(user.email);
      });
  });

  it('should fail if user with email does not exist', () => {
    const newUser = {
      email: 'du@yahoo.com',
      password: '12345'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('User with email does not exist');
        expect(res.body.code).to.equal(USR_EMAIL_NOT_FOUND);
      });
  });

  it('should fail if password is incorrect', () => {
    const newUser = {
      email: 'duplicationtestemail@yahoo.com',
      password: '12'
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Invalid password');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL_PASSWORD);
      });
  });

  it('should fail if email is an empty string', () => {
    const newUser = {
      email: ' ',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The email field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if email is not provided', () => {
    const newUser = {
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The email field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if email is invalid', () => {
    const newUser = {
      email: 2,
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Email');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL);
      });
  });
  it('should fail if password is not given', () => {
    const newUser = {
      email: 'makina@yahoo.com',
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The password field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if password is invalid', () => {
    const newUser = {
      email: 'makina@yahoo.com',
      password: true
    };
    chai.request(app)
      .post(`${currApiPrefix}/customers/login`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Password');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL_PASSWORD);
      });
  });
});
