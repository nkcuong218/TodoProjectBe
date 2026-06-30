import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })

export class Todo {
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

}

export const TodoSchema = SchemaFactory.createForClass(Todo);