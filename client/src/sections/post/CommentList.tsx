import { styled, Typography } from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { createComment, getCommentByPost } from 'src/api/coment.api';
import { useAppSelector } from 'src/redux/hooks';
import { Comment, Post, Reply, User } from 'src/types/Base';
import { CreateCommentInput } from 'src/types/InputValue';
import { CommentResponse } from 'src/types/Response';
import socket from 'src/utils/socket';
import CommentInput from './CommentInput';
import CommentItemRoot from './CommentItem';

const RootStyled = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
}));

interface CommentListProps {
  post: Post;
}

interface CommentState extends Pick<CommentResponse, 'totalCount'> {
  comments: Array<Comment>;
}

export default function CommentList({ post }: CommentListProps) {
  const [commentResponse, setCommentResponse] = useState<CommentState>({
    comments: [],
    totalCount: 0,
  });

  const { comments, totalCount } = commentResponse;
  const user = useAppSelector((state) => state.auth.user);

  const [message, setMessage] = useState('');

  const { hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['COMMENTS_POST', { post: post.id }],
    ({ pageParam }) => getCommentByPost(post.id, { limit: 3, page: pageParam }),
    {
      getNextPageParam: ({ page, totalPage }) => (page < totalPage - 1 ? page + 1 : undefined),
      onSuccess(data) {
        if (!isEmpty(data)) {
          const lastData = data.pages.slice(-1).pop();
          setCommentResponse(() => ({
            totalCount: lastData?.totalCount as number,
            comments: flatten(data.pages.map((page) => page.comments)) as Comment[],
          }));
        }
      },
    }
  );
  useEffect(() => {
    socket.on('POST_COMMENT', (response) => {
      if (response && response.type === 'comment') {
        setCommentResponse((prev) => ({
          ...prev,
          comments: [{ ...(response.data as Comment), reply: [] }, ...(prev.comments as Comment[])],
        }));
      }
      if (response && response.type === 'reply') {
        const commentId = response.data.parent.id;
        const reply = response.data;
        setCommentResponse((prev) => ({
          ...prev,
          comments: prev.comments?.map((comment) =>
            comment.id !== commentId ? comment : { ...comment, reply: [reply, ...(comment.reply as Array<Reply>)] }
          ),
        }));
      }
    });
  }, []);

  const { mutateAsync: sendComment } = useMutation((value: CreateCommentInput) => createComment(value));

  const handleSendComment = async () => {
    try {
      await sendComment({ author: user as User, post, message });
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewComment = async () => {
    fetchNextPage();
  };

  return (
    <RootStyled>
      <CommentInput value={message} setValue={setMessage} handleSubmit={handleSendComment} />
      {!isEmpty(comments) &&
        comments?.map((comment) => (
          <div key={comment.id}>
            <CommentItemRoot key={comment.id} comment={comment} post={post} />
          </div>
        ))}
      {hasNextPage && (
        <Typography
          variant="body2"
          mt={1}
          onClick={handleViewComment}
          sx={{
            mt: 1,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          See more {Number(totalCount) - Number(comments?.length)} comments
        </Typography>
      )}
    </RootStyled>
  );
}
