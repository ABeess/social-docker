import { IconButton, ListItemText, Stack, styled, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CallRoundedIcon, MoreHorizIcon, VideocamRoundedIcon } from 'src/components/icons';
import ChatHeaderSkeleton from 'src/components/skeleton/ChatHeaderSkeleton';
import useRouter from 'src/hooks/useRouter';
import { useAppSelector } from 'src/redux/hooks';
import { Conversation, User } from 'src/types/Base';
import { ConversationResponse } from 'src/types/Response';
import { fDistanceStrict } from 'src/utils/formatTime';
import { generateNameChat } from 'src/utils/generateNameChat';
import ChatAvatarGroup from './ChatAvatarGroup';
import ChatNew from './ChatNew';

interface UserStateType {
  messageName: string;
  avatarGroup: string;
  type: 'private' | 'groups';
}

function AvatarHeader() {
  const currentUser = useAppSelector((state) => state.auth.user) as User;
  const { params } = useRouter();
  const [userData, setUserData] = useState<UserStateType>({
    messageName: '',
    type: 'private',
    avatarGroup: '',
  });

  const queryClient = useQueryClient();
  const enabled = useAppSelector((state) => state.enableQuery);

  useEffect(() => {
    if (enabled['CONVERSATION'] && params.to !== 'new') {
      const currentConversation = queryClient
        .getQueryData<ConversationResponse>(['CONVERSATION', { user_id: currentUser.id }])
        ?.conversations.find((conversation) => conversation.id === params.to) as Conversation;

      if (!currentConversation) return;
      const { participants, type, owner } = currentConversation;

      const { avatarGroup, name } = generateNameChat({
        type,
        owner,
        participants,
        currentUserId: currentUser.id,
      });

      setUserData((prev) => ({ ...prev, messageName: name, type, avatarGroup }));
    }
  }, [params.to, enabled['CONVERSATION']]);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <ChatAvatarGroup type={userData.type} mainAvatar={userData.avatarGroup} subAvatar={currentUser.avatar} />
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {userData.messageName}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {fDistanceStrict(new Date('2022-10-09T03:42:08.550Z'))}
          </Typography>
        }
      />
    </Stack>
  );
}

const ChatHeaderStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

interface ChatHeaderProp {
  loading?: boolean;
}

export default function ChatHeader({ loading }: ChatHeaderProp) {
  const { params } = useRouter();
  return (
    <ChatHeaderStyled>
      {params.to !== 'new' ? (
        <>
          {loading ? <ChatHeaderSkeleton /> : <AvatarHeader />}
          <Stack direction="row" spacing={0.5}>
            <IconButton>
              <CallRoundedIcon />
            </IconButton>

            <IconButton>
              <VideocamRoundedIcon />
            </IconButton>

            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </Stack>
        </>
      ) : (
        <ChatNew />
      )}
    </ChatHeaderStyled>
  );
}
