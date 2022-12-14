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

export const GET_USER_RECOMMEND = gql`
  query GetNotCurrentUser($userId: String!) {
    getUserNotCurrent(userId: $userId) {
      code
      message
      users {
        id
        avatar
        firstName
        lastName
        createdAt
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

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($url: String!, $userId: String!) {
    uploadAvatar(url: $url, userId: $userId) {
      code
      message
      __typename
    }
  }
`;

export const UPDATE_THUMBNAIL = gql`
  mutation UpdateThumbnail($data: UpdateThumbnailInput!) {
    updateThumbnail(data: $data) {
      code
      message
    }
  }
`;
