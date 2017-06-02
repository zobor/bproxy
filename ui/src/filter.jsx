import React from 'react'

class Filter extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      keyword: ''
    }

    this.init()

    this.handlerKeyDown = this.handlerKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  init(){
    var keyword = this.getHistoryMsg()
    var that = this
    if (keyword){
      setTimeout(()=>{
        that.sendMsg(keyword)
        that.setState({keyword: keyword})
      },500)
    }
  }

  handlerKeyDown(e) {
    var that = this
    var keyword = e.target.value
    if (that.filterTimer) {
      clearTimeout( that.filterTimer )
      that.filterTimer = null
    }
    that.filterTimer = setTimeout(()=>{
      that.sendMsg(keyword)
      that.saveMsg(keyword)
    },300)
  }

  handleChange(e){
    this.setState({keyword: e.target.value});
  }

  settingClick(e){
    window.open('http://127.0.0.1:9000/settings')
  }

  clearLocalData(e){
    localStorage.clear()
    location.reload()
  }

  sendMsg(msg){
    this.props.msg.emit('filter', {
      value: msg
    })
  }

  saveMsg(msg){
    try{
      window.localStorage.setItem('browser-proxy-filter-keyword', msg);
    }catch(e){}
  }

  getHistoryMsg(){
    return window.localStorage.getItem('browser-proxy-filter-keyword');
  }

  render(){
    return (
      <div className="row filter-group" >
        <div className="col-md-2 filter-label" >过滤结果</div>
        <input onKeyDown={this.handlerKeyDown} onChange={this.handleChange} className="form-controla filter-input col-md-8" type="text" placeholder="请输入字符通过URL过滤请求" value={this.state.keyword} />
        <div className="col-md-2">
          <span className="glyphicon glyphicon-asterisk btn-secondary" onClick={this.settingClick} data-toggle="tooltip" data-placement="bottom" title="设置"></span>
          <span onClick={this.clearLocalData} className="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="清除缓存"></span>
        </div>
      </div>
    )
  }
}

export default Filter