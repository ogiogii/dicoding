import {
  describe, it, expect, vi,
} from 'vitest';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';
import CommentLikeRepository from '../../../Domains/comments/CommentLikeRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrate the add like action correctly if not liked yet', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyLike = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.verifyLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentLikeRepository.addLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });

  it('should orchestrate the delete like action correctly if already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyLike = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.verifyLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentLikeRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });
});
