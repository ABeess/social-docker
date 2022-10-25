import { Socket } from 'socket.io';
import UserRoom from '../entities/UserRoom';
import { redis } from '../utils/redis';

export default class SocketRoom {
  constructor(socket: Socket) {
    console.log('User connect:', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnect', socket.id);
    });

    socket.on('CREATE_ROOM', async (userId: string) => {
      try {
        const newRoom = UserRoom.create({
          userId,
          room: `${socket.id}-${userId}`,
        });
        await newRoom.save();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('POST_ROOM', (room: string[]) => {
      socket.join(room);
    });

    socket.on('CREATE_LIVE', (room: string) => {
      console.log(room);
      socket.join(room);
    });
    socket.on('LEAVE_ROOM', (room: string) => {
      socket.leave(room);
    });

    socket.on('JOIN_ROOM', async (userId: string) => {
      try {
        const userRoom = await UserRoom.find({
          where: {
            userId,
          },
        });
        const room = userRoom.map((item) => item.room);
        socket.join(room);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('EVENT_JOIN_STREAM', async (room: string) => {
      socket.join(room);

      const redisRoom = await redis.get(room);

      if (!redisRoom) {
        await redis.incrby(room, 1);
      } else {
        await redis.incrby(room, 1);
      }

      _io.to(room).emit('EVENT_JOIN_STREAM', { count: !redisRoom ? 1 : Number(redisRoom) + 1 });
    });

    socket.on('EVENT_LEAVE_STREAM', async (room: string) => {
      const newCount = await redis.decrby(room, 1);
      console.log('socket.on :: newCount', newCount);

      _io.to(room).emit('EVENT_JOIN_STREAM', { count: Number(newCount) });
      socket.leave(room);
    });
  }
}
