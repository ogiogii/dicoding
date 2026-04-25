/* istanbul ignore file */
import { Pool } from 'pg';
import config from '../../../Commons/config.js';

// For test environment, create a new pool each time to avoid shared state issues
let pool;

const poolConfig = config.database.connectionString
  ? {
    connectionString: config.database.connectionString,
    ssl: config.database.ssl,
  }
  : {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    ssl: config.database.ssl,
  };

if (process.env.NODE_ENV === 'test') {
  pool = new Pool({ ...poolConfig, max: 5, connectionTimeoutMillis: 5000 });
} else {
  // Use global to ensure singleton for production
  if (!global.pgPool) {
    global.pgPool = new Pool({ ...poolConfig, max: 5, connectionTimeoutMillis: 5000 });
    
    global.pgPool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  pool = global.pgPool;
}

export default pool;