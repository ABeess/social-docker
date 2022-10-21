import { styled, Typography } from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { useState } from 'react';
import { createComment, getCommentByPost } from 'src/api/coment.api';
import { useAppSelector } from 'src/redux/hooks';
import { Post, User } from 'src/types/Base';
import { CreateCommentInput } from 'src/types/InputValue';
import { CommentResponse } from 'src/types/Response';
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

export default function CommentList({ post }: CommentListProps) {
  const [remainingComment, setRemainingComment] = useState(0);

  const user = useAppSelector((state) => state.auth.user) as User;

  const [message, setMessage] = useState('');

  const { hasNextPage, fetchNextPage, data } = useInfiniteQuery(
    ['COMMENTS_POST', { post: post.id }],
    ({ pageParam }) => getCommentByPost(post.id, { limit: 3, page: pageParam }),
    {
      getNextPageParam: ({ page, totalPage }) => (page < totalPage - 1 ? page + 1 : undefined),
      onSuccess(data) {
        if (!isEmpty(data)) {
          const { page, perPage, totalCount } = data.pages.slice(-1).pop() as CommentResponse;
          setRemainingComment(totalCount - (page + 1 * perPage));
        }
      },
    }
  );

  const { mutateAsync: sendComment } = useMutation((value: CreateCommentInput) => createComment(value));

  const handleSendComment = async () => {
    try {
      await sendComment({ authorId: user.id, postId: post.id, message });
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
      {data &&
        flatten(data?.pages.map((page) => page.comments)).map((comment) => (
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
          See more {remainingComment} comments
        </Typography>
      )}
    </RootStyled>
  );
}
