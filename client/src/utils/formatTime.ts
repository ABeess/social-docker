import { formatDistanceStrict, formatDistanceToNow } from 'date-fns';

export const fDistanceToNow = (date: Date) =>
  formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
export const fDistanceStrict = (date: Date | string) =>
  formatDistanceStrict(typeof date === 'string' ? new Date(date) : date, new Date());
