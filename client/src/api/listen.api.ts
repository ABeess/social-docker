import socket from 'src/utils/socket';

// eslint-disable-next-line no-unused-vars
export const listen = <T>(name: string, callback: (data: T) => void) => {
  socket.on(name, callback);
};
