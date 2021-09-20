import { ObjectType, Field, ID } from "type-graphql";

import { Comment } from "./comment.type";

@ObjectType()
export class Recipe {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [Comment])
  comments: Comment[];
}