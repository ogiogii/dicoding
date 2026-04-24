import { vi } from 'vitest';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = {
      verifyCommentAvailability: vi.fn().mockResolvedValue(undefined),
      checkCommentOwner: vi.fn().mockResolvedValue(undefined),
      deleteComment: vi.fn().mockResolvedValue(undefined),
    };
    const mockThreadRepository = {
      verifyAvailableThread: vi.fn().mockResolvedValue(undefined),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });

  it('should throw NotFoundError when thread is not found', async () => {
    const mockCommentRepository = {
      verifyCommentAvailability: vi.fn(),
      checkCommentOwner: vi.fn(),
      deleteComment: vi.fn(),
    };
    const mockThreadRepository = {
      verifyAvailableThread: vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan')),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute({ threadId: 'xxx', commentId: 'comment-123', owner: 'user-123' }))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when comment is not found', async () => {
    const mockCommentRepository = {
      verifyCommentAvailability: vi.fn().mockRejectedValue(new NotFoundError('komentar tidak ditemukan')),
      checkCommentOwner: vi.fn(),
      deleteComment: vi.fn(),
    };
    const mockThreadRepository = {
      verifyAvailableThread: vi.fn().mockResolvedValue(undefined),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute({ threadId: 'thread-123', commentId: 'xxx', owner: 'user-123' }))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError when user is not comment owner', async () => {
    const mockCommentRepository = {
      verifyCommentAvailability: vi.fn().mockResolvedValue(undefined),
      checkCommentOwner: vi.fn().mockRejectedValue(new AuthorizationError('bukan pemilik komentar')),
      deleteComment: vi.fn(),
    };
    const mockThreadRepository = {
      verifyAvailableThread: vi.fn().mockResolvedValue(undefined),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute({ threadId: 'thread-123', commentId: 'comment-123', owner: 'other-user' }))
      .rejects.toThrow(AuthorizationError);
  });
});
