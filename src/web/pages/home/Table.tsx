import { useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import { Ctx } from "../../ctx";
import './table.scss';
import { HttpRequestRequest } from '../../../types/web';
import { formatSeconds } from '../../../proxy/utils/format';

const Table = (props: any) => {
  const { list } = props;
  const { state, dispatch } = useContext(Ctx);
  const { requestId } = state;
  const $table = useRef<HTMLTableElement>(null);
  const onClick = (req: any) => {
    dispatch({ type: "setShowDetail", showDetail: true });
    if (req.custom.requestId) {
      dispatch({ type: "setRequestId", requestId: req.custom.requestId });
    }
  };

  // useEffect(() => {
  //   if ($table.current) {
  //     setTimeout(() => {
  //         $table.current?.querySelector('tbody tr:last-child')?.scrollIntoView({
  //         behavior: 'smooth',
  //       });
  //     });
  //   }
  // }, [list.length]);

  return (
    <div className="table-box scrollbar-style">
      <table className="table" ref={$table}>
        <thead>
          <tr>
            <td>状态</td>
            <td className="matched">匹配</td>
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
              <tr className={classNames({
                active: requestId === req?.custom?.requestId,
                error: statusCode.indexOf('4') === 0 || statusCode.indexOf('5') === 0,
                matched: req.matched,
              })} onClick={onClick.bind(null, req)} key={req?.custom?.requestId}>
                <td className={classNames({
                  status: true,
                })}>{req?.custom?.statusCode}</td>
                <td className="matched">{req.matched ? '✔' : '✘'}</td>
                <td className="method">{req?.custom?.method}</td>
                <td className="protocol">{req?.custom?.protocol}</td>
                <td className="host" title={req?.custom?.host}>{req?.custom?.host?.slice(0,25)}</td>
                <td className="path" title={req?.custom?.path}>{req?.custom?.path?.slice(0, 80)}</td>
                <td className="contentType">{req?.responseHeaders && (req?.responseHeaders['content-type']||'').replace(/;\s?\S+/, '').slice(0,25)}</td>
                <td className="speed">{req.requestStartTime && req.requestEndTime ? `${formatSeconds(req.requestEndTime - req.requestStartTime)}` : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {list.length === 0 ? <div className="empty-tip">我在等待 HTTP 请求的到来...</div> : null}
    </div>
  );
};

export default Table;
