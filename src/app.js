import express from 'express';
import { rateLimit } from 'express-rate-limit';
import container from './Infrastructures/container.js';
import ClientError from './Commons/exceptions/ClientError.js';
import DomainErrorTranslator from './Commons/exceptions/DomainErrorTranslator.js';

import threadRoutes from './Interfaces/http/api/threads/index.js';
import authRoutes from './Interfaces/http/api/authentications/index.js';
import commentRoutes from './Interfaces/http/api/comments/routes.js';
import userRoutes from './Interfaces/http/api/users/index.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API pakai Swagger + Express',
    },
    servers: [
      { url: 'http://localhost:3000' }
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


app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get('/', (req, res) => {
  res.send('Welcome to Forum API! Visit <a href="/api-docs">/api-docs</a> for documentation.');
});


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

app.use('/threads', limiter);

app.use('/users', userRoutes(container));
app.use('/authentications', authRoutes(container));
app.use('/threads', threadRoutes(container));
app.use('/', commentRoutes(container));

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

  console.error(error); // Log unexpected errors for debugging
  return res.status(500).json({
    status: 'error',
    message: 'terjadi kegagalan pada server kami',
  });
});

export default app;