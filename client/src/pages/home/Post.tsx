import { Box, Card, Container } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPost } from 'src/api/post.api';
import Page from 'src/components/Page';
import PostSkeleton from 'src/components/skeleton/PostSkeleton';
import useRouter from 'src/hooks/useRouter';
import { CommentList, PostCreate, PostList } from 'src/sections/post';
import { Post } from 'src/types/Base';
import socket from 'src/utils/socket';

export default function PostPage() {
  const [postResponse, setPostResponse] = useState<Array<Post>>([]);

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
          limit: 2,
        },
        ...(hashUrl && {
          userId: params.id,
        }),
      }),
    {
      getNextPageParam: ({ page, totalPage }) => (page < totalPage - 1 ? page + 1 : undefined),
      onSuccess: (data) => {
        if (!isEmpty(data)) {
          setPostResponse(() => flatten(data.pages.map((page) => page.posts) as unknown as Post[]));
        }
      },
    }
  );

  const [ref, inView] = useInView();

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (!isEmpty(postResponse)) {
      socket.emit(
        'POST_ROOM',
        postResponse?.map((post) => post.id)
      );
    }
  }, [postResponse]);

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
