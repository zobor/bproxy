import classNames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';
import { formatSeconds } from '../../../proxy/utils/format';
import { HttpRequestRequest } from '../../../types/web';
import isElementVisible from '../../modules/isElementVisible';
import { debounce, get } from '../../modules/lodash';
import {
  decodeURL,
  filterValueIncludes,
  formatFileSize,
  showResponseType
} from '../../modules/util';
import { Ctx } from '../ctx';
import './Table.scss';

const Thead = () => (
  <thead>
    <tr>
      <td align="center">状态</td>
      <td align="center">方式</td>
      <td align="center">协议</td>
      <td>域名</td>
      <td>路径</td>
      <td>类型</td>
      <td>大小</td>
      <td>耗时</td>
      <td>HOST</td>
    </tr>
  </thead>
);

const Table = (props: any) => {
  const { list } = props;
  const { state, dispatch } = useContext(Ctx);
  const { requestId, highlight, fixedToTableBottom } = state;
  const $table = useRef<HTMLTableElement>(null);
  const $loading = useRef<HTMLDivElement>(null);
  const onClick = (req: any) => {
    dispatch({ type: 'setShowDetail', showDetail: true });
    if (req.custom.requestId) {
      dispatch({ type: 'setRequestId', requestId: req.custom.requestId });
    }
  };

  useEffect(() => {
    const onPressESC = (e) => {
      if (e.keyCode === 27) {
        dispatch({ type: 'setShowDetail', showDetail: false });
      }
    };
    document.body.addEventListener('keydown', onPressESC);

    return () => {
      document.body.removeEventListener('keydown', onPressESC);
    };
  }, []);

  useEffect(() => {
    const onScroll = debounce(() => {
      if (isElementVisible($loading.current)) {
        dispatch({ type: 'setFixedToTableBottom', fixedToTableBottom: true });
      } else {
        dispatch({ type: 'setFixedToTableBottom', fixedToTableBottom: false });
      }
    }, 50);

    window.addEventListener('wheel', onScroll);

    return () => {
      window.removeEventListener('wheel', onScroll);
    };
  }, []);

  useEffect(() => {
    if (fixedToTableBottom && $table.current) {
      $table.current.scrollTop = 1000 * 100;
    }
  }, [list.length, fixedToTableBottom]);

  return (
    <div className="table-box scrollbar-style" ref={$table}>
      {list.length ? <table className="table">
        <Thead />
        <tbody>
          {list.map((req: HttpRequestRequest) => {
            const statusCode = `${req?.custom?.statusCode}`;
            let filesize = get(req, 'responseHeaders["content-length"]');
            const contentType = get(req, 'responseHeaders["content-type"]');
            const body = get(req, 'responseBody');

            if (typeof body === 'string' && !filesize) {
              filesize = body.length;
            }

            return (
              <tr
                key={req?.custom?.requestId}
                className={classNames({
                  active: requestId === req?.custom?.requestId,
                  error:
                    statusCode.indexOf('4') === 0 ||
                    statusCode.indexOf('5') === 0,
                  matched: req.matched,
                  highlight:
                    highlight &&
                    filterValueIncludes(req?.custom?.url || '', highlight),
                })}
                onClick={onClick.bind(null, req)}
              >
                {/* statusCode */}
                <td
                  className={classNames({
                    status: true,
                    [`s${req?.custom?.statusCode}`]: !!req?.custom?.statusCode,
                  })}
                >
                  {req?.custom?.statusCode}
                </td>
                {/* method */}
                <td className="method">{req?.custom?.method}</td>
                {/* protocal */}
                <td className="protocol">{req?.custom?.protocol}</td>
                {/* host */}
                <td className="host">
                  <span className="textLimit">{req?.custom?.host}</span>
                </td>
                {/* path */}
                <td className="path">
                  <span className="textLimit">
                    {decodeURL(req?.custom?.path)}
                  </span>
                </td>
                {/* contentType */}
                <td className="contentType">
                  <span
                    className={classNames({
                      [showResponseType(contentType)]: true,
                      textLimit: true,
                    })}
                  >
                    <span className="textLimit">
                      {showResponseType(contentType)}
                    </span>
                  </span>
                </td>
                {/* size */}
                <td className="size">{formatFileSize(filesize)}</td>
                {/* time */}
                <td
                  className={classNames({
                    speed: true,
                    slow:
                      req.requestStartTime &&
                      req.requestEndTime &&
                      req.requestEndTime - req.requestStartTime > 2000,
                  })}
                >
                  <span className="textLimit">
                    {req.requestStartTime && req.requestEndTime
                      ? `${formatSeconds(
                          req.requestEndTime - req.requestStartTime
                        )}`
                      : '-'}
                  </span>
                </td>
                {/* ip */}
                <td className="ip">
                  <span className="textLimit">{req.ip}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table> : <div className="empty-tip">
        暂无数据，您可以尝试开启<span>系统代理</span>再试试。
      </div>}
      <div className={classNames({
        loading: true,
        lock: list.length > 20 && fixedToTableBottom,
      })} ref={$loading} />
    </div>
  );
};

export default Table;
