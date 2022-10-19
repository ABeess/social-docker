import { gql } from 'graphql-request';

export const LOGIN_QUERY = gql`
  mutation Login($data: LoginInput!) {
    login(loginInput: $data) {
      __typename
      code
      message
      user {
        id
        email
        lastName
        firstName
        createdAt
        updatedAt
        avatar
        __typename
      }
      accessToken
    }
  }
`;

export const REGISTER_QUERY = gql`
  mutation Register($data: RegisterInput!) {
    register(registerInput: $data) {
      code
      message
      __typename
      user {
        __typename
        id
      }
    }
  }
`;
