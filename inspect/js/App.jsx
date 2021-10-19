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
    query: a.search.replace('?' ,''),
  };
  a = null;
  return res;
}

const arrayBuf2string = (buf) => {
  const enc = new TextDecoder('utf-8');

  return enc.decode(buf);
}

function parseQueryString(query) {
  const vars = query.split("&");
  const queryString = {};
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    const key = decodeURIComponent(pair[0]);
    if (!key) {
      continue;
    }
    const value = decodeURIComponent(pair[1]);
    if (typeof queryString[key] === "undefined") {
      queryString[key] = decodeURIComponent(value);
    } else if (typeof queryString[key] === "string") {
      const arr = [queryString[key], decodeURIComponent(value)];
      queryString[key] = arr;
    } else {
      queryString[key].push(decodeURIComponent(value));
    }
  }
  return queryString;
}

const parseRequest = (req) => {
  const { hostname, path, protocol, query } = parseURL(req.url);
  const params = parseQueryString(query);

  return Object.assign(req, {
    host: hostname,
    path,
    protocol,
    requestParams: params,
  });
};

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [list, setList] = useState([]);
  useEffect(() => {

    // invoke test
    // socket.on('ioWebInvokeCallback', rs => {
    //   console.log(rs);
    // });
    // socket.emit('ioWebInvoke', {
    //   type: 'test',
    //   params: 'https://v.qq.com/h5/withdraw/index-2193377aab07a6db087c.js'
    // });
    socket.on('request', (req) => {
      setList((pre) => {
        // merge history request and response
        const history = pre.find(item => item.custom.requestId === req.requestId);
        if (history) {
          if (req.responseHeader) {
            history.responseHeader = req.responseHeader;
          }
          if (req.responseBody) {
            try {
              const data = pako.ungzip(req.responseBody, {to: "string"});
              history.responseBody = data;
            } catch(err){
              console.log('[gzip decode error]', err);
            }
          }
          if (req.statusCode) {
            history.custom = history.custom || {};
            history.custom.statusCode = req.statusCode || '';
          }
          return pre;
        }
        const item = parseRequest(req);
        // build data
        const data = {
          custom: {
            requestId: item.requestId,
            url: item.url,
            method: req.method,
            protocol: item.protocol,
            host: item.host,
            path: item.path,
          },
          requestHeaders: item.requestHeader,
          requestParams: item.requestParams,
        };
        // handler post body
        if (req.requestBody) {
          if (req.requestHeader['content-type'] === 'application/x-www-form-urlencoded') {
            data.postData = arrayBuf2string(req.requestBody);
            data.postData = parseQueryString(data.postData);
            data.postData.$$type = 'formData';
          } else if (req.requestHeader && req.requestHeader['content-type'] && req.requestHeader['content-type'].includes('application/json')) {
            data.postData = arrayBuf2string(req.requestBody);
            data.postData = JSON.parse(data.postData);
            data.postData.$$type = 'json';
          }
        }
        // done
        return pre.concat([data]);
      });
    });
  }, []);
  return <div className="app-main">
    <Ctx.Provider value={{ state, dispatch }}>
      <Table list={list} />
      <Detail list={list} />
    </Ctx.Provider>
  </div>
};
