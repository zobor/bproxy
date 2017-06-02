var js_code = {};
js_code.css = function(){
/*
ul li{
  margin-left: 12px;
}
ul.hover{
  background: #dfdfdf;
}
.btn{padding-right:5px;cursor:pointer;padding:1px 3px;margin-left: -10px;color:red;}
.omit{color:gray;}
.hide{display:none;}
pre{
  background: #efefef;
  margin:10px;
  word-wrap: break-word;
  word-break: normal;
  white-space: pre-wrap;
}
ul{
  list-style:none;
  border-left: dashed 1px #dfdfdf;
}
.key{
  font-weight: bold;
}
.str{
  color:rgb(184,3,3);
}
.num{
  color:blue;
}
.bool{
  color: green;
}
.null{
  color:#888;
}
 */
};

var util = {

  /**
   * 从function的注释取代码
   */
  getHTMLFromNote: function(fn){
    var _str = fn.toString(),
      s_pos = _str.indexOf("/*")+2,
      e_pos = _str.lastIndexOf("*/");
    return (s_pos<0 || e_pos<0) ? "" : _str.substring(s_pos, e_pos);
  },

  /**
   * 编码HTML
   */
  escapeHTML: function(str){
    if(typeof str==='string'){
      var reg = /^https?:\/\/.*$/;
      str = str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
      if(reg.test(str)){
        str = '<a href="'+str+'" target="_blank">' + str + '</a>';
      }
    }
    return str;
  },

  /**
   * 编码Values值
   */
  escapeVALUE: function(val){
    if(typeof val==='number'){
      return '<span class="num">' + this.escapeHTML(val) + '</span>';
    }else if(typeof val==='string'){
      return '<span class="str">"' + this.escapeHTML(val) + '"</span>';
    }else if(typeof val==='boolean'){
      return '<span class="bool">' + this.escapeHTML(val) + '</span>';
    }else{
      return '<span class="null">' + val + '</span>';
    }
  }
};


function FormatJSON(config){
  config = config || {};
  this.fn_start = '';
  this.fn_end = '';
}

FormatJSON.prototype = {
  /**
   * 格式化Object对象
   * @param {Object} obj
   * @param {Number} deep
   * @param {String} _html
   */
  FormatObject: function(obj, deep, _html){
    deep ++;
    var obj_len=0;
    for(var i in obj){
      obj_len++;
    }
    var current_index = 0;
    var is_last;
    for(var i in obj){
      current_index++;
      is_last = current_index===obj_len?true:false
      var col = obj[i];
      if(jQuery.isArray(col)){
        _html.push([
          '<li>',
          // out_blank(deep),
          '<span class="btn">-</span>',
          '"',
          '<span class="key">'+util.escapeHTML(i)+'</span>',
          '": ',
          '<span class="mark_s">[</span>',
          '<span class="omit hide">...]</span>',
          this.FormatArray(col, deep, []),
          // out_blank(deep),
          '<span class="mark_e">]</span>',
          (is_last?'':'<span class="comma">,</span>'),
          '</li>'
        ].join(''));
      }else if(typeof col==='object'&&col&&col.constructor===Object){
        _html.push([
          '<li>',
          // out_blank(deep),
          '<span class="btn">-</span>',
          '"',
          '<span class="key">'+util.escapeHTML(i)+'</span>',
          '": ',
          '<span class="mark_s">{</span>',
          '<span class="omit hide">...}</span>',
          this.FormatObject(col, deep, []),
          // out_blank(deep),
          '<span class="mark_e">}</span>',
          (is_last?'':'<span class="comma">,</span>'),
          '</li>'
        ].join(''));
      }else if(typeof col==='function'){
        _html.push([
          '<li>',
          '"',
          '<span class="key">'+util.escapeHTML(i)+'</span>',
          '": ',
          util.escapeVALUE('function'),
          (is_last?'':','),
          '</li>'
        ].join(''));
      }else{
        _html.push([
          '<li>',
          // out_blank(deep),
          '"',
          '<span class="key">'+util.escapeHTML(i)+'</span>',
          '": ',
          util.escapeVALUE(col),
          (is_last?'':','),
          '</li>'
        ].join(''));
      }
    }
    return [
    '<ul>',
    _html.join(''),
    '</ul>'
    ].join('')
  },

  /**
   * 格式化Array对象
   * @param {Object} obj
   * @param {Number} deep
   * @param {String} _html
   */
  FormatArray: function(arr, deep,_html){
    deep++;
    var len = arr.length,
      is_last,
      self = this;
    jQuery(arr).each(function(index, val){
      is_last = len===(index+1);
      if(jQuery.isArray(val)){
        _html.push([
          '<li>',
          // out_blank(deep),
          '<span class="btn">-</span>',
          '<span class="mark_s">[</span>',
          '<span class="omit hide">...]</span>',
          self.FormatArray(val, deep, []),
          // out_blank(deep),
          '<span class="mark_e">]</span>',
          (is_last?'':'<span class="comma">,</span>'),
          '</li>'
        ].join(''));
      }else if(typeof val==='object'&&val&&val.constructor===Object){
        _html.push([
          '<li>',
          // out_blank(deep),
          '<span class="btn">-</span>',
          '<span class="mark_s">{</span>',
          '<span class="omit hide">...}</span>',
          self.FormatObject(val, deep, []),
          // out_blank(deep),
          '<span class="mark_e">}</span>',
          (is_last?'':'<span class="comma">,</span>'),
          '</li>'
        ].join(''));
      }else if(typeof val==='string'||typeof val==='number'){
        _html.push([
          '<li>',
          // out_blank(deep),
          util.escapeHTML(val),
          (is_last?'':'<span class="comma">,</span>'),
          '</li>'
        ].join(''));
      }
    });

    return [
    '<ul>',
      _html.join(''),
    '</ul>'
    ].join('');
  },

  /**
   * 将JSON数据转换成html
   * @param  {Object} data
   * @return {String}
   */
  buildHTML: function( data ){
    if(typeof data==='object' && data.constructor===Object){
      var ss=[
        '<li>',
        // out_blank(deep),
        '<span class="btn">-</span>',
        this.fn_start+'{',
        '<span class="omit hide">...}'+this.fn_end+'</span>',
        this.FormatObject(data,0,[]),
        // out_blank(deep),
        '<span class="mark_e">}'+this.fn_end+'</span>',
        '</li>'
      ].join('');
      return '<ul>' + ss + '</ul>';
    }else if(typeof data==='object' && data.constructor===Array){
      var ss=[
        '<li>',
        // out_blank(deep),
        '<span class="btn">-</span>',
        this.fn_start+'[',
        '<span class="omit hide">...]'+this.fn_end+'</span>',
        this.FormatArray(data,0,[]),
        // out_blank(deep),
        '<span class="mark_e">]'+this.fn_end+'</span>',
        '</li>'
      ].join('');
      return '<ul>' + ss + '</ul>';
    }
  },

  /**
   * 解析json 字符串
   * @param  {String} str_html
   */
  parse: function(str_html){
    var reg=/(.*?)(\{[\s\S]+\})(\);?)?/,
      json;
    if(str_html.indexOf('{') === 0 || str_html.indexOf('[') === 0 ){
      this.fn_start = '';
      this.fn_end = '';
      try{
        json = JSON.parse(str_html);
      }catch(e){
        return 'Illegal format';
      }
    }else if ( reg.test(str_html) ) {
      var mch = RegExp.$2;
      var fn_start = RegExp.$1;
      var fn_end = RegExp.$3;
      this.fn_start = fn_start || '';
      this.fn_end = fn_end || '';
      try{
        json = JSON.parse(mch);
      }catch(e){
        return 'Illegal format';
      }
    }
    return json;
  },

  /**
   * 初始化样式
   */
  buildCss: function(){
    var id = 'f22fd1-71394756d-b854ad2c196e-7b198';
    if ( jQuery('#'+id).length ) return;
    var css_val = util.getHTMLFromNote(js_code.css);
    var style = document.createElement('style');
    style.type='text/css';
    style.innerHTML = css_val;
    style.id = id;
    document.head.appendChild(style);
  },

  /**
   * 添加用户操作事件
   */
  addEvent: function(){
    jQuery(document).off('click.formatJSON').on('click.formatJSON', '.btn',function(e){
      var tar = e.target;
      var $ul = jQuery(tar).siblings('ul');
      var $omit= jQuery(tar).siblings('.omit');
      var $m_e = jQuery(tar).siblings('.mark_e');
      var $comma = jQuery(tar).siblings('.comma');
      if($ul.is(':visible')){
        $ul.addClass('hide');
        $omit.removeClass('hide');
        $m_e.addClass('hide');
        $comma.addClass('hide');
        jQuery(tar).html('+');
      }else{
        $ul.removeClass('hide');
        $omit.addClass('hide');
        $m_e.removeClass('hide');
        $comma.removeClass('hide');
        jQuery(tar).html('-');
      }
    });
  },

  /**
   * 入口
   */
  start: function(parseData, $targetDom){
    var data;

    data = this.parse(parseData);
    if (data==='Illegal format') {
      return data;
    }

    var jsonHTML = this.buildHTML(data);

    this.buildCss();
    this.addEvent();

    return jsonHTML;
  },

};

var format = new FormatJSON();

export default format