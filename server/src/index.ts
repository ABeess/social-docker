import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import 'dotenv/config';
import 'reflect-metadata';
// import { ApolloServer } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import { buildSchema } from 'type-graphql';
import { channel } from './channel';
import { AppDataSource } from './lib/dataSource';
import rootRouter from './routes/rootRouter';
import { Context } from './types';
import { redis } from './utils/redis';
import cookieParser from 'cookie-parser';

const main = async (): Promise<void> => {
  // const upload = multer({ storage: multer.diskStorage({}) });
  const app = express();

  const httpServer = createServer(app);

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      origin: [process.env.CLIENT_URL, 'http://localhost:3030'],
      credentials: true,
    })
  );

  app.use(cookieParser(process.env.SESSION_SECRET));

  app.use(
    session({
      name: process.env.SESSION_NAME,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        ...(process.env.NODE_ENV === 'production' && {
          domain: 'abeesdev.com',
        }),
      },
      store: new RedisStore({ client: redis }),
      secret: String(process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use('/', rootRouter);

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.js'],
  });

  channel(httpServer);

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      // ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    context: ({ req, res }: Pick<Context, 'req' | 'res'>) => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [process.env.CLIENT_URL as string, 'http://localhost:3030'],
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 3088;

  await new Promise((resolve) => httpServer.listen(PORT, resolve as () => void));

  await AppDataSource.connect();
  console.log(`Graphql endpoint on: http://localhost:${PORT}${apolloServer.graphqlPath}`);
};

main().catch((error) => console.log('Server Error: ', error));
