import express from 'express';
import ThreadsHandler from './handler.js';
import routes from './routes.js';

const threadRoutes = (container) => {
  const handler = new ThreadsHandler(container);
  const router = express.Router();

  return routes(handler, router, container); // 🔥 kirim container
};

export default threadRoutes;