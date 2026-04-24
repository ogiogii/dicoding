class AddedComment {
  constructor(payload) {
    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    this.id = id;
    this.content = content;
    this.owner = owner;
  }
}

export default AddedComment;