import { vi } from 'vitest';
import AddThreadUseCase from '../AddThreadUseCase.js';
import AddThread from '../../../Domains/threads/entities/AddThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const expectedAddedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    const mockThreadRepository = {
      addThread: vi.fn().mockResolvedValue(expectedAddedThread),
    };

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread(useCasePayload)
    );
  });

  it('should throw error when payload does not contain needed property', async () => {
    const mockThreadRepository = { addThread: vi.fn() };
    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    await expect(addThreadUseCase.execute({ title: 'title', owner: 'user-123' }))
      .rejects.toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', async () => {
    const mockThreadRepository = { addThread: vi.fn() };
    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    await expect(addThreadUseCase.execute({ title: 123, body: 'body', owner: 'user-123' }))
      .rejects.toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
