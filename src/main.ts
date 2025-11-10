import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { SecurityMiddleware } from './shared/middleware/security.middleware';
import { HelmetMiddleware } from './shared/middleware/helmet.middleware';
const compression = require('compression');
const hpp = require('hpp');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'], // Production logging
  });
  const configService = app.get(ConfigService);

  // ============ SECURITY LAYER (Configurable) ============
  const securityEnabled = configService.get('SECURITY_ENABLED', 'false') === 'true';
  
  if (securityEnabled) {
    console.log('🔒 Security features ENABLED');
    
    // 1. Helmet Security Headers
    const helmetMiddleware = new HelmetMiddleware();
    app.use((req, res, next) => helmetMiddleware.use(req, res, next));
    
    // 2. Security Middleware (Custom)
    const securityMiddleware = new SecurityMiddleware();
    app.use((req, res, next) => securityMiddleware.use(req, res, next));
    
    // 3. HTTP Parameter Pollution Prevention
    app.use(hpp());
    
    // 4. Response Compression
    app.use(compression());
  } else {
    console.log('⚠️  Security features DISABLED - Enable from admin panel');
  }

  // Global filters and interceptors
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Enable CORS with strict settings
  const allowedOrigins = configService.get('CORS_ORIGIN', 'http://localhost:3000').split(',');
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        console.warn(`[SECURITY] Blocked CORS request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
    maxAge: 86400, // 24 hours
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