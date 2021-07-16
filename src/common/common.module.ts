import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard
    }
  ]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({
      path: 'coffees',
      method: RequestMethod.GET
    })
    // consumer.apply(LoggingMiddleware).exclude('coffees').forRoutes('*')
  }
}
