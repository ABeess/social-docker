import { Box, Card, Container } from '@mui/material';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPost } from 'src/api/post.api';
import Page from 'src/components/Page';
import PostSkeleton from 'src/components/skeleton/PostSkeleton';
import useRouter from 'src/hooks/useRouter';
import useSocket from 'src/hooks/useSocket';
import { CommentList, PostCreate, PostList } from 'src/sections/post';
import { Comment, Post, Reply } from 'src/types/Base';
import { CommentResponse } from 'src/types/Response';
import { CommentSocketResponse } from 'src/types/socket.response';

export default function PostPage() {
  const { params, pathname } = useRouter();

  const hashUrl = !isEmpty(params) && pathname.includes('profile');

  const { fetchNextPage, hasNextPage, isLoading, data } = useInfiniteQuery(
    [
      'POST',
      {
        userId: hashUrl ? params.id : '',
      },
    ],
    ({ pageParam }) =>
      getPost({
        query: {
          page: pageParam,
          limit: 3,
        },
        ...(hashUrl && {
          userId: params.id,
        }),
      }),
    {
      getNextPageParam: ({ page, totalPage }) => (page < totalPage - 1 ? page + 1 : undefined),
    }
  );

  const queryClient = useQueryClient();

  const commentSocket = useSocket<CommentSocketResponse>('POST_COMMENT') as CommentSocketResponse;

  useEffect(() => {
    if (commentSocket) {
      const prevData = queryClient.getQueryData<InfiniteData<CommentResponse>>([
        'COMMENTS_POST',
        { post: commentSocket.postId },
      ]) as InfiniteData<CommentResponse>;

      if (commentSocket.type === 'comment') {
        const comment = commentSocket.data as unknown as Comment;
        queryClient.setQueryData<InfiniteData<CommentResponse>>(['COMMENTS_POST', { post: commentSocket.postId }], {
          ...prevData,

          pages: prevData.pages.map((page) => ({
            ...page,
            comments: [{ ...comment, reply: [] }, ...(page.comments as Comment[])],
          })),
        });
      }
      if (commentSocket.type === 'reply') {
        const reply = commentSocket.data as Reply;
        const commentId = reply.parent.id;

        queryClient.setQueryData<InfiniteData<CommentResponse>>(['COMMENTS_POST', { post: commentSocket.postId }], {
          ...prevData,

          pages: prevData.pages.map((page) => ({
            ...page,
            comments: page.comments?.map((comment) =>
              comment.id !== commentId ? comment : { ...comment, reply: [reply, ...(comment.reply as Array<Reply>)] }
            ),
          })),
        });
      }
    }
  }, [commentSocket]);

  const [ref, inView] = useInView();

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Post">
      <Container maxWidth="md">
        <PostCreate handleSuccess={handleSuccess} open={open} handleClose={handleClose} handleOpen={handleOpen} />

        {isLoading
          ? [...Array(2)].map((_, index) => <PostSkeleton key={index} />)
          : data &&
            flatten(data.pages.map((page) => page.posts))?.map((post) => (
              <Card key={post?.id} sx={{ pb: 2, mt: 2 }}>
                <Box>
                  <PostList post={post as Post} />
                  <CommentList post={post as Post} />
                </Box>
              </Card>
            ))}

        {!isLoading && hasNextPage && (
          <PostSkeleton
            sx={{
              mt: 2,
            }}
            ref={ref}
          />
        )}
      </Container>
    </Page>
  );
}
