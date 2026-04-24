import AddComment from '../../Domains/threads/entities/AddComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { content, threadId, owner } = useCasePayload;

    const addComment = new AddComment({
      content,
      threadId,
      owner,
    });

    // cek thread ada atau tidak
    await this._threadRepository.verifyAvailableThread(threadId);

    return this._commentRepository.addComment(addComment);
  }
}

export default AddCommentUseCase;