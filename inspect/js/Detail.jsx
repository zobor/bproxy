import { Ctx } from './useData';
const { useContext } = React;

const tabList = [
  {
    label: 'Custom',
    value: 'custom',
  },
  {
    label: 'Request Headers',
    value: 'requestHeaders',
  },
  {
    label: 'Request Query',
    value: 'requestParams',
  },
  {
    label: 'Post Data',
    value: 'postData',
  },
  {
    label: 'Response Headers',
    value: 'responseHeader',
  },
  {
    label: 'Response Body',
    value: 'responseBody',
  }
];

const Detail = (props) => {
  const { state, dispatch } = useContext(Ctx);
  const { list } = props;
  const { showDetail, detailActiveTab, requestId } = state;
  const listItem = list.length ? list.find(item => item.custom && item.custom.requestId === requestId) : null;
  const detail = detailActiveTab && listItem && listItem[detailActiveTab] ? listItem[detailActiveTab] : null;
  const custom = listItem && detailActiveTab && listItem.custom ? listItem.custom : null;
  const onClose = () => {
    dispatch({ type: 'setShowDetail', showDetail: false});
  };
  const onTabChange = (tabValue) => {
    dispatch({ type: 'setDetailActiveTab', detailActiveTab: tabValue});
  };

  return (<div className={`detail ${showDetail?'open':''}`}>
    <div className="mask" onClick={onClose} />
    <div className="content">
      <div className="url">{custom ? `${custom.method} ${custom.path}`: ''}</div>
      <div className="tabs">
        <ul>
          {
            tabList.map((tab) => (<li onClick={onTabChange.bind(null, tab.value)} key={tab.value} className={`${detailActiveTab === tab.value ? 'active' : ''}`}>{tab.label}</li>))
          }
        </ul>
      </div>

      {detail && detailActiveTab !== 'responseBody' ? <div className="form">
        {Object.keys(detail).map(key => (
          <div className="form-item">
            <label>{key}:</label>
            <div className="form-item-value">{detail[key]}</div>
          </div>
        ))}
      </div> : null}
      {detail && detailActiveTab === 'responseBody' ? <div className="body-panel">
        {detail}
      </div> : null}
    </div>
  </div>)
};

export default Detail;
