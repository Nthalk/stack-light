import {ApiResponse, useResponse} from './ApiResponse';
import {User} from '../context/RequestContext';
import {useUser} from '../context/useUser';

type PingResponse = {
  user: User | void;
  pong: 'pong';
};

type PingRequest = {
  ping: 'ping';
};

export const TestApi = {
  ping: async (_request: PingRequest): Promise<ApiResponse<PingResponse>> => {
    const rsp = useResponse<PingResponse>();
    return rsp.build({
      user: useUser(),
      pong: 'pong',
    });
  },
};
