#!/usr/bin/env node
/**
 * macOS 桌面控制工具
 * 使用 AppleScript 实现鼠标、键盘、截图功能
 */

const { execSync } = require('child_process');

function runAppleScript(script) {
    try {
        const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8', timeout: 10000 });
        return { success: true, output: result.trim() };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 获取屏幕分辨率
function getScreenSize() {
    const script = `
        tell application "Finder"
            set _b to bounds of window of desktop
            return (item 3 of _b) & " " & (item 4 of _b)
        end tell
    `;
    const result = runAppleScript(script);
    if (result.success) {
        const [width, height] = result.output.split(' ').map(Number);
        return { success: true, width, height };
    }
    return { success: false, error: result.error };
}

// 获取鼠标位置
function getMousePosition() {
    // 使用 Python 的 Quartz 或者第三方工具
    try {
        const result = execSync('python3 -c "import Quartz; print(Quartz.CGEventGetLocation(Quartz.CGEventCreate(None)))" 2>/dev/null || echo "500 500"', { encoding: 'utf8' });
        return { success: true, position: result.trim() };
    } catch (e) {
        return { success: false, position: { x: 0, y: 0 } };
    }
}

// 执行快捷键
function sendHotkey(keys) {
    const keyMap = {
        'ctrl': 'control',
        'cmd': 'command',
        'alt': 'option',
        'shift': 'shift',
        'enter': 'return',
        'space': 'space',
        'tab': 'tab',
        'esc': 'escape'
    };
    
    const modifiers = [];
    const mainKey = '';
    
    const keyList = keys.split(',').map(k => k.trim().toLowerCase());
    
    let script = '';
    if (keyList.length === 1) {
        // 单个按键
        const key = keyMap[keyList[0]] || keyList[0];
        script = `tell application "System Events" to keystroke "${key}"`;
    } else {
        // 组合键
        const main = keyList.pop();
        const mods = keyList.map(k => keyMap[k] || k).join(' ');
        script = `tell application "System Events" to keystroke "${main}" using {${mods}}`;
    }
    
    return runAppleScript(script);
}

// 打开应用
function openApp(appName) {
    const script = `tell application "${appName}" to activate`;
    return runAppleScript(script);
}

// 列出运行中的 app
function listApps() {
    const script = `tell application "System Events" to get name of (processes where background only is false)`;
    const result = runAppleScript(script);
    if (result.success) {
        const apps = result.output.split(',').map(a => a.trim());
        return { success: true, apps };
    }
    return { success: false, error: result.error };
}

// 截图
function screenshot(path) {
    try {
        execSync(`screencapture -x "${path}"`, { timeout: 10000 });
        return { success: true, path };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'size':
            console.log(JSON.stringify(getScreenSize()));
            break;
        case 'apps':
            console.log(JSON.stringify(listApps()));
            break;
        case 'open':
            console.log(JSON.stringify(openApp(args[1])));
            break;
        case 'hotkey':
            console.log(JSON.stringify(sendHotkey(args[1])));
            break;
        case 'screenshot':
            console.log(JSON.stringify(screenshot(args[1] || '/tmp/screenshot.png')));
            break;
        default:
            console.log(JSON.stringify({
                success: false,
                error: 'Unknown command. Use: size, apps, open, hotkey, screenshot'
            }));
    }
}

main();
