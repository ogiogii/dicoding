import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';

describe('CommentRepositoryPostgres', () => {
  // Setup user & thread before each test
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    // await pool.end();
  });


  describe('addComment', () => {
    it('should persist comment and return AddedComment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const addedComment = await commentRepositoryPostgres.addComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toBeInstanceOf(AddedComment);
      expect(addedComment.id).toBe('comment-123');
      expect(addedComment.content).toBe('sebuah komentar');
      expect(addedComment.owner).toBe('user-123');
    });
  });

  describe('verifyCommentAvailability', () => {
    it('should not throw NotFoundError when comment exists', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');


      // Act & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves.not.toThrow();
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-not-exist'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('checkCommentOwner', () => {
    it('should not throw when user is comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(commentRepositoryPostgres.checkCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrow();
    });

    it('should throw AuthorizationError when user is not comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(commentRepositoryPostgres.checkCommentOwner('comment-123', 'other-user'))
        .rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should soft delete comment (set is_delete = true)', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Act
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toBe(true);
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(commentRepositoryPostgres.deleteComment('comment-not-exist'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
