import { useState } from 'react';

import FriendCard from './FriendCard';

import { Box, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { flatten } from 'lodash';
import { addFriend, getFriendShipRequest } from 'src/api/friendship.api';
import FriendSkeleton from 'src/components/skeleton/FriendSkeleton';
import { useAppSelector } from 'src/redux/hooks';
import { User } from 'src/types/Base';
import { AddFriendInput } from 'src/types/InputValue';
import { FriendShipRequestResponse } from 'src/types/Response';

export interface AcceptType {
  requester: User;
  id: string;
}

export default function FriendRequest() {
  const user = useAppSelector((state) => state.auth.user);

  // const { data, loading } = useFriendRequestQuery({
  //   variables: {
  //     userId: String(user?.id),
  //   },
  // });

  const [friendState, setFriendState] = useState<Pick<FriendShipRequestResponse, 'friendRequest'>>({
    friendRequest: [],
  });

  const { friendRequest } = friendState;

  const { isLoading } = useInfiniteQuery(
    ['FRIEND_REQUEST', { userId: user?.id }],
    ({ pageParam }) =>
      getFriendShipRequest({
        query: {
          limit: 10,
          page: pageParam,
        },
        userId: user?.id as string,
      }),
    {
      getNextPageParam: ({ page, totalPage }) => (page < totalPage - 1 ? page + 1 : undefined),
      onSuccess(data) {
        if (data) {
          setFriendState((prev) => ({ ...prev, friendRequest: flatten(data.pages.map((page) => page.friendRequest)) }));
        }
      },
    }
  );

  // useEffect(() => {
  //   if (data) {
  //     setFriendState(data.getFriendRequest as FriendShipRequestResponse);
  //   }
  // }, [data]);

  // const [acceptFriend] = useAddFriendRequestMutation();

  const { mutateAsync: acceptFriend } = useMutation((values: AddFriendInput) => addFriend(values));

  const handleAccepted = async ({ requester, id }: AcceptType) => {
    try {
      console.log(requester, id);

      await acceptFriend({
        addressee: requester,
        requester: user as User,
        type: 'accepted',
      });
      // await acceptFriend({
      //   variables: {
      //     data: {
      //       addressee: requester,
      //       requester: user,
      //       type: 'accepted',
      //     },
      //   },
      // });
      setFriendState((prev) => ({
        ...prev,
        friendRequest: prev.friendRequest?.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box>
        <Typography variant="h6" mb={2}>
          Friend request
        </Typography>
        <Grid container spacing={2}>
          {!isLoading
            ? friendRequest?.map((item, index) => (
                <Grid key={index} xs={2}>
                  <FriendCard accept friendship={item} onAccepted={handleAccepted} />
                </Grid>
              ))
            : [...Array(6)].map((_, index) => (
                <Grid key={index} xs={2}>
                  <FriendSkeleton />
                </Grid>
              ))}
        </Grid>
        <Divider sx={{ my: 4 }} />
      </Box>
    </>
  );
}
