import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from '../../Commons/config.js';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';
import comments from '../../Interfaces/http/api/comments/index.js';

const createServer = async (container) => {
  const app = express();

  // 🔥 SWAGGER CONFIG
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Forum API Documentation',
        version: '1.0.0',
        description: 'Dokumentasi API pakai Swagger + Express',
      },
      servers: [
        { 
          url: 'https://dicoding-developakun4151-64umqljg.leapcell.dev',
          description: 'Production Server'
        },
        { 
          url: `http://localhost:${config.app.port}`,
          description: 'Local Development'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/Interfaces/http/api/**/routes.js'] 
  };
  const openapiSpecification = swaggerJsDoc(swaggerOptions);

  // 🔥 MIDDLEWARES
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle Preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).send();
    }
    next();
  });

  app.use(express.json());

  // 🔥 LIMIT ACCESS (Rate Limiting)
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 90, // Batasi setiap IP ke 90 request per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'fail',
        message: 'Terlalu banyak permintaan, silakan coba lagi nanti',
      });
    },
  });
  app.use(limiter);

  // 🔥 ROUTES
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.get('/', (req, res) => {
    res.send('Welcome to Forum API! Visit <a href="/api-docs">/api-docs</a> for documentation.');
  });

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', threads(container));
  app.use('/', comments(container));

  // 🔥 ERROR HANDLER
  /* eslint-disable no-unused-vars */
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    console.error('[SERVER_ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

export default createServer;