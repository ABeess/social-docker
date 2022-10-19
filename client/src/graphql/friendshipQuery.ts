import { gql } from 'graphql-request';

export const FRIENDSHIP_RECOMMEND = gql`
  query FriendShipRecommend($query: QueryInput, $userId: String!) {
    friendShipRecommend(query: $query, userId: $userId) {
      users {
        id
        avatar
        firstName
        lastName
        createdAt
      }
      page
      perPage
      totalCount
      totalPage
    }
  }
`;

export const FRIENDSHIP_REQUEST = gql`
  query FriendRequest($query: QueryInput, $userId: String!) {
    getFriendRequest(query: $query, userId: $userId) {
      page
      perPage
      totalCount
      totalPage
      friendRequest {
        id
        accepted
        createdAt
        addressee {
          id
          createdAt
        }
        requester {
          avatar
          firstName
          lastName
          id
          createdAt
        }
      }
    }
  }
`;

export const FRIENDSHIP_WAITING = gql`
  query FriendWaiting($query: QueryInput, $userId: String!) {
    friendWaiting(query: $query, userId: $userId) {
      page
      perPage
      totalCount
      totalPage
      friendRequest {
        accepted
        addressee {
          avatar
          firstName
          lastName
          id
          createdAt
        }
        requester {
          avatar
          firstName
          lastName
          id
          createdAt
        }
      }
    }
  }
`;

export const GET_FRIENDS = gql`
  query GetFriends($userId: String!) {
    getFriends(userId: $userId) {
      friends {
        id
        firstName
        lastName
        avatar
        createdAt
        updatedAt
        __typename
      }
      page
      perPage
      totalCount
      totalPage
      __typename
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriendRequest($data: AddFriendInput!) {
    addFriend(data: $data) {
      code
      message
      addressee {
        id
        firstName
        lastName
        avatar
        createdAt
        email
      }
    }
  }
`;
