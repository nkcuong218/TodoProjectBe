import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: Date.now() })
  createdAt: Date;

  @Prop({ required: false, default: Date.now() })
  updatedAt: Date;

  @Prop({ default: false, required: false })
  isDeleted: boolean
}


export const UserSchema = SchemaFactory.createForClass(User);
