import React from 'react'
import FormatJSON from './format-json.jsx'

class ResDetail extends React.Component {
  constructor(props){
    super(props)

    this.tabChangeHandler = this.tabChangeHandler.bind(this)

    // state
    this.state = {
      layerDisplay: '',
      title: '',
      tabDetail: '',
      method: ''
    }

    // dataset
    this.dataset = {};

    this.init()
  }

  init(){
    var that = this
    this.props.msg.on('tableClick', data=>{
      that.dataset.session = data;
      var cookies = that.getCookies(data.data.reqHeaders.cookie)
      that.dataset.session.data.cookies = cookies
      that.setState({
        title: decodeURIComponent(data.data.url),
        url: data.data.url,
        layerDisplay: '',
        method: data.data.method
      })
      var $active = $('[data-role=res-tabs] a.active')
      if (!$active.length){
        $active = $('[data-role=res-tabs] a:eq(0)')
      }
      that.tabChangeHandler({target: $active.get(0)})
    })
  }

  tabChangeHandler(e){
    var $tar = $(e.target)
    var action
    var keyMaps = {
      'request-headers': 'reqHeaders',
      'request-params': 'query',
      'request-cookies': 'cookies',
      'response-headers': 'resHeaders',
      'response-body': 'body',
      'response-json': 'body'
    }
    var data
    var formatCode = false
    if (!$tar.hasClass('DTTT_button')){
      $tar = $tar.parents('.DTTT_button')
      if (!$tar.length) return
    }
    $tar.addClass('active').siblings().removeClass('active')
    action = $tar.attr('data-action')
    if (!action) return
    if ( !(action in keyMaps) ) return
    data = this.dataset.session.data[ keyMaps[action] ]
    if (action==='response-json') {
      data = FormatJSON.start(data)
      formatCode = true
    }
    this.setState({
      tabDetail: this.buildRequestHeaders(data, formatCode)
    })
  }

  getCookies(cookie){
    if (!cookie) return null;
    var list = cookie.split('; ');
    var cookieData = {};
    $.each(list, (idx, item)=>{
      if (item && item.indexOf('=')>-1) {
        var kv = item.split('=');
        if (kv && kv.length===2){
          cookieData[kv[0]] = kv[1];
        }
      }
    })
    return cookieData;
  }

  urlClickHandler(e){
    window.open(e.target.getAttribute('data-url'))
  }

  buildRequestHeaders(data, noPre){
    var rows = [];
    if ( $.type(data)==='string' ) {
      if (noPre){
        return (
          <div dangerouslySetInnerHTML={{__html: data}} />
        )
      }
      return (
        <pre>{data}</pre>
      )
    }

    for (var key in data){
      rows.push(
        <tr>
          <td>{key}</td>
          <td className="wd-break">{data[key]}</td>
        </tr>
      )
    }
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }

  render(){
    return (
      <div className="panel panel-default detail-layer-pannel" style={{display: this.state.layerDisplay}}>
        <div className="panel-heading">
          <h3 className="panel-title">请求明细</h3>
        </div>
        <div className="panel-body">
          <h3 className="response-url-title" data-url={this.state.url} title="点击可新窗口打开" onClick={this.urlClickHandler}>{this.state.method} {this.state.title}</h3>
          <div className="dataTables_wrapper form-inline dt-bootstrap">
            <div className="row" style={{display:'none2'}}>
              <div className="col-sm-12">
                <div data-role="res-tabs" className="DTTT_container" onClick={this.tabChangeHandler}>
                  <a data-action="request-headers" className="DTTT_button"><span>请求头</span></a>
                  <a data-action="request-params" className="DTTT_button"><span>请求参数</span></a>
                  <a data-action="request-cookies" className="DTTT_button"><span>请求Cookie</span></a>
                  <a data-action="response-headers" className="DTTT_button"><span>响应头</span></a>
                  <a data-action="response-body" className="DTTT_button"><span>响应文本</span></a>
                  <a data-action="response-json" className="DTTT_button"><span>JSON</span></a>
                </div>
              </div>
            </div>
            <div className="response-show-div">{this.state.tabDetail}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResDetail