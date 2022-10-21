import { Field, ObjectType } from 'type-graphql';
import Participants from '../entities/Participants';
import Message from '../entities/Message';
import { BaseResponse } from './BaseResponse';
import { User } from '../entities';

@ObjectType({ implements: BaseResponse })
export class ListChatSideBarResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => [Participants], { nullable: true })
  sidebar?: Participants[];
}

@ObjectType({ implements: BaseResponse })
export class ListChatResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => [Message], { nullable: true })
  chats?: Message[];
}

@ObjectType({ implements: BaseResponse })
export class MessageHeaderResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [User], { nullable: true })
  receiver?: User[];

  @Field(() => User, { nullable: true })
  owner?: User;
}
