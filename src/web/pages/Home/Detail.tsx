import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { get, isArray, isEmpty, isObject, isString } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import { isLikeJson } from '../../../utils/check';
import { isDetailViewable } from '../../../utils/is';
import Icon from '../../components/Icon';
import { Button, Modal, Tooltip, message } from '../../components/UI';
import ViewAll from '../../components/ViewAll';
import useBool from '../../hooks/useBool';
import { buffer2string, textDecode } from '../../modules/buffer';
import { copyText } from '../../modules/copy';
import { openUrl } from '../../modules/interactive';
import { formatObjectKeyRender } from '../../modules/util';
import { Ctx } from '../ctx';
import './Detail.scss';
import { tabList } from './settings';
import pageConfig from '../../pageConfig';
import jsonFormat from '../../../utils/jsonFormat';
import { parseJSON } from '../../../utils/utils';

// 提示304解决办法
const remove304 = (path: string) => {
  const tips = `\n\n<span class='tips'>如何禁用缓存?\n代理规则添加：<b>{ regx: '${path}', disableCache: true }</b></span>`;
  return `没有数据可以预览${tips}`;
};

// 显示格式化json
const showFormatJson = (jsonText) => {
  Modal.success({
    width: '50vw',
    content: (
      <pre className="prettyprint lang-json" style={{ maxWidth: '80vw' }}>
        <code>{jsonText}</code>
      </pre>
    ),
  });
};

// 复制curl
const copyCurl = (e, detail) => {
  const txt = [`curl -X ${detail?.custom.method} `];
  const type = get(detail, 'requestHeaders["content-type"]');
  const isForm = type?.includes('form');
  const { postData } = detail;
  Object.keys(detail.requestHeaders || {})
    .filter((key) => key.toLowerCase() !== 'accept-encoding')
    .forEach((key: string) => {
      txt.push(` -H "${key}: ${detail.requestHeaders[key].replace(/"/g, "'")}" `);
    });
  if (!isEmpty(postData)) {
    if (isForm) {
      txt.push(
        ' -d "' +
          Object.keys(postData)
            .map((key: string) => `${key}=${postData[key]}`)
            .join('&') +
          '"',
      );
    }
  }

  txt.push(` ${detail?.custom?.url} `);

  const text = txt.join('').replace(/\s{2,}/g, ' ');
  copy(text);
  message.success('已复制');
};

// cookie表格视图
const CookiesView = (props: { cookies: string[] }): React.ReactElement<any, any> | null => {
  const { cookies } = props;
  if (!(cookies && cookies.length)) {
    return null;
  }
  return (
    <table className="data-table">
      {/* <caption>Cookies</caption> */}
      <thead>
        <tr>
          <td style={{ width: '20%' }}>key</td>
          <td>value</td>
        </tr>
      </thead>
      <tbody>
        {cookies.map((str: string, index: number) => {
          const arr = str.replace(/^(\w+)=/, '$1 ').split(' ');
          if (!(arr && arr.length === 2)) {
            return null;
          }
          const text = decodeURIComponent(arr[1]);
          return arr && arr.length === 2 ? (
            <tr key={`${arr[0]}-${arr[1]}-${index}`}>
              <td>{arr[0]}</td>
              <td onClick={(e) => copyText(e, text)}>
                <ViewAll limit={200}>{text}</ViewAll>
              </td>
            </tr>
          ) : null;
        })}
      </tbody>
    </table>
  );
};

// key value 表格视图
const keyValueTable = (objects) => {
  return (
    <table className="kv-table">
      <tbody>
        {Object.keys(objects).map((key) => {
          let dataValue = objects[key];
          if (
            ['if-modified-since', 'expires', 'last-modified', 'date', 'x-swift-savetime'].includes(
              key.toLocaleLowerCase(),
            )
          ) {
            try {
              dataValue = `${dataValue}`;
            } catch (err) {}
          }
          const text = isObject(dataValue) ? JSON.stringify(dataValue) : dataValue;

          return (
            <tr key={key}>
              <td title={key}>
                <span
                  className={classNames({
                    'max-text-limit-2': true,
                    'bproxy-key': key?.includes('x-bproxy'),
                  })}
                >
                  {key}:
                </span>
              </td>
              <td>
                <span className="max-text-limit2">
                  <span onClick={(e) => copyText(e, text)}>
                    <ViewAll limit={200}>{formatObjectKeyRender(text)}</ViewAll>
                  </span>
                  {isLikeJson(text) ? (
                    <Tooltip title="格式化">
                      <span onClick={showFormatJson.bind(null, text)} className="format-btn">
                        ...
                      </span>
                    </Tooltip>
                  ) : null}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// 内容详情多场景预览
const viewContent = ({ isJson, content, statusCode, urlPath, isImage, isMp4 }) => {
  // 图片预览
  if (isImage && isString(content)) {
    return (
      <div className="image-preview-box">
        {/* <SImage classNames="image-preview" src={content} /> */}
        <a href={content} target="_blank">
          {content}
        </a>
      </div>
    );
  }
  // video 预览
  if (isMp4) {
    return (
      <div className="video-preview-box">
        <video controls src={content}></video>
      </div>
    );
  }
  if (isJson && content.length / (300 * 1024) > 1) {
    return <div className="not-support">JSON超过 300K 不支持预览</div>;
  }
  if (isString(content) && content.length / (1024 * 1024) > 1) {
    return <div className="not-support">文本超过1M不支持预览</div>;
  }
  // json 预览
  if (isJson) {
    let json = {};
    let jsonstr;
    try {
      json = isString(content) ? parseJSON(content) : content;
      jsonstr = isString(content) ? content : JSON.stringify(content);
    } catch (err) {}
    if (jsonstr && jsonstr.length > 1000) {
      return <pre>{jsonFormat(json)}</pre>;
    }
    return <ReactJson src={json} {...(pageConfig as any)} />;
  }
  // 304缓存提示
  if (statusCode === 304) {
    return <div dangerouslySetInnerHTML={{ __html: remove304(urlPath) }} />;
  }
  // 字符预览
  if (isString(content)) {
    return content;
  }
  // web socket预览
  if (isArray(content)) {
    return (
      <ol className="ws-list">
        {content.map((item, idx) => {
          return (
            <li key={`ws-list-li-${idx}`} data-time={item.time}>
              {item.data}
            </li>
          );
        })}
      </ol>
    );
  }

  return null;
};

// 自动mock组件
const AutoMock = (props) => {
  const { detail, visible } = props;
  if (!visible) {
    return null;
  }

  return (
    <div className="handlers">
      <Button type="primary" shape="round" onClick={(e) => copyCurl(e, detail)}>
        Copy CURL
      </Button>
    </div>
  );
};

// tab列表项
const TabList = (props) => {
  const { onClick, detailActiveTab } = props;

  return (
    <div className="tabs">
      <ul>
        {tabList.map((tab) => {
          return (
            <li
              onClick={onClick.bind(null, tab.value)}
              key={tab.value}
              className={classNames({
                active: detailActiveTab === tab.value,
              })}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// url详情查看
const URLViewer = (props) => {
  const { custom, onClose } = props;

  return (
    <div className="detailTop">
      <Icon type="close" onClick={onClose} />
      {custom ? (
        <div title="点击打开此链接" className="url" onClick={openUrl.bind(null, custom.url)}>
          {custom.statusCode || 'Pendding'} {custom.method} {custom.origin}
          {custom.path}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

// kv
const KeyValueViewer = ({ detail, detailActiveTab }) => {
  const data = detail[detailActiveTab];
  if (Array.isArray(data)) {
    return (
      <div className="form scrollbar-style">
        <table className="data-table">
          {data.map((item) => (
            <tr key={item[0]}>
              <td onClick={(e) => copyText(e, item[0])}>{item[0]}</td>
              <td onClick={(e) => copyText(e, decodeURIComponent(item[1]))}>{decodeURIComponent(item[1])}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
  if (isString(data)) {
    return <pre>{data}</pre>;
  }
  return (
    <div
      className={classNames({
        'form scrollbar-style body-panel': true,
        empty: isEmpty(data),
      })}
    >
      {!isEmpty(data) ? keyValueTable(data) : null}
    </div>
  );
};

// params
const ParamsView = ({ detail, cookies }) => {
  return (
    <>
      <div className="params-view scrollbar-style body-panel">
        <div className="title">概览</div>
        <KeyValueViewer detail={detail} detailActiveTab="custom" />
        <div className="title">URL参数</div>
        {isEmpty(detail.requestParams) ? (
          <div className="emptyText">无</div>
        ) : (
          <KeyValueViewer detail={detail} detailActiveTab="requestParams" />
        )}
        <div className="title">POST参数</div>
        {isEmpty(detail.postData) ? (
          <div className="emptyText">无</div>
        ) : (
          <KeyValueViewer detail={detail} detailActiveTab="postData" />
        )}
        <div className="title">请求头</div>
        {isEmpty(detail.requestHeaders) ? (
          <div className="emptyText">无</div>
        ) : (
          <KeyValueViewer detail={detail} detailActiveTab="requestHeaders" />
        )}
        <div className="title">Cookies</div>
        <CookiesView cookies={cookies} />
      </div>
    </>
  );
};

// raw
const RawViewer = ({ detail, isJSON }) => {
  if (isEmpty(detail)) {
    return null;
  }
  let body = '';
  const { postData: pData } = detail;
  let postData = '';
  try {
    if (Array.isArray(pData)) {
      postData = pData.map((item) => `${item[0]}=${item[1]}`).join('&');
    } else {
      postData = JSON.stringify(pData);
    }
  } catch (err) {}
  try {
    if (isJSON) {
      body = JSON.stringify(parseJSON(detail.responseBody));
    }
  } catch (err) {}
  return (
    <div className="raw-body scrollbar-style">
      <div className="title">URL Query</div>
      <div style={{ color: 'rgb(229, 152, 102)' }}>
        {isEmpty(detail.requestParams) ? '无' : JSON.stringify(detail.requestParams)}
      </div>
      <div className="title">POST Data</div>
      <div style={{ color: 'rgb(229, 152, 102)' }}>{isEmpty(postData) ? '无' : postData}</div>
      <div className="title">Request Headers</div>
      <div style={{ color: 'rgb(229, 152, 102)', fontSize: 12 }}>
        <ViewAll limit={200}>{JSON.stringify(detail.requestHeaders)}</ViewAll>
      </div>
      <div className="title">Response</div>
      <div style={{ fontSize: 13, color: 'rgb(229, 152, 102)' }}>{isJSON ? body : null} </div>
    </div>
  );
};

// body
const BodyViewer = ({ isJSON, isHTML, detail, showBody, canView, custom, isImage, isMp4 }) => {
  return (
    <div className="body-panel scrollbar-style">
      <AutoMock visible={true} isJSON={isJSON} isHTML={isHTML} detail={detail} />
      {canView ? (
        <div className="response-viewer">
          {viewContent({
            isJson: isJSON,
            content: showBody,
            statusCode: custom.statusCode,
            urlPath: custom.path,
            isImage,
            isMp4,
          })}
        </div>
      ) : (
        <div className="not-support">不支持预览</div>
      )}
    </div>
  );
};

const Detail = (props: any): React.ReactElement<any, any> | null => {
  const { state, dispatch } = useContext(Ctx);
  useBool(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [showBody, setShowBody] = useState<string | React.ReactElement<any, any>>('');
  const { detail = {} } = props;
  const { showDetail, detailActiveTab } = state;
  const { custom = {} } = detail || {};
  const contentType = (get(detail, 'responseHeaders["content-type"]') || '').toLowerCase();
  const $isJson = useRef(contentType?.includes('/json'));
  const isImage = contentType?.includes('image/');
  const isMp4 = contentType?.includes('/mp4');
  const isHTML = contentType?.includes('/html');
  const isUtf8 = contentType?.includes('/utf-8');
  const isEncoding = get(detail, 'responseHeaders["content-encoding"]');
  const isChunked = get(detail, 'responseHeaders[transfer-encoding]') === 'chunked';
  const cookies = (get(detail, 'requestHeaders.cookie') || '').split('; ').filter((item) => !!item);
  const canView = isDetailViewable(get(detail, 'responseHeaders')) || isImage || isMp4;

  // body解析
  useEffect(() => {
    setShowBody('处理中...');
    $isJson.current = false;
    // image
    if (isImage || isMp4) {
      setShowBody(detail?.custom?.url);
      $isJson.current = false;
    } else {
      let body;

      if (isString(detail?.responseBody) || ['wss', 'ws'].includes(detail?.custom?.method)) {
        // 字符串
        body = detail?.responseBody;
      } else if (isChunked && !isEncoding) {
        body = textDecode(detail?.responseBody);
      } else {
        body = buffer2string(detail?.responseBody, isEncoding, isUtf8);
      }

      // json 格式化加工
      if (body && isString(body) && ($isJson.current || isLikeJson(body))) {
        try {
          body = parseJSON(body);
          $isJson.current = true;
        } catch (err) {}
      }

      setShowBody(body);
    }
  }, [detailActiveTab, detail, showDetail, detail?.requestEndTime]);

  // 关闭之后 清空body
  useEffect(() => {
    if (!showDetail) {
      setShowBody('');
    }
  }, [showDetail]);

  const onClose = (): void => {
    setVisible(false);
    dispatch({ type: 'setShowDetail', showDetail: false });
  };
  const onTabChange = (tabValue: string): void => {
    dispatch({ type: 'setDetailActiveTab', detailActiveTab: tabValue });
  };

  // 快捷键
  useEffect(() => {
    const onKeyPress = (e) => {
      const index = tabList.findIndex((item) => item.value === detailActiveTab);
      const length = tabList.length;
      // right
      if (e.keyCode === 39) {
        const newIndex = index === length - 1 ? 0 : index + 1;
        onTabChange(tabList[newIndex].value);
      } else if (e.keyCode === 37) {
        // left
        const newIndex = index === 0 ? length - 1 : index - 1;
        onTabChange(tabList[newIndex].value);
      }
    };
    document.body.addEventListener('keydown', onKeyPress);

    return () => {
      document.body.removeEventListener('keydown', onKeyPress);
    };
  }, [detailActiveTab]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => {
      setVisible(false);
    };
  }, []);

  if (!showDetail || isEmpty(detail) || isEmpty(custom)) {
    return null;
  }

  return (
    <div
      className={classNames({
        detail: true,
        open: visible,
        vertical: window.innerHeight > window.innerWidth,
      })}
    >
      <div className="content">
        {/* URL */}
        <URLViewer custom={custom} onClose={onClose} />
        {/* Tabs */}
        <TabList onClick={onTabChange} detailActiveTab={detailActiveTab} />
        {/* Body / keyValue viewer */}

        {detailActiveTab === 'requestHeaders' && <ParamsView detail={detail} cookies={cookies} />}
        {detailActiveTab === 'responseHeaders' && <KeyValueViewer detail={detail} detailActiveTab={detailActiveTab} />}
        {detailActiveTab == 'responseBody' && (
          <BodyViewer
            isJSON={$isJson.current}
            isHTML={isHTML}
            custom={custom}
            detail={detail}
            showBody={showBody}
            canView={canView}
            isImage={isImage}
            isMp4={isMp4}
          />
        )}
        {detailActiveTab === 'raw' && <RawViewer detail={detail} isJSON={$isJson.current} />}
      </div>
    </div>
  );
};

export default Detail;
