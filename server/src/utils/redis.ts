import Redis from 'ioredis';

export const redis = new Redis({
  ...(process.env.NODE_ENV === 'production' && {
    host: 'redis',
    port: 6379,
  }),
});
