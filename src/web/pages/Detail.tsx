import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { Ctx } from '../ctx';
import { buffer2string, textDecode } from '../modules/buffer';
import JSONFormat from '../libs/jsonFormat';
import { tabList } from './settings';
import { Button, message, Tooltip } from '../components/UI';
import SImage from '../components/SImage';
import { get, isObject, isString, isEmpty, isArray } from '../modules/_';
import {
  findLinkFromString,
  formatWsSymbol,
  isLikeJson,
} from '../modules/util';
import { isDetailViewAble } from '../../proxy/utils/is';
import { copyTextOnClick, openUrl } from '../modules/interactive';
import useBool from '../hooks/useBool';
import {
  getConfigFilePath,
  insertRemoteInspectRule,
  updateConfigFile,
} from '../modules/bridge';

import '../libs/code-prettify.css';
import './Detail.scss';
import classnames from 'classnames';

// 提示304解决办法
const remove304 = (path: string) => {
  const tips = `\n\n<span class='tips'>如何禁用缓存?\n代理规则添加：<b>{ regx: '${path}', disableCache: true }</b></span>`;
  return `没有数据可以预览${tips}`;
};

// 点击复制文本
const copyText = (e, text) => {
  copyTextOnClick(e.target, text);
  message.success('已复制');
};

// cookie表格视图
const CookiesView = (props: {
  cookies: string[];
}): React.ReactElement<any, any> | null => {
  const { cookies } = props;
  if (!(cookies && cookies.length)) {
    return null;
  }
  return (
    <table className="data-table">
      <caption>Cookies</caption>
      <thead>
        <tr>
          <td style={{ width: '20%' }}>key</td>
          <td>value</td>
        </tr>
      </thead>
      <tbody>
        {cookies.map((str: string) => {
          const arr = str.replace(/^(\w+)=/, '$1 ').split(' ');
          if (!(arr && arr.length === 2)) {
            return null;
          }
          const text = decodeURIComponent(arr[1]);
          return arr && arr.length === 2 ? (
            <tr key={`${arr[0]}-${arr[1]}`}>
              <td>{arr[0]}</td>
              <td onClick={(e) => copyText(e, text)}>
                <span>{text}</span>
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
      {Object.keys(objects)
        .filter((key) => key !== '$$type')
        .map((key) => {
          let dataValue = objects[key];
          if (
            [
              'if-modified-since',
              'expires',
              'last-modified',
              'date',
              'x-swift-savetime',
            ].includes(key.toLocaleLowerCase())
          ) {
            try {
              dataValue = `${dataValue} -> (${moment(dataValue).format(
                'YYYY-MM-DD HH:mm:ss'
              )})`;
            } catch (err) {}
          }
          const text = isObject(dataValue)
            ? JSON.stringify(dataValue)
            : (dataValue || '').toString();

          return (
            <tr key={key}>
              <td title={key}>
                <span className={classnames({
                  'max-text-limit-2': true,
                  'bproxy-key': key?.includes('x-bproxy'),
                })}>{key}: </span>
              </td>
              <td>
                <span
                  title={text}
                  onClick={(e) => copyText(e, text)}
                  className="max-text-limit2"
                >
                  {text}
                </span>
              </td>
            </tr>
          );
        })}
    </table>
  );
};

// 内容详情多场景预览
const viewContent = ({ isJson, content, statusCode, urlPath, isImage, isMp4 }) => {
  // 图片预览
  if (isImage) {
    return (
      <div className="image-preview-box">
        <SImage classNames="image-preview" src={content} />
      </div>
    );
  }
  // video 预览
  if (isMp4) {
    return <div className='video-preview-box'>
      <video controls src={content}></video>
    </div>
  }
  // json 预览
  if (isJson) {
    return (
      <pre
        dangerouslySetInnerHTML={{
          __html: findLinkFromString(content),
        }}
        className="prettyprint lang-json"
      />
    );
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
        {content.map((item, idx) => (
          <li key={`ws-list-li-${idx}`} onClick={(e) => copyText(e, item)}>
            {formatWsSymbol(item)}
          </li>
        ))}
      </ol>
    );
  }

  return null;
};

// mock文件
const onMockFile = async (data: any, content: string) => {
  if (!content) {
    message.error('内容为空，无法写入文件');
    return;
  }
  const { custom } = data;
  const { path } = custom;
  const arr = path.split('/');
  const filename =
    (arr.length > 3 ? arr.slice(arr.length - 3) : arr).join('_') + '.json';
  const isConfirm = confirm(`是否写入mock文件到项目中？\n文件名: ${filename}`);

  if (isConfirm) {
    const success = await updateConfigFile(path, filename, content);
    if (success) {
      message.success('文件写入成功! bproxy配置文件已更新! ');
    } else {
      message.error('文件写入失败');
    }
  }
};

// mock页面，远程调试
const onMockPage = async (data: any) => {
  const isConfirm = confirm(
    `是否远程调试当前页面：${data?.custom?.path}\nbproxy会自动帮你添加一行代理规则来匹配该页面`
  );

  if (isConfirm) {
    const configFilePath = await getConfigFilePath();
    await insertRemoteInspectRule({
      urlPath: data?.custom?.path,
      configFilePath,
    });
  }
};

// 自动mock组件
const AutoMock = (props) => {
  const { isJSON, detail, body, isHTML, visible } = props;
  if (!visible) {
    return null;
  }

  return (
    <div className="handlers">
      {isJSON ? (
        <Tooltip title="mock文件，会下载文本内容，写入当前项目下的mock目录，并映射请求到本地的mock文件上。">
          <Button
            shape="round"
            type="primary"
            onClick={onMockFile.bind(null, detail, body)}
          >
            mock当前请求
          </Button>
        </Tooltip>
      ) : null}
      {isHTML ? (
        <Tooltip title="调试当前页面，bproxy会往页面注入定制的webSocket，来实现远程代码调用">
          <Button
            shape="round"
            type="primary"
            onClick={onMockPage.bind(null, detail)}
          >
            调试当前页面
          </Button>
        </Tooltip>
      ) : null}
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
  const { custom } = props;

  return (
    <div
      title="点击打开此链接"
      className="url"
      onClick={openUrl.bind(null, custom.url)}
    >
      {custom ? (
        <Tooltip title={custom.url} placement="bottomLeft">
          <div>
            {custom.statusCode || 'Pendding'} {custom.method} {custom.origin}
            {custom.path}
          </div>
        </Tooltip>
      ) : (
        ''
      )}
    </div>
  );
};

const Detail = (props: any): React.ReactElement<any, any> | null => {
  const { state, dispatch } = useContext(Ctx);
  const {
    state: cssAnimate,
    toggle: toggleCssAnimate,
    no: disableCssAnimate,
  } = useBool(false);
  const { state: cssAnimateHide, toggle: toggleCssAnimateHide } =
    useBool(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [showBody, setShowBody] = useState<
    string | React.ReactElement<any, any>
  >('');
  const { detail = {} } = props;
  const { showDetail, detailActiveTab } = state;
  const { custom = {} } = detail || {};
  const contentType = (
    get(detail, 'responseHeaders["content-type"]') || ''
  ).toLowerCase();
  const $isJson = useRef(contentType?.includes('/json'));
  const isImage = contentType?.includes('image/');
  const isMp4 = contentType?.includes('/mp4');
  const isHTML = contentType?.includes('/html');
  const isUtf8 = contentType?.includes('/utf-8');
  const isEncoding = get(detail, 'responseHeaders["content-encoding"]');
  const isChunked =
    get(detail, 'responseHeaders[transfer-encoding]') === 'chunked';
  const cookies = (get(detail, 'requestHeaders.cookie') || '')
    .split('; ')
    .filter((item) => !!item);
  const postDataType = get(detail, `[${detailActiveTab}].$$type`);
  const canView = isDetailViewAble(get(detail, 'responseHeaders')) || isImage || isMp4;
  const isMedia = isImage || isMp4;

  // body解析
  useEffect(() => {
    setShowBody('处理中...');
    $isJson.current = false;
    setTimeout(() => {
      // image
      if (isImage || isMp4) {
        setShowBody(detail?.custom?.url);
        $isJson.current = false;
      } else {
        let body;

        if (
          isString(detail?.responseBody) ||
          ['wss', 'ws'].includes(detail?.custom?.method)
        ) {
          // 字符串
          body = detail?.responseBody;
        } else if (isChunked && !isEncoding) {
          body = textDecode(detail?.responseBody);
        } else {
          body = buffer2string(detail?.responseBody, isEncoding, isUtf8);
        }

        // json 格式化加工
        if (isString(body) && ($isJson.current || isLikeJson(body))) {
          try {
            body = JSON.parse(body);
            body = JSONFormat(body);
            $isJson.current = true;
          } catch (err) {}
        }

        setShowBody(body);
      }
    }, 150);
  }, [detailActiveTab, detail, showDetail]);

  // 关闭之后 清空body
  useEffect(() => {
    if (!showDetail) {
      setShowBody('');
    }
  }, [showDetail]);

  const onClose = (): void => {
    toggleCssAnimate();
    toggleCssAnimateHide();
    setTimeout(() => {
      setVisible(false);
      dispatch({ type: 'setShowDetail', showDetail: false });
    }, 300);
  };
  const onTabChange = (tabValue: string): void => {
    dispatch({ type: 'setDetailActiveTab', detailActiveTab: tabValue });
  };

  // json 代码高亮
  useEffect(() => {
    if ($isJson.current && showBody && detailActiveTab === 'responseBody') {
      setTimeout(() => {
        (window as any)?.PR?.prettyPrint();
      }, 0);
    }
  }, [showBody, detailActiveTab]);

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
      toggleCssAnimate();
    }, 100);

    return () => {
      setVisible(false);
      disableCssAnimate();
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
        'animate__animated animate__bounceInRight': cssAnimate,
        'animate__animated animate__bounceOutLeft': cssAnimateHide,
      })}
    >
      <div className="mask" onClick={onClose} />
      <div className="content">
        {/* URL */}
        <URLViewer custom={custom} />
        {/* Tabs */}
        <TabList onClick={onTabChange} detailActiveTab={detailActiveTab} />
        {/* Body / keyValue viewer */}
        {detailActiveTab !== 'responseBody' ? (
          <div
            className={classNames({
              'form scrollbar-style body-panel': true,
              [postDataType]: postDataType,
            })}
          >
            {!isEmpty(detail[detailActiveTab])
              ? keyValueTable(detail[detailActiveTab])
              : null}
            {detailActiveTab === 'requestHeaders' ? (
              <CookiesView cookies={cookies} />
            ) : null}
          </div>
        ) : (
          <div className="body-panel scrollbar-style">
            <AutoMock
              visible={canView && !isMedia && ($isJson.current || isHTML)}
              isJSON={$isJson.current}
              isHTML={isHTML}
              detail={detail}
              body={showBody}
            />
            {canView ? (
              <div className="response-viewer">
                {viewContent({
                  isJson: $isJson.current,
                  content: showBody,
                  statusCode: custom.statusCode,
                  urlPath: custom.path,
                  isImage,
                  isMp4,
                })}
              </div>
            ) : (
              '不支持预览'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
