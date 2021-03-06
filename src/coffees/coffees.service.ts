import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { EventEntity } from '../events/entities/event.entity';
import { ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { InjectModel } from '@nestjs/mongoose';
import { CoffeeModel } from './schemas/coffee.schema';
import { Model } from 'mongoose'

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor) private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(coffeesConfig.KEY) private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    @InjectModel(CoffeeModel.name) private readonly coffeeModel: Model<CoffeeModel>
  ) {
    console.log(coffeesConfiguration)
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery

    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    })
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors']
    })
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`)
    }
    return coffee
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(createCoffeeDto.flavors.map(name => {
      return this.preloadFlavorByName(name)
    }))

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors
    })
    return this.coffeeRepository.save(coffee)
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors = updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
      ))


    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors
    })
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`)
    }
    return this.coffeeRepository.save(coffee)
  }

  async remove(id: string) {
    const coffee = await this.findOne(id)
    return this.coffeeRepository.remove(coffee)
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      coffee.recommendation++

      const recommendEvent = new EventEntity()
      recommendEvent.name = 'recommend_coffee'
      recommendEvent.type = 'coffee'
      recommendEvent.payload = { coffeeId: coffee.id }

      await queryRunner.manager.save(coffee)
      await queryRunner.manager.save(recommendEvent)

      await queryRunner.commitTransaction()
    } catch(err) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name })
    if (existingFlavor) {
      return existingFlavor
    }
    return this.flavorRepository.create({ name })
  }
}
