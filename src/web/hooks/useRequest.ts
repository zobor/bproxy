import { useEffect, useState } from 'react';
import { parseFormData, parseJsonData } from '../../proxy/utils/format';
import { InvokeRequestParams } from '../../types/proxy';
import { HttpRequestRequest } from '../../types/web';
import { get, isEmpty } from '../modules/lodash';
import { onRequest } from '../modules/socket';
import {
  filterRequestItem,
  filterRequestList,
  parseRequest
} from '../modules/util';

const limit = 100;

function parseRequestData(req: InvokeRequestParams, history: any = {}) {
  const item = parseRequest(req);
  const contentType = get(req, 'requestHeaders["content-type"]') || '';

  // custom
  const data: HttpRequestRequest = isEmpty(history)
    ? {
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
      }
    : history;

  // requestBody
  if (req.requestBody) {
    if (contentType.includes('x-www-form-urlencoded')) {
      try {
        data.postData = parseJsonData(req.requestBody);
      } catch (err) {
        console.error('[error] post data parse fail', err);
      }
    } else if (contentType.includes('/json')) {
      try {
        data.postData = JSON.parse(req.requestBody);
      } catch (err) {
        console.error('[error] post data parse fail', err);
      }
    } else if (contentType.includes('/form')) {
      data.postData = parseFormData(req.requestBody);
    } else {
      try {
        data.postData = JSON.parse(req.requestBody);
      } catch (err) {
        data.postData = req.requestBody as any;
      }
    }
  }

  // responseBody
  if (req.responseBody) {
    if (data?.custom?.method === 'ws' || data?.custom?.method === 'wss') {
      if (Array.isArray(data.responseBody)) {
        data.responseBody.push(req.responseBody);
      } else {
        data.responseBody = [req.responseBody];
      }
    } else {
      data.responseBody = req.responseBody;
    }
  }

  // responseHeaders
  if (req.responseHeaders) {
    data.responseHeaders = req.responseHeaders;
  }

  // ip
  if (req.ip) {
    data.ip = req.ip;
  }

  // statusCode
  if (req.statusCode) {
    data.custom = data.custom || {
      requestId: req.requestId,
    };
    data.custom.statusCode = req.statusCode || 0;
  }

  // request time
  if (!isEmpty(history)) {
    data.requestEndTime = data.requestEndTime || Date.now();
    data.requestStartTime &&
      (data.time = data.requestEndTime - data.requestStartTime);
  }

  return data;
}

interface UseRequestReturns {
  list: HttpRequestRequest[];
  clean: () => void;
}

function useRequest(
  proxySwitch: boolean,
  filterType: string,
  filterString: string,
  filterContentType: string,
  filterRequestMethod: string,
): UseRequestReturns {
  {
    const [list, setList] = useState<HttpRequestRequest[]>([]);
    const clean = () => setList([]);
    useEffect(() => {
      onRequest((req: InvokeRequestParams) => {
        // 过滤开关被关闭
        // 过滤非法请求数据
        if (!proxySwitch || !req || !req.method) {
          return;
        }
        setList((pre: any) => {
          // merge history request and response
          const list = filterRequestList(pre, {
            filterType,
            filterString,
            filterContentType,
            filterRequestMethod,
          });
          const history = list.find(
            (item: any) => item?.custom?.requestId === req.requestId
          );
          const index = list.findIndex(
            (item) => item?.custom?.requestId === req.requestId
          );

          // append keys to previours
          if (history?.custom?.path) {
            const data = parseRequestData(req, history);
            pre[index] = data;
            return [...list];
          }
          // history end

          // new request
          const data = parseRequestData(req, {});

          if (
            filterRequestItem(data, {
              filterType,
              filterString,
              filterContentType,
              filterRequestMethod,
            })
          ) {
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
    }, [proxySwitch, filterType, filterString, filterContentType, filterRequestMethod]);

    // 请求过滤
    useEffect(() => {
      if (!proxySwitch) {
        return;
      }
      setList((pre: any) => {
        const list = filterRequestList(pre, {
          filterType,
          filterString,
          filterContentType,
          filterRequestMethod,
        });

        return list;
      });
    }, [
      proxySwitch,
      filterType,
      filterString,
      filterContentType,
      filterRequestMethod,
    ]);

    return {
      list,
      clean,
    };
  };
}

export default useRequest;
