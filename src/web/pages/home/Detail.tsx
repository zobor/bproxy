import React, { useContext, useEffect, useState } from "react";
import { Ctx } from "../../ctx";
import { buffer2string } from "../../modules/buffer";
import JSONFormat from "../../libs/jsonFormat";
import "./detail.scss";
import classNames from 'classnames';
import Tooltip from 'antd/es/tooltip';

const tabList = [
  {
    label: "概览",
    value: "custom",
  },
  {
    label: "请求头",
    value: "requestHeaders",
  },
  {
    label: "请求参数",
    value: "requestParams",
  },
  {
    label: "POST参数",
    value: "postData",
  },
  {
    label: "响应头",
    value: "responseHeaders",
  },
  {
    label: "响应内容",
    value: "responseBody",
  },
];

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

  // view text
  useEffect(() => {
    setShowBody("处理中...");
    detail &&
      setTimeout(() => {
        // image
        if (
          detail.responseHeaders &&
          detail.responseHeaders["content-type"]?.includes("image/")
        ) {
          const body = (
            <div className="image-preview-box">
              <img className="image-preview" src={detail?.custom?.url} />
            </div>
          );
          setShowBody(body);
        } else {
          // websocket
          if (detail.custom.method === "ws") {
            const body = detail.responseBody.map((item, idx: number) => (
              <div key={`${detail.custom.requestId}-ws-body-${idx}`}>
                {buffer2string(item, "")}
              </div>
            ));
            setShowBody(body);
          } else {
            // text\json
            let body = buffer2string(
              detail.responseBody,
              detail.responseHeaders &&
                detail.responseHeaders["content-encoding"]
            );

            // format json
            if (detail?.responseHeaders["content-type"].includes("json")) {
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

  // cookies
  const cookies =
    detailActiveTab === "requestHeaders" && detail?.requestHeaders?.cookie
      ? detail.requestHeaders.cookie.split("; ")
      : [];

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

  if (!showDetail) {
    return null;
  }

  return (
    <div className={`detail ${showDetail ? "open" : ""}`}>
      <div className="mask" onClick={onClose} />
      <div className="content">
        <div className="url" onClick={openUrl.bind(null, custom.url)}>
          {custom ? (
            <Tooltip title={custom.url}>
              {custom.statusCode || "Pendding"} {custom.method} {custom.origin}
              {custom.path}
            </Tooltip>
          ) : (
            ""
          )}
        </div>
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

        {detail && detailActiveTab !== "responseBody" ? (
          <div
            className={classNames({
              "form scrollbar-style": true,
              [detail[detailActiveTab].$$type]:
                detail &&
                detail[detailActiveTab] &&
                !!detail[detailActiveTab].$$type,
            })}
          >
            {detail[detailActiveTab]
              ? Object.keys(detail[detailActiveTab])
                  .filter((key) => key !== "$$type")
                  .map((key) => (
                    <div className="form-item" key={key}>
                      <label>{key}:</label>
                      <div className="form-item-value">
                        {typeof detail[detailActiveTab][key] === "object"
                          ? JSON.stringify(detail[detailActiveTab][key])
                          : detail[detailActiveTab][key]}
                      </div>
                    </div>
                  ))
              : null}
            <CookiesView cookies={cookies} />
          </div>
        ) : null}
        {detailActiveTab === "responseBody" ? (
          <div className="body-panel scrollbar-style">
            {showBody || "不支持预览"}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Detail;
