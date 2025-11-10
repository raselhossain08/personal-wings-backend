import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';

// Core Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { CoursesModule } from './courses/courses.module';
// import { ProductsModule } from './products/products.module';
// import { OrdersModule } from './orders/orders.module';
// import { PaymentsModule } from './payments/payments.module';
// import { AnalyticsModule } from './analytics/analytics.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { UploadsModule } from './uploads/uploads.module';
import { HealthModule } from './health/health.module';

// Tasks (commented out until properly implemented)
// import { EmailTasksService } from './tasks/email-tasks.service';
// import { AnalyticsTasksService } from './tasks/analytics-tasks.service';

// Gateways (commented out until modules are fixed)
// import { NotificationsGateway } from './notifications/gateways/notifications.gateway';
// import { ChatGateway } from './chat/gateways/chat.gateway';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60),
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
      inject: [ConfigService],
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Email
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"${configService.get('FROM_NAME')}" <${configService.get('FROM_EMAIL')}>`,
        },
        template: {
          dir: __dirname + '/templates',
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    // CoursesModule,
    // ProductsModule,
    // OrdersModule,
    // PaymentsModule,
    // AnalyticsModule,
    // NotificationsModule,
    // UploadsModule,
    HealthModule,
  ],
  providers: [
    // Background tasks (commented out until properly implemented)
    // EmailTasksService,
    // AnalyticsTasksService,
    
    // WebSocket gateways (commented out until modules are fixed)
    // NotificationsGateway,
    // ChatGateway,
  ],
})
export class AppModule {}