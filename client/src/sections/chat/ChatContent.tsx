import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItemText,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalCase } from 'change-case';
// import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getFriends } from 'src/api/friendship.api';
import { createConversation, getListChat, sendMessage } from 'src/api/message.api';
import Iconify from 'src/components/Iconify';
import ScrollBar from 'src/components/ScrollBar';
import useRouter from 'src/hooks/useRouter';
import { useAppSelector } from 'src/redux/hooks';
import { PATH_PAGE } from 'src/routes/path';
import { Message, User } from 'src/types/Base';
import { CreateConversationInput, SendChatInput } from 'src/types/InputValue';
import { ConversationResponse, ListChatResponse } from 'src/types/Response';
import { fDistanceStrict } from 'src/utils/formatTime';
import socket from 'src/utils/socket';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';

const RootStyled = styled('div')(() => ({
  flex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatHeaderStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

const ContentStyled = styled('div')(() => ({
  flex: 1,
  position: 'relative',
}));

export default function ChatContent() {
  const user = useAppSelector((state) => state.auth.user) as User;

  const [hashNew, setHashNew] = useState(false);

  const { params, push } = useRouter();

  const { state } = useLocation() as {
    state: {
      receiver: Array<User>;
    };
  };

  const queryClient = useQueryClient();

  const [listReceiver, setListReceiver] = useState<Array<string>>([]);

  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('PRIVATE_CHAT', (response: Message) => {
      console.log(response);
      const prevData = queryClient.getQueryData<ListChatResponse>([
        'LIST_CHAT',
        { conversion_id: response.conversation.id },
      ]) as ListChatResponse;

      queryClient.setQueryData<ListChatResponse>(['LIST_CHAT', { conversion_id: response.conversation.id }], {
        ...prevData,
        chats: [...prevData?.chats, response],
      });
    });
  }, []);

  useEffect(() => {
    if (params) {
      setHashNew(params.to === 'new');
    }
  }, [params]);

  const handleSelectAction = (_: SyntheticEvent<Element, Event>, value: User[]) => {
    setListReceiver(value.map((user) => user.id));
  };

  const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const { data: friendQuery, isLoading } = useQuery(
    ['RECEIVER_SELECT', { path: params.to }],
    () => getFriends(user?.id),
    {
      enabled: params.to === 'new',
    }
  );

  const { data: listChatQuery } = useQuery(
    ['LIST_CHAT', { conversion_id: params.to }],
    () => getListChat(params.to as string),
    {
      enabled: params.to !== 'new',
    }
  );

  // const [sendMessage] = useSendMessageMutation();

  const { mutateAsync: createConversationMutate } = useMutation(
    (values: CreateConversationInput) => createConversation(values),
    {
      onSuccess(data) {
        console.log(data);
      },
    }
  );

  // useEffect(() => {
  //   if (!hashNew && ref.current) {
  //     ref.current?.scrollIntoView({
  //       behavior: 'smooth',
  //     });
  //   }
  // }, [listChatQuery]);

  const { mutateAsync: sendMessageMutate } = useMutation((values: SendChatInput) => sendMessage(values));

  const handleSendMessage = async () => {
    try {
      if (params.to === 'new') {
        const response = await createConversationMutate({
          receiverId: listReceiver,
          senderId: user.id,
        });

        console.log(response);

        await sendMessageMutate({
          sender: user,
          receiveId: listReceiver,
          message,
          conversationId: response.conversation.id,
        });

        if (response.code === 201) {
          const prevConversationQuery = queryClient.getQueryData<ConversationResponse>([
            'CONVERSATION',
            { user_id: user.id },
          ]) as ConversationResponse;

          queryClient.setQueryData<ConversationResponse>(['CONVERSATION', { user_id: user.id }], {
            ...prevConversationQuery,
            conversations: [
              {
                ...response.conversation,
                lastMessage: message,
                lastSendUser: user,
              },
              ...prevConversationQuery.conversations,
            ],
          });
        }

        push(PATH_PAGE.message(response.conversation.id), {
          state: {
            receiver: response.conversation.receiver.map((user) => user.id),
          },
        });
      } else {
        await sendMessageMutate({
          message,
          conversationId: params.to as string,
          sender: user,
          receiveId: state.receiver.map((user) => user.id),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <RootStyled>
      <ChatHeaderStyled>
        {!hashNew ? (
          <>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={state?.receiver[0]?.avatar || ''} sx={{ width: 45, height: 45 }} />
              <ListItemText
                primary={
                  <Typography variant="subtitle1">{`${state?.receiver[0].firstName} ${state?.receiver[0].lastName}`}</Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {fDistanceStrict(new Date('2022-10-09T03:42:08.550Z'))}
                  </Typography>
                }
              />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <IconButton>
                <Iconify icon="fluent:call-28-filled" sx={{ height: 18 }} />
              </IconButton>

              <IconButton>
                <Iconify icon="bi:camera-video-fill" height={14} />
              </IconButton>

              <IconButton>
                <Iconify icon="fluent:more-horizontal-16-filled" />
              </IconButton>
            </Stack>
          </>
        ) : (
          <Stack direction="row" sx={{ width: 1 }} alignItems="center" spacing={1}>
            <Typography
              variant="subtitle2"
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              Send To:
            </Typography>
            <Autocomplete
              multiple
              fullWidth
              disableClearable={true}
              loading={isLoading}
              popupIcon=""
              sx={{
                '& 	.MuiAutocomplete-tag': {
                  my: 0,
                },
              }}
              options={friendQuery?.friends || []}
              onChange={handleSelectAction}
              filterSelectedOptions
              getOptionLabel={(option) => capitalCase(`${option?.firstName} ${option?.lastName}`) || ''}
              renderTags={(value: User[], getTagProps) =>
                value.map((option: User, index: number) => (
                  <Box key={option.id}>
                    <Chip
                      variant="filled"
                      sx={{ my: 0 }}
                      label={capitalCase(`${option?.firstName} ${option?.lastName}`)}
                      {...getTagProps({ index })}
                    />
                  </Box>
                ))
              }
              renderOption={(prop, option) => (
                <Box component="li" {...prop}>
                  <Avatar src={user?.avatar || ''} sx={{ width: 35, height: 35 }} />
                  <Typography variant="body1" color="text.secondary" ml={1}>
                    {capitalCase(`${option?.firstName} ${option?.lastName}`)}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
            />
          </Stack>
        )}
      </ChatHeaderStyled>

      <ContentStyled>
        <ChatInput onChange={handleOnchange} value={message} setValue={setMessage} sendSubmit={handleSendMessage} />
        <ScrollBar
          sx={{
            height: 'calc(75vh - 168px)',
            px: 2,
          }}
        >
          {listChatQuery &&
            listChatQuery?.chats.map((item, index) => (
              <ChatItem key={index} data={item} reply={item.sender.id !== user?.id} />
            ))}
          {/* <Box ref={ref} sx={{ height: '2px' }} /> */}
        </ScrollBar>
      </ContentStyled>
    </RootStyled>
  );
}
