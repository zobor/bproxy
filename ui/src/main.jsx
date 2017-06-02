import React from 'react'
import Msg from 'events'
import ReactDOM from 'react-dom'
import Header from './header.jsx'
import Table from './table.jsx'
import ResDetail from './res-detail.jsx'
import MsgSender from './msg-sender.jsx'

var msg = new Msg();

ReactDOM.render(
  <div>
    <Header msg={msg}/>
    <Table msg={msg}/>
    <ResDetail msg={msg}/>
    <MsgSender msg={msg}/>
  </div>,
  document.getElementById('container')
);