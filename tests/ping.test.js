import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';
import pool from '../src/Infrastructures/database/postgres/pool.js';

describe('GET /ping', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should respond with pong', async () => {
    const app = await createServer(container);
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });
});