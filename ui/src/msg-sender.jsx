import React from 'react';
import { socketPort } from '../../src/config.js';

class msgSender extends React.Component {
  constructor(props){
    super(props)
    this.init()
  }
  init(){
    var that = this;
    jQuery.getScript(`http://127.0.0.1:${socketPort}/socket.io/socket.io.js`).done(()=>{
      var socket = io(`http://localhost:${socketPort}`);
      socket.emit('clientConnect');
      socket.on('request', data=>{
        that.props.msg.emit('requestStart', data);
      });

      socket.on('response', data=>{
        that.props.msg.emit('requestDone', data);
      });
    });
  }

  render(){
    return null
  }
}
export default msgSender;