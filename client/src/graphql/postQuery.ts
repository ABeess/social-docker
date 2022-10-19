import { gql } from 'graphql-request';

export const ALL_POST_QUERY = gql`
  query GetAllPost($query: QueryInput!, $userId: String) {
    postsQuery(query: $query, userId: $userId) {
      posts {
        id
        content
        image {
          url
          id
          type
        }
        createdAt
        updatedAt
        user {
          id
          email
          lastName
          firstName
          avatar
          createdAt
        }
        comment {
          id
        }
      }
      page
      perPage
      totalCount
      totalPage
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($images: [ImageInput!]!, $post: PostInput!) {
    createPost(images: $images, post: $post) {
      code
      message
      post {
        id
        content
        updatedAt
        createdAt
        image {
          url
          type
          type
        }
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
`;

export const LIKE_POST = gql`
  mutation LikePost($data: PostLikeMutationInput!) {
    likePost(data: $data) {
      code
      message
      __typename
      currentLike {
        like
        type
        __typename
      }
      likes {
        id
        type
        createdAt
        updatedAt
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnLikePost($data: PostLikeQueryInput!) {
    unLikePost(data: $data) {
      code
      message
      __typename
    }
  }
`;

export const GET_LIKE = gql`
  query GetLikePost($data: PostLikeQueryInput!) {
    getLikeByPost(data: $data) {
      code
      message
      likes {
        id
        type
        createdAt
        updatedAt
      }
      currentLike {
        like
        type
      }
      totalLike
    }
  }
`;
