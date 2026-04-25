import pool from './src/Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from './tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from './tests/AuthenticationsTableTestHelper.js';
import createServer from './src/Infrastructures/http/createServer.js';
import { buildContainer } from './src/Infrastructures/container.js';
import request from 'supertest';

async function testLogin() {
  try {
    const app = await createServer(buildContainer());

    // Clean tables
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();

    const uniqueUsername = `debugtest_${Date.now()}`;

    // Register
    ('\n=== REGISTRATION ===');
    const registerRes = await request(app).post('/users').send({
      username: uniqueUsername,
      password: 'password',
      fullname: 'Debug Test',
    });
    ('Register Status:', registerRes.status);
    ('Register Body:', JSON.stringify(registerRes.body, null, 2));

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Login
    ('\n=== LOGIN ATTEMPT ===');
    const loginRes = await request(app).post('/authentications').send({
      username: uniqueUsername,
      password: 'password',
    });
    ('Login Status:', loginRes.status);
    ('Login Body:', JSON.stringify(loginRes.body, null, 2));

    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

testLogin();
