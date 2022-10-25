import { isEmpty } from 'lodash';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Not } from 'typeorm';
import Conversation from '../entities/Conversation';
import Friendship from '../entities/Friendship';
import User from '../entities/User';
import UserProfile from '../entities/UserProfile';
import { UpdateThumbnailInput, UserProfileInput } from '../inputs/UserProfileInput';
import { HoverCardResponse } from '../response/HoverCardResponse';
import { MessageHeaderResponse } from '../response/MessageResponse';
import {
  ProfileUserResponse,
  ResponseMutation,
  UpdateUserProfileResponse,
  UserNotCurrentResponse,
} from '../response/UserResponse';
import { generateError } from '../utils/responseError';

@Resolver()
export default class UserResolver {
  @Query(() => UserNotCurrentResponse)
  async getUserNotCurrent(@Arg('userId') id: string): Promise<UserNotCurrentResponse> {
    try {
      const users = await User.find({
        where: {
          id: Not(id),
        },
      });
      return {
        code: 200,
        message: 'get User',
        users,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => HoverCardResponse)
  async hoverCard(@Arg('userId') id: string): Promise<HoverCardResponse> {
    const friend = await Friendship.findOne({
      where: [
        { addressee: { id }, accepted: true },
        { requester: { id }, accepted: true },
      ],
    });

    const user = await User.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });

    return {
      isFriend: !isEmpty(friend),
      user: user as User,
    };
  }

  @Query(() => ProfileUserResponse)
  async getProfileUser(@Arg('userId') id: string): Promise<ProfileUserResponse> {
    try {
      const existUser = await User.findOne({
        where: {
          id,
        },
        relations: {
          profile: true,
        },
      });

      if (!existUser) {
        return {
          code: 404,
          message: 'User does not exist on the system',
        };
      }
      return {
        code: 200,
        message: 'User Profile',
        user: existUser,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => MessageHeaderResponse)
  async messageHeader(@Arg('conversationId') id: string): Promise<MessageHeaderResponse> {
    try {
      if (!id) {
        return {
          code: 404,
          message: 'Missing the parameter "id"',
        };
      }

      const conversation = await Conversation.findOne({
        where: {
          id,
        },
        relations: ['receiver', 'owner'],
      });
      return {
        code: 200,
        message: 'Message Header',
        owner: conversation?.owner,
        receiver: conversation?.receiver,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error!',
      };
    }
  }

  @Mutation(() => UpdateUserProfileResponse)
  async updateProfile(@Arg('data') data: UserProfileInput): Promise<UpdateUserProfileResponse> {
    try {
      const { firstName, lastName, user, ...other } = data;

      const existProfile = await UserProfile.findOne({
        where: {
          user: {
            id: user?.id,
          },
        },
      });

      const userUpdate = await User.createQueryBuilder()
        .update()
        .where('id = :id', {
          id: user?.id,
        })
        .set({
          firstName,
          lastName,
        })
        .returning('*')
        .execute();

      if (existProfile) {
        const updateProfile = await UserProfile.createQueryBuilder()
          .update()
          .where('userId = :userId', {
            userId: user?.id,
          })
          .set(other)
          .returning('*')
          .execute();

        return {
          code: 200,
          message: 'Update User Profile',
          profile: updateProfile.raw[0],
          user: userUpdate.raw[0],
        };
      }

      const newProfile = UserProfile.create({
        ...other,
        user,
      });

      await newProfile.save();

      return {
        code: 201,
        message: 'Update User Profile',
        profile: newProfile,
        user: userUpdate.raw[0],
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Mutation(() => ResponseMutation)
  async uploadAvatar(
    @Arg('userId') id: string,
    @Arg('url') url: string
  ): Promise<ResponseMutation> {
    try {
      await User.update({ id }, { avatar: url });
      return {
        code: 200,
        message: 'Update avatar',
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message,
      };
    }
  }

  @Mutation(() => ResponseMutation)
  async updateThumbnail(
    @Arg('data') { url, userId }: UpdateThumbnailInput
  ): Promise<ResponseMutation> {
    try {
      await UserProfile.update(
        {
          user: {
            id: userId,
          },
        },
        {
          thumbnail: url,
        }
      );

      return {
        code: 200,
        message: 'Update Thumbnail',
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error',
      };
    }
  }
}
