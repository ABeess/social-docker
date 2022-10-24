import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import { User } from '../entities';

@InputType()
export class CreateStreamKeyInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  streamKey: string;

  @Field()
  url: string;

  @Field()
  clientId: string;

  @Field(() => GraphQLJSONObject)
  user: User;
}

@InputType()
export class StreamChatInput {
  @Field()
  message: string;

  @Field()
  streamId: string;

  @Field(() => GraphQLJSONObject)
  user: User;
}
