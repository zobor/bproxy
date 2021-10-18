import { Ctx } from './useData';
const { useContext } = React;


const Table = (props) => {
  const { list } = props;
  const { dispatch } = useContext(Ctx);
  const onClick = () => {
    dispatch({ type: 'setShowDetail', showDetail: true });
  };

  return (<table className="table">
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
      {list.map((item) => {
        return (
          <tr onClick={onClick}>
            <td>200</td>
            <td>Local</td>
            <td>{item.method}</td>
            <td>{item.protocol}</td>
            <td>{item.host}</td>
            <td>{item.path}</td>
            <td>200ms</td>
          </tr>
        );
      })}
    </tbody>
  </table>);
};


export default Table;
