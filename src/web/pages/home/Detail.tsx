import React, { useContext, useEffect, useState } from "react";
import classNames from 'classnames';
import Tooltip from 'antd/es/tooltip';
import Button from "antd/es/button";
import message from "antd/es/message";
import { get, isObject } from 'lodash';

import { Ctx } from "../../ctx";
import { buffer2string } from "../../modules/buffer";
import JSONFormat from "../../libs/jsonFormat";
import { bridgeInvoke } from "../../modules/socket";


import 'antd/es/button/style/css';
import "./detail.scss";
import { tabList } from "./settings";



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
              <td>{decodeURIComponent(arr[1])}</td>
            </tr>
          ) : null;
        })}
      </tbody>
    </table>
  );
};

const Detail = (props: any): React.ReactElement<any, any> | null => {
  const { state, dispatch } = useContext(Ctx);
  const [showBody, setShowBody] = useState<
    string | React.ReactElement<any, any>
  >("");
  const { detail = {} } = props;
  const { showDetail, detailActiveTab } = state;
  const { custom = {} } = detail || {};
  const contentType = get(detail, 'responseHeaders["content-type"]');
  const isJson = contentType?.includes('/json');
  const cookies = (get(detail, 'requestHeaders.cookie') || '').split("; ");

  // view text
  useEffect(() => {
    setShowBody("处理中...");
    setTimeout(() => {
      const contentType = get(detail, 'responseHeaders["content-type"]');
      const isImage = contentType?.includes("image/");
      const isJson = contentType?.includes('/json');
      const isEncoding = get(detail, 'responseHeaders["content-encoding"]');
      // image
      if (isImage) {
        const body = (
          <div className="image-preview-box">
            <img className="image-preview" src={detail?.custom?.url} />
          </div>
        );
        setShowBody(body);
      } else {
        // websocket
        if (detail?.custom?.method === "ws") {
          const body = detail.responseBody.map((item, idx: number) => (
            <div key={`${detail.custom.requestId}-ws-body-${idx}`}>
              {buffer2string(item, "")}
            </div>
          ));
          setShowBody(body);
        } else {
          // text\json
          let body = buffer2string(detail?.responseBody, isEncoding);

          // format json
          if (isJson) {
            try {
              body = JSON.parse(body);
              body = JSONFormat(body, null, 2, 100);
            } catch (err) {}
          }
          setShowBody(body);
        }
      }
    }, 300);
  }, [detailActiveTab, detail]);

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
  const onMockFile = (data: any, content: string) => {
    if (!content) {
      message.error('内容为空，无法写入文件');
      return;
    }
    const { custom } = data;
    const { path } = custom;
    const arr = path.split('/');
    const filename = (arr.length > 3 ? arr.slice(arr.length - 3) : arr).join('_') + '.json';
    const isConfirm = confirm(`是否写入mock文件到项目中？\n文件名: ${filename}`);
    isConfirm && writeFile(path, filename, content);
  };

  if (!showDetail) {
    return null;
  }

  return (
    <div className={`detail ${showDetail ? "open" : ""}`}>
      <div className="mask" onClick={onClose} />
      <div className="content">
        {/* URL */}
        <div className="url" onClick={openUrl.bind(null, custom.url)}>
          {custom ? (
            <Tooltip title={custom.url}>
              <div style={{ display: "flex" }}>
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
              [get(detail, `[${detailActiveTab}].$$type`)]: get(
                detail,
                `[${detailActiveTab}].$$type`
              ),
            })}
          >
            {detail[detailActiveTab]
              ? Object.keys(detail[detailActiveTab])
                  .filter((key) => key !== "$$type")
                  .map((key) => (
                    <div className="form-item" key={key}>
                      <label>{key}:</label>
                      <div className="form-item-value">
                        {isObject(detail[detailActiveTab][key])
                          ? JSON.stringify(detail[detailActiveTab][key])
                          : detail[detailActiveTab][key]}
                      </div>
                    </div>
                  ))
              : null}
            {detailActiveTab === "requestHeaders" ? (
              <CookiesView cookies={cookies} />
            ) : null}
          </div>
        ) : (
          <div className="body-panel scrollbar-style">
            {showBody || "不支持预览"}

            {isJson && showBody ? (
              <div className="handlers">
                <Button
                  shape="round"
                  type="primary"
                  onClick={onMockFile.bind(null, detail, showBody)}
                >
                  mock当前请求
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
