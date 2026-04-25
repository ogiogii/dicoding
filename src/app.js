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
import cors from 'cors';
import config from './Commons/config.js';

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
      { 
        url: 'https://dicoding-developakun4151-64umqljg.leapcell.dev/',
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

app.use(cors());
app.use(express.json());

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Ping
app.get('/ping', (req, res) => {
  res.send('pong');
});

// 🔥 LIMIT ACCESS (Rate Limiting)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 90, // Batasi setiap IP ke 90 request per windowMs
  standardHeaders: true, // Kembalikan rate limit info di headers `RateLimit-*`
  legacyHeaders: false, // Matikan headers `X-RateLimit-*`
  handler: (req, res) => {
    res.status(429).json({
      status: 'fail',
      message: 'Terlalu banyak permintaan, silakan coba lagi nanti',
    });
  },
});

// Terapkan rate limit pada semua rute /threads (Sesuai kriteria Dicoding)
// Namun sebaiknya diterapkan global untuk keamanan lebih baik
app.use('/threads', limiter);

app.get('/', (req, res) => {
  res.send('Welcome to Forum API! Visit <a href="/api-docs">/api-docs</a> for documentation.');
});

// Routes
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

  console.error('[SERVER_ERROR]', error); // Log unexpected errors for debugging
  return res.status(500).json({
    status: 'error',
    message: 'terjadi kegagalan pada server kami',
  });
});

export default app;