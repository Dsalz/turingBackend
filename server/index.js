import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import Trimmer from './middlewares/Trimmer';

dotenv.config();

// Set up the express app
const app = express();

// Enable CORS
app.use(cors());

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Trimming data
app.use(Trimmer.trimBody);

// Routes
app.use('/api/v1', routes);

// Return 404 for nonexistent routes
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Set Port
const port = process.env.PORT;

app.listen(port);

export default app;
