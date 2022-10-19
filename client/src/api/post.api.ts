import { ALL_POST_QUERY, CREATE_POST, GET_LIKE, LIKE_POST, UNLIKE_POST } from 'src/graphql/postQuery';
import { LikePostInput, PostInput, QueryInput, UnLikePostInput } from 'src/types/InputValue';
import { CreatePostMutation, LikePostMutation, UnLikePostMutation } from 'src/types/MutationResponse';
import { LikePostQuery, PostResponse } from 'src/types/QueryResponse';
import { Upload } from 'src/types/UploadResponse';
import app from 'src/utils/graphqlRequest';

interface GetPostQuery {
  query?: QueryInput;
  userId?: string;
}
export const getPost = async ({ query, userId }: GetPostQuery) => {
  const response: PostResponse = await app.request(ALL_POST_QUERY, {
    query,
    userId,
  });
  return response.postsQuery;
};

export interface CreatePostQuery {
  post: PostInput;
  images: Upload[];
}
export const createPost = async ({ images, post }: CreatePostQuery) => {
  const response: CreatePostMutation = await app.request(CREATE_POST, {
    images,
    post,
  });
  return response.createPost;
};

export const likePost = async (data: LikePostInput) => {
  const { likePost }: LikePostMutation = await app.request(LIKE_POST, {
    data,
  });
  return likePost;
};

export const unLikePost = async (data: UnLikePostInput) => {
  const { unLikePost }: UnLikePostMutation = await app.request(UNLIKE_POST, {
    data,
  });
  return unLikePost;
};

export const getLikePost = async (data: { userId: string; postId: string }) => {
  const { getLikeByPost }: LikePostQuery = await app.request(GET_LIKE, {
    data,
  });
  return getLikeByPost;
};
