#!/bin/bash
# sync-index.sh - 自动同步 www/index.html 到根目录
# 使用方法: ./sync-index.sh

WWW_INDEX="pathogen-control-system/www/index.html"
ROOT_INDEX="pathogen-control-system/index.html"

echo "🔄 同步 index.html..."

if [ -f "$WWW_INDEX" ]; then
    cp "$WWW_INDEX" "$ROOT_INDEX"
    echo "✅ 已同步: $WWW_INDEX → $ROOT_INDEX"
    
    # 检查是否有变更
    if git diff --quiet "$ROOT_INDEX" 2>/dev/null; then
        echo "ℹ️  无变更需要提交"
    else
        git add "$ROOT_INDEX"
        echo "📝 已添加到暂存区，请提交更改"
    fi
else
    echo "❌ 错误: $WWW_INDEX 不存在"
    exit 1
fi
