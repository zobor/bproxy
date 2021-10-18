import { Ctx } from './useData';
const { useContext } = React;

const Detail = () => {
  const { state, dispatch } = useContext(Ctx);
  const { showDetail } = state;
  const onClose = () => {
    dispatch({ type: 'setShowDetail', showDetail: false});
  }

  return (<div className={`detail ${showDetail?'open':''}`}>
    <div className="mask" onClick={onClose} />
    <div className="content">
      <div className="tabs">
        <ul>
          <li>Custom</li>
          <li>Request Headers</li>
          <li className="active">Request Params</li>
          <li>Request Form</li>
          <li>Response Headers</li>
          <li>Response Body</li>
        </ul>
      </div>

      <div className="form">
        <div className="form-item">
          <label>content-type:</label>
          <div className="form-item-value">text/html</div>
        </div>
        <div className="form-item">
          <label>content-type:</label>
          <div className="form-item-value">text/html</div>
        </div>
        <div className="form-item">
          <label>content-type:</label>
          <div className="form-item-value">text/html</div>
        </div>
      </div>
    </div>
  </div>)
};

export default Detail;
