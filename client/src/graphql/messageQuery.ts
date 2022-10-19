import { gql } from 'graphql-request';

export const CREATE_CONVERSATION = gql`
  mutation CreateConversion($data: CreateConversationInput!) {
    createConversation(data: $data) {
      code
      message
      __typename
      conversation {
        id
        title
        type
        updatedAt
        __typename
        receiver {
          id
        }
        participants {
          id
          user {
            id
            firstName
            lastName
            avatar
            createdAt
            __typename
          }
        }
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendChat($data: SendChatInput!) {
    sendMessage(data: $data)
  }
`;

export const LIST_CHAT_SIDEBAR = gql`
  query ListChatSideBar($userId: String!) {
    listSideBar(userId: $userId) {
      code
      message
      sidebar {
        id
        lastMessage
        createdAt
        seen
        totalUnSeen
        updatedAt
        user {
          id
          avatar
          firstName
          lastName
          createdAt
        }
        lastSendUser {
          id
          avatar
          firstName
          lastName
          createdAt
        }
        conversation {
          id
          createdAt
        }
      }
    }
  }
`;

export const GET_CHATS = gql`
  query GetChat($conversionId: String!) {
    getChats(conversionId: $conversionId) {
      code
      message
      chats {
        id
        message
        createdAt
        sender {
          id
          firstName
          lastName
          avatar
          createdAt
        }
      }
    }
  }
`;
