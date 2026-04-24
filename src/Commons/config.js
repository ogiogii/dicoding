/* istanbul ignore file */
import dotenv from 'dotenv';
import path from 'path';

('NODE_ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env'),
    override: true,
  });
} else {
  dotenv.config();
}

('PGDATABASE:', process.env.PGDATABASE);

const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
  },
  database: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT), // Pastikan jadi angka
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    connectionString: process.env.DATABASE_URL,
  },
  auth: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: Number(process.env.ACCESS_TOKEN_AGE), // Pastikan jadi angka
  },
};

export default config;