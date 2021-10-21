import { useContext } from "react";
import classNames from "classnames";
import { Ctx } from "../../ctx";
import './table.scss';

const Table = (props: any) => {
  const { list } = props;
  const { state, dispatch } = useContext(Ctx);
  const { requestId } = state;
  const onClick = (req: any) => {
    dispatch({ type: "setShowDetail", showDetail: true });
    if (req.custom.requestId) {
      dispatch({ type: "setRequestId", requestId: req.custom.requestId });
    }
  };

  return (
    <div className="table-box scrollbar-style">
      <table className="table">
        <thead>
          <tr>
            <td>状态</td>
            <td>type</td>
            <td>方式</td>
            <td>协议</td>
            <td>域名</td>
            <td>地址</td>
            <td>类型</td>
            <td>耗时</td>
          </tr>
        </thead>

        <tbody>
          {list.map((req: any) => {
            return (
              <tr className={classNames({
                active: requestId === req?.custom?.requestId,
              })} onClick={onClick.bind(null, req)} key={req.custom.requestId}>
                <td className="status">{req.custom.statusCode}</td>
                <td className="type">Local</td>
                <td className="method">{req.custom.method}</td>
                <td className="protocol">{req.custom.protocol}</td>
                <td className="host" title={req.custom.host}>{req.custom.host.slice(0,25)}</td>
                <td className="path" title={req.custom.path}>{req.custom.path.slice(0, 80)}</td>
                <td className="contentType">{req.responseHeader && (req.responseHeader['content-type']||'').replace(/;\s\S+/, '').slice(0,25)}</td>
                <td className="speed">{req.requestStartTime && req.requestEndTime ? `${req.requestEndTime - req.requestStartTime}ms` : '-'}</td>
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
