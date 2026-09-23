#!/bin/sh
# Agent Skills Study Hub - 停止服务（macOS / Linux）
PID=$(lsof -ti:3000 2>/dev/null)
if [ -n "$PID" ]; then
  kill $PID && echo "已停止 3000 端口上的服务。"
else
  echo "3000 端口上没有运行中的服务。"
fi
