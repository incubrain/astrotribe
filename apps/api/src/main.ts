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
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger('NestBootstrap'),
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
          connectSrc: ["'self'", 'https:', 'wss:'],
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

  // CORS
  const corsOrigins = configService.get('app.api_cors_origins')
  // CORS Configuration
  app.enableCors({
    origin: [
      'https://astronera.org',
      'https://www.astronera.org',
      /\.astronera\.org$/,
      'http://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'sentry-trace',
      'baggage',
      'x-api-key',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })

  // Startup
  const port = configService.get('app.api_port')
  const host = '0.0.0.0' // Important for Railway
  console.log('Starting application on:', host, port)
  await app.listen(port, host) // Listen on all interfaces

  const logger = new CustomLogger('Bootstrap')
  logger.log(`Application is running on: http://${host}:${port}`)
  logger.log(`Swagger documentation is available at: http://${host}:${port}/docs`)
}

bootstrap().catch((error: any) => {
  const logger = new CustomLogger('Bootstrap')
  logger.error('Failed to start application', error.stack)
  process.exit(1)
})
