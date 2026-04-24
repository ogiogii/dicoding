class ToggleCommentLikeUseCase {
  constructor({ commentLikeRepository, commentRepository, threadRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const isLiked = await this._commentLikeRepository.verifyLike(commentId, userId);

    if (isLiked) {
      await this._commentLikeRepository.deleteLike(commentId, userId);
    } else {
      await this._commentLikeRepository.addLike(commentId, userId);
    }
  }
}

export default ToggleCommentLikeUseCase;
