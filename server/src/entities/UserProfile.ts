import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class UserProfile extends Model {
  @Column({ default: '' })
  @Field()
  liveAt: string;

  @Column({ default: '' })
  @Field()
  ward: string;

  @Column({ default: '' })
  @Field()
  province: string;

  @Column({ default: '' })
  @Field()
  district: string;

  @Column({ default: '' })
  @Field()
  gender: string;

  @Column({ default: '' })
  @Field()
  dayOfBirth: string;

  @Column({ default: '' })
  @Field()
  phoneNumber: string;

  @Column({ default: '' })
  @Field()
  story: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  thumbnail: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
