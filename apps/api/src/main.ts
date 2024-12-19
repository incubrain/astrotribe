// main.ts
import { NestFactory, Reflector } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from '@core/filters/http-exception.filter'
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor'
import { CustomLogger } from '@core/logger/custom.logger'
import { PaginationInterceptor } from '@core/interceptors/pagination.interceptor'
import { TrimPipe } from '@core/pipes/trim.pipe'
import { TypeConversionPipe } from '@core/pipes/type-conversion.pipe'
import { CustomThrottlerGuard } from '@core/guards/throttler.guard'
import { CustomThrottlerStorage } from '@core/storage/throttler.storage'
import compression from 'compression'
import helmet from 'helmet'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerStorage } from '@nestjs/throttler'

async function bootstrap() {
  // Create the app with custom logger
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  })

  const configService = app.get(ConfigService)

  // Security
  app.use(helmet())
  app.use(compression())

  // Global guards
  app.useGlobalGuards(
    new CustomThrottlerGuard(
      {
        throttlers: [
          {
            ttl: 60000, // 1 minute in milliseconds
            limit: 10,
          },
          {
            ttl: 3600000, // 1 hour in milliseconds
            limit: 100,
          },
        ],
      },
      new CustomThrottlerStorage(),
      new Reflector(),
    ),
  )

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter(new CustomLogger()))

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new CustomLogger()), new PaginationInterceptor())

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
  app.enableCors({
    origin: configService.get('app.api_cors_origins'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
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
