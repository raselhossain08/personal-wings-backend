import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
import { AppModule } from './app-minimal.module';  // Use minimal version temporarily
import { ConfigService } from '@nestjs/config';
// import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
// import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global filters and interceptors
  // Global filters and interceptors (commented out for minimal version)
  // app.useGlobalFilters(new GlobalExceptionFilter(configService));
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: configService.get('CORS_CREDENTIALS', true),
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    validationError: { target: false },
  }));

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api'));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Personal Wings Professional CMS API')
    .setDescription('Complete enterprise CMS for aviation training platform')
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Courses', 'Course and lesson management')
    .addTag('Products', 'Aircraft and product listings')
    .addTag('Orders', 'Order management and processing')
    .addTag('Payments', 'Payment processing and invoices')
    .addTag('Analytics', 'Business intelligence and reporting')
    .addTag('Notifications', 'Messaging and communication')
    .addTag('Uploads', 'File upload and management')
    .addServer('http://localhost:3001', 'Development Server')
    .addServer('https://api.personalwings.com', 'Production Server')
    .setContact('Support', 'https://personalwings.com/support', 'support@personalwings.com')
    .setLicense('Commercial', 'https://personalwings.com/license')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Personal Wings API Documentation',
    customCss: `
      .swagger-ui .topbar { background-color: #1e40af; }
      .swagger-ui .info hgroup.main h2 { color: #1e40af; }
      .swagger-ui .btn.authorize { background-color: #1e40af; border-color: #1e40af; }
      .swagger-ui .scheme-container { background-color: #f8fafc; }
    `,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js',
    ],
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port);

  console.log(`🚀 Personal Wings Professional Backend running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏷️  Environment: ${configService.get('NODE_ENV', 'development')}`);
}
bootstrap();