import {
  AddFriendResponse,
  createConversationResponse,
  CreatePostResponse,
  CreateStreamResponse,
  LikePostResponse,
  MutationResponse,
  SendStreamChatResponse,
  UpdateUserProfileResponse,
  UserResponse,
} from './Response';

export type Mutation = {
  login: UserResponse;
  register: UserResponse;
  logout: LogoutMutation;
  markAsRead: MutationResponse;
  createComment: MutationResponse;
  replyComment: MutationResponse;
  createPost: CreatePostResponse;
  addFriend: AddFriendResponse;
  likePost: LikePostResponse;
  unLikePost: MutationResponse;
  updateProfile: UpdateUserProfileResponse;
  createConversation: createConversationResponse;
  uploadAvatar: MutationResponse;
  updateThumbnail: MutationResponse;
  createStream: CreateStreamResponse;
  sendStreamChat: SendStreamChatResponse;
  unLoadStream: MutationResponse;
};

export type LoginMutation = Pick<Mutation, 'login'>;
export type RegisterMutation = Pick<Mutation, 'register'>;
export type LogoutMutation = Pick<Mutation, 'logout'>;
export type MaskAsReadMutation = Pick<Mutation, 'markAsRead'>;
export type CreateCommentMutation = Pick<Mutation, 'createComment'>;
export type ReplyCommentMutation = Pick<Mutation, 'replyComment'>;
export type CreatePostMutation = Pick<Mutation, 'createPost'>;
export type AddFriendMutation = Pick<Mutation, 'addFriend'>;
export type LikePostMutation = Pick<Mutation, 'likePost'>;
export type UnLikePostMutation = Pick<Mutation, 'unLikePost'>;
export type UpdateProfileMutation = Pick<Mutation, 'updateProfile'>;
export type CreateConversationMutation = Pick<Mutation, 'createConversation'>;
export type UploadAvatarMutation = Pick<Mutation, 'uploadAvatar'>;
export type UploadThumbnailMutation = Pick<Mutation, 'updateThumbnail'>;
export type CreateStreamMutation = Pick<Mutation, 'createStream'>;
export type SendStreamChatMutation = Pick<Mutation, 'sendStreamChat'>;
export type UnloadStreamMutation = Pick<Mutation, 'unLoadStream'>;
