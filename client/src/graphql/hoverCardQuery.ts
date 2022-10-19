import { gql } from 'graphql-request';

export const HOVER_CARD = gql`
  query HoverCard($userId: String!) {
    hoverCard(userId: $userId) {
      isFriend
      user {
        id
        avatar
        firstName
        lastName
        createdAt
        profile {
          id
          dayOfBirth
          gender
          liveAt
          phoneNumber
          district
          province
        }
      }
    }
  }
`;
