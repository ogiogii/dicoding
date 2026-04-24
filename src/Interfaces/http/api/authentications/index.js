import express from 'express';
import AuthenticationsHandler from './handler.js';
import routes from './routes.js';

const authRoutes = (container) => {
  const handler = new AuthenticationsHandler(container);
  const router = express.Router();

  return routes(handler, router, container);
};

export default authRoutes;