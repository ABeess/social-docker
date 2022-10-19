import { Maybe } from '.';
import { Comment, Post, User, UserProfile } from './Base';

export interface LoginValues {
  email: string;
  password: string;
}

export type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type QueryInput = {
  limit?: Maybe<number>;
  page?: Maybe<number>;
  skip?: Maybe<number>;
  take?: Maybe<number>;
};

export type MaskAsReadInput = {
  type: 'single' | 'multiple';
  notificationId?: string;
  ownerId: string;
};

export type CreateCommentInput = {
  author: User;
  message: string;
  post: Post;
};

export type ReplyCommentInput = {
  author: User;
  message: string;
  comment: Comment;
  postId: string;
};

export type PostInput = {
  content: string;
  caption?: string;
  status?: string;
  checking?: string;
  visible?: string;
  user: User;
};

export type FriendQueryInput = {
  query?: QueryInput;
  userId: string;
};

export type AddFriendInput = {
  requester: User;
  addressee: User;
  type?: 'accepted' | 'requested';
};

export type LikePostInput = {
  user: User;
  post: Post;
  type: string;
};

export type UnLikePostInput = {
  userId: string;
  postId: string;
};

export interface ProfileInput extends Partial<UserProfile> {
  firstName: string;
  lastName: string;
}

export interface SendChatInput {
  message: string;
  sender: User;
  conversationId: string;
  receiveId: Array<string>;
}

export interface CreateConversationInput {
  senderId: string;
  receiverId: Array<string>;
}

// export type AcceptFriendInput = {
//   id: string;
//   addressee: User;
//   type?: string;
// };
