import mysql from 'mysql';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();


const localConnection = {
  host: '192.168.64.2',
  user: 'damola',
  password: '12345678',
  database: 'turing_backend'
};

const onlineConnection = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
};

const dbConnection = process.env.NODE_ENV === 'development' ? localConnection : onlineConnection;

const connection = mysql.createConnection(dbConnection);

connection.connect((err) => {
  if (err) throw err;
});

connection.query = util.promisify(connection.query).bind(connection);

export default connection;
