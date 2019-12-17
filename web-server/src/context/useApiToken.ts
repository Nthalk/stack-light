import {RequestContext} from './RequestContext';

export function useApiToken(): string | undefined {
  const token = RequestContext.req.headers['X-API-TOKEN'];
  if (token) {
    if (Array.isArray(token)) {
      return token[0];
    } else {
      return token;
    }
  } else {
    return undefined;
  }
}
