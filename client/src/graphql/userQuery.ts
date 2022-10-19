import { gql } from 'graphql-request';

export const GET_PROFILE_USER = gql`
  query GetProfileUser($userId: String!) {
    getProfileUser(userId: $userId) {
      code
      message
      __typename
      user {
        id
        avatar
        email
        firstName
        lastName
        createdAt
        updatedAt
        __typename
        profile {
          id
          gender
          dayOfBirth
          district
          liveAt
          phoneNumber
          province
          story
          thumbnail
          createdAt
          __typename
        }
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UserProfileInput!) {
    updateProfile(data: $data) {
      code
      message
      profile {
        id
        gender
        phoneNumber
        liveAt
        province
        district
        ward
        createdAt
        story
      }
      user {
        id
        avatar
        firstName
        lastName
        email
        createdAt
      }
    }
  }
`;
