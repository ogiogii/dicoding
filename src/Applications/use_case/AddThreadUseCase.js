import AddThread from '../../Domains/threads/entities/AddThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    // WAJIB AWAIT
    const addedThread = await this._threadRepository.addThread(addThread);
    return addedThread;
  }
}

export default AddThreadUseCase;