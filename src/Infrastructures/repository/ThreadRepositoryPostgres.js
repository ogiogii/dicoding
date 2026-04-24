import AddedThread from '../../Domains/threads/entities/AddedThread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${typeof this._idGenerator === 'function' ? this._idGenerator() : this._idGenerator}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads(id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const threadQuery = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
             FROM threads t
             JOIN users u ON t.owner = u.id
             WHERE t.id = $1`,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);
    if (!threadResult.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    // FIX: Gunakan CASE WHEN untuk menangani konten komentar yang dihapus
    const commentQuery = {
      text: `SELECT c.id, u.username, c.date,
             CASE WHEN c.is_delete = TRUE THEN '**komentar telah dihapus**' ELSE c.content END as content,
             CAST(COUNT(cl.id) AS INTEGER) as "likeCount"
             FROM comments c
             JOIN users u ON c.owner = u.id
             LEFT JOIN comment_likes cl ON cl.comment_id = c.id
             WHERE c.thread_id = $1
             GROUP BY c.id, u.username
             ORDER BY c.date ASC`,
      values: [threadId],
    };

    const commentResult = await this._pool.query(commentQuery);
    const thread = threadResult.rows[0];

    return {
      ...thread,
      comments: commentResult.rows,
    };
  }
}

export default ThreadRepositoryPostgres;