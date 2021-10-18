import Table from './Table';
import Detail from './Detail';
import { Ctx, defaultState, reducer } from './useData';

const { useReducer, useEffect, useState } = React;
const socket = io(`ws://${window.location.host}`);

const parseURL = (url) => {
  let a = document.createElement('a');
  a.href = url;
  const res = {
    hostname: a.hostname,
    path: a.pathname,
    protocol: a.protocol.replace(':', ''),
  };
  a = null;
  return res;
}

const parseRequest = (req) => {
  const { hostname, path, protocol } = parseURL(req.url);

  return {
    host: hostname,
    path,
    protocol,
  }
};

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [list, setList] = useState([]);
  useEffect(() => {
    socket.on('test', (data) => {
      console.log(data);
    });

    socket.on('request', (req) => {
      console.log(req);
      setList((pre) => {
        const item = parseRequest(req);
        return pre.concat(item);
      });
    });
  }, []);
  return <div>
    <Ctx.Provider value={{ state, dispatch }}>
      <Table list={list} />
      <Detail />
    </Ctx.Provider>
  </div>
};
