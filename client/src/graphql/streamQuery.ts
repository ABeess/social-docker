import { gql } from 'graphql-request';

export const CREATE_STREAM = gql`
  mutation CreateStream($data: CreateStreamKeyInput!) {
    createStream(data: $data) {
      code
      message
      data {
        id
        clientId
        description
        title
        streamKey
        updatedAt
        user {
          id
          firstName
          lastName
          avatar
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const GET_STREAMS = gql`
  query GetStreams {
    getLiveStream {
      code
      message
      streams {
        id
        title
        description
        url
        clientId
        streamKey
        createdAt
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

export const SEND_STREAM_CHAT = gql`
  mutation SendStreamChat($data: StreamChatInput!) {
    sendStreamChat(data: $data) {
      code
      message
      __typename
    }
  }
`;

export const GET_STREAM_CHAT = gql`
  query GetStreamChats($streamId: String!) {
    getStreamChat(streamId: $streamId) {
      code
      message
      __typename
      streamChats {
        id
        message
        createdAt
        __typename
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
`;

export const GET_DETAIL_STREAM = gql`
  query GetDetailStream($streamId: String!) {
    getDetailStream(streamId: $streamId) {
      code
      message
      stream {
        id
        title
        clientId
        description
        url
        createdAt
        updatedAt
        live
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

export const UNLOAD_STREAM = gql`
  mutation UnloadStream($streamId: String!) {
    unLoadStream(streamId: $streamId) {
      code
      message
    }
  }
`;
