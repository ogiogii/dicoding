/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'test comment',
    threadId = 'thread-123',
    owner = 'user-123',
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, thread_id, owner, date, is_delete) VALUES($1, $2, $3, $4, NOW(), $5)',
      values: [id, content, threadId, owner, isDelete],
    };

    await pool.query(query);
  },


  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
  },
};

export default CommentsTableTestHelper;