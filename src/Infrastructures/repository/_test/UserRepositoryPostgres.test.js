import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    // WAJIB: Bersihkan tabel setiap kali satu test case (it) selesai
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    // await pool.end(); // Removed to prevent pool closing for other tests
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser.id).toBe('user-123');
      expect(registeredUser.username).toBe('dicoding');
      expect(registeredUser.fullname).toBe('Dicoding Indonesia');
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      // Di sini lo masukin user-123. Karena ada afterEach, ini gak akan bentrok sama test lain.
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret_password' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');

      // Assert
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
        .rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      // Assert
      expect(userId).toEqual('user-123');
    });
  });
});