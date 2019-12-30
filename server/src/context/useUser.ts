import {RequestContext, User} from './RequestContext';

export function useUser(): User | void {
  return RequestContext.req.user;
}
