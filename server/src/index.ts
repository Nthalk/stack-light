import {Express, Request, Response} from 'express';
import express from 'express';
import {RequestContextMiddleware} from './context/RequestContext';
import {TestApi} from './api/TestApi';
import bodyParser from 'body-parser';
import {ApiResponse, useResponse} from './api/ApiResponse';
import {useSecurity} from './security/Auth';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Configure our webserver
const app: Express = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(RequestContextMiddleware);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Security
useSecurity(app);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Serve static files
app.use(express.static('../web/dist'));

////////////////////////////////////////////////////////////////////////////////////////////////////
// Serve up api requests
const apiRouter = express.Router();
function installApi(
  path: string,
  api: Record<string, (req: unknown) => Promise<ApiResponse<unknown>>>
): void {
  Object.keys(api).forEach(key => {
    const handler = api[key];
    apiRouter.post('/' + path + '/' + key, (req: Request, rsp: Response) => {
      handler(req.body).then(
        r => rsp.json(r),
        (er: any) => {
          rsp.json(
            useResponse()
              .er({code: 'Unknown', message: JSON.stringify(er)})
              .build()
          );
        }
      );
    });
  });
}
installApi('test', TestApi);

app.use('/api', apiRouter);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Start webserver
app.listen(8081, () => {
  console.log('Started server... at http://localhost:8081/');
});
