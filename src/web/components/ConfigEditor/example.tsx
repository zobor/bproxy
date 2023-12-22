import React from 'react';
import ReactJson from 'react-json-view';
import pageConfig from '../../pageConfig';

// 自定义序列化函数

const formatExample = (data) => {
  const replacer = (key, value) => {
    if (value instanceof RegExp) {
      return `__REGEXP ${value.toString()}`;
    }
    if (value instanceof Function) {
      return `__FUNCTION ${value.toString()}`;
    }
    return value;
  };
  let res = JSON.stringify(data, replacer, 2)
    .replace(/"__REGEXP ([^"]+)"/g, '$1');

  if (res.includes('__FUNCTION')) {
    res = res.replace(/"__FUNCTION ([^"]+)"/g, '$1')
    .replace(/\\n/g, `
`);
  }

  return res;
};

const example = [
  {
    label: '开启远程调试',
    value: {
      url: 'https://m.v.qq.com/tvp',
      debug: true,
    },
    desc: '或者在请求 URL 后面添加参数 ?bproxy=1'
  },
  {
    label: '开启vconsole',
    value: {
      url: 'https://m.v.qq.com/tvp',
      debug: 'vconsole',
    },
    desc: '或者在请求 URL 后面添加参数 ?bproxy=2'
  },
  {
    label: '草稿功能 - 响应内容字段快速替换 - JSON',
    value: {
      url: 'https://www.qq.com/demo.json',
      target: function draft(data) {
        data.data.list[0].time = Date.now();
      }
    }
  },
  {
    label: '草稿功能 - 响应内容字段快速替换 - 字符串',
    value: {
      url: 'https://www.qq.com/demo.json',
      target: function draft(data) {
        // return data.replaceAll(str1, newStr1);
      }
    },
    desc: 'function value: \t return data.replaceAll(str1, newStr1);'
  },
  {
    label: '支持Yapi 项目 mock',
    value: {
      disableCache: true,
      https: true,
      rules: [],
      yapiHost: 'https://www.example.com',
      yapi: [
        {
          id: 123,
          token: 'xxx'
        }
      ]
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

function View({ data, desc }) {
  return <>
    <pre className='config-example-code'>
      {formatExample(data)}
    </pre>
    {desc ? <p>{desc}</p> : null}
  </>
}

export default function Example() {
  return (
    <>
      {example.map(({ label, value, desc }, index) => (
        <div className="example-box" key={label}>
          <div className="example-title">
            {index + 1}、{label}
          </div>
          <View data={value} desc={desc} />
        </div>
      ))}
    </>
  );
}
