#!/usr/bin/env python3
"""
桌面控制测试脚本
用于验证 PyAutoGUI 安装
"""

def check_installation():
    try:
        import pyautogui
        print(f"✅ PyAutoGUI 版本: {pyautogui.__version__}")
        
        # 安全设置
        pyautogui.FAILSAFE = True  # 鼠标移到角落停止
        
        # 获取屏幕尺寸
        width, height = pyautogui.size()
        print(f"✅ 屏幕分辨率: {width}x{height}")
        
        # 获取当前鼠标位置
        x, y = pyautogui.position()
        print(f"✅ 当前鼠标位置: ({x}, {y})")
        
        return True
    except ImportError:
        print("❌ PyAutoGUI 未安装")
        return False

if __name__ == "__main__":
    check_installation()
