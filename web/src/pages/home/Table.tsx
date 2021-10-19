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
            <td className="status">status</td>
            <td className="type">type</td>
            <td className="method">method</td>
            <td className="protocol">protocol</td>
            <td className="host">host</td>
            <td className="path">path</td>
            <td className="contentType">Content-Type</td>
            <td className="speed">speed</td>
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
                <td>{req.responseHeader && req.responseHeader['content-type']}</td>
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
