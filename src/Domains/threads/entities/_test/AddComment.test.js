import AddComment from '../AddComment.js';

describe('AddComment entity', () => {
  it('should throw ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY when content is missing', () => {
    expect(() => new AddComment({ threadId: 'thread-123', owner: 'owner-123' }))
      .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY when threadId is missing', () => {
    expect(() => new AddComment({ content: 'konten', owner: 'owner-123' }))
      .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY when owner is missing', () => {
    expect(() => new AddComment({ content: 'konten', threadId: 'thread-123' }))
      .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION when content is not string', () => {
    expect(() => new AddComment({ content: 123, threadId: 'thread-123', owner: 'owner-123' }))
      .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION when threadId is not string', () => {
    expect(() => new AddComment({ content: 'konten', threadId: 123, owner: 'owner-123' }))
      .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION when owner is not string', () => {
    expect(() => new AddComment({ content: 'konten', threadId: 'thread-123', owner: 123 }))
      .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly when payload is valid', () => {
    const addComment = new AddComment({ content: 'sebuah komentar', threadId: 'thread-123', owner: 'user-123' });
    expect(addComment.content).toBe('sebuah komentar');
    expect(addComment.threadId).toBe('thread-123');
    expect(addComment.owner).toBe('user-123');
  });
});
