import NodeMediaServer from 'node-media-server';
import Streams from './entities/Streams';

// http://localhost:3098/live/abees.flv

const generateUrl = (path: string) => {
  // return `http://localhost:3098${path}.flv`;
  return `${process.env.LIVE_URL}${path}.flv`;
};

export const nodeMedia = new NodeMediaServer({
  logType: 0,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 60,
  },
  http: {
    port: 3098,
    allow_origin: '*',
    mediaroot: '',
  },
});

nodeMedia.on('postPublish', (id, path) => {
  console.log(path);

  const room = path.split('/')[2];
  _io.to(room).emit('START_STREAM', {
    id,
    url: generateUrl(path),
  });
});

nodeMedia.on('donePublish', async (id) => {
  _io.emit('STOP_STREAM', { id, type: 'stop' });

  await Streams.update(
    {
      clientId: id,
    },
    { live: false }
  );
});
