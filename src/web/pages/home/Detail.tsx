import React, { useContext, useEffect, useState } from "react";
import classNames from 'classnames';
import moment from 'moment';

import { Ctx } from "../../ctx";
import { buffer2string, textDecode } from "../../modules/buffer";
import JSONFormat from "../../libs/jsonFormat";
import { bridgeInvoke } from "../../modules/socket";
import { tabList } from "./settings";
import { Button, message, Tooltip } from "../../components/UI";

import '../../libs/code-prettify.css';
import "./detail.scss";
import { get, isObject, isString } from "../../modules/_";

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
          <td style={{ width: "20%" }}>key</td>
          <td>value</td>
        </tr>
      </thead>
      <tbody>
        {cookies.map((str: string) => {
          const arr = str.replace(/^(\w+)=/, "$1 ").split(" ");
          return arr && arr.length === 2 ? (
            <tr key={`${arr[0]}-${arr[1]}`}>
              <td>{arr[0]}</td>
              <td>
                <Tooltip title="点击复制">
                  {decodeURIComponent(arr[1])}
                </Tooltip>
              </td>
            </tr>
          ) : null;
        })}
      </tbody>
    </table>
  );
};


const findLink = (str) => {
  if (!(str && str.replace)) {
    return str;
  }
  return str
    // .replace(/time[\w_\-\$]\":\s(\d{10,13})/i, '$1')
    .replace(/"(https?:\/\/[^"]+)"/g, `"<a href='$1' target="_blank">$1</a>"`);
};

const Detail = (props: any): React.ReactElement<any, any> | null => {
  const { state, dispatch } = useContext(Ctx);
  const [showBody, setShowBody] = useState<
    string | React.ReactElement<any, any>
  >("");
  const { detail = {} } = props;
  const { showDetail, detailActiveTab } = state;
  const { custom = {} } = detail || {};
  const contentType = (get(detail, 'responseHeaders["content-type"]') || '').toLowerCase();
  const isJson = contentType?.includes('/json');
  const isImage = contentType?.includes("image/");
  const isUtf8 = contentType?.includes('/utf-8');
  const isEncoding = get(detail, 'responseHeaders["content-encoding"]');
  const isChunked = get(detail, 'responseHeaders[transfer-encoding]') === 'chunked';
  const cookies = (get(detail, 'requestHeaders.cookie') || '').split("; ").filter(item => !!item);
  const postDataType = get(detail, `[${detailActiveTab}].$$type`);

  // view text
  useEffect(() => {
    setShowBody("处理中...");
    setTimeout(() => {
      // image
      if (isImage) {
        const body = (
          <div className="image-preview-box">
            <img className="image-preview" src={detail?.custom?.url} />
          </div>
        );
        setShowBody(body);
      } else {
        if (isString(detail?.responseBody)) {
          let body = detail?.responseBody;

          if (isJson) {
            try {
              body = JSON.parse(body);
              body = JSONFormat(body);
            } catch (err) {}
          }
          setShowBody(body);
        }
        // websocket
        else if (detail?.custom?.method === "ws") {
          const body = detail.responseBody.map((item, idx: number) => (
            <div key={`${detail.custom.requestId}-ws-body-${idx}`}>
              {buffer2string(item, "", false)}
            </div>
          ));
          setShowBody(body);
        } else if (isChunked && !isEncoding) {
          let body = textDecode(detail?.responseBody);
          if (isJson) {
            try {
              body = JSON.parse(body);
              body = JSONFormat(body);
            } catch (err) {}
          }
          setShowBody(body);
        } else {
          // text\json
          let body = buffer2string(detail?.responseBody, isEncoding, isUtf8);

          // format json
          if (isJson) {
            try {
              body = JSON.parse(body);
              body = JSONFormat(body);
            } catch (err) {}
          }
          setShowBody(body);
        }
      }
    }, 0);
  }, [detailActiveTab, detail, showDetail]);

  useEffect(() => {
    if (!showDetail) {
      setShowBody("");
    }
  }, [showDetail]);

  const onClose = (): void => {
    dispatch({ type: "setShowDetail", showDetail: false });
  };
  const onTabChange = (tabValue: string): void => {
    dispatch({ type: "setDetailActiveTab", detailActiveTab: tabValue });
  };
  const openUrl = (url: string): void => {
    window.open(url);
  };
  const writeFile = async(regx: string, file: string, content: string) => {
    const configFilePath = await bridgeInvoke({
      api: "getConfigFile",
    });
    const rs = await bridgeInvoke({api: 'mapFile', params: {
      regx,
      file,
      content,
      configFilePath,
    }});
    return rs;
  };
  const onMockFile = async(data: any, content: string) => {
    if (!content) {
      message.error('内容为空，无法写入文件');
      return;
    }
    const { custom } = data;
    const { path } = custom;
    const arr = path.split('/');
    const filename = (arr.length > 3 ? arr.slice(arr.length - 3) : arr).join('_') + '.json';
    const isConfirm = confirm(`是否写入mock文件到项目中？\n文件名: ${filename}`);
    if (isConfirm) {
      const success = await writeFile(path, filename, content);
      if (success) {
        message.success('文件写入成功! bproxy配置文件已更新! ');
      } else {
        message.error('文件写入失败');
      }
    }
  };

  useEffect(() => {
    if (isJson && showBody && detailActiveTab === 'responseBody') {
      setTimeout(() => {
        (window as any)?.PR?.prettyPrint();
      }, 0);
    }
  }, [isJson, showBody, detailActiveTab]);

  if (!showDetail) {
    return null;
  }

  return (
    <div className={`detail ${showDetail ? "open" : ""}`}>
      <Tooltip title="点击此区域关闭详情">
        <div className="mask" onClick={onClose} />
      </Tooltip>
      <div className="content">
        {/* URL */}
        <div title="点击打开此链接" className="url" onClick={openUrl.bind(null, custom.url)}>
          {custom ? (
            <Tooltip title={custom.url} placement="bottomLeft">
              <div>
                {custom.statusCode || "Pendding"} {custom.method}{" "}
                {custom.origin}
                {custom.path}
              </div>
            </Tooltip>
          ) : (
            ""
          )}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <ul>
            {custom &&
              tabList.map((tab) => {
                if (custom?.method === "GET" && tab.value === "postData") {
                  return null;
                }
                return (
                  <li
                    onClick={onTabChange.bind(null, tab.value)}
                    key={tab.value}
                    className={`${
                      detailActiveTab === tab.value ? "active" : ""
                    }`}
                  >
                    {tab.label}
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Content View */}
        {detail && detailActiveTab !== "responseBody" ? (
          <div
            className={classNames({
              "form scrollbar-style": true,
              [postDataType]: postDataType,
            })}
          >
            {detail[detailActiveTab]
              ? Object.keys(detail[detailActiveTab])
                  .filter((key) => key !== "$$type")
                  .map((key) => {
                    let dataValue = detail[detailActiveTab][key];
                    if (['if-modified-since', 'expires', 'last-modified', 'date', 'x-swift-savetime'].includes(key.toLocaleLowerCase())) {
                      try {
                        dataValue = `${dataValue} -> (${moment(dataValue).format('YYYY-MM-DD HH:mm:ss')})`;
                      } catch(err){}
                    }
                    return (
                      <div className="form-item" key={key}>
                        <label
                          className={classNames({
                            hl: key?.includes("x-bproxy"),
                          })}
                        >
                          {key}:
                        </label>
                        <Tooltip title="点击复制">
                          <div className="form-item-value">
                            {isObject(dataValue)
                              ? JSON.stringify(dataValue)
                              : dataValue.toString()}
                          </div>
                        </Tooltip>
                      </div>
                    );
                  })
              : null}
            {detailActiveTab === "requestHeaders" ? (
              <CookiesView cookies={cookies} />
            ) : null}
          </div>
        ) : (
          <div className="body-panel scrollbar-style">
            {isJson && showBody ? (
              <div className="handlers">
                <Tooltip title="mock文件，会下载文本内容，写入当前项目下的mock目录，并映射请求到本地的mock文件上。">
                  <Button
                    shape="round"
                    type="primary"
                    onClick={onMockFile.bind(null, detail, showBody)}
                  >
                    mock当前请求
                  </Button>
                </Tooltip>
              </div>
            ) : null}
            <div className="response-viewer">
              {isJson ? <pre dangerouslySetInnerHTML={{
                __html: findLink(showBody),
              }} className="prettyprint lang-json" /> : showBody}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
