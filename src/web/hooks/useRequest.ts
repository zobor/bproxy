import { useEffect, useState } from "react";
import { onRequest } from "../modules/socket";
import { arrayBuf2string, parseQueryString, parseRequest } from "../modules/util";

const limit = 100;

export default () => {
  const [list, setList] = useState<any>([]);
  useEffect(() => {
    onRequest((req: any) => {
      setList((pre: any) => {
        // merge history request and response
        const history = pre.find((item: any) => item.custom.requestId === req.requestId);
        if (history) {
          history.requestEndTime = Date.now();
          history.time = history.requestEndTime - history.requestStartTime;
          if (req.responseHeader) {
            history.responseHeader = req.responseHeader;
          }
          if (req.responseBody && req.responseBody.byteLength) {
            if (history.custom.method === 'ws' || history.custom.method === 'wss') {
              if (Array.isArray(history.responseBody)) {
                history.responseBody.push(req.responseBody)
              } else {
                history.responseBody = [req.responseBody];
              }
            } else {
              history.responseBody = req.responseBody;
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
        const data: any = {
          requestStartTime: Date.now(),
          custom: {
            requestId: item.requestId,
            url: item.url,
            method: req.method,
            protocol: item.protocol,
            host: item.host,
            path: item.path,
            origin: item.origin,
          },
          requestHeaders: item.requestHeader,
          requestParams: item.requestParams || {},
        };
        // handler post body
        if (req.requestBody) {
          if (req.requestHeader['content-type'] === 'application/x-www-form-urlencoded') {
            data.postData = arrayBuf2string(req.requestBody);
            data.postData = parseQueryString(data.postData as string);
            data.postData.$$type = 'formData';
          } else if (req.requestHeader && req.requestHeader['content-type'] && req.requestHeader['content-type'].includes('application/json')) {
            data.postData = arrayBuf2string(req.requestBody);
            if (data.postData) {
              try {
                data.postData = JSON.parse(data.postData);
                data.postData.$$type = 'json';
              }catch (err) {
                console.error('[error] post data parse fail', err);
              }
            }
          }
        }
        // done
        const newList = pre.concat([data]);
        if (pre.length > limit) {
          return newList.slice(newList.length - limit);
        }
        return newList;
      });
    })
  }, []);

  return [list];
};
