import { Socket } from 'socket.io';
import PostChanel from '../entities/PostRoom';
import UserRoom from '../entities/UserRoom';
import { uuid } from '../utils/uuid';

export default class SocketRoom {
  constructor(socket: Socket) {
    console.log('User connect:', socket.id);

    PostChanel.find({}).then((data) => {
      const channel = data.map((room) => room.chanel);
      socket.join(channel);
    });

    UserRoom.find({}).then((data) => {
      const chanel = data.map((x) => x.room);
      socket.join(chanel);
    });

    socket.on('disconnect', () => {
      console.log('user disconnect', socket.id);
    });

    socket.on('CREATE_ROOM', async (userId: string, room?: string) => {
      try {
        const newRoom = UserRoom.create({
          userId,
          room: room ? `${room}-${uuid}` : uuid,
        });
        await newRoom.save();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('POST_ROOM', (room: string[]) => {
      socket.join(room);
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
  }
}
