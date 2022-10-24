import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import StreamChat from '../entities/StreamChat';
import Streams from '../entities/Streams';
import { CreateStreamKeyInput, StreamChatInput } from '../inputs/StreamInput';
import { MutationResponse } from '../response/BaseResponse';
import {
  CreateStreamChatResponse,
  CreateStreamResponse,
  GetDetailStreamResponse,
  GetStreamChatResponse,
  GetStreamResponse,
} from '../response/StreamResponse';
import { formatDate } from '../utils/formatDate';
import { redis } from '../utils/redis';

@Resolver()
export class StreamResolver {
  @Mutation(() => CreateStreamResponse)
  async createStream(@Arg('data') data: CreateStreamKeyInput): Promise<CreateStreamResponse> {
    try {
      const newStreamKey = Streams.create({
        ...data,
        live: true,
        user: formatDate(data.user),
      });

      await newStreamKey.save();

      return {
        code: 200,
        message: 'Save stream',
        data: newStreamKey,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error',
      };
    }
  }

  @Mutation(() => CreateStreamChatResponse)
  async sendStreamChat(@Arg('data') data: StreamChatInput): Promise<CreateStreamChatResponse> {
    try {
      const newMessage = StreamChat.create({
        ...data,
      });

      await newMessage.save();

      _io.to(data.streamId).emit('STREAM_CHAT', newMessage);

      return {
        code: 201,
        message: 'CREATE STREAM',
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error',
      };
    }
  }

  @Mutation(() => MutationResponse)
  async unLoadStream(@Arg('streamId') id: string): Promise<MutationResponse> {
    try {
      const currentCount = await redis.get(id);

      if (Number(currentCount) > 0) {
        const newCount = await redis.decrby(id, 1);
        _io.to(id).emit('EVENT_JOIN_STREAM', { count: Number(newCount) });
      }

      _io.to(id).emit('EVENT_JOIN_STREAM', { count: currentCount });

      return {
        code: 200,
        message: 'Unload stream',
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error',
      };
    }
  }

  @Query(() => GetStreamChatResponse)
  async getStreamChat(@Arg('streamId') id: string): Promise<GetStreamChatResponse> {
    try {
      const [streamChats, count] = await StreamChat.findAndCount({
        where: {
          streamId: id,
        },
        order: {
          createdAt: 'asc',
        },
        relations: ['user'],
      });

      console.log(count);

      return {
        code: 200,
        message: 'Get Chat',
        streamChats,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'interval server error',
      };
    }
  }

  @Query(() => GetStreamResponse)
  async getLiveStream(): Promise<GetStreamResponse> {
    try {
      const [streams] = await Streams.findAndCount({
        where: {
          live: true,
        },
        relations: ['user'],
      });

      return {
        code: 200,
        message: 'Get Stream',
        streams,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error',
      };
    }
  }
  @Query(() => GetDetailStreamResponse)
  async getDetailStream(@Arg('streamId') id: string): Promise<GetDetailStreamResponse> {
    try {
      const stream = await Streams.findOne({
        where: {
          id,
        },
        relations: ['user'],
      });

      return {
        code: 200,
        message: 'Get Stream',
        stream,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Interval server error',
      };
    }
  }
}
