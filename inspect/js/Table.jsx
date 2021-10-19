import { Ctx } from "./useData";
const { useContext } = React;

const Table = (props) => {
  const { list } = props;
  const { dispatch } = useContext(Ctx);
  const onClick = (req) => {
    dispatch({ type: "setShowDetail", showDetail: true });
    if (req.custom.requestId) {
      dispatch({ type: "setRequestId", requestId: req.custom.requestId });
    }
  };

  return (
    <div className="table-box scrollbar-style">
      <table className="table">
        <thead>
          <td className="status">status</td>
          <td className="type">type</td>
          <td className="method">method</td>
          <td className="protocol">protocol</td>
          <td className="host">host</td>
          <td className="path">path</td>
          <td className="speed">speed</td>
        </thead>

        <tbody>
          {list.map((req) => {
            return (
              <tr onClick={onClick.bind(null, req)}>
                <td>{req.custom.statusCode}</td>
                <td>Local</td>
                <td>{req.custom.method}</td>
                <td>{req.custom.protocol}</td>
                <td>{req.custom.host}</td>
                <td title={req.custom.path}>{req.custom.path.slice(0, 80)}</td>
                <td>200ms</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
