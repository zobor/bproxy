import { useContext } from "react";
import { Ctx } from "../../ctx";
import { buffer2string } from '../../modules/string';
import './detail.scss';

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

const Detail = (props: any) => {
  const { state, dispatch } = useContext(Ctx);
  const { list } = props;
  const { showDetail, detailActiveTab, requestId } = state;
  const listItem = list.length ? list.find((item: any) => item.custom && item.custom.requestId === requestId) : null;
  let detail = detailActiveTab && listItem && listItem[detailActiveTab] ? listItem[detailActiveTab] : null;
  const custom = listItem && detailActiveTab && listItem.custom ? listItem.custom : null;

  if ( detailActiveTab === 'responseBody' && custom && listItem.responseHeader && listItem.responseHeader['content-type'] && listItem.responseHeader['content-type'].includes('image/')) {
    detail = <div className="image-preview-box"><img className="image-preview" src={custom.url} /></div>;
  }

  if (detailActiveTab === 'responseBody' && custom && listItem.responseHeader) {
    detail = buffer2string(detail, listItem.responseHeader['content-encoding']);
  }

  const onClose = () => {
    dispatch({ type: 'setShowDetail', showDetail: false});
  };
  const onTabChange = (tabValue: string) => {
    dispatch({ type: 'setDetailActiveTab', detailActiveTab: tabValue});
  };

  if (!showDetail) {
    return null;
  }

  return (<div className={`detail ${showDetail?'open':''}`}>
    <div className="mask" onClick={onClose} />
    <div className="content">
      <div className="url">{custom ? `${custom.protocol} ${custom.method} ${custom.statusCode} ${custom.path}`: ''}</div>
      <div className="tabs">
        <ul>
          {
            tabList.map((tab) => {
              if(custom?.method === 'GET' && tab.value === 'postData') {
                return null;
              }
              return <li onClick={onTabChange.bind(null, tab.value)} key={tab.value} className={`${detailActiveTab === tab.value ? 'active' : ''}`}>{tab.label}</li>;
            })
          }
        </ul>
      </div>

      {detailActiveTab !== 'responseBody' ? <div className="form scrollbar-style">
        {detail && Object.keys(detail).map(key => (
          <div className="form-item" key={key}>
            <label>{key}:</label>
            <div className="form-item-value">{detail[key].toString()}</div>
          </div>
        ))}
      </div> : null}
      {detailActiveTab === 'responseBody' ? <div className="body-panel scrollbar-style">
        {detail || '不支持预览'}
      </div> : null}
    </div>
  </div>)
};

export default Detail;
