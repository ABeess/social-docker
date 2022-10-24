import { Field, Maybe, ObjectType } from 'type-graphql';
import StreamChat from '../entities/StreamChat';
import Streams from '../entities/Streams';
import { BaseResponse } from './BaseResponse';

@ObjectType({ implements: BaseResponse })
export class CreateStreamResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => Streams)
  data?: Streams;
}

@ObjectType({ implements: BaseResponse })
export class GetStreamResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => [Streams])
  streams?: Streams[];
}

@ObjectType({ implements: BaseResponse })
export class CreateStreamChatResponse implements BaseResponse {
  code: number;
  message: string;

  @Field()
  chat?: StreamChat;
}

@ObjectType({ implements: BaseResponse })
export class GetStreamChatResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [StreamChat])
  streamChats?: StreamChat[];
}

@ObjectType({ implements: BaseResponse })
export class GetDetailStreamResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => Streams, { nullable: true })
  stream?: Maybe<Streams>;
}
