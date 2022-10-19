import {
  ADD_FRIEND,
  FRIENDSHIP_RECOMMEND,
  FRIENDSHIP_REQUEST,
  FRIENDSHIP_WAITING,
  GET_FRIENDS,
} from 'src/graphql/friendshipQuery';
import { AddFriendInput, FriendQueryInput } from 'src/types/InputValue';
import { AddFriendMutation } from 'src/types/MutationResponse';
import { FriendListQuery, FriendRecommendQuery, FriendRequestQuery, FriendWaitingQuery } from 'src/types/QueryResponse';
import app from 'src/utils/graphqlRequest';

export const getFriendShipRecommend = async ({ userId, query }: FriendQueryInput) => {
  const response: FriendRecommendQuery = await app.request(FRIENDSHIP_RECOMMEND, {
    userId,
    query,
  });
  return response.friendShipRecommend;
};

export const getFriendShipRequest = async ({ query, userId }: FriendQueryInput) => {
  const response: FriendRequestQuery = await app.request(FRIENDSHIP_REQUEST, {
    userId,
    query,
  });

  return response.getFriendRequest;
};

export const getFriendShipWaiting = async ({ query, userId }: FriendQueryInput) => {
  const response: FriendWaitingQuery = await app.request(FRIENDSHIP_WAITING, {
    userId,
    query,
  });

  return response.friendWaiting;
};

export const getFriends = async (userId: string) => {
  const { getFriends }: FriendListQuery = await app.request(GET_FRIENDS, {
    userId,
  });

  return getFriends;
};

export const addFriend = async (data: AddFriendInput) => {
  const response: AddFriendMutation = await app.request(ADD_FRIEND, {
    data,
  });

  return response.addFriend;
};
