import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import { Post, User } from '../entities';
import Comment from '../entities/Comment';

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field()
  message: string;

  @Field({ nullable: true })
  postId: string;

  @Field()
  authorId?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  commentId?: string;
}

@InputType()
export class ReplyInput {
  @Field()
  message: string;

  @Field(() => GraphQLJSONObject)
  author?: User;

  @Field()
  commentId?: string;

  @Field()
  postId: string;
}
