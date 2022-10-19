import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { capitalCase } from 'change-case';
import { flatten, isEmpty } from 'lodash';
import { MouseEvent, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getNotification, markAsReadNotification } from 'src/api/notification.api';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import Iconify from 'src/components/Iconify';
import { NotificationsIcon } from 'src/components/icons';
import Popover from 'src/components/Popover';
import NotificationSkeleton from 'src/components/skeleton/NotificationSkeleton';
import TextMaxLine from 'src/components/TextMaxLine';
import useRouter from 'src/hooks/useRouter';
import { useAppSelector } from 'src/redux/hooks';
import { PATH_DASHBOARD } from 'src/routes/path';
import { Notification } from 'src/types/Base';
import { MaskAsReadInput } from 'src/types/InputValue';
import { NotificationQueryResponse } from 'src/types/Response';
import { fDistanceToNow } from 'src/utils/formatTime';
import socket from 'src/utils/socket';

const NotificationPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const user = useAppSelector((state) => state.auth.user);

  const { push } = useRouter();

  const [ref, inView] = useInView();

  const [notificationState, setNotificationState] = useState<
    Pick<NotificationQueryResponse, 'notifications' | 'totalUnread'>
  >({
    totalUnread: 0,
  });

  const { notifications, totalUnread } = notificationState;

  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } = useInfiniteQuery(
    ['NOTIFICATION', { owner: user?.id }],
    async ({ pageParam = 0 }) =>
      await getNotification({ query: { page: pageParam, limit: 5 }, ownerId: user?.id as string }),
    {
      getNextPageParam: ({ page, totalPage }) => (Number(page) < Number(totalPage) - 1 ? Number(page) + 1 : undefined),
      onSuccess(data) {
        const lastData = data.pages.slice(-1).pop();
        if (!isEmpty(data)) {
          setNotificationState(() => ({
            totalUnread: lastData?.totalUnread as number,
            notifications: flatten(data.pages.map((page) => page.notifications)) as Notification[],
          }));
        }
      },
    }
  );
  useEffect(() => {
    socket.on('NOTIFICATION', (response: Notification) => {
      console.log(response);
      setNotificationState((prev) => ({
        ...prev,
        totalUnread: prev.totalUnread + 1,
        notifications: [response as Notification, ...(prev.notifications as Notification[])],
      }));
    });
  }, []);

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView]);

  const { mutateAsync } = useMutation((data: MaskAsReadInput) => markAsReadNotification(data));

  const handleSingleUnread = async ({ read, id, type, requester }: Notification) => {
    try {
      if (!read) {
        await mutateAsync({
          notificationId: id,
          type: 'single',
          ownerId: user?.id as string,
        });

        setNotificationState((prev) => ({
          ...prev,
          notifications: prev.notifications?.map((notification) =>
            notification?.id === id ? { ...notification, read: true } : notification
          ),
          totalUnread: prev.totalUnread - 1,
        }));
      }

      if (type === 'Friend request') {
        push(PATH_DASHBOARD.lookingFriend);
        handleClosePopover();
      }

      if (type === 'Friend accepted') {
        push(PATH_DASHBOARD.profile(requester.id as string));
        handleClosePopover();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMultipleUnread = async () => {
    try {
      if (totalUnread > 0) {
        await markAsReadNotification({
          type: 'multiple',
          ownerId: user?.id as string,
        });

        setNotificationState((prev) => ({
          ...prev,
          notifications: prev.notifications?.map((notification) => ({ ...notification, read: true })),
          totalUnread: 0,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpenPopover}>
        <Badge badgeContent={totalUnread} color="error">
          {/* <Iconify icon="ooui:bell" sx={{ width: 22, height: 22 }} /> */}
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClosePopover} sx={{ maxHeight: 600 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, pb: 1 }}>
          <Box>
            <Typography variant="subtitle1">Notification</Typography>
            <Typography variant="caption">{`You have ${totalUnread} unread messages`}</Typography>
          </Box>
          <IconButtonAnimate size="small" onClick={handleMultipleUnread}>
            <Iconify icon="charm:tick-double" />
          </IconButtonAnimate>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <List disablePadding>
          {!isLoading && !isEmpty(data) ? (
            notifications?.map((notification) => {
              const { id, content, createdAt, requester, read } = notification;
              return (
                <ListItemButton
                  key={id}
                  onClick={() => handleSingleUnread(notification)}
                  sx={{ ...(!read && { bgcolor: (theme) => theme.palette.divider }) }}
                >
                  <ListItemAvatar>
                    <Avatar src={requester.avatar || ''} />
                  </ListItemAvatar>

                  <ListItemText>
                    <TextMaxLine line={2} variant="subtitle2">
                      {capitalCase(`${requester.firstName} ${requester.lastName}`)}
                      <Typography variant="body2" component="span" ml={0.5}>
                        {content}
                      </Typography>
                    </TextMaxLine>
                    <Typography variant="caption">{fDistanceToNow(createdAt)}</Typography>
                  </ListItemText>
                </ListItemButton>
              );
            })
          ) : (
            <NotificationSkeleton sx={{ px: 2, py: 1 }} />
          )}

          {!isLoading && hasNextPage && <NotificationSkeleton sx={{ px: 2, py: 1 }} ref={ref} />}
        </List>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            sx={{
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
