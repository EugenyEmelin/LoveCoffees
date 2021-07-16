import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@UsePipes(new ValidationPipe())
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    await new Promise(resolve => setTimeout(resolve, 400))
    return this.coffeesService.findAll(paginationQuery)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coffeesService.findOne(id.toString())
  }

  @Post('create')
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto
  ) {
    return this.coffeesService.update(id, updateCoffeeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id)
  }
}
