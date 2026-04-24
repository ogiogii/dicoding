import express from 'express';
import UsersHandler from './handler.js';

const users = (container) => {
  const router = express.Router();
  const handler = new UsersHandler(container);

  router.post('/', handler.postUserHandler);

  return router;
};

export default users;