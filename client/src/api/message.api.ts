import { GET_CONVERSATION } from 'src/graphql/conversationQuery';
import { CREATE_CONVERSATION, GET_CHATS, LIST_CHAT_SIDEBAR, SEND_MESSAGE } from 'src/graphql/messageQuery';
import { CreateConversationInput, SendChatInput } from 'src/types/InputValue';
import { CreateConversationMutation } from 'src/types/MutationResponse';
import { ConversationQuery, ListChatQuery, ListChatSideBarQuery } from 'src/types/QueryResponse';
import app from 'src/utils/graphqlRequest';

export const getConversation = async (userId: string) => {
  const { getConversations }: ConversationQuery = await app.request(GET_CONVERSATION, {
    userId,
  });
  return getConversations;
};

export const createConversation = async (data: CreateConversationInput) => {
  const response: CreateConversationMutation = await app.request(CREATE_CONVERSATION, {
    data,
  });
  return response.createConversation;
};

export const sendMessage = async (data: SendChatInput) =>
  await app.request(SEND_MESSAGE, {
    data,
  });

export const getListChatSideBar = async (userId: string) => {
  const response: ListChatSideBarQuery = await app.request(LIST_CHAT_SIDEBAR, {
    userId,
  });
  return response.listSideBar;
};

export const getListChat = async (conversionId: string) => {
  const { getChats }: ListChatQuery = await app.request(GET_CHATS, {
    conversionId,
  });

  return getChats;
};
