import express from 'express';
import CommentsHandler from './handler.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const routes = (container) => {
  const router = express.Router();
  const handler = new CommentsHandler(container);

  /**
 * @swagger
 * /threads/{threadId}/comments:
 *   post:
 *     summary: Add comment
 *     description: Add a comment to a thread (requires authentication)
 *     tags:
 *       - comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     addedComment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         content:
 *                           type: string
 *                         owner:
 *                           type: string
 */
  router.post(
    '/threads/:threadId/comments',
    authMiddleware(container),
    handler.postCommentHandler
  );


  /**
 * @swagger
 * /threads/{threadId}/comments/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     description: Delete a comment from a thread (requires authentication, only owner can delete)
 *     tags:
 *       - comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 */
  router.delete(
    '/threads/:threadId/comments/:commentId',
    authMiddleware(container),
    handler.deleteCommentHandler
  );

  router.put(
    '/threads/:threadId/comments/:commentId/likes',
    authMiddleware(container),
    handler.putCommentLikeHandler
  );


  return router;
};

export default routes;