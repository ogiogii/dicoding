class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._commentRepository.checkCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;