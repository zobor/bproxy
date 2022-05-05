import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { formatSeconds } from "../../proxy/utils/format";
import { HttpRequestRequest } from "../../types/web";
import { Ctx } from "../ctx";
import { queryIpLocation } from '../modules/interactive';
import { formatFileSize, shorthand, showResponseType } from '../modules/util';
import { get } from "../modules/_";
import "./Table.scss";




const Table = (props: any) => {
  const { list } = props;
  const { state, dispatch } = useContext(Ctx);
  const { requestId, highlight, filterContentType } = state;
  const $table = useRef<HTMLTableElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
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
    document.body.addEventListener("keydown", onPressESC);

    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);

    return () => {
      document.body.removeEventListener("keydown", onPressESC);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // const defaultWindowSize = windowWidth < 690 ? 690 : 1326;
  // const shorthandRate = windowWidth / defaultWindowSize;
  // const hostPrefixLength = Math.min(parseInt(`${shorthandRate * 8}`, 10), 8);
  // const hostMaxLength = Math.min(parseInt(`${shorthandRate * 40}`, 10), 40);
  // const pathPrefixLength = Math.min(parseInt(`${shorthandRate * 15}`, 10),20);
  // const pathMaxLength = Math.min(parseInt(`${shorthandRate * 40}`, 10), 40);
  const hostPrefixLength = 8;
  const hostMaxLength = 40;
  const pathPrefixLength = 20;
  const pathMaxLength = 40;

  if (list.length === 0) {
    return <div className="empty-tip">
      暂无数据，您可以尝试开启<span>系统代理</span>再试试。
    </div>;
  }

  return (
    <div className="table-box scrollbar-style">
      <table className="table" ref={$table}>
        <thead>
          <tr>
            <td>状态</td>
            <td>方式</td>
            <td>协议</td>
            <td>域名</td>
            <td>路径</td>
            <td>类型</td>
            <td>大小</td>
            <td>耗时</td>
            <td>HOST</td>
          </tr>
        </thead>

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
                    [`s${req?.custom?.statusCode}`]: !!req?.custom?.statusCode,
                  })}
                >
                  {req?.custom?.statusCode}
                </td>
                <td className="method">{req?.custom?.method}</td>
                <td className="protocol">{req?.custom?.protocol}</td>
                <td className="host" title={req?.custom?.host}>
                  {shorthand(req?.custom?.host, hostPrefixLength, hostMaxLength)}
                </td>
                <td className="path" title={req?.custom?.path}>
                  {shorthand(req?.custom?.path, pathPrefixLength, pathMaxLength)}
                </td>
                <td className="contentType">
                  <span className={showResponseType(contentType)}>
                    {showResponseType(contentType)}
                  </span>
                </td>
                <td className="size">
                  {formatFileSize(filesize)}
                </td>
                <td
                  className={classNames({
                    speed: true,
                    slow:
                      req.requestStartTime &&
                      req.requestEndTime &&
                      req.requestEndTime - req.requestStartTime > 2000,
                  })}
                >
                  {req.requestStartTime && req.requestEndTime
                    ? `${formatSeconds(
                        req.requestEndTime - req.requestStartTime
                      )}`
                    : "-"}
                </td>
                <td
                  className="ip"
                  onClick={() => {
                    queryIpLocation(req.ip || '');
                    setTimeout(() => {
                      dispatch({ type: "setShowDetail", showDetail: false });
                    }, 10);
                    return false;
                  }}
                >
                  {req.ip}
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
