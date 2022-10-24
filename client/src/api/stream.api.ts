// http://localhost:3098/api/streams/live/1666605568633
import axios, { AxiosResponse } from 'axios';
import {
  CREATE_STREAM,
  GET_DETAIL_STREAM,
  GET_STREAMS,
  GET_STREAM_CHAT,
  SEND_STREAM_CHAT,
  UNLOAD_STREAM,
} from 'src/graphql/streamQuery';
import { CreateStreamInput, SendStreamChatInput } from 'src/types/InputValue';
import { CreateStreamMutation, SendStreamChatMutation, UnloadStreamMutation } from 'src/types/MutationResponse';
import { GetDetailStreamQuery, GetStreamChatQuery, GetStreamQuery } from 'src/types/QueryResponse';
import app from 'src/utils/graphqlRequest';

export const createStream = async (data: CreateStreamInput) => {
  const response: CreateStreamMutation = await app.request(CREATE_STREAM, {
    data,
  });
  return response.createStream;
};

export const getStreams = async () => {
  const response: GetStreamQuery = await app.request(GET_STREAMS);
  return response.getLiveStream;
};

export const sendStreamChat = async (data: SendStreamChatInput) => {
  const response: SendStreamChatMutation = await app.request(SEND_STREAM_CHAT, {
    data,
  });
  return response.sendStreamChat;
};

export const getStreamChat = async (streamId: string) => {
  const response: GetStreamChatQuery = await app.request(GET_STREAM_CHAT, {
    streamId,
  });
  return response.getStreamChat;
};

export const unloadStream = async (streamId: string) => {
  const response: UnloadStreamMutation = await app.request(UNLOAD_STREAM, {
    streamId,
  });
  return response.unLoadStream;
};

export const getStreamDetail = async (streamId: string) => {
  const response: GetDetailStreamQuery = await app.request(GET_DETAIL_STREAM, {
    streamId,
  });
  return response.getDetailStream;
};

interface SteamViewAPI {
  isLive: boolean;
  viewers: number;
  duration: number;
  bitrate: number;
  startTime: number;
  arguments: any;
}

export const getViewerStream = async (streamKey: string) => {
  const response: AxiosResponse<SteamViewAPI> = await axios({
    url: `http://localhost:3098/api/streams/live/${streamKey}`,
    method: 'GET',
  });

  return response.data;
};
