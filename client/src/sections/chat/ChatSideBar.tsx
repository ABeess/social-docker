import AddIcon from '@mui/icons-material/Add';
import {
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
import MyAvatar from 'src/components/MyAvatar';
import ScrollBar from 'src/components/ScrollBar';
import TextMaxLine from 'src/components/TextMaxLine';
import { NAVBAR } from 'src/config';
import useRouter from 'src/hooks/useRouter';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setEnable } from 'src/redux/slice/enabledQuery.slice';
import { PATH_PAGE } from 'src/routes/path';
import { User } from 'src/types/Base';
import { fDistanceStrict } from 'src/utils/formatTime';
import { generateNameChat } from 'src/utils/generateNameChat';
import ChatAvatarGroup from './ChatAvatarGroup';
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
  const dispatch = useAppDispatch();

  const { data } = useQuery(['CONVERSATION', { user_id: user.id }], () => getConversation(user.id), {
    onSuccess() {
      dispatch(setEnable('CONVERSATION'));
    },
  });

  const handleSelectChat = (id: string, receiver: Array<string>) => {
    push(PATH_PAGE.message(id), {
      state: receiver,
    });
  };

  const handleAddNew = () => {
    push(PATH_PAGE.message('new'));
  };

  return (
    <RootStyled>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} pt={2}>
        <MyAvatar />
        <IconButton onClick={handleAddNew}>
          <AddIcon />
        </IconButton>
      </Stack>

      <ChatSearch />

      <ScrollBar sx={{ flex: 1, py: 1, px: 1 }}>
        <List>
          {data?.conversations?.map((item, index) => {
            const { participants, id, title, type, lastMessage, lastSendUser, updatedAt, owner } = item;
            const active = id === params.to;
            const receiver: Array<string> = participants.map(({ user }) => user.id);

            const { avatarGroup, name } = generateNameChat({
              participants,
              type,
              title,
              owner,
              currentUserId: user.id,
            });

            return (
              <ListItemButton
                key={index}
                sx={{ borderRadius: 1, ...(active && { bgcolor: (theme) => theme.palette.action.hover }) }}
                onClick={() => handleSelectChat(id, receiver)}
              >
                <ListItemAvatar>
                  <ChatAvatarGroup type={type} mainAvatar={avatarGroup} subAvatar={user.avatar} />
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
      </ScrollBar>
    </RootStyled>
  );
}
