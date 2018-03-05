var host = `
# 127.0.0.1 www.baidu.com
`

var rules = [
  // {
  //   regx: /^https?://.*.baidu.com/,
  //   status: '404'
  // }
]

module.exports = {
  host: host,
  rules: rules
}