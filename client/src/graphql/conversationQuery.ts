import { gql } from 'graphql-request';

export const GET_CONVERSATION = gql`
  query GetConversation($userId: String!) {
    getConversations(userId: $userId) {
      code
      message
      conversations {
        id
        title
        type
        lastMessage
        updatedAt
        lastSendUser {
          id
          firstName
          lastName
          avatar
          createdAt
        }
        receiver {
          id
        }
        participants {
          id
          seen
          totalUnSeen
          user {
            id
            firstName
            lastName
            avatar
            createdAt
          }
        }
      }
    }
  }
`;
