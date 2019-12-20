import React, {createContext, useContext, useMemo, useState} from 'react';
import {ApiResponse, ApiRootError} from '../../../server/src/api/ApiResponse';
import {TestApi} from '../../../server/src/api/TestApi';
export * from '../../../server/src/api/TestApi';

export type ApiState = {
  activeRequests: number;
  totalRequests: number;
};

function buildApi<
  T extends Record<string, (req: unknown) => Promise<ApiResponse<unknown>>>
>(client: Api, path: string, api: T): T {
  const translated: Record<
    string,
    (req: unknown) => Promise<ApiResponse<unknown>>
  > = {};
  Object.keys(api).forEach(method => {
    translated[method] = async (
      req: unknown
    ): Promise<ApiResponse<unknown>> => {
      client.onRequestStart();

      const headers: {[key: string]: string} = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (client.token) {
        headers.Authorization = `Bearer ${client.token}`;
      }
      try {
        const rsp = await fetch('api/' + path + '/' + method, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(req),
        });
        const json = rsp.json();
        if (rsp.status >= 400) {
          throw json;
        } else {
          client.onRequestSuccess();
          return json as ApiResponse<unknown>;
        }
      } catch (e) {
        client.onRequestError();
        return {error: e as ApiRootError};
      }
    };
  });
  return translated as T;
}

export default class Api {
  constructor(
    private setApiState: (modifier: (apiState: ApiState) => ApiState) => void
  ) {}

  public token: string | void;

  public onRequestSuccess(): void {
    this.setApiState(apiState => ({
      ...apiState,
      totalRequests: apiState.totalRequests + 1,
      activeRequests: apiState.activeRequests + 1,
    }));
  }
  public onRequestError(): void {
    this.setApiState(apiState => ({
      ...apiState,
      activeRequests: apiState.activeRequests - 1,
    }));
  }
  public onRequestStart(): void {
    this.setApiState(apiState => ({
      ...apiState,
      activeRequests: apiState.activeRequests - 1,
    }));
  }

  public test = buildApi(this, 'test', TestApi);
}

const ApiContext = createContext<Api>(null as Api);
const ApiStateContext = createContext<ApiState>(null as ApiState);

export function useApi(): Api {
  return useContext(ApiContext);
}

export function ApiProvider(props: {children: JSX.Element}): JSX.Element {
  const [apiState, setApiState] = useState<ApiState>({
    activeRequests: 0,
    totalRequests: 0,
  });

  const api = useMemo(() => new Api(setApiState), []);

  return (
    <ApiContext.Provider value={api}>
      <ApiStateContext.Provider value={apiState}>
        {props.children}
      </ApiStateContext.Provider>
    </ApiContext.Provider>
  );
}
