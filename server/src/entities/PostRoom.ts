import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import Model from './Model';

@Entity()
@ObjectType()
export default class PostChanel extends Model {
  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  chanel: string;
}
