import React from 'react';
import ReactJson from 'react-json-view';
import pageConfig from '../../pageConfig';

const example = [
  {
    label: '开启远程调试',
    value: {
      url: 'https://m.v.qq.com/tvp',
      debug: true,
    },
  },
  {
    label: '开启vconsole',
    value: {
      url: 'https://m.v.qq.com/tvp',
      debug: 'vconsole',
    },
  },
  {
    label: '设置跨域',
    value: {
      url: 'https://m.v.qq.com/tvp',
      cors: true,
    },
  },
  {
    label: '自定义响应头',
    value: {
      url: 'https://m.v.qq.com/tvp',
      responseHeaders: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
      },
    },
  },
  {
    label: '代理设置',
    value: {
      url: /(google|github)./,
      proxy: 'http://127.0.0.1:1080',
    },
  },
  {
    label: '配置host',
    value: { url: 'https://m.v.qq.com/tvp', target: '127.0.0.1' },
  },
  {
    label: '请求指向本地devServer（一级路径）',
    value: { url: 'https://www.google.com/*', target: 'http://localhost:3000/' },
  },
  {
    label: '请求指向本地devServer（包含子路径）',
    value: { url: 'https://www.google.com/**', target: 'http://localhost:3000/' },
  },
  {
    label: '请求指向本地资源(全部文件)',
    value: { url: 'https://www.google.com/**', target: '/path/to/' },
  },
  {
    label: '请求指向本地资源(单文件)',
    value: { url: 'https://www.google.com/a.html', file: '/path/to/a.html' },
  },
  {
    label: '模拟弱网',
    value: { url: 'm.v.qq.com/tvp', delay: 2000 },
  },
  {
    label: '模拟502错误',
    value: { url: 'm.v.qq.com/tvp', target: 502 },
  },
];

function View({ data }) {
  return <ReactJson src={data} {...(pageConfig as any)} collapsed />;
}

export default function Example() {
  return (
    <>
      {example.map(({ label, value }, index) => (
        <div className="example-box" key={label}>
          <div className="example-title">
            {index + 1}、{label}
          </div>
          <View data={value} />
        </div>
      ))}
    </>
  );
}
