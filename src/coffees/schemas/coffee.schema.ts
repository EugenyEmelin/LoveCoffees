import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'

@Schema()
export class CoffeeModel extends Document {
  @Prop()
  name: string

  @Prop()
  brand: string

  @Prop([String])
  flavors: string[]
}

export const CoffeeSchema = SchemaFactory.createForClass(CoffeeModel)
