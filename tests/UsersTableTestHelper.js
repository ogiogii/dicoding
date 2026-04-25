/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'dicodingtest',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: `
        INSERT INTO users(id, username, password, fullname)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING
      `,
      values: [id, username, password, fullname],
    };

    try {
      await pool.query(query);
    } catch (error) {
      if (error.code === '23505') { // duplicate key
        // do nothing, user already exists
      } else {
        throw error;
      }
    }

  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    // 🔥 WAJIB BIAR TEST GA NIMPA DATA
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  },
};

export default UsersTableTestHelper;