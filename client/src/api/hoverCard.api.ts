import { HOVER_CARD } from 'src/graphql/hoverCardQuery';
import { HoverCardQuery } from 'src/types/QueryResponse';
import app from 'src/utils/graphqlRequest';

export const hoverCardQuery = async (userId: string) => {
  const { hoverCard }: HoverCardQuery = await app.request(HOVER_CARD, {
    userId,
  });
  return hoverCard;
};
