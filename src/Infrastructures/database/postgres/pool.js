/* istanbul ignore file */
import { Pool } from 'pg';
import config from '../../../Commons/config.js';

('Creating pool for database:', config.database.database);
('Config database:', JSON.stringify(config.database, null, 2));

// For test environment, create a new pool each time to avoid shared state issues
let pool;
if (process.env.NODE_ENV === 'test') {
  pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    max: 5,
  });
} else {
  // Use global to ensure singleton for production
  if (!global.pgPool) {
    global.pgPool = new Pool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      max: 5,
    });
  }
  pool = global.pgPool;
}

export default pool;