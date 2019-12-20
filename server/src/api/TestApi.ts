import {ApiResponse, useResponse} from './ApiResponse';

type PingResponse = {
  pong: 'pong';
};

type PingRequest = {
  ping: 'ping';
};

export const TestApi = {
  ping: async (_request: PingRequest): Promise<ApiResponse<PingResponse>> => {
    const rsp = useResponse<PingResponse>();
    return rsp.build({
      pong: 'pong',
    });
  },
};
