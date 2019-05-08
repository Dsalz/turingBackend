import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AUT_EMPTY_CODE, AUT_UNAUTHORIZED } from '../misc/errorCodes';

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
    const { authorization } = req.headers;
    const xAccessToken = req.headers['x-access-token'];
    if (!authorization && !xAccessToken) {
      return res.status(401).send({
        code: AUT_EMPTY_CODE,
        error: 'Request has no Token, Please Login or SignUp',
      });
    }

    const token = authorization ? authorization.split(' ')[1] : xAccessToken.split(' ')[1];
    return jwt.verify(token, majorKey, (err, data) => {
      if (err) {
        return res.status(401).send({
          code: AUT_UNAUTHORIZED,
          error: 'Invalid Token, Please Login or SignUp',
        });
      }
      req.user = data.user;
      return next();
    });
  },
};

export default tokenizer;
