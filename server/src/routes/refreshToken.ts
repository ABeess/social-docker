import express, { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../entities/User';
import { UnauthorizedRest } from '../lib/errorHandle';
import { UseJWTPayload } from '../types/index';
import { setCookie } from '../utils/cookies';
import { generateToken } from '../utils/jwtManger';
import { redis } from '../utils/redis';
const Router = express.Router();

Router.post('/refreshToken', async (req: Request, res: Response) => {
  try {
    const cookies = req.signedCookies['refresh-token'];

    const refreshToken = await redis.get(`token:${cookies}`);

    if (!refreshToken || !cookies) {
      throw new UnauthorizedRest('You are not authenticated "cookie"');
    }

    const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as UseJWTPayload;

    if (!payload) {
      throw new UnauthorizedRest('Token is not valid');
    }

    const existingUser = await User.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedRest('You are not authenticated "user"');
    }

    const newAccessToken = generateToken({
      data: {
        sub: payload?.sub as string,
      },
      form: 'accessToken',
    });

    const newRefreshToken = generateToken({
      data: {
        sub: payload.sub as string,
      },
      form: 'refreshToken',
    });

    await redis.set(existingUser.id, newRefreshToken);

    setCookie({
      res,
      data: existingUser.id,
      name: 'refresh-token',
    });

    return res.status(200).json({
      code: 200,
      message: 'Refresh accessToken',
      accessToken: newAccessToken,
    });
  } catch (error) {
    const code = error.code ? error.code : 500;
    return res.status(code).json({
      code,
      message: error.message || 'Interval server error' + error,
    });
  }
});

export default Router;
