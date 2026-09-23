#!/bin/sh
# Agent Skills Study Hub - 一键启动（macOS / Linux）
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] 未检测到 Node.js，请先安装 Node.js 20+（https://nodejs.org）后重试。"
  exit 1
fi

echo "[1/3] 检查依赖 ..."
if [ ! -d node_modules ]; then
  echo "      首次运行，正在安装依赖，请稍候 ..."
  npm install || { echo "[ERROR] npm install 失败，请检查网络后重试。"; exit 1; }
fi

echo "[2/3] 检查生产构建 ..."
if [ ! -f out/index.html ]; then
  echo "      未找到构建产物，开始构建（约 1 分钟）..."
  npm run build || { echo "[ERROR] 构建失败，请查看上方报错。"; exit 1; }
fi

echo "[3/3] 启动中：http://localhost:3000（按 Ctrl+C 停止）"
( sleep 2; open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null ) &
npm start
