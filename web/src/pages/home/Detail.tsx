import { useContext, useEffect, useState } from "react";
import { Ctx } from "../../ctx";
import { buffer2string } from '../../modules/string';
import './detail.scss';

const tabList = [
  {
    label: '概览',
    value: 'custom',
  },
  {
    label: '请求头',
    value: 'requestHeaders',
  },
  {
    label: '请求参数',
    value: 'requestParams',
  },
  {
    label: 'POST参数',
    value: 'postData',
  },
  {
    label: '响应头',
    value: 'responseHeader',
  },
  {
    label: '响应内容',
    value: 'responseBody',
  }
];

const Detail = (props: any) => {
  const { state, dispatch } = useContext(Ctx);
  const [ showBody, setShowBody ] = useState('');
  const { detail = {} } = props;
  const { showDetail, detailActiveTab } = state;
  const { custom = {} } = detail || {};
  // console.log('detail', detail);

  // if ( detailActiveTab === 'responseBody' && custom && listItem.responseHeader && listItem.responseHeader['content-type'] && listItem.responseHeader['content-type'].includes('image/')) {
  //   detail = <div className="image-preview-box"><img className="image-preview" src={custom.url} /></div>;
  // }

  // view text
  useEffect(() => {
    setShowBody('处理中...');
    detail && setTimeout(() => {
      const body = buffer2string(detail.responseBody, detail.responseHeader['content-encoding']);
      setShowBody(body);
    }, 300);
  }, [detailActiveTab, detail]);

  useEffect(() => {
    if(!showDetail) {
      setShowBody('');
    }
  }, [showDetail])

  const onClose = () => {
    dispatch({ type: 'setShowDetail', showDetail: false});
  };
  const onTabChange = (tabValue: string) => {
    dispatch({ type: 'setDetailActiveTab', detailActiveTab: tabValue});
  };
  const openUrl = (url: string): void => {
    window.open(url);
  };

  if (!showDetail) {
    return null;
  }

  return (<div className={`detail ${showDetail?'open':''}`}>
    <div className="mask" onClick={onClose} />
    <div className="content">
      <div className="url" onClick={openUrl.bind(null, custom.url)}>{custom ? `${custom.statusCode||'Pendding'} ${custom.method} ${custom.origin}${custom.path}`: ''}</div>
      <div className="tabs">
        <ul>
          {
            custom && tabList.map((tab) => {
              if(custom?.method === 'GET' && tab.value === 'postData') {
                return null;
              }
              return <li onClick={onTabChange.bind(null, tab.value)} key={tab.value} className={`${detailActiveTab === tab.value ? 'active' : ''}`}>{tab.label}</li>;
            })
          }
        </ul>
      </div>

      {detailActiveTab !== 'responseBody' ? <div className="form scrollbar-style">
        {detail && detail[detailActiveTab] && Object.keys(detail[detailActiveTab]).map(key => (
          <div className="form-item" key={key}>
            <label>{key}:</label>
            <div className="form-item-value">{detail[detailActiveTab][key].toString()}</div>
          </div>
        ))}
      </div> : null}
      {detailActiveTab === 'responseBody' ? <div className="body-panel scrollbar-style">
        {showBody || '不支持预览'}
      </div> : null}
    </div>
  </div>)
};

export default Detail;
