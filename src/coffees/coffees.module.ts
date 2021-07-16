import { Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { EventEntity } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeeModel, CoffeeSchema } from './schemas/coffee.schema';

@Module({
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useFactory: () => ['buddy brew', 'nescafe'],
      scope: Scope.TRANSIENT
    }
  ],
  imports: [
    TypeOrmModule.forFeature([
      Coffee,
      Flavor,
      EventEntity
    ]),
    MongooseModule.forFeature([
      {
        name: CoffeeModel.name,
        schema: CoffeeSchema,
      }
    ]),
    ConfigModule.forFeature(coffeesConfig)
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
