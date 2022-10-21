import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import Comment from '../entities/Comment';
import PostChanel from '../entities/PostRoom';
import ReplyCommentPost from '../entities/Reply';
import { CommentInput, ReplyInput } from '../inputs/CommentInput';
import { QueryInput } from '../inputs/QueryInput';
import { authentication } from '../middleware/authentication';
import { CreateCommentResponse, ReplyResponse } from '../response/CommentResponse';
import { CommentListResponse } from '../response/PostResponse';
import { queryGenerate } from '../utils/queryGenerate';
import { generateError } from '../utils/responseError';
import { uuid } from '../utils/uuid';

@Resolver()
export default class CommentResolver {
  @Mutation(() => CreateCommentResponse)
  @UseMiddleware(authentication)
  async createComment(
    @Arg('data') { message, authorId, postId }: CommentInput
  ): Promise<CreateCommentResponse> {
    try {
      const newComment = Comment.create({
        message: message,
        author: {
          id: authorId,
        },
        post: {
          id: postId,
        },
      });

      await newComment.save();

      const comment = await Comment.findOne({
        where: {
          id: newComment.id,
        },
        relations: ['author'],
      });

      const room = await PostChanel.findOneBy({ postId });

      _io.to(room?.chanel || uuid).emit('POST_COMMENT', {
        data: comment,
        type: 'comment',
        postId,
      });

      return {
        code: 200,
        message: 'Comment Post',
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'interval server error',
      };
    }
  }

  @Mutation(() => ReplyResponse)
  @UseMiddleware(authentication)
  async replyComment(
    @Arg('data') { author, message, commentId, postId }: ReplyInput
  ): Promise<ReplyResponse> {
    try {
      const newReply = ReplyCommentPost.create({
        author,
        message: message,
        parent: {
          id: commentId,
        },
      });

      await newReply.save();

      const room = await PostChanel.findOneBy({ postId });

      _io.to(room?.chanel || uuid).emit('POST_COMMENT', {
        data: newReply,
        type: 'reply',
        postId,
      });
      return {
        code: 200,
        message: 'Reply comment',
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => CommentListResponse)
  @UseMiddleware(authentication)
  async getComment(
    @Arg('postId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<CommentListResponse> {
    const { page, limit, skip } = queryGenerate(query);

    const [commentList, count] = await Comment.findAndCount({
      where: {
        post: {
          id,
        },
      },
      skip: skip,
      take: limit,
      relationLoadStrategy: 'join',
      relations: ['author', 'post', 'reply', 'reply.author'],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      comments: commentList,
      totalCount: count,
      totalPage: Math.ceil(count / Number(limit)),
      perPage: count < Number(limit) ? 1 : limit,
      page: page,
    };
  }
}
