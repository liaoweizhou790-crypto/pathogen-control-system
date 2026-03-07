#!/usr/bin/env node
/**
 * 将Markdown转换为PDF (使用Playwright)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 简单的markdown转HTML函数
function markdownToHTML(md) {
    let html = md
        // 转义HTML特殊字符
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // 标题
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // 粗体和斜体
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // 代码
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // 列表项
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // 包裹列表
        .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
        // 修复嵌套的ul
        .replace(/<ul><ul>/g, '<ul>')
        .replace(/<\/ul><\/ul>/g, '</ul>')
        // 段落
        .replace(/\n\n/g, '</p><p>')
        // 换行
        .replace(/\n/g, '<br>');
    
    return '<p>' + html + '</p>';
}

async function convertMarkdownToPDF(inputFile, outputFile) {
    const mdContent = fs.readFileSync(inputFile, 'utf-8');
    const htmlContent = markdownToHTML(mdContent);
    
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>病原微生物防控系统操作说明书</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
            @bottom-center {
                content: "第 " counter(page) " 页";
                font-size: 10pt;
                color: #666;
            }
        }
        body {
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            font-size: 11pt;
            line-height: 1.8;
            color: #333;
            padding: 20px;
        }
        h1 { font-size: 22pt; color: #2c3e50; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        h2 { font-size: 16pt; color: #34495e; border-left: 4px solid #667eea; padding-left: 10px; }
        h3 { font-size: 13pt; color: #445566; }
        ul { margin: 10px 0; padding-left: 25px; }
        li { margin: 5px 0; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        strong { color: #2c3e50; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' }
    });
    await browser.close();
    
    console.log(`PDF已生成: ${outputFile}`);
}

const inputFile = process.argv[2] || 'pathogen-control-system/操作说明书.md';
const outputFile = process.argv[3] || 'pathogen-control-system/病原微生物防控系统_操作说明书.pdf';

convertMarkdownToPDF(inputFile, outputFile).catch(console.error);
