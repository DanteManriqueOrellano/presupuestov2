import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Notification {
  @Field()
  id: number;

  @Field({ nullable: true })
  message?: string;

  @Field()
  date: Date;
}

export interface NotificationPayload {
  id: number;
  message?: string;
}