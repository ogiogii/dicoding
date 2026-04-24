import { vi } from 'vitest';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah komentar',
        },
      ],
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(expectedThread),
    };

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const thread = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });

  it('should throw NotFoundError when thread is not found', async () => {
    const mockThreadRepository = {
      getThreadById: vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan')),
    };

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    await expect(getThreadDetailUseCase.execute('invalid-thread'))
      .rejects.toThrow(NotFoundError);
  });
});
