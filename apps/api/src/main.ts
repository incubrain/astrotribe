// main.ts
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import compression from 'compression'

import { HttpExceptionFilter } from '@core/filters/http-exception.filter'
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor'
import { CustomLogger } from '@core/logger/custom.logger'
import { PaginationInterceptor } from '@core/interceptors/pagination.interceptor'
import { TrimPipe } from '@core/pipes/trim.pipe'
import helmet from 'helmet'

// INTERCEPTORS
import { BigIntSerializationInterceptor } from '@core/interceptors/bigint.interceptor'
import { AppModule } from './app.module'

async function bootstrap() {
  // Create the app with custom logger
  const logger = new CustomLogger('Bootstrap')
  const app = await NestFactory.create(AppModule, {
    logger,
  })

  const configService = app.get(ConfigService)

  // Security
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
      // contentSecurityPolicy: {
      //   directives: {
      //     defaultSrc: ["'self'"],
      //     scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      //     styleSrc: ["'self'", "'unsafe-inline'"],
      //     imgSrc: ["'self'", 'data:', 'https:'],
      //     connectSrc: ["'self'", 'https:', 'wss:', '*.astronera.org'], // Add explicit domain
      //   },
      // },
    }),
  )
  app.use(compression())

  // CORS Configuration - Let's use enableCors() instead of manual middleware
  app.enableCors({
    // origin: [
    //   'https://admin.astronera.org',
    //   'https://app.astronera.org',
    //   'https://auth.astronera.org',
    //   'https://monitoring.astronera.org',
    //   'https://www.astronera.org',
    //   'https://astronera.org',
    //   /\.astronera\.org$/,
    //   'http://localhost:3000',
    // ],
    origin: true, // Allow all origins
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    // allowedHeaders: [
    //   'Content-Type',
    //   'Authorization',
    //   'X-Requested-With',
    //   'Accept',
    //   'Origin',
    //   'sentry-trace',
    //   'baggage',
    //   'x-api-key',
    // ],
    credentials: true,
  })

  // Debug middleware - after CORS
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
    })
    next()
  })

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

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      // Preflight request - return early with CORS headers
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Accept, Origin, sentry-trace, baggage, x-api-key',
      )
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Max-Age', '86400') // 24 hours
      res.status(204).end()
      return
    }
    next()
  })

  // CORS Configuration
  app.enableCors({
    origin: [
      'https://admin.astronera.org',
      'https://app.astronera.org',
      'https://auth.astronera.org',
      'https://monitoring.astronera.org',
      'https://www.astronera.org',
      'https://astronera.org',
      /\.astronera\.org$/,
      'http://localhost:3000',
    ],
    credentials: true,
  })

  // Debug middleware
  app.use((req, res, next) => {
    const logger = new CustomLogger('HTTP')
    logger.debug(`${req.method} ${req.path}`, {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
    })
    next()
  })

  // Startup
  const port = process.env.PORT || configService.get('app.api_port')
  const host = '0.0.0.0' // Important for Railway
  console.log('Starting application on:', host, port)
  await app.listen(port, host) // Listen on all interfaces

  logger.log(`Application is running on: http://${host}:${port}`)
  logger.log(`Swagger documentation is available at: http://${host}:${port}/docs`)
}

bootstrap().catch((error: any) => {
  console.error('Failed to start application', error.stack)
  process.exit(1)
})
