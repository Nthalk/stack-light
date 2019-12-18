import {ApiResponse} from "../../server/src/api/ApiResponse";
import {TestApi} from "../../server/src/api/TestApi";
import { createContext, useState, useMemo } from "react";


function buildApi<T extends Record<string,(req:any) => Promise<ApiResponse<any>>>>(path:string, api: T):T{
  return null as T
}

export default class Api{
  public test = buildApi('test', TestApi);
}

export type ApiManager = {

}

const ApiContext = createContext<Api>(null as Api);
const ApiManagerContext = createContext<ApiManager>(null as ApiManager);

export function ApiProvider(props: {children: JSX.Element}):JSX.Element{
  const [manager, setManager] = useState<ApiManager>({})


  const api = useMemo(() => {
    return new Api();
  },[])

  return <ApiManagerContext.Provider value={manager}>
    <ApiContext.Provider value={api}>
      {props.children}
    </ApiContext.Provider>
  </ApiManagerContext.Provider>
}
