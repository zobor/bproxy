import { useEffect, useState } from "react";
import { onRequest } from "../modules/io";
import { arrayBuf2string, parseQueryString, parseRequest } from "../modules/util";

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
            history.responseBody = req.responseBody;
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
                console.log(data.postData);
              }
            }
          }
        }
        // done
        return pre.concat([data]);
      });
    })
  }, []);

  return [list];
};
