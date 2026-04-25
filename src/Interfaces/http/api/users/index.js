import UsersHandler from './handler.js';
import routes from './routes.js';

const users = (container) => {
  const handler = new UsersHandler(container);

  return routes(handler);
};

export default users;