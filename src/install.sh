#!/bin/bash

# 获取当前脚本的完整路径（包含脚本名称）
script_path="$BASH_SOURCE"

# 获取脚本所在的目录路径
# 使用dirname命令截取最后一个/之前的部分，即脚本所在的目录路径
current_dir=$(dirname "$script_path")

echo "✔ 当前脚本所在的目录路径为: $current_dir"

echo "✔ 清理历史版本..."
rm -rf /Applications/bproxy.app

echo "✔ 移动最新版本到应用程序目录..."
mv "$current_dir/bproxy.app" /Applications

echo "✔ 信任bproxy.app..."
sudo spctl --master-disable
sudo xattr -d com.apple.quarantine /Applications/bproxy.app

echo "✔ 安装完成"
