import { useEffect, useState } from "react";
import { InvokeRequestParams } from "../../types/proxy";
import { HttpRequestRequest } from "../../types/web";
import { onRequest } from "../modules/socket";
import {
  arrayBuf2string,
  filterRequestItem,
  filterRequestList,
  parseQueryString,
  parseRequest,
} from "../modules/util";

const limit = 300;

export default (proxySwitch: boolean, filterType, filterString): { list: HttpRequestRequest[]; clean: () => void } => {
  const [list, setList] = useState<HttpRequestRequest[]>([]);
  const clean = () => {
    setList([]);
  };
  useEffect(() => {
    onRequest((req: InvokeRequestParams) => {
      if (!proxySwitch) {
        return;
      }
      setList((pre: any) => {
        // merge history request and response
        const list = filterRequestList(pre, { filterType, filterString });
        const history = list.find(
          (item: any) => item.custom.requestId === req.requestId
        );
        const index = list.findIndex(item => item?.custom?.requestId === req.requestId);

        // append keys to previours
        if (history) {
          history.requestEndTime = Date.now();
          history.requestStartTime && (history.time = history.requestEndTime - history.requestStartTime);
          // responseHeaders
          if (req.responseHeaders) {
            history.responseHeaders = req.responseHeaders;
          }
          // responseBody
          if (req.responseBody && req.responseBody.byteLength) {
            if (
              history?.custom?.method === "ws" ||
              history?.custom?.method === "wss"
            ) {
              if (Array.isArray(history.responseBody)) {
                history.responseBody.push(req.responseBody);
              } else {
                history.responseBody && (history.responseBody = [req.responseBody]);
              }
            } else {
              history.responseBody = req.responseBody;
            }
          }
          // statusCode
          if (req.statusCode) {
            history.custom = history.custom || {};
            history.custom.statusCode = req.statusCode || 0;
          }
          pre[index] = history;
          return [...list];
        }

        // new request
        // request start but no response
        const item = parseRequest(req);
        const data: HttpRequestRequest = {
          matched: !!req.matched,
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
          requestHeaders: item.requestHeaders,
          requestParams: item.requestParams || {},
        };
        if (req.statusCode && data.custom) {
            data.custom.statusCode = req.statusCode;
        }
        // handler post body
        if (req.requestBody) {
          if (
            req.requestHeaders &&
            req.requestHeaders["content-type"] ===
              "application/x-www-form-urlencoded"
          ) {
            const postData = arrayBuf2string(req.requestBody);
            data.postData = parseQueryString(postData as string);
            data.postData.$$type = "formData";
          } else if (
            req.requestHeaders &&
            req.requestHeaders["content-type"] &&
            req.requestHeaders["content-type"].includes("application/json")
          ) {
            const postData = arrayBuf2string(req.requestBody);
            if (postData) {
              try {
                data.postData = JSON.parse(postData);
                data.postData && (data.postData.$$type = "json");
              } catch (err) {
                console.error("[error] post data parse fail", err);
              }
            }
          }
        }
        if (filterRequestItem(data, { filterType, filterString })) {
          // done
          const newList = pre.concat([data]);
          if (pre.length > limit) {
            return newList.slice(newList.length - limit);
          }
          return newList;
        }
        return pre;
      });
    });
  }, [proxySwitch, filterString, filterType]);

  return {
    list,
    clean,
  };
};
