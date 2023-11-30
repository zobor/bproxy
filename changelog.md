# bproxy change log

## 5.2.31

- https 协议的匹配规则优化，建议 https 配置为空数组
- wss 匹配规则，不需要写默认的 443 端口
- 调整开启系统代理的策略，默认不开启，需要手动开启后记录状态

## 5.2.29

- 修复 https 证书错误导致请求失败
- 优化 postbody 显示
- fixbug

## 5.2.28

- 修复 Node17 的 breaking change: ipv6first

## 5.2.26

- 修复 ws 连接失败的问题
- 优化 JSON 显示
- 新增功能：文本搜索（快捷键:/）

## 5.2.25

- 修复规则检测页面的报错

## 5.2.24

- 优化文本类请求的预览
- 去掉参数：highPerformanceMode
- 优化禁用缓存功能: disableCache
- url 参数?bproxy=2 识别为 debug=vconsole 页面

## 5.2.23

- 支持 umami
- 支持配置文件报错提醒 & 配置回滚
- Electron 客户端内的请求不走系统代理
- 支持查看 ChangeLog
- debug 模式支持本地文件
- target 支持 draft 模式
- url 参数?bproxy=1 识别为 debug 页面

## 5.2.14

- 体验优化
- 关闭 bproxy，恢复之前的系统代理配置

## 5.2.13

- 配置文件支持强大的编辑器

## 5.2.12

- UI 体验优化

## 5.2.10

- weinre 模式支持 chrome 61+

## 5.2.9

- 修复 ws 不能代理上的问题

## 5.2.8

- 修复 chrome 不能识别证书

## 5.2.6

- 修复不能获取本地 IP 的问题
- 优化代理代理的性能损耗
- 新增日常查看功能
- 区分 bash 和客户端模式的运行时
- 支持 safari 远程调试

## 5.2.2

- 新增版本更新检测
- 优化 chrome 开发者工具，断开 ws 后自动重连
