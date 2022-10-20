import { CookieOptions, Response } from 'express';

interface SetCookieParams<T> {
  res: Response;
  data: T;
  name: string;
  options?: CookieOptions;
}

export const setCookie = <T>({ res, data, name, options }: SetCookieParams<T>) => {
  res.cookie(name, data, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 365,
    signed: true,
    ...(process.env.NODE_ENV === 'production' && {
      domain: 'abeesdev.com',
    }),
    ...options,
  });
};
