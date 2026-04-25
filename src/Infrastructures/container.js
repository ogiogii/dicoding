/* istanbul ignore file */
import { createContainer } from 'instances-container';

// external agency
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './database/postgres/pool.js';

// service (repository, helper, manager, etc)
import UserRepository from '../Domains/users/UserRepository.js';
import PasswordHash from '../Applications/security/PasswordHash.js';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js';
import BcryptPasswordHash from './security/BcryptPasswordHash.js';

import ThreadRepository from '../Domains/threads/ThreadRepository.js';
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres.js';

// 🔥 FIX PATH COMMENT (WAJIB)
import CommentRepository from '../Domains/comments/CommentRepository.js';
import CommentRepositoryPostgres from './repository/CommentRepositoryPostgres.js';
import CommentLikeRepository from '../Domains/comments/CommentLikeRepository.js';
import CommentLikeRepositoryPostgres from './repository/CommentLikeRepositoryPostgres.js';

// use case
import AddUserUseCase from '../Applications/use_case/AddUserUseCase.js';
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js';
import JwtTokenManager from './security/JwtTokenManager.js';
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase.js';

import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js';

import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase.js';
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase.js';

import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../Applications/use_case/AddCommentUseCase.js';

// 🔥 WAJIB ADA
import DeleteCommentUseCase from '../Applications/use_case/DeleteCommentUseCase.js';

// 🔥 TAMBAHAN GET THREAD DETAIL
import GetThreadDetailUseCase from '../Applications/use_case/GetThreadDetailUseCase.js';
import ToggleCommentLikeUseCase from '../Applications/use_case/ToggleCommentLikeUseCase.js';

const buildContainer = () => {
  const container = createContainer();

  // ==================
  // REGISTER REPOSITORY
  // ==================
  container.register([
    {
      key: UserRepository.name,
      Class: UserRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: AuthenticationRepository.name,
      Class: AuthenticationRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }],
      },
    },
    {
      key: PasswordHash.name,
      Class: BcryptPasswordHash,
      parameter: {
        dependencies: [{ concrete: bcrypt }],
      },
    },
    {
      key: AuthenticationTokenManager.name,
      Class: JwtTokenManager,
      parameter: {
        dependencies: [{ concrete: jwt }],
      },
    },
    {
      key: ThreadRepository.name,
      Class: ThreadRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: CommentRepository.name,
      Class: CommentRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: CommentLikeRepository.name,
      Class: CommentLikeRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
  ]);

  // ==================
  // REGISTER USE CASE
  // ==================
  container.register([
    {
      key: AddUserUseCase.name,
      Class: AddUserUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'userRepository', internal: UserRepository.name },
          { name: 'passwordHash', internal: PasswordHash.name },
        ],
      },
    },
    {
      key: LoginUserUseCase.name,
      Class: LoginUserUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'userRepository', internal: UserRepository.name },
          { name: 'authenticationRepository', internal: AuthenticationRepository.name },
          { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
          { name: 'passwordHash', internal: PasswordHash.name },
        ],
      },
    },
    {
      key: LogoutUserUseCase.name,
      Class: LogoutUserUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        ],
      },
    },
    {
      key: RefreshAuthenticationUseCase.name,
      Class: RefreshAuthenticationUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'authenticationRepository', internal: AuthenticationRepository.name },
          { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
        ],
      },
    },
    {
      key: AddThreadUseCase.name,
      Class: AddThreadUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'threadRepository', internal: ThreadRepository.name },
        ],
      },
    },
    {
      key: AddCommentUseCase.name,
      Class: AddCommentUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'commentRepository', internal: CommentRepository.name },
          { name: 'threadRepository', internal: ThreadRepository.name },
        ],
      },
    },

    // 🔥 DELETE COMMENT (WAJIB)
    {
      key: DeleteCommentUseCase.name,
      Class: DeleteCommentUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'commentRepository', internal: CommentRepository.name },
          { name: 'threadRepository', internal: ThreadRepository.name },
        ],
      },
    },

    // 🔥 GET THREAD DETAIL (WAJIB)
    {
      key: GetThreadDetailUseCase.name,
      Class: GetThreadDetailUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'threadRepository', internal: ThreadRepository.name },
        ],
      },
    },
    {
      key: ToggleCommentLikeUseCase.name,
      Class: ToggleCommentLikeUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          { name: 'commentLikeRepository', internal: CommentLikeRepository.name },
          { name: 'commentRepository', internal: CommentRepository.name },
          { name: 'threadRepository', internal: ThreadRepository.name },
        ],
      },
    },
  ]);

  return container;
};

const container = buildContainer();

export default container;
export { buildContainer };