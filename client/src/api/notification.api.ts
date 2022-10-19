import { MASK_AS_READ_QUERY, NOTIFICATION_QUERY } from 'src/graphql/notificationQuery';
import { MaskAsReadInput, QueryInput } from 'src/types/InputValue';
import { MaskAsReadMutation } from 'src/types/MutationResponse';
import { GetNotificationsResponse } from 'src/types/QueryResponse';
import { BaseResponse } from 'src/types/Response';
import app from 'src/utils/graphqlRequest';

interface GetNotificationParams {
  query?: QueryInput;
  ownerId: string;
}
export const getNotification = async ({ query, ownerId }: GetNotificationParams) => {
  const response: GetNotificationsResponse = await app.request(NOTIFICATION_QUERY, {
    query,
    ownerId,
  });
  return response.getNotification;
};

export const markAsReadNotification = async (data: MaskAsReadInput): Promise<BaseResponse> => {
  const response: MaskAsReadMutation = await app.request(MASK_AS_READ_QUERY, {
    data,
  });
  return response.markAsRead;
};
