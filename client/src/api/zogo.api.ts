import axios from 'axios';

interface ZegoTokenParams {
  userID: string;
  userName: string;
  roomID: string;
  expired_ts?: number;
}

export const zegoToken = async ({ expired_ts = 7200, ...params }: ZegoTokenParams) => {
  const response = await axios({
    method: 'GET',
    url: 'https://dynamic-token-server.herokuapp.com/access_token',
    params: {
      expired_ts,
      ...params,
    },
  });
  return response.data;
};
