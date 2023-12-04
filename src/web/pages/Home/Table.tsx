import classNames from 'classnames';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { get } from '../../modules/lodash';
import { formatSeconds, formatUrlPathOfFileName } from '../../../utils/format';
import { decodeURL, filterValueIncludes, formatFileSize, showResponseType } from '../../modules/util';
import { Ctx } from '../ctx';
import './Table.scss';
import TextSearch from './TextSearch';

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
      <td>Server</td>
    </tr>
  </thead>
);

const Table = (props: any) => {
  const { list } = props;
  const [searchList, setSearchList] = useState([]);
  const { state, dispatch } = useContext(Ctx);
  const { requestId, highlight, fixedToTableBottom, showDetail, textSearch } = state;
  const $table = useRef<HTMLTableElement>(null);
  const onClick = useCallback(
    (req: any) => {
      if (requestId === req.custom.requestId && showDetail) {
        dispatch({ type: 'setShowDetail', showDetail: false });
      } else {
        dispatch({ type: 'setShowDetail', showDetail: true });
        if (req.custom.requestId) {
          dispatch({ type: 'setRequestId', requestId: req.custom.requestId });
        }
      }
    },
    [requestId, showDetail],
  );

  useEffect(() => {
    const onPressESC = (e) => {
      // esc close detail
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
    if ($table.current && fixedToTableBottom) {
      $table.current.scrollTop = 1000 * 100;
    }
  }, [list.length, fixedToTableBottom]);

  useEffect(() => {
    if (textSearch.length && list.length) {
      setSearchList(
        list.filter((item) => {
          return item && typeof item.responseBody === 'string' && item.responseBody.includes(textSearch);
        }),
      );
    }
  }, [textSearch, list]);

  const tableList = useMemo(() => {
    return textSearch.length ? searchList : list;
  }, [textSearch, searchList, list]);

  return (
    <div className="table-box scrollbar-style" ref={$table}>
      <TextSearch />
      <table className="table">
        <Thead />
        <tbody className={classNames({ empty: tableList.length === 0 })}>
          {tableList.map((req: any) => {
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
                  error: statusCode.indexOf('4') === 0 || statusCode.indexOf('5') === 0,
                  matched: req.matched,
                  highlight: highlight && filterValueIncludes(req?.custom?.url || '', highlight),
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
                <td
                  className={classNames({
                    method: true,
                    [req?.custom?.method]: true,
                  })}
                >
                  {req?.custom?.method}
                </td>
                {/* protocal */}
                <td className="protocol">{req?.custom?.protocol}</td>
                {/* host */}
                <td className="host">
                  <span className="textLimit">{req?.custom?.host}</span>
                </td>
                {/* path */}
                <td className="path">
                  <span className="textLimit">
                    {formatUrlPathOfFileName(decodeURL(req?.custom?.path)).map((str) => (
                      <span key={`td-${req?.custom?.requestId}-${str}`}>{str}</span>
                    ))}
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
                    <span className="textLimit">{showResponseType(contentType)}</span>
                  </span>
                </td>
                {/* size */}
                <td className="size">{formatFileSize(filesize)}</td>
                {/* time */}
                <td
                  className={classNames({
                    speed: true,
                    slow:
                      req.requestStartTime && req.requestEndTime && req.requestEndTime - req.requestStartTime > 2000,
                  })}
                >
                  <span className="textLimit">
                    {req.requestStartTime && req.requestEndTime
                      ? `${formatSeconds(req.requestEndTime - req.requestStartTime)}`
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
      </table>
    </div>
  );
};

export default Table;
