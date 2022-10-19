/* eslint-disable no-constant-condition */
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import { addFriend, getFriendShipRecommend } from 'src/api/friendship.api';
import Image from 'src/components/Image';
import FriendSkeleton from 'src/components/skeleton/FriendSkeleton';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { updateFriendWaiting } from 'src/redux/slice/friendWaiting.slice';
import { loadDataRecommend, updateUserRecommend } from 'src/redux/slice/userRecommend.slice';
import { User } from 'src/types/Base';
import { AddFriendInput } from 'src/types/InputValue';
import { fDistanceToNow } from 'src/utils/formatTime';

interface ILoading {
  [key: string]: boolean;
}

export default function RecommendFriend() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<ILoading>({});

  // const { data, loading } = useFriendShipRecommendQuery({
  //   variables: {
  //     userId: String(user?.id),
  //   },
  // });

  const { users } = useAppSelector((state) => state.userRecommend);

  useQuery(
    ['FRIEND_RECOMMEND', { userId: user?.id }],
    () =>
      getFriendShipRecommend({
        userId: user?.id as string,
        query: {
          limit: 5,
          page: 0,
        },
      }),
    {
      onSuccess(data) {
        dispatch(loadDataRecommend(data));
      },
    }
  );

  const { mutateAsync, isLoading: loadingMutation } = useMutation((values: AddFriendInput) => addFriend(values));

  // useEffect(() => {
  //   if (data) {
  //     dispatch(loadDataRecommend(data.friendShipRecommend));
  //   }
  // }, [data]);

  useEffect(() => {
    if (!loadingMutation) {
      setIsLoading({});
    }
  }, [loadingMutation]);

  const handleSendFriend = async (addressee: User) => {
    try {
      setIsLoading({ [String(addressee.id)]: true });

      await mutateAsync({
        addressee,
        requester: user as User,
        type: 'requested',
      });

      dispatch(
        updateFriendWaiting({
          accepted: false,
          addressee,
          requester: user,
        })
      );
      dispatch(updateUserRecommend({ id: addressee.id }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box>
        <Typography variant="h6" mb={2}>
          Recommend friends
        </Typography>

        <Grid container spacing={2}>
          {true
            ? users?.map((item, index) => (
                <Grid key={index} xs={2}>
                  <Card>
                    <Image src={item?.avatar || ''} ratio="6/4" />
                    <Box p={1}>
                      <Typography variant="subtitle1">{capitalCase(`${item?.firstName} ${item?.lastName}`)}</Typography>
                      <Typography variant="caption">{fDistanceToNow(item?.createdAt)}</Typography>
                      <Stack spacing={1} mt={2}>
                        <LoadingButton
                          loading={isLoading[String(item.id)]}
                          variant="contained"
                          size="small"
                          fullWidth
                          onClick={() => handleSendFriend(item)}
                        >
                          Add friend
                        </LoadingButton>

                        <Button
                          size="small"
                          color="inherit"
                          fullWidth
                          sx={{
                            bgcolor: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 300 : 700],
                          }}
                        >
                          View profile
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))
            : [...Array(6)].map((_, index) => (
                <Grid key={index} xs={2}>
                  <FriendSkeleton />
                </Grid>
              ))}
        </Grid>
      </Box>
    </>
  );
}
