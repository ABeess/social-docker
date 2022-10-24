import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@ObjectType()
@Entity()
export default class Streams extends Model {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  streamKey: string;

  @Field()
  @Column()
  url: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field()
  @Column({ nullable: true })
  clientId: string;

  @Field()
  @Column({ default: false })
  live: boolean;
}
