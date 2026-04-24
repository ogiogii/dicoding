import authMiddleware from '../../middleware/authMiddleware.js';

const routes = (handler, router, container) => {
  // POST thread (login)
/**
 * @swagger
 * /threads:
 *   post:
 *     summary: Create thread
 *     description: Create a new thread (requires authentication)
 *     tags:
 *       - threads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
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
 *                     addedThread:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         owner:
 *                           type: string
 */
  router.post('/', authMiddleware(container), handler.postThreadHandler);


  // GET thread detail (tidak perlu login)
/**
 * @swagger
 * /threads/{threadId}:
 *   get:
 *     summary: Get thread detail
 *     description: Get detail of a thread including comments
 *     tags:
 *       - threads
 *     parameters:
 *       - in: path
 *         name: threadId
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     thread:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         body:
 *                           type: string
 *                         date:
 *                           type: string
 *                         username:
 *                           type: string
 *                         comments:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               date:
 *                                 type: string
 *                               content:
 *                                 type: string
 */
  router.get('/:threadId', handler.getThreadDetailHandler);


  return router;
};

export default routes;