// main.ts
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import tcpPortUsed from 'tcp-port-used'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import compression from 'compression'

import { HttpExceptionFilter } from '@core/filters/http-exception.filter'
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor'
import { CustomLogger } from '@core/logger/custom.logger'
import { PaginationInterceptor } from '@core/interceptors/pagination.interceptor'
import { TrimPipe } from '@core/pipes/trim.pipe'
import helmet from 'helmet'
import { IoAdapter } from '@nestjs/platform-socket.io'

// INTERCEPTORS
import { BigIntSerializationInterceptor } from '@core/interceptors/bigint.interceptor'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose'])

async function bootstrap() {
  // Create the app with custom logger
  const logger = new CustomLogger('Bootstrap')
  const app = await NestFactory.create(AppModule, {
    logger,
  })

  app.useWebSocketAdapter(new IoAdapter(app))

  // Debug middleware
  // CORS Configuration - Let's use enableCors() instead of manual middleware
  app.enableCors({
    origin: [
      'https://admin.astronera.org',
      'https://app.astronera.org',
      'http://localhost:3000',
      'http://localhost:3009',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:4200',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'x-api-key',
      'Origin',
      'baggage',
      'sentry-trace',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Upgrade',
      'Connection',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  app.use((req, res, next) => {
    const logger = new CustomLogger('HTTP')
    logger.debug(`${req.method} ${req.path}`, {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
    })
    next()
  })

  const configService = app.get(ConfigService)

  // Security
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'wss:', 'ws:', '*.astronera.org'],
        },
      },
    }),
  )
  app.use(compression())

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter(new CustomLogger()))

  // Global interceptors
  app.useGlobalInterceptors(
    new BigIntSerializationInterceptor(),
    new LoggingInterceptor(new CustomLogger()),
    new PaginationInterceptor(),
  )

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    new TrimPipe(),
  )

  // ToDo - add favicon to public folder
  app.use('/favicon.ico', (req, res) => {
    res.status(204).end()
  })
  // API Prefix
  app.setGlobalPrefix('api/v1')

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // Startup
  const port = process.env.PORT || 8080
  const host = process.env.HOST ?? 'localhost' // Important for Railway
  console.log('Starting application on:', host, port)

  try {
    const inUse = await tcpPortUsed.check(Number(port), host)
    console.log('Port status:', { port, inUse })
    if (inUse) {
      console.error(`Port ${port} is already in use!`)
      process.exit(1)
    }
  } catch (error: any) {
    console.error('Error checking port:', error)
  }

  const listenPromise = app.listen(Number(port), host)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Listen timeout after 10 seconds')), 10000)
  })
  try {
    await Promise.race([listenPromise, timeoutPromise])
    console.log('Listen successful!')
  } catch (error: any) {
    console.error('Listen failed or timed out:', error)
    throw error
  }

  console.log('12. Bootstrap process complete!')
}

bootstrap().catch((error: any) => {
  console.error('Bootstrap failed with error:', {
    message: error.message,
    stack: error.stack,
    code: error.code,
    errno: error.errno,
  })
  process.exit(1)
})
