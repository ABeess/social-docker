import { gql } from 'graphql-request';

export const CREATE_COMMENT = gql`
  mutation CreateComment($data: CommentInput!) {
    createComment(data: $data) {
      code
      message
    }
  }
`;

export const GET_COMMENTS_BY_POST = gql`
  query GetComments($postId: String!, $query: QueryInput) {
    getComment(postId: $postId, query: $query) {
      totalCount
      totalPage
      page
      perPage
      __typename
      comments {
        id
        message
        createdAt
        updatedAt
        __typename
        author {
          id
          firstName
          lastName
          createdAt
          email
          avatar
          updatedAt
          __typename
        }
        reply {
          id
          message
          createdAt
          updatedAt
          __typename
          author {
            id
            firstName
            lastName
            createdAt
            email
            avatar
            updatedAt
            __typename
          }
        }
        post {
          id
        }
      }
    }
  }
`;

export const REPLY_COMMENT = gql`
  mutation ReplyComment($data: ReplyInput!) {
    replyComment(data: $data) {
      code
      message
      __typename
    }
  }
`;
