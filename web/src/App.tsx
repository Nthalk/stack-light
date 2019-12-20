import React, {useEffect, useState} from 'react';
import {useApi} from './providers/ApiProvider';

export default function App(): JSX.Element {
  const api = useApi();
  const [rsp, setRsp] = useState();
  useEffect(() => {
    (async () => {
      const pong = await api.test.ping({ping: 'ping'});
      console.log(pong);
      setRsp(pong);
    })();
  }, [api.test]);
  return <div>{JSON.stringify(rsp)}?</div>;
}
