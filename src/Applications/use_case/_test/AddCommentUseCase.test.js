import { vi } from 'vitest';
import AddCommentUseCase from '../AddCommentUseCase.js';
import AddComment from '../../../Domains/threads/entities/AddComment.js';

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedAddedComment = {
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    };

    const mockCommentRepository = {
      addComment: vi.fn().mockResolvedValue(expectedAddedComment),
    };
    const mockThreadRepository = {
      verifyAvailableThread: vi.fn().mockResolvedValue(undefined),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment(useCasePayload)
    );
  });

  it('should throw error when thread is not found', async () => {
    const mockCommentRepository = { addComment: vi.fn() };
    const mockThreadRepository = {
      verifyAvailableThread: vi.fn().mockRejectedValue(new Error('thread tidak ditemukan')),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addCommentUseCase.execute({ content: 'content', threadId: 'invalid-thread', owner: 'user-123' }))
      .rejects.toThrowError('thread tidak ditemukan');
  });

  it('should throw error when payload does not contain needed property', async () => {
    const mockCommentRepository = { addComment: vi.fn() };
    const mockThreadRepository = { verifyAvailableThread: vi.fn() };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addCommentUseCase.execute({ threadId: 'thread-123', owner: 'user-123' }))
      .rejects.toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', async () => {
    const mockCommentRepository = { addComment: vi.fn() };
    const mockThreadRepository = { verifyAvailableThread: vi.fn() };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addCommentUseCase.execute({ content: 999, threadId: 'thread-123', owner: 'user-123' }))
      .rejects.toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
