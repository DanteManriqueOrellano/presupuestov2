import { ID, Field, ArgsType } from "type-graphql";

@ArgsType()
export class NewCommentsArgs {
  @Field(_type => ID)
  recipeId: string;
}
