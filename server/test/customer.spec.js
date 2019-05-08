import {
  describe, it
} from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../index';
import {
  USR_REQUIRED_FIELD,
  USR_INVALID_EMAIL,
  USR_INVALID_EMAIL_PASSWORD,
  USR_EMAIL_ALREADY_EXISTS,
  USR_INVALID_PHONE,
  USR_INVALID_CARD,
  USR_EMAIL_NOT_FOUND,
  AUT_EMPTY_CODE,
  AUT_UNAUTHORIZED,
  USR_INVALID_FIELD,
  USR_INVALID_SHIPPING_ID
} from '../misc/errorCodes';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

let userToken = '';
const wrongToken = 'Bearer jdhdhfhf';

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
      userToken = res.body.accessToken;
      done();
    });
});

describe('Signing customer up', () => {
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

describe('Logging customers in', () => {
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

describe('Updating customers information', () => {
  before((done) => {
    const newUser = {
      name: 'Damola Makin',
      email: 'testemail@yahoo.com',
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
  it('should succeed if fields are valid and not return password', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcyyyy',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.email).to.equal(user.email);
        expect(res.body.name).to.equal(user.name);
        expect(res.body.day_phone).to.equal(user.day_phone);
        expect(res.body.eve_phone).to.equal(user.eve_phone);
        expect(res.body.mob_phone).to.equal(user.mob_phone);
        should.not.exist(res.body.password);
      });
  });

  it('should succeed if only required fields are provided', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'Damola',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.email).to.equal(user.email);
        expect(res.body.name).to.equal(user.name);
        should.not.exist(res.body.password);
      });
  });

  it('should fail if api key is invalid', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcd',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${wrongToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('The apikey is invalid');
        expect(res.body.code).to.equal(AUT_UNAUTHORIZED);
      });
  });

  it('should fail if api key is not provided', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcd',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('There is no api key');
        expect(res.body.code).to.equal(AUT_EMPTY_CODE);
      });
  });
  it('should fail if new email already taken', () => {
    const user = {
      email: 'testemail@yahoo.com',
      name: 'abcd',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Email already exists');
        expect(res.body.code).to.equal(USR_EMAIL_ALREADY_EXISTS);
      });
  });
  it('should fail if email is not provided', () => {
    const user = {
      name: 'abcd',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The email field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if email is invalid', () => {
    const user = {
      email: 'duplicationtestemailyahoo.com',
      name: 'abcd',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Email');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL);
      });
  });
  it('should fail if name is not provided', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      password: '123456',
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The name field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if password is invalid', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcd',
      password: true,
      day_phone: '+265378485579',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Password');
        expect(res.body.code).to.equal(USR_INVALID_EMAIL_PASSWORD);
      });
  });
  it('should fail if day_phone is invalid', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcd',
      day_phone: '+265',
      eve_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid phone number');
        expect(res.body.code).to.equal(USR_INVALID_PHONE);
      });
  });
  it('should fail if eve_phone is invalid', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcd',
      eve_phone: '+265',
      day_phone: '+265378485579',
      mob_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid phone number');
        expect(res.body.code).to.equal(USR_INVALID_PHONE);
      });
  });
  it('should fail if mob_phone is invalid', () => {
    const user = {
      email: 'duplicationtestemail@yahoo.com',
      name: 'abcd',
      mob_phone: '+265',
      eve_phone: '+265378485579',
      day_phone: '+265378485579',
    };
    chai.request(app)
      .put(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid phone number');
        expect(res.body.code).to.equal(USR_INVALID_PHONE);
      });
  });
});

describe('Get customers information', () => {
  it('should succeed if fields are valid and not return password', () => {
    chai.request(app)
      .get(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${userToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Damola');
        expect(res.body.email).to.equal('duplicationtestemail@yahoo.com');
        should.not.exist(res.body.password);
      });
  });

  it('should fail if api key is invalid', () => {
    chai.request(app)
      .get(`${currApiPrefix}/customer`)
      .set('USER-KEY', `${wrongToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('The apikey is invalid');
        expect(res.body.code).to.equal(AUT_UNAUTHORIZED);
      });
  });

  it('should fail if no api key is provided', () => {
    chai.request(app)
      .get(`${currApiPrefix}/customer`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('There is no api key');
        expect(res.body.code).to.equal(AUT_EMPTY_CODE);
      });
  });
});

describe('Updating customers address', () => {
  it('should succeed if fields are valid and not return password', () => {
    const user = {
      address_1: 'sjsdhdhdfhjfjf',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.address_1).to.equal(user.address_1);
        expect(res.body.address_2).to.equal(user.address_2);
        expect(res.body.city).to.equal(user.city);
        expect(res.body.region).to.equal(user.region);
        expect(res.body.postal_code).to.equal(user.postal_code);
        expect(res.body.shipping_region_id).to.equal(user.shipping_region_id);
        should.not.exist(res.body.password);
      });
  });

  it('should fail if api key is invalid', () => {
    const user = {
      address_1: 'sjsdhdhdfhjfjf',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${wrongToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('The apikey is invalid');
        expect(res.body.code).to.equal(AUT_UNAUTHORIZED);
      });
  });

  it('should fail if api key is not provided', () => {
    const user = {
      address_1: 'sjsdhdhdfhjfjf',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('There is no api key');
        expect(res.body.code).to.equal(AUT_EMPTY_CODE);
      });
  });
  it('should fail if address_1 is not provided', () => {
    const user = {
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The address field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if address_1 is invalid', () => {
    const user = {
      address_1: true,
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Address');
        expect(res.body.code).to.equal(USR_INVALID_FIELD);
      });
  });
  it('should fail if address_2 is invalid', () => {
    const user = {
      address_2: true,
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Address');
        expect(res.body.code).to.equal(USR_INVALID_FIELD);
      });
  });
  it('should fail if city is not provided', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The city field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if city is invalid', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 1,
      region: 'Nigeria',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid City');
        expect(res.body.code).to.equal(USR_INVALID_FIELD);
      });
  });
  it('should fail if region is not provided', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The region field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if region is invalid', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 22,
      postal_code: '1002938',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Region');
        expect(res.body.code).to.equal(USR_INVALID_FIELD);
      });
  });
  it('should fail if postal code is not provided', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      region: 'Nigeria',
      city: 'Lagos',
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The postal code field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if postal code is invalid', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: true,
      country: 'Nigeria',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Postal Code');
        expect(res.body.code).to.equal(USR_INVALID_FIELD);
      });
  });
  it('should fail if country is not provided', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      region: 'Nigeria',
      city: 'Lagos',
      postal_code: '10029387',
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The country field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if country is invalid', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002948',
      country: 33,
      shipping_region_id: 2
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Country');
        expect(res.body.code).to.equal(USR_INVALID_FIELD);
      });
  });
  it('should fail if shipping region is not provided', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      region: 'Nigeria',
      city: 'Lagos',
      postal_code: '10029387',
      country: 'Nigeria'
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The shipping region field is required');
        expect(res.body.code).to.equal(USR_INVALID_SHIPPING_ID);
      });
  });
  it('should fail if shipping region is invalid', () => {
    const user = {
      address_1: 'kdjhdfhfhfjfjfhfhfh',
      address_2: 'kdjhdfhfhfjfjfhfhfh',
      city: 'Lagos',
      region: 'Nigeria',
      postal_code: '1002948',
      country: 'Nigeria',
      shipping_region_id: 'nhdhd'
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/address`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Shipping Region');
        expect(res.body.code).to.equal(USR_INVALID_SHIPPING_ID);
      });
  });
});

describe('Updating customers credit card', () => {
  it('should succeed if fields are valid and not return password', () => {
    const user = {
      credit_card: '837366749474647885'
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/creditCard`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.status).to.equal(200);
        expect(res.body.credit_card).to.equal(user.credit_card);
        should.not.exist(res.body.password);
      });
  });

  it('should fail if api key is invalid', () => {
    const user = {
      credit_card: '837366749474647885'
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/creditCard`)
      .set('USER-KEY', `${wrongToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('The apikey is invalid');
        expect(res.body.code).to.equal(AUT_UNAUTHORIZED);
      });
  });

  it('should fail if api key is not provided', () => {
    const user = {
      credit_card: '837366749474647885'
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/creditCard`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('There is no api key');
        expect(res.body.code).to.equal(AUT_EMPTY_CODE);
      });
  });
  it('should fail if credit_card is not provided', () => {
    const user = {};
    chai.request(app)
      .put(`${currApiPrefix}/customers/creditCard`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('The credit card field is required');
        expect(res.body.code).to.equal(USR_REQUIRED_FIELD);
      });
  });
  it('should fail if credit_card is invalid', () => {
    const user = {
      credit_card: '8373'
    };
    chai.request(app)
      .put(`${currApiPrefix}/customers/creditCard`)
      .set('USER-KEY', `${userToken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid credit card details');
        expect(res.body.code).to.equal(USR_INVALID_CARD);
      });
  });
});
