import {
  AddFriendResponse,
  createConversationResponse,
  CreatePostResponse,
  LikePostResponse,
  MutationResponse,
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
