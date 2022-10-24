import { Field, InterfaceType, ObjectType } from 'type-graphql';
@InterfaceType()
export abstract class BaseResponse {
  @Field(() => Number, { nullable: true })
  code: number;

  @Field(() => String, { nullable: true })
  message: string;
}

@InterfaceType()
export abstract class QueryResponse {
  @Field({ nullable: true })
  totalCount?: number;

  @Field({ nullable: true })
  totalPage?: number;

  @Field({ nullable: true })
  perPage?: number;

  @Field({ nullable: true })
  page?: number;
}

@ObjectType({ implements: BaseResponse })
export class MutationResponse implements BaseResponse {
  code: number;
  message: string;
}
