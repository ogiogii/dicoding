/* istanbul ignore file */
import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV === 'test' && !process.env.CI) {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env'),
    override: true,
  });
} else {
  dotenv.config();
}

const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
  },
  database: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    // Default SSL to true if not in test env, as most cloud providers require it
    ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
    connectionString: process.env.DATABASE_URL,
  },
  auth: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: Number(process.env.ACCESS_TOKEN_AGE),
  },
};

export default config;