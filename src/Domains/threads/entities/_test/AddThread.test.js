import AddThread from '../AddThread.js';

describe('AddThread entity', () => {
  it('should throw ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when title is missing', () => {
    expect(() => new AddThread({ body: 'body', owner: 'owner-123' }))
      .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when body is missing', () => {
    expect(() => new AddThread({ title: 'title', owner: 'owner-123' }))
      .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when owner is missing', () => {
    expect(() => new AddThread({ title: 'title', body: 'body' }))
      .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION when title is not string', () => {
    expect(() => new AddThread({ title: 123, body: 'body', owner: 'owner-123' }))
      .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION when body is not string', () => {
    expect(() => new AddThread({ title: 'title', body: 123, owner: 'owner-123' }))
      .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION when owner is not string', () => {
    expect(() => new AddThread({ title: 'title', body: 'body', owner: 123 }))
      .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly when payload is valid', () => {
    const addThread = new AddThread({ title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' });
    expect(addThread.title).toBe('sebuah thread');
    expect(addThread.body).toBe('sebuah body');
    expect(addThread.owner).toBe('user-123');
  });
});
