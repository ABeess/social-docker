import { Maybe } from '.';
import {
  Comment,
  Conversation,
  Friendship,
  Message,
  Notification,
  Participant,
  Post,
  PostLike,
  Streams,
  StreamsChat,
  User,
  UserProfile,
} from './Base';

export type QueryResponse = {
  page: number;
  perPage: number;
  totalCount: number;
  totalPage: number;
};

export type BaseResponse = {
  code: number;
  message: string;
};

export type MutationResponse = BaseResponse & Typename;

export type Typename = {
  __typename?: string;
};

export type CurrentLike = {
  like: boolean;
  type: string;
};

export type MaskAsReadResponse = BaseResponse;

export interface UserResponse extends BaseResponse, Typename {
  accessToken?: Maybe<string>;
  user?: Maybe<User>;
}

export interface LogoutResponse extends BaseResponse, Typename {}

export interface NotificationQueryResponse extends QueryResponse, Typename {
  notifications?: Maybe<Array<Notification>>;
  totalUnread: number;
}

export interface CommentResponse extends QueryResponse, Typename {
  comments: Array<Comment>;
}

export interface CreatePostResponse extends BaseResponse, Typename {
  post: Maybe<Post>;
}

export interface FriendShipRecommendResponse extends QueryResponse, Typename {
  users: Array<User>;
}

export interface FriendShipRequestResponse extends QueryResponse, Typename {
  friendRequest: Array<Friendship>;
}

export interface FriendListResponse extends QueryResponse, Typename {
  friends: Array<User>;
}

export interface LikePostResponse extends BaseResponse, Typename {
  totalLike?: number;
  likes: PostLike;
  currentLike: CurrentLike;
}

export interface HoverCardResponse extends Typename {
  user: User;
  isFriend: boolean;
}

export interface ProfileUserResponse extends BaseResponse, Typename {
  user: User;
}

export interface UpdateUserProfileResponse extends BaseResponse, Typename {
  user: User;
  profile: UserProfile;
}

export interface ListChatSideBarResponse extends BaseResponse, Typename {
  sidebar: Array<Participant>;
}

export interface ListChatResponse extends BaseResponse, Typename {
  chats: Array<Message>;
}

export interface createConversationResponse extends BaseResponse, Typename {
  conversation: Conversation;
}

export interface ConversationResponse extends BaseResponse, Typename {
  conversations: Array<Conversation>;
}

export interface CreateStreamResponse extends BaseResponse, Typename {
  data: Streams;
}

export interface GeStreamResponse extends BaseResponse, Typename {
  streams: Streams[];
}

export interface SendStreamChatResponse extends BaseResponse, Typename {
  chat: StreamsChat;
}

export interface GetStreamChatResponse extends BaseResponse, Typename {
  streamChats: StreamsChat[];
}

export interface GetDetailStreamResponse extends BaseResponse, Typename {
  stream: Streams;
}

export interface GetUserRecommendResponse extends BaseResponse, Typename {
  users: User[];
}
export type AddFriendResponse = BaseResponse & Typename;
