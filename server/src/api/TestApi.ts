import {useApiToken} from '../context/useApiToken';
import {ApiResponse, useResponse} from './ApiResponse';

type PingResponse = {
  pong: 'pong';
};

type PingRequest = {
  ping: 'ping';
};

export const TestApi = {
  ping: async (request: PingRequest): Promise<ApiResponse<PingResponse>> => {
    const token = useApiToken();
    const rsp = useResponse<PingResponse>();

    return rsp.build({
      pong: 'pong',
    });
  },
};
