import { CREATE_COMMENT, GET_COMMENTS_BY_POST, REPLY_COMMENT } from 'src/graphql/commentQuery';
import { CreateCommentInput, QueryInput, ReplyCommentInput } from 'src/types/InputValue';
import { CreateCommentMutation, ReplyCommentMutation } from 'src/types/MutationResponse';
import { CommentQueryResponse } from 'src/types/QueryResponse';
import { BaseResponse, CommentResponse } from 'src/types/Response';
import app from 'src/utils/graphqlRequest';

export const createComment = async (data: CreateCommentInput): Promise<BaseResponse> => {
  const response: CreateCommentMutation = await app.request(CREATE_COMMENT, {
    data,
  });
  return response.createComment;
};

export const getCommentByPost = async (data: string, query?: QueryInput): Promise<CommentResponse> => {
  const response: CommentQueryResponse = await app.request(GET_COMMENTS_BY_POST, {
    postId: data,
    query,
  });

  return response.getComment;
};

export const replyComment = async (data: ReplyCommentInput): Promise<BaseResponse> => {
  const response: ReplyCommentMutation = await app.request(REPLY_COMMENT, {
    data,
  });
  return response.replyComment;
};
