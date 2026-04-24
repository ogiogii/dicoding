import pool from '../src/Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from './CommentLikesTableTestHelper.js';
import createServer from '../src/Infrastructures/http/createServer.js';
import { buildContainer } from '../src/Infrastructures/container.js';
import request from 'supertest';

describe('Threads API', () => {
  let app;

  beforeAll(async () => {
    // Ensure clean database state before all tests
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    // Create fresh app and container for each test
    app = await createServer(buildContainer());
  });

  afterEach(async () => {
    // Clean up after test
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should create thread, comment, delete comment, and get detail', async () => {
    // Use unique username to avoid interference with parallel tests
    const uniqueUsername = `dicodingtest_${Date.now()}`;

    // 1. Registrasi
    const registerRes = await request(app).post('/users').send({
      username: uniqueUsername,
      password: 'password',
      fullname: 'Dicoding Indonesia',
    });

    expect(registerRes.status).toEqual(201); // Variabel terpakai (No lint error)

    // 2. Login
    const loginRes = await request(app).post('/authentications').send({
      username: uniqueUsername,
      password: 'password',
    });
    if (loginRes.status !== 201) {
      ('LOGIN FAILED - Status:', loginRes.status);
      ('LOGIN FAILED - Body:', JSON.stringify(loginRes.body, null, 2));
    }
    expect(loginRes.status).toEqual(201);
    const { accessToken } = loginRes.body.data;

    // 3. Create Thread
    const threadRes = await request(app)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Judul Thread',
        body: 'Isi Thread',
      });
    expect(threadRes.status).toEqual(201);
    const { id: threadId } = threadRes.body.data.addedThread;

    // 4. Create Comment
    const commentRes = await request(app)
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Ini komentar',
      });
    expect(commentRes.status).toEqual(201);
    const { id: commentId } = commentRes.body.data.addedComment;

    // 5. Delete Comment
    const deleteRes = await request(app)
      .delete(`/threads/${threadId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleteRes.status).toEqual(200);

    // 6. Get Detail Thread
    const detailRes = await request(app).get(`/threads/${threadId}`);
    expect(detailRes.status).toEqual(200);

    // Perbaikan arrow-parens (tanda kurung)
    const deletedComment = detailRes.body.data.thread.comments.find((c) => c.id === commentId);
    expect(deletedComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should return 400 when adding thread with bad payload', async () => {
    // 1. Registrasi & Login
    const username = `test_${Date.now()}`;
    await request(app).post('/users').send({ username, password: 'password', fullname: 'name' });
    const loginRes = await request(app).post('/authentications').send({ username, password: 'password' });
    const { accessToken } = loginRes.body.data;

    // 2. Create Thread with missing body
    const response = await request(app)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Judul' });

    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual('fail');
  });

  it('should return 404 when adding comment to non-existent thread', async () => {
    // 1. Registrasi & Login
    const username = `test2_${Date.now()}`;
    await request(app).post('/users').send({ username, password: 'password', fullname: 'name' });
    const loginRes = await request(app).post('/authentications').send({ username, password: 'password' });
    const { accessToken } = loginRes.body.data;

    // 2. Create Comment to non-existent thread
    const response = await request(app)
      .post('/threads/thread-999/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'konten' });

    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual('fail');
  });
});