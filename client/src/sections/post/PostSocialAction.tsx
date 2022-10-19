/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, Button, Stack, styled, Tooltip } from '@mui/material';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { likePost, unLikePost } from 'src/api/post.api';
import IconAnimate from 'src/components/animate/IconAnimate';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import Iconify from 'src/components/Iconify';

import { useAppSelector } from 'src/redux/hooks';
import { Maybe } from 'src/types';
import { Post, User } from 'src/types/Base';
import { LikePostInput, UnLikePostInput } from 'src/types/InputValue';
import { CurrentLike, LikePostResponse } from 'src/types/Response';

interface ListIconType {
  icon: string;
  value: string;
  color?: string;
}

const LIST_ICON: ListIconType[] = [
  {
    icon: 'ant-design:like-filled',
    value: 'like',
    color: 'info.main',
  },
  {
    icon: 'codicon:heart-filled',
    value: 'heart',
    color: 'error.main',
  },
  {
    icon: 'twemoji:grinning-squinting-face',
    value: 'grinning',
  },
  {
    icon: 'twemoji:sad-but-relieved-face',
    value: 'sad',
  },
  {
    icon: 'twemoji:zany-face',
    value: 'zany',
  },
];

interface PostSocialActionProp {
  post?: Post;
  currentLike?: CurrentLike;
  // eslint-disable-next-line no-unused-vars
  handleLikeSuccess: (currentLike: CurrentLike) => void;
  handleUnlike: () => void;
}

export default function PostSocialAction({ post, currentLike, handleLikeSuccess, handleUnlike }: PostSocialActionProp) {
  const user = useAppSelector((state) => state.auth.user);

  const { mutateAsync: likePostMutate } = useMutation((values: LikePostInput) => likePost(values), {
    onSuccess({ code, currentLike }, variables) {
      if (code === 201) {
        handleLikeSuccess({ like: true, type: variables.type });
      } else {
        handleLikeSuccess(currentLike as CurrentLike);
      }
    },
  });
  const { mutateAsync: unLikePostMutate } = useMutation((values: UnLikePostInput) => unLikePost(values));

  const handleToggleLike = async () => {
    // if (currentLike?.like) {
    //   await unLikePost({
    //     variables: {
    //       likeInput: {
    //         userId: String(user?.id),
    //         postId: String(post?.id),
    //       },
    //     },
    //   });
    //   handleUnlike();
    // } else {
    //   const { data } = await createPostLike({
    //     variables: {
    //       likeInput: {
    //         post,
    //         user,
    //         type: 'like',
    //       },
    //     },
    //   });
    //   handleLikeSuccess({ like: true, type: data?.createPostLike.likes?.type });
    // }

    if (currentLike?.like) {
      await unLikePostMutate({
        userId: user?.id as string,
        postId: post?.id as string,
      });
      handleUnlike();
    } else {
      await likePostMutate({
        post: post as Post,
        user: user as User,
        type: 'like',
      });
    }
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
      <Tooltip
        placement="top"
        leaveDelay={200}
        enterDelay={100}
        title={
          <TooltipLikeItem
            user={user as User}
            post={post}
            mutationAsync={likePostMutate}
            handleLikeSuccess={handleLikeSuccess}
            typeCurrent={String(currentLike?.type)}
          />
        }
        PopperProps={{
          sx: {
            mb: 0,
          },
        }}
      >
        <Button
          onClick={handleToggleLike}
          variant="text"
          color={currentLike?.like ? 'primary' : 'inherit'}
          fullWidth
          startIcon={<HashIcon name={currentLike?.type || ''} />}
        >
          {currentLike?.type ? currentLike.type : 'Like'}
        </Button>
      </Tooltip>
      <Button variant="text" color="inherit" fullWidth startIcon={<Iconify icon="akar-icons:comment" />}>
        comments
      </Button>
      <Button variant="text" color="inherit" fullWidth startIcon={<Iconify icon="icon-park-outline:share-two" />}>
        share
      </Button>
      <Button
        variant="text"
        color="inherit"
        startIcon={<Avatar sx={{ width: 24, height: 24 }} src={user?.avatar ? user.avatar : ''} />}
        endIcon={<Iconify icon="bi:caret-down-fill" sx={{ width: 12, height: 12 }} />}
      />
    </Stack>
  );
}

const RootItemStyled = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
  display: 'flex',
  gap: theme.spacing(1),
}));

interface TooltipIemProp {
  user?: Maybe<User>;
  post?: Post;
  // eslint-disable-next-line no-unused-vars
  handleLikeSuccess: (currentLike: CurrentLike) => void;
  mutationAsync: UseMutateAsyncFunction<LikePostResponse, unknown, LikePostInput, unknown>;
  typeCurrent?: string;
}

function TooltipLikeItem({ user, post, typeCurrent, mutationAsync }: TooltipIemProp) {
  const handleLikePost = async (type: string) => {
    try {
      if (type === typeCurrent) return;
      // const { data } = await createPostLike({
      //   variables: {
      //     likeInput: {
      //       post,
      //       user,
      //       type,
      //     },
      //   },
      // });

      // const { code, currentLike, likes } = data?.createPostLike as PostLikeMutationResponse;
      await mutationAsync({ post: post as Post, user: user as User, type });

      // if (code === 201) {
      //   handleLikeSuccess({ like: true, type: likes?.type });
      // } else {
      //   handleLikeSuccess(currentLike as CurrentLike);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RootItemStyled>
      {LIST_ICON.slice(0, 2).map(({ icon, color, value }) => (
        <IconButtonAnimate
          key={icon}
          size="medium"
          sx={{ bgcolor: color, borderRadius: '100%' }}
          onClick={() => handleLikePost(value)}
        >
          <Iconify icon={icon} sx={{ width: 12, height: 12, color: (theme) => theme.palette.common.white }} />
        </IconButtonAnimate>
      ))}

      {LIST_ICON.slice(2, 5).map(({ icon, value }) => (
        <IconAnimate key={icon} sx={{ width: 28, height: 28 }} onClick={() => handleLikePost(value)}>
          <Iconify icon={icon} sx={{ width: '100%', height: '100%' }} />
        </IconAnimate>
      ))}
    </RootItemStyled>
  );
}

function HashIcon({ name }: { name?: string }) {
  const existIcon = LIST_ICON.find((item) => item.value === name);

  if (!name || !existIcon) {
    return <Iconify icon="ant-design:like-outlined" />;
  }
  return (
    <Iconify
      icon={existIcon.icon}
      sx={{
        color: existIcon.value === 'like' ? 'info.main' : 'error.main',
      }}
    />
  );
}
