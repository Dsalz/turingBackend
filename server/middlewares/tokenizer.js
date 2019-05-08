import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AUT_EMPTY_CODE, AUT_UNAUTHORIZED } from '../misc/errorCodes';
import responses from '../misc/responses';

dotenv.config();

const majorKey = process.env.SECRET_KEY;

const tokenizer = {
  createToken: user => new Promise((resolve, reject) => {
    jwt.sign({ user }, majorKey, { expiresIn: '24h' }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  }),
  verifyToken: (req, res, next) => {
    const authorization = req.headers['user-key'];
    if (!authorization) {
      return res.status(401).send(responses.invalidField(AUT_EMPTY_CODE, 'There is no api key', 'API-KEY'));
    }

    const token = authorization.split(' ')[1];
    return jwt.verify(token, majorKey, (err, data) => {
      if (err) {
        return res.status(401).send(responses.invalidField(AUT_UNAUTHORIZED, 'The apikey is invalid', 'API-KEY'));
      }
      req.user = data.user;
      return next();
    });
  },
};

export default tokenizer;
