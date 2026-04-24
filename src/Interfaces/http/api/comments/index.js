import routes from './routes.js';
import express from 'express';

const comments = (container) => {
  const router = express.Router();

  return routes(container);
};

export default comments;