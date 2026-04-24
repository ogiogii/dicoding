import pool from '../src/Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from './CommentLikesTableTestHelper.js';
import createServer from '../src/Infrastructures/http/createServer.js';
import { buildContainer } from '../src/Infrastructures/container.js';
import request from 'supertest';

describe('Comment Likes API', () => {
  let app;

  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    app = await createServer(buildContainer());
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should return 200 and like the comment', async () => {
      // Arrange
      const username = 'dicoding';
      await request(app).post('/users').send({
        username,
        password: 'password',
        fullname: 'Dicoding Indonesia',
      });
      const loginRes = await request(app).post('/authentications').send({
        username,
        password: 'password',
      });
      const { accessToken } = loginRes.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'thread title', body: 'thread body' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'comment content' });
      const { id: commentId } = commentRes.body.data.addedComment;

      // Action
      const response = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');

      const detailRes = await request(app).get(`/threads/${threadId}`);
      expect(detailRes.body.data.thread.comments[0].likeCount).toEqual(1);
    });

    it('should return 200 and unlike the comment if already liked', async () => {
      // Arrange
      const username = 'dicoding2';
      await request(app).post('/users').send({
        username,
        password: 'password',
        fullname: 'Dicoding Indonesia',
      });
      const loginRes = await request(app).post('/authentications').send({
        username,
        password: 'password',
      });
      const { accessToken } = loginRes.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'thread title', body: 'thread body' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'comment content' });
      const { id: commentId } = commentRes.body.data.addedComment;

      // First like
      await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Action: Unlike
      const response = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');

      const detailRes = await request(app).get(`/threads/${threadId}`);
      expect(detailRes.body.data.thread.comments[0].likeCount).toEqual(0);
    });
  });
});
