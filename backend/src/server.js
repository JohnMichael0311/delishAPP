// import dotenv from 'dotenv';
// dotenv.config();
// import { fileURLToPath } from 'url';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet'; 
// import morgan from 'morgan'; 
// import fs from 'fs';
// import path, { dirname } from 'path';

// import foodRouter from './routers/food.router.js';
// import userRouter from './routers/user.router.js';
// import orderRouter from './routers/order.router.js';
// import uploadRouter from './routers/upload.router.js';
// import paymentRoutes from './routers/paymentRoutes.js'; 
// import { dbconnect, dbclose } from './config/database.config.js';
// import monitoringRouter from './routers/monitoring.router.js';
// import { cache } from './utils/simpleCache.js';
// // import CacheMonitor from './services/cacheMonitor.js';
// // Initialize Express app
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();

// // Setup logging
// const logDirectory = path.join(__dirname, 'logs');
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

// const logFilePath = path.join(logDirectory, 'access.log');
// const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// // Basic middleware setup
// app.use(helmet());

// // CORS configuration
// // const cors = require('cors');

// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization', 'access_token']  // <-- add your custom header here
// // }));


// app.use(cors({
//   origin: 'http://localhost:3000', // Frontend origin
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'access_token'],
// }));
// // Logging
// app.use(morgan('dev'));
// app.use(morgan('combined', { stream: accessLogStream }));

// // Body parsing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Monitoring routes
// app.use('/api/monitoring', monitoringRouter);

// // Cache monitoring endpoint
// app.get('/metrics/cache', async (req, res) => {
//   try {
//     const stats = {
//       hitRatio: cache.metrics.hitRatio,
//       totalRequests: cache.metrics.totalRequests,
//       hits: cache.metrics.hits,
//       misses: cache.metrics.misses,
//       lastUpdated: cache.metrics.lastUpdated,
//       timestamp: new Date().toISOString()
//     };
//     res.json(stats);
//   } catch (error) {
//     console.error('Error getting cache metrics:', error);
//     res.status(500).json({
//       error: 'Failed to get cache stats'
//     });
//   }
// });

// // API Routes
// app.use('/api/foods', foodRouter);
// app.use('/api/users', userRouter);
// app.use('/api/orders', orderRouter);
// app.use('/api/upload', uploadRouter);
// app.use('/api', paymentRoutes);

// // Static files
// const publicFolder = path.join(__dirname, 'public');
// app.use(express.static(publicFolder));

// // Fallback to index.html for unknown routes
// app.get('*', (req, res) => {
//   const indexFilePath = path.join(publicFolder, 'index.html');
//   res.sendFile(indexFilePath);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(`Error in ${req.method} ${req.url}:`, err.stack);
  
//   // Set proper headers
//   res.setHeader('Content-Type', 'application/json');
  
//   // Development error response
//   if (process.env.NODE_ENV === 'development') {
//     res.status(err.status || 500).json({
//       status: 'error',
//       message: err.message,
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//   } else {
//     // Production error response
//     res.status(err.status || 500).json({
//       status: 'error',
//       message: err.message || 'Internal server error',
//       timestamp: new Date().toISOString()
//     });
//   }
// });

// // Function to find an available port
// const findAvailablePort = async (startPort, maxAttempts = 10) => {
//   for (let port = startPort; port < startPort + maxAttempts; port++) {
//     try {
//       // Create a new server instance to test the port
//       const testServer = express();
//       await new Promise((resolve, reject) => {
//         testServer
//           .listen(port)
//           .once('error', reject)
//           .once('listening', () => {
//             testServer.close(() => resolve(port));
//           });
//       });
//       return port;
//     } catch (err) {
//       if (err.code !== 'EADDRINUSE') throw err;
//       console.log(`Port ${port} in use, trying ${port + 1}`);
//     }
//   }
//   throw new Error(`No available ports found between ${startPort} and ${startPort + maxAttempts - 1}`);
// };

// // Graceful shutdown function
// const gracefulShutdown = (server) => {
//   const shutdown = async () => {
//     console.log('Received shutdown signal');
    
//     // Close the HTTP server
//     server.close(() => {
//       console.log('HTTP server closed');
//     });

//     // Close Redis connection
//     if (cache.client.isReady) {
//       await cache.client.quit();
//       console.log('Redis connection closed');
//     }

//     // Close any other connections here
//     process.exit(0);
//   };

//   // Handle different shutdown signals
//   process.on('SIGTERM', shutdown);
//   process.on('SIGINT', shutdown);
// };

// // Start the server
// const PORT = process.env.PORT || 5000;


// // Initialize server
// async function initializeServer() {
//   try {
//     // Connect to MongoDB
//     let dbConnection = null;
//     try {
//       dbConnection = await dbconnect();
//       console.log('Database connection established');
//     } catch (error) {
//       console.error('Failed to connect to database:', error);
//       throw error;
//     }

//     // Initialize cache monitoring
//     // const cacheMonitor = new CacheMonitor();

//     // Create server
//     const server = app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });

//     // Setup graceful shutdown
//     const shutdown = async () => {
//       console.log('Received shutdown signal');
      
//       // Close HTTP server
//       await new Promise((resolve) => {
//         server.close(resolve);
//       });
//       console.log('HTTP server closed');
      
//       // Clean up cache monitoring
//       // cacheMonitor.cleanup();
//       console.log('Cache monitoring cleaned up');
      
//       // Close Redis connection
//       if (cache.client.isReady) {
//         await cache.client.quit();
//         console.log('Redis connection closed');
//       }
      
//       // Close MongoDB connection
//       if (dbConnection) {
//         await dbclose();
//       }
      
//       process.exit(0);
//     };

//     // Handle different shutdown signals
//     process.on('SIGTERM', shutdown);
//     process.on('SIGINT', shutdown);
//     process.on('uncaughtException', (err) => {
//       console.error('Uncaught Exception:', err);
//       shutdown();
//     });
//     process.on('unhandledRejection', (reason, promise) => {
//       console.error('Unhandled Rejection:', reason);
//       shutdown();
//     });

//     // Store server reference
//     app.server = server;

//     return server;
//   } catch (error) {
//     console.error('Server initialization failed:', error);
//     process.exit(1);
//   }
// }

// // Start server
// initializeServer();

// export default app;


// import dotenv from 'dotenv';
// dotenv.config();
// import { fileURLToPath } from 'url';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import fs from 'fs';
// import path, { dirname } from 'path';

// import swaggerUi from 'swagger-ui-express';
// import swaggerJsdoc from 'swagger-jsdoc';

// import foodRouter from './routers/food.router.js';
// import userRouter from './routers/user.router.js';
// import orderRouter from './routers/order.router.js';
// import uploadRouter from './routers/upload.router.js';
// import paymentRoutes from './routers/paymentRoutes.js';
// import { dbconnect, dbclose } from './config/database.config.js';
// import monitoringRouter from './routers/monitoring.router.js';
// import { cache } from './utils/simpleCache.js';
// import { graphqlHTTP } from 'express-graphql';
// import { schema } from './graphQL/schema.js';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();

// // Setup log directory
// const logDirectory = path.join(__dirname, 'logs');
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }
// const logFilePath = path.join(logDirectory, 'access.log');
// const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });


// // Middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: false, // ✅ Important for GraphiQL to work
//   })
// );
// // Middleware setup
// app.use(helmet());
// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization', 'access_token'],
// // }));

// app.use(morgan('dev'));
// app.use(morgan('combined', { stream: accessLogStream }));
// app.use(express.json());
// app.use(
//   cors({
//     credentials: true,
//     origin: ['http://localhost:3000'],
//   })
// );
// app.use(express.urlencoded({ extended: true }));

// // Monitoring routes
// app.use('/api/monitoring', monitoringRouter);

// // Cache metrics endpoint
// app.get('/metrics/cache', async (req, res) => {
//   try {
//     const stats = {
//       hitRatio: cache.metrics.hitRatio,
//       totalRequests: cache.metrics.totalRequests,
//       hits: cache.metrics.hits,
//       misses: cache.metrics.misses,
//       lastUpdated: cache.metrics.lastUpdated,
//       timestamp: new Date().toISOString()
//     };
//     res.json(stats);
//   } catch (error) {
//     console.error('Error getting cache metrics:', error);
//     res.status(500).json({ error: 'Failed to get cache stats' });
//   }
// });

// // Swagger Setup
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Delish Food Delivery API',
//       version: '1.0.0',
//       description: 'Auto-generated API documentation for Delish using Swagger',
//     },
//     servers: [
//       {
//         url: 'http://localhost:5000',
//       },
//     ],
//   },
//   apis: ['./src/routers/*.js'],
// };
// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // API Routes
// app.use('/api/foods', foodRouter);
// app.use('/api/users', userRouter);
// app.use('/api/orders', orderRouter);
// app.use('/api/upload', uploadRouter);
// app.use('/api', paymentRoutes);

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

// // Serve static files
// const publicFolder = path.join(__dirname, 'public');
// app.use(express.static(publicFolder));

// // Fallback for SPA
// app.get('*', (req, res) => {
//   const indexFilePath = path.join(publicFolder, 'index.html');
//   res.sendFile(indexFilePath);
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(`Error in ${req.method} ${req.url}:`, err.stack);
//   res.setHeader('Content-Type', 'application/json');
//   const isDev = process.env.NODE_ENV === 'development';
//   res.status(err.status || 500).json({
//     status: 'error',
//     message: err.message || 'Internal server error',
//     ...(isDev && { stack: err.stack }),
//     timestamp: new Date().toISOString()
//   });
// });

// // Graceful shutdown logic
// const gracefulShutdown = async (server, dbConnection) => {
//   try {
//     console.log('Received shutdown signal');

//     // Close HTTP server
//     await new Promise((resolve) => server.close(resolve));
//     console.log('HTTP server closed');

//     // Close Redis
//     if (cache?.client?.isReady) {
//       await cache.client.quit();
//       console.log('Redis connection closed');
//     }

//     // Close MongoDB
//     if (dbConnection) {
//       await dbclose();
//       console.log('Database connection closed');
//     }

//     process.exit(0);
//   } catch (err) {
//     console.error('Error during shutdown:', err);
//     process.exit(1);
//   }
// };

// // Server bootstrapping
// const PORT = process.env.PORT || 5000;
// async function initializeServer() {
//   let dbConnection = null;
//   try {
//     dbConnection = await dbconnect();
//     console.log('Database connection established');

//     const server = app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });

//     const shutdown = () => gracefulShutdown(server, dbConnection);
//     process.on('SIGTERM', shutdown);
//     process.on('SIGINT', shutdown);
//     process.on('uncaughtException', (err) => {
//       console.error('Uncaught Exception:', err);
//       shutdown();
//     });
//     process.on('unhandledRejection', (reason) => {
//       console.error('Unhandled Rejection:', reason);
//       shutdown();
//     });

//     app.server = server;
//     return server;

//   } catch (error) {
//     console.error('Server initialization failed:', error);
//     process.exit(1);
//   }
// }

// initializeServer();

// export default app;



import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path, { dirname } from 'path';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
// import paymentRoutes from './routers/paymentRoutes.js';
import { dbconnect, dbclose } from './config/database.config.js';
import monitoringRouter from './routers/monitoring.router.js';
import { cache } from './utils/simpleCache.js';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphQL/schema.js';

import paymentRoutes from './routers/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Setup log directory
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const logFilePath = path.join(logDirectory, 'access.log');
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));
app.use(express.urlencoded({ extended: true }));

// Monitoring routes
app.use('/api/monitoring', monitoringRouter);

// Cache metrics endpoint
app.get('/metrics/cache', async (req, res) => {
  try {
    const stats = {
      hitRatio: cache.metrics.hitRatio,
      totalRequests: cache.metrics.totalRequests,
      hits: cache.metrics.hits,
      misses: cache.metrics.misses,
      lastUpdated: cache.metrics.lastUpdated,
      timestamp: new Date().toISOString()
    };
    res.json(stats);
  } catch (error) {
    console.error('Error getting cache metrics:', error);
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delish Food Delivery API',
      version: '1.0.0',
      description: 'Auto-generated API documentation for Delish using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routers/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payment', paymentRoutes);
// ✅ Move GraphQL route above fallback
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Serve static files
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// Fallback for SPA

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error in ${req.method} ${req.url}:`, err.stack);
  res.setHeader('Content-Type', 'application/json');
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// app.get('*', (req, res) => {
//   const indexFilePath = path.join(publicFolder, 'index.html');
//   res.sendFile(indexFilePath);
// });


// Graceful shutdown logic
const gracefulShutdown = async (server, dbConnection) => {
  try {
    console.log('Received shutdown signal');

    // Close HTTP server
    await new Promise((resolve) => server.close(resolve));
    console.log('HTTP server closed');

    // Close Redis
    if (cache?.client?.isReady) {
      await cache.client.quit();
      console.log('Redis connection closed');
    }

    // Close MongoDB
    if (dbConnection) {
      await dbclose();
      console.log('Database connection closed');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

// Server bootstrapping
const PORT = process.env.PORT || 5000;
async function initializeServer() {
  let dbConnection = null;
  try {
    dbConnection = await dbconnect();
    console.log('Database connection established');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const shutdown = () => gracefulShutdown(server, dbConnection);
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      shutdown();
    });
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
      shutdown();
    });

    app.server = server;
    return server;

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

initializeServer();

export default app;