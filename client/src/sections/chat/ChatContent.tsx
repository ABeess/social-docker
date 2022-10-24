import { Box, styled } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createConversation, getListChat, sendMessage } from 'src/api/message.api';
import ScrollBar from 'src/components/ScrollBar';
import useRouter from 'src/hooks/useRouter';
import useSocket from 'src/hooks/useSocket';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setEnable } from 'src/redux/slice/enabledQuery.slice';
import { resetReceiver } from 'src/redux/slice/receiver.slice';
import { PATH_PAGE } from 'src/routes/path';
import { Message, User } from 'src/types/Base';
import { CreateConversationInput, SendChatInput } from 'src/types/InputValue';
import { ConversationResponse, ListChatResponse } from 'src/types/Response';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';

const RootStyled = styled('div')(() => ({
  flex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentStyled = styled('div')(() => ({
  flex: 1,
  position: 'relative',
}));

export default function ChatContent() {
  const user = useAppSelector((state) => state.auth.user) as User;
  const receiverList = useAppSelector((state) => state.receiver);
  const dispatch = useAppDispatch();

  const { params, push } = useRouter();

  const ref = useRef<HTMLElement>(null);

  const { state } = useLocation() as {
    state: Array<string>;
  };

  const queryClient = useQueryClient();

  const [message, setMessage] = useState('');

  const socketData = useSocket<Message>('PRIVATE_CHAT') as Message;

  const handleScroll = () => {
    if (ref.current) {
      ref?.current.scrollIntoView({
        block: 'end',
      });
    }
  };

  useEffect(() => {
    if (socketData) {
      const prevData = queryClient.getQueryData<ListChatResponse>([
        'LIST_CHAT',
        { conversion_id: socketData.conversation.id },
      ]) as ListChatResponse;
      if (!prevData) return;
      queryClient.setQueryData<ListChatResponse>(['LIST_CHAT', { conversion_id: socketData.conversation.id }], {
        ...prevData,
        chats: [...prevData?.chats, socketData],
      });
    }
  }, [socketData]);

  const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const { data: listChatQuery, isLoading: loadingListChat } = useQuery(
    ['LIST_CHAT', { conversion_id: params.to }],
    () => getListChat(params.to as string),
    {
      enabled: params.to !== 'new',
    }
  );

  const { mutateAsync: createConversationMutate } = useMutation(
    (values: CreateConversationInput) => createConversation(values),
    {
      onSuccess(data) {
        console.log(data);
      },
    }
  );

  const { mutateAsync: sendMessageMutate, isLoading: sendLoading } = useMutation(
    (values: SendChatInput) => sendMessage(values),

    {
      onMutate() {
        setMessage('');
      },
      onSuccess() {
        handleScroll();
      },
    }
  );

  const handleSendMessage = async () => {
    try {
      if (!message) return;

      if (params.to === 'new') {
        const response = await createConversationMutate({
          receiverId: receiverList,
          senderId: user.id,
        });
        await sendMessageMutate({
          sender: user,
          receiveId: receiverList,
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
          state: response.conversation.receiver.map((user) => user.id),
        });
        dispatch(setEnable('CONVERSATION'));
        dispatch(resetReceiver());
      } else {
        await sendMessageMutate({
          message,
          conversationId: params.to as string,
          sender: user,
          receiveId: state,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [ref.current, listChatQuery]);

  return (
    <RootStyled>
      <ChatHeader loading={loadingListChat} />

      <ContentStyled>
        <ChatInput
          onChange={handleOnchange}
          value={message}
          setValue={setMessage}
          sendSubmit={handleSendMessage}
          loading={sendLoading}
          // sx={{
          //   position: 'absolute',
          // }}
        />
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
          {!loadingListChat && <Box ref={ref} sx={{ height: '2px' }} />}
        </ScrollBar>
      </ContentStyled>
    </RootStyled>
  );
}
