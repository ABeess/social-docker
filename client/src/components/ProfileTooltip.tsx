import { Avatar, Box, Button, Stack, Tooltip, TooltipProps, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { capitalCase } from 'change-case';
import { ReactElement, useEffect, useState } from 'react';
import { hoverCardQuery } from 'src/api/hoverCard.api';
import { useAppSelector } from 'src/redux/hooks';
import { fDistanceToNow } from 'src/utils/formatTime';
import ButtonText from './ButtonText';
import Iconify from './Iconify';
import ProfileHoverSkeleton from './skeleton/ProfileHoverSkeleton';

interface ProfileTooltipProp extends Partial<TooltipProps> {
  children: ReactElement;
  userId: string;
}

const ProfileTooltip = ({ children, placement = 'top-end', userId, sx, ...other }: ProfileTooltipProp) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Tooltip
      title={<ProfileItem userId={userId} open={open} />}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      enterDelay={400}
      leaveDelay={100}
      placement={placement}
      {...other}
      sx={{
        maxWidth: 600,
        '& :nth-of-type(1)': {
          cursor: 'pointer',
        },
        ...sx,
      }}
    >
      <Box>{children}</Box>
    </Tooltip>
  );
};

interface ProfileItemProp {
  userId: string;
  open: boolean;
}

function ProfileItem({ userId, open }: ProfileItemProp) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const { data, isLoading } = useQuery(['HOVER_CARD', { userId }], () => hoverCardQuery(userId), {
    enabled: !!open,
  });

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (data) {
      setIsOwner(currentUser?.id === data.user?.id);
    }
  }, [open, data]);

  if (isLoading) {
    return (
      <Box p={1}>
        <ProfileHoverSkeleton />
      </Box>
    );
  }

  return (
    <>
      {data && !isLoading && (
        <Stack p={1} sx={{ width: 'fit-content' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={data?.user?.avatar || ''} />
            <Box>
              <Typography variant="subtitle1">
                {capitalCase(`${data?.user?.firstName} ${data?.user?.lastName}`)}
              </Typography>
              <Typography variant="caption">Embark {fDistanceToNow(data?.user.createdAt)}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} mt={2} justifyContent="center">
            {!isOwner ? (
              <>
                <ButtonText
                  color="inherit"
                  sx={{ px: 2 }}
                  size="medium"
                  startIcon={
                    <Iconify icon={data?.isFriend ? 'bi:person-check-fill' : 'ant-design:user-add-outlined'} />
                  }
                >
                  {data?.isFriend ? 'friend' : 'Add friend'}
                </ButtonText>
                <Button
                  variant="contained"
                  startIcon={
                    <Iconify icon={data?.isFriend ? 'ant-design:message-outlined' : 'healthicons:ui-user-profile'} />
                  }
                >
                  {data?.isFriend ? 'Message' : 'View Profile'}
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<Iconify icon="healthicons:ui-user-profile" />}>
                Edit Profile
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default ProfileTooltip;
