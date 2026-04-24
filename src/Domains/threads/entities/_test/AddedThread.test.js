import AddedThread from '../AddedThread.js';

describe('AddedThread entity', () => {
  it('should throw ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when id is missing', () => {
    expect(() => new AddedThread({ title: 'title', owner: 'owner-123' }))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when title is missing', () => {
    expect(() => new AddedThread({ id: 'thread-123', owner: 'owner-123' }))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when owner is missing', () => {
    expect(() => new AddedThread({ id: 'thread-123', title: 'title' }))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION when id is not string', () => {
    expect(() => new AddedThread({ id: 123, title: 'title', owner: 'owner-123' }))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly when payload is valid', () => {
    const addedThread = new AddedThread({ id: 'thread-123', title: 'sebuah thread', owner: 'user-123' });
    expect(addedThread.id).toBe('thread-123');
    expect(addedThread.title).toBe('sebuah thread');
    expect(addedThread.owner).toBe('user-123');
  });
});
