import { gql } from 'graphql-request';

export const NOTIFICATION_QUERY = gql`
  query GetNotifications($query: QueryInput, $ownerId: String!) {
    getNotification(query: $query, ownerId: $ownerId) {
      __typename
      notifications {
        __typename
        id
        content
        createdAt
        type
        read
        requester {
          avatar
          id
          firstName
          lastName
          createdAt
        }
      }
      totalUnread
      totalCount
      totalPage
      perPage
      page
    }
  }
`;

export const MASK_AS_READ_QUERY = gql`
  mutation MaskAsReadNotification($data: NotificationInput!) {
    markAsRead(notificationInput: $data) {
      code
      message
    }
  }
`;
