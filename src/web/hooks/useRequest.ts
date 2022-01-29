import { useEffect, useRef, useState } from "react";
import { InvokeRequestParams } from "../../types/proxy";
import { HttpRequestRequest } from "../../types/web";
import { onRequest } from "../modules/socket";
import {
  filterRequestItem,
  filterRequestList,
  parseRequest,
} from "../modules/util";
import { get } from '../modules/_';
import { parseFormData, parseJsonData } from '../../proxy/utils/format';

const limit = 500;

export default (proxySwitch: boolean, filterType: string, filterString: string, updateRequestListFlag: number): { list: HttpRequestRequest[]; clean: () => void; lastUpdate: number } => {
  const [list, setList] = useState<HttpRequestRequest[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const lastUpdateFlag = useRef<number>(updateRequestListFlag);
  const clean = () => {
    setList([]);
  };
  useEffect(() => {
    onRequest((req: InvokeRequestParams) => {
      if (!proxySwitch) {
        return;
      }
      setLastUpdate(Date.now());
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
          // ip
          if (req.ip) {
            history.ip = req.ip;
          }
          // responseBody
          if (req.responseBody) {
            if (
              history?.custom?.method === "ws" ||
              history?.custom?.method === "wss"
            ) {
              if (Array.isArray(history.responseBody)) {
                history.responseBody.push(req.responseBody);
              } else {
                history.responseBody = [req.responseBody];
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
        // history end

        // new request
        // request start but no response
        const item = parseRequest(req);
        const contentType = get(req, 'requestHeaders["content-type"]') || '';
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
          if (contentType.includes('x-www-form-urlencoded')) {
            try {
              data.postData = parseJsonData(req.requestBody);
            } catch (err) {
              console.error('[error] post data parse fail', err);
            }
          } else if (contentType.includes("/json")) {
            try {
              data.postData = JSON.parse(req.requestBody);
            } catch (err) {
              console.error("[error] post data parse fail", err);
            }
          } else if (contentType.includes("/form")) {
            data.postData = parseFormData(req.requestBody);
          } else {
            try {
              data.postData = JSON.parse(req.requestBody);
              data.postData && (data.postData.$$type = 'json');
            } catch (err) {
              data.postData = req.requestBody as any;
            }
          }
          // if (
          //   req.requestHeaders &&
          //   req.requestHeaders["content-type"] ===
          //     "application/x-www-form-urlencoded"
          // ) {
          //   console.log(req.requestBody);
          //   const postData = arrayBuf2string(req.requestBody);
          //   data.postData = parseQueryString(postData as string);
          //   data.postData.$$type = "formData";
          // } else if (
          //   req.requestHeaders &&
          //   req.requestHeaders["content-type"] &&
          //   req.requestHeaders["content-type"].includes("application/json")
          // ) {
          //   const postData = arrayBuf2string(req.requestBody);
          //   if (postData) {
          //     try {
          //       data.postData = JSON.parse(postData);
          //       data.postData && (data.postData.$$type = "json");
          //     } catch (err) {
          //       console.error("[error] post data parse fail", err);
          //     }
          //   }
          // }
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

  // 请求过滤
  useEffect(() => {
    if (!proxySwitch) {
      return;
    }
    if (lastUpdateFlag.current !== updateRequestListFlag) {
      setList((pre: any) => {
        const list = filterRequestList(pre, { filterType, filterString });

        return list;
      });
      lastUpdateFlag.current = updateRequestListFlag;
    }
  }, [proxySwitch, updateRequestListFlag, filterType, filterString]);

  return {
    list,
    clean,
    lastUpdate,
  };
};
