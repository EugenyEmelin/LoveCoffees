import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  readonly brand: string

  @ApiProperty({ example: [] })
  @IsArray()
  @IsString({ each: true })
  readonly flavors: string[]
}
