import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  capitalize,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getConversation } from 'src/api/message.api';
import Iconify from 'src/components/Iconify';
import MyAvatar from 'src/components/MyAvatar';
import ScrollBar from 'src/components/ScrollBar';
import TextMaxLine from 'src/components/TextMaxLine';
import { NAVBAR } from 'src/config';
import useRouter from 'src/hooks/useRouter';
import { useAppSelector } from 'src/redux/hooks';
import { PATH_PAGE } from 'src/routes/path';
import { User } from 'src/types/Base';
import { fDistanceStrict } from 'src/utils/formatTime';
import ChatSearch from './ChatSearch';

const RootStyled = styled('div')(({ theme }) => ({
  width: NAVBAR.NAV_DESKTOP_WIDTH,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  height: '100%',
  borderRight: `1px dashed ${theme.palette.divider}`,
  position: 'relative',
}));

export default function ChatSideBar() {
  const user = useAppSelector((state) => state.auth.user) as User;
  const { push, params } = useRouter();

  const { data } = useQuery(['CONVERSATION', { user_id: user.id }], () => getConversation(user.id));

  const handleSelectChat = (id: string, receiver: Array<User>) => {
    push(PATH_PAGE.message(id), {
      state: {
        receiver,
      },
    });
  };

  return (
    <RootStyled>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} pt={2}>
        <MyAvatar />
        <IconButton>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
      </Stack>

      <ChatSearch />

      <ScrollBar sx={{ position: 'absolute', inset: 0, top: 0 }}>
        <Box sx={{ px: 1 }}>
          <List>
            {data?.conversations?.map((item, index) => {
              const { participants, id, title, type, lastMessage, lastSendUser, updatedAt } = item;

              const newUser = participants.find((item) => item.user.id !== user.id);

              console.log(lastSendUser);
              const active = id === params.to;
              const receiver: Array<User> = participants.map((item) => item.user);
              const name = title
                ? title
                : type === 'groups'
                ? participants.reduce((prev, acc) => `${prev} ${acc.user.firstName} ${acc.user.lastName},`, '')
                : `${newUser?.user.firstName} ${newUser?.user.lastName}`;

              const avatar = participants.reduce((_, acc) => acc.user.avatar as string, '');
              return (
                <ListItemButton
                  key={index}
                  sx={{ borderRadius: 1, ...(active && { bgcolor: (theme) => theme.palette.action.hover }) }}
                  onClick={() => handleSelectChat(id, receiver)}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        type === 'groups' ? (
                          <AvatarGroup>
                            <Avatar src={avatar || ''} sx={{ width: 24, height: 24 }} />
                          </AvatarGroup>
                        ) : (
                          <></>
                        )
                      }
                    >
                      <Avatar src={participants[0].user.avatar || ''} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <TextMaxLine line={1} variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        {name}
                      </TextMaxLine>
                    }
                    secondary={
                      <TextMaxLine line={1} variant="caption">
                        {lastMessage && lastSendUser?.id === user.id
                          ? 'you: ' + lastMessage
                          : capitalize(`${lastSendUser?.firstName} ${lastSendUser?.lastName}: `) + lastMessage || ''}
                      </TextMaxLine>
                    }
                  />
                  <ListItemText
                    sx={{ flex: '0 0 auto', ml: 2 }}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {fDistanceStrict(updatedAt)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </ScrollBar>
    </RootStyled>
  );
}
