// main.ts
import { NestFactory, Reflector } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import compression from 'compression'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from '@core/filters/http-exception.filter'
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor'
import { CustomLogger } from '@core/logger/custom.logger'
import { PaginationInterceptor } from '@core/interceptors/pagination.interceptor'
import { TrimPipe } from '@core/pipes/trim.pipe'
import { TypeConversionPipe } from '@core/pipes/type-conversion.pipe'
import { CustomThrottlerGuard } from '@core/guards/throttler.guard'
import { CustomThrottlerStorage } from '@core/storage/throttler.storage'

import helmet from 'helmet'
import { ThrottlerStorage } from '@nestjs/throttler'
import { PermissionGuard } from '@core/guards/permission.guard'
import { PermissionService } from '@core/services/permission.service'
import { APP_GUARD } from '@nestjs/core'

// INTERCEPTORS
import { BigIntSerializationInterceptor } from '@core/interceptors/bigint.interceptor'

async function bootstrap() {
  // Create the app with custom logger
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  })

  const configService = app.get(ConfigService)

  // Security
  app.use(helmet())
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

  // PERMISSION GUARD
  // app.useGlobalGuards(
  //   new PermissionGuard(app.get(PermissionService), new CustomLogger('PermissionGuard')),
  // )

  // CORS
  const corsOrigins = configService.get('app.api_cors_origins')
  // CORS Configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        callback(null, true)
        return
      }

      const allowedOrigins = Array.isArray(corsOrigins)
        ? corsOrigins
        : corsOrigins.split(',').map((o) => o.trim())

      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true)
      } else {
        logger.warn(`Blocked CORS request from origin: ${origin}`)
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
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
    exposedHeaders: ['Content-Disposition'], // If you need to expose any headers
    maxAge: 3600, // Cache preflight requests for 1 hour
  })

  // Startup
  const port = configService.get('app.api_port')
  await app.listen(port)

  const logger = new CustomLogger('Bootstrap')
  logger.log(`Application is running on: http://localhost:${port}`)
  logger.log(`Swagger documentation is available at: http://localhost:${port}/docs`)
}

bootstrap().catch((error) => {
  const logger = new CustomLogger('Bootstrap')
  logger.error('Failed to start application', error.stack)
  process.exit(1)
})
