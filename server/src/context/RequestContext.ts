import * as http from 'http';
import {NextFunction} from 'connect';

export const RequestContext = new (class {
  public req: http.IncomingMessage;
  public res: http.ServerResponse;
})();

export function RequestContextMiddleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: NextFunction
): void {
  RequestContext.req = req;
  RequestContext.res = res;
  next();
}
