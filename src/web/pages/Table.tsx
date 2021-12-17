import { useContext, useEffect, useRef } from "react";
import classNames from "classnames";

import { Ctx } from "../ctx";
import { HttpRequestRequest } from '../../types/web';
import { formatSeconds } from '../../proxy/utils/format';
import { take, takeRight } from "../modules/_";
import { Tooltip } from "../components/UI";

import './table.scss';

const shorthand = (str, len = 20, max = 40) => {
  if (str.length > max) {
    const arr = str.split('');
    const arr1 = take(arr, len);
    const arr2 = takeRight(arr, len);

    return `${arr1.join('')}...${arr2.join('')}`;
  }
  return str;
}

const Table = (props: any) => {
  const { list } = props;
  const { state, dispatch } = useContext(Ctx);
  const { requestId, highlight } = state;
  const $table = useRef<HTMLTableElement>(null);
  const onClick = (req: any) => {
    dispatch({ type: "setShowDetail", showDetail: true });
    if (req.custom.requestId) {
      dispatch({ type: "setRequestId", requestId: req.custom.requestId });
    }
  };

  useEffect(() => {
    const onPressESC = (e) => {
      if (e.keyCode === 27) {
        dispatch({ type: "setShowDetail", showDetail: false });
      }
    };
    document.body.addEventListener('keydown', onPressESC);

    return () => {
      document.body.removeEventListener('keydown', onPressESC);
    }
  }, []);

  if (list.length === 0) {
    return <div className="empty-tip">我在等待 HTTP 请求的到来...</div>;
  }

  return (
    <div className="table-box scrollbar-style">
      <table className="table" ref={$table}>
        <thead>
          <tr>
            <td>状态</td>
            <td className="matched">
              <Tooltip title="✔表示匹配了bproxy的规则">匹配</Tooltip>
            </td>
            <td>方式</td>
            <td>协议</td>
            <td>域名</td>
            <td>地址</td>
            <td>类型</td>
            <td>耗时</td>
          </tr>
        </thead>

        <tbody>
          {list.map((req: HttpRequestRequest) => {
            const statusCode = `${req?.custom?.statusCode}`;
            return (
              <tr
                key={req?.custom?.requestId}
                className={classNames({
                  active: requestId === req?.custom?.requestId,
                  error:
                    statusCode.indexOf("4") === 0 ||
                    statusCode.indexOf("5") === 0,
                  matched: req.matched,
                  highlight: highlight && req?.custom?.url?.includes(highlight),
                })}
                onClick={onClick.bind(null, req)}
              >
                <td
                  className={classNames({
                    status: true,
                    [`s${req?.custom?.statusCode}`]: !!req?.custom?.statusCode
                  })}
                >
                  {req?.custom?.statusCode}
                </td>
                <td
                  className="matched"
                >
                  {req.matched ? "✔" : "-"}
                </td>
                <td className="method">{req?.custom?.method}</td>
                <td className="protocol">{req?.custom?.protocol}</td>
                <td className="host" title={req?.custom?.host}>
                  {shorthand(req?.custom?.host, 10, 20)}
                </td>
                <td className="path" title={req?.custom?.path}>
                  {shorthand(req?.custom?.path)}
                </td>
                <td className="contentType">
                  {req?.responseHeaders &&
                    (req?.responseHeaders["content-type"] || "-")
                      .replace(/;\s?\S+/, "")
                      .slice(0, 25)}
                </td>
                <td className={classNames({
                  speed: true,
                  slow: req.requestStartTime && req.requestEndTime && (req.requestEndTime - req.requestStartTime) > 2000,
                })}>
                  {req.requestStartTime && req.requestEndTime
                    ? `${formatSeconds(
                        req.requestEndTime - req.requestStartTime
                      )}`
                    : "-"}
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
