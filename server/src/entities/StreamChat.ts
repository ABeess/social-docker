import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class StreamChat extends Model {
  @Column()
  @Field()
  message: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  @Field()
  streamId: string;
}
