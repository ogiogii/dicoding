import {
  describe, it, expect, beforeEach, afterEach, afterAll,
} from 'vitest';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist comment like', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      // Action
      await commentLikeRepositoryPostgres.addLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeByCommentAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete comment like', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      // Action
      await commentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeByCommentAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyLike function', () => {
    it('should return true if like exists', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      // Action & Assert
      const isLiked = await commentLikeRepositoryPostgres.verifyLike('comment-123', 'user-123');
      expect(isLiked).toBe(true);
    });

    it('should return false if like does not exist', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      // Action & Assert
      const isLiked = await commentLikeRepositoryPostgres.verifyLike('comment-123', 'user-123');
      expect(isLiked).toBe(false);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      // Action
      const likeCount = await commentLikeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toBe(1);
    });
  });
});
