import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/Infrastructures/database/postgres/pool.js';

describe('GET /ping', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should respond with pong', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });
});