import { useEffect, useState } from 'react';
import { listen } from 'src/api/listen.api';
import { Maybe } from 'src/types';
import socket from 'src/utils/socket';

export default function useSocket<Type>(room: string): Maybe<Type> {
  const [response, setResponse] = useState<Maybe<Type>>(null);

  useEffect(() => {
    listen(room, (response: Type) => {
      setResponse(response);
    });

    return () => {
      socket.removeListener(room);
    };
  }, []);

  return response;
}
