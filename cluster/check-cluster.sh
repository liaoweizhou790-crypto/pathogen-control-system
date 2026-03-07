# 集群测试脚本
# 用于验证 KimiClaw 集群各 Worker 节点是否正常工作

#!/bin/bash

echo "======================================"
echo "   KimiClaw 集群健康检查"
echo "======================================"
echo ""

# 检查 Agent 列表
echo "[1/5] 检查 Agent 列表..."
openclaw agents list 2>/dev/null | grep -E "worker-" && echo "✅ Worker Agents 已注册" || echo "❌ Worker Agents 未找到"
echo ""

# 检查目录结构
echo "[2/5] 检查目录结构..."
for worker in worker-data worker-doc worker-web; do
  if [ -d "$HOME/.openclaw/agents/$worker/agent" ] && [ -d "$HOME/.openclaw/workspace/workers/$(echo $worker | cut -d'-' -f2)" ]; then
    echo "  ✅ $worker 目录正常"
  else
    echo "  ❌ $worker 目录缺失"
  fi
done
echo ""

# 检查配置文件
echo "[3/5] 检查配置文件..."
for worker in worker-data worker-doc worker-web; do
  if [ -f "$HOME/.openclaw/workspace/workers/$(echo $worker | cut -d'-' -f2)/AGENTS.md" ]; then
    echo "  ✅ $worker AGENTS.md 存在"
  else
    echo "  ❌ $worker AGENTS.md 缺失"
  fi
done
echo ""

# 检查共享存储
echo "[4/5] 检查共享存储..."
if [ -d "$HOME/.openclaw/workspace/cluster/shared/tasks" ] && \
   [ -d "$HOME/.openclaw/workspace/cluster/shared/results" ] && \
   [ -d "$HOME/.openclaw/workspace/cluster/shared/memory" ]; then
  echo "  ✅ 共享存储目录正常"
else
  echo "  ❌ 共享存储目录缺失"
fi
echo ""

# 检查主控配置
echo "[5/5] 检查主控 AGENTS.md 集群配置..."
if grep -q "KimiClaw 集群调度中心" "$HOME/.openclaw/workspace/AGENTS.md" 2>/dev/null; then
  echo "  ✅ 主控集群配置已更新"
else
  echo "  ❌ 主控集群配置未找到"
fi
echo ""

echo "======================================"
echo "   集群检查完成"
echo "======================================"
