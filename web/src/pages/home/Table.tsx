import { useContext } from "react";
import { Ctx } from "../../ctx";

const Table = (props: any) => {
  const { list } = props;
  const { dispatch } = useContext(Ctx);
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
            <td className="status">状态</td>
            <td className="type">type</td>
            <td className="method">方式</td>
            <td className="protocol">协议</td>
            <td className="host">域名</td>
            <td className="path">地址</td>
            <td className="contentType">类型</td>
            <td className="speed">耗时</td>
          </tr>
        </thead>

        <tbody>
          {list.map((req: any) => {
            return (
              <tr onClick={onClick.bind(null, req)} key={req.custom.requestId}>
                <td>{req.custom.statusCode}</td>
                <td>Local</td>
                <td>{req.custom.method}</td>
                <td>{req.custom.protocol}</td>
                <td>{req.custom.host}</td>
                <td title={req.custom.path}>{req.custom.path.slice(0, 80)}</td>
                <td>{req.responseHeader && (req.responseHeader['content-type']||'').replace(/charset=\S+/, '')}</td>
                <td>{req.requestStartTime && req.requestEndTime ? `${req.requestEndTime - req.requestStartTime}ms` : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
