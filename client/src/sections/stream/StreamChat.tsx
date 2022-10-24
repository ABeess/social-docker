import { Box, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getStreamChat, sendStreamChat } from 'src/api/stream.api';
import { MoreVertIcon } from 'src/components/icons';
import ScrollBar from 'src/components/ScrollBar';
import useRouter from 'src/hooks/useRouter';
import useSocket from 'src/hooks/useSocket';
import { useAppSelector } from 'src/redux/hooks';
import { StreamsChat, User } from 'src/types/Base';
import { SendStreamChatInput } from 'src/types/InputValue';
import { GetStreamChatResponse } from 'src/types/Response';
import StreamChatInput from './StreamChatInput';
import StreamChatItem from './StreamChatItem';

const RootStyled = styled(Card)(() => ({
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
}));

const HeaderStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ContentStyled = styled('div')(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1, 2),
  paddingRight: 0,
  position: 'absolute',
  inset: 0,
  top: 64,
  bottom: 64,
}));

export default function StreamChat() {
  const [message, setMessage] = useState('');
  const user = useAppSelector((state) => state.auth.user) as User;

  const refScroll = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (refScroll.current) {
      refScroll?.current.scrollIntoView({
        block: 'end',
      });
    }
  };

  const { query } = useRouter();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation((values: SendStreamChatInput) => sendStreamChat(values), {
    onMutate() {
      setMessage('');
    },
    onSuccess() {
      handleScroll();
    },
  });

  const handleSendChat = async () => {
    if (query.target_id) {
      await mutateAsync({
        message,
        streamId: query.target_id as string,
        user,
      });
    }
  };

  const socketStreamChat = useSocket<StreamsChat>('STREAM_CHAT');

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const { data, isLoading } = useQuery(
    ['STREAM_CHAT', { target_id: query.target_id }],
    () => getStreamChat(query.target_id as string),
    {
      enabled: !!query.target_id,
    }
  );

  useEffect(() => {
    if (socketStreamChat) {
      const prevQuery = queryClient.getQueryData<GetStreamChatResponse>([
        'STREAM_CHAT',
        { target_id: query.target_id },
      ]) as GetStreamChatResponse;

      queryClient.setQueryData<GetStreamChatResponse>(['STREAM_CHAT', { target_id: query.target_id }], {
        ...prevQuery,
        streamChats: [...prevQuery?.streamChats, socketStreamChat],
      });
      handleScroll();
    }
  }, [socketStreamChat]);

  useEffect(() => {
    handleScroll();
  }, [data]);

  return (
    <RootStyled>
      <HeaderStyled>
        <Typography variant="h6">Top Chat</Typography>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </HeaderStyled>

      <ContentStyled>
        <ScrollBar>
          <Stack spacing={2}>
            {!isLoading &&
              data?.streamChats.map(({ id, user, message }) => (
                <StreamChatItem key={id} sender={user} message={message} />
              ))}
            <Box ref={refScroll} sx={{ height: 2 }} />
          </Stack>
        </ScrollBar>
      </ContentStyled>

      <StreamChatInput onChange={handleOnchange} sendSubmit={handleSendChat} setValue={setMessage} value={message} />
    </RootStyled>
  );
}
