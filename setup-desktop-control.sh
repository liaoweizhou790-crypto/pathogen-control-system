#!/bin/bash
# desktop-control-setup.sh
# 配置 OpenClaw 桌面控制功能

echo "🖥️  OpenClaw 桌面控制配置脚本"
echo "================================"

# 检查 Python
echo "1. 检查 Python 环境..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ 未找到 Python，请先安装 Python 3"
    exit 1
fi

echo "   找到: $PYTHON_CMD"

# 检查 pip
echo "2. 检查 pip..."
if ! $PYTHON_CMD -m pip --version &> /dev/null; then
    echo "❌ pip 未安装"
    exit 1
fi

# 安装 PyAutoGUI 和相关依赖
echo "3. 安装桌面控制依赖..."
echo "   这可能需要几分钟..."

$PYTHON_CMD -m pip install --user \
    pyautogui \
    pillow \
    pyscreeze \
    pymsgbox \
    pyperclip \
    2>&1 | grep -E "(Successfully|Requirement|error)" || true

# 检查安装
echo "4. 验证安装..."
if $PYTHON_CMD -c "import pyautogui; print(f'PyAutoGUI {pyautogui.__version__}')" 2>/dev/null; then
    echo "✅ PyAutoGUI 安装成功"
else
    echo "⚠️  安装可能不完整，尝试备用方法..."
fi

echo ""
echo "================================"
echo "安装完成！"
echo ""
echo "现在我可以帮您："
echo "  🖱️  控制鼠标移动、点击、拖拽"
echo "  ⌨️  键盘输入、快捷键"
echo "  🖼️  屏幕截图、OCR 识别"
echo "  📱  打开和切换应用程序"
echo ""
echo "安全提示："
echo "  • 鼠标移动到屏幕角落会触发安全停止"
echo "  • 重要操作会请求您的确认"
echo "  • 所有操作都可以被中断"
