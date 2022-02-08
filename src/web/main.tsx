import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './libs/run_prettify';

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

function report() {
  const url = `https://z3.cnzz.com/stat.htm?id=1278865075&r=http%3A%2F%2Fregx.vip%2F&lg=zh-cn&ntime=none&cnzz_eid=117682865-1634900721-null&showp=1920x1080&p=http%3A%2F%2Fregx.vip%2Fbproxy%2Fweb&t=Bproxy&umuuid=17ca7ad415558d-06ccc278d12621-5a402f16-1fa400-17ca7ad415644b&h=1&rnd=${parseInt((+new Date / 1000).toString(), 10)}`;
  const img = new Image();
  img.src = url;
}

report();
