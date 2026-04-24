import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
  });


  describe('addThread', () => {
    it('should persist thread and return AddedThread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const addedThread = await threadRepositoryPostgres.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toBeInstanceOf(AddedThread);
      expect(addedThread.id).toBe('thread-123');
      expect(addedThread.title).toBe('sebuah thread');
      expect(addedThread.owner).toBe('user-123');
    });
  });

  describe('verifyAvailableThread', () => {
    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123'))
        .resolves.not.toThrow();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-not-exist'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getThreadById', () => {
    it('should return thread with comments when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      // Act
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.id).toBe('thread-123');
      expect(thread.username).toBe('dicoding');
      expect(Array.isArray(thread.comments)).toBe(true);
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-not-exist'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
