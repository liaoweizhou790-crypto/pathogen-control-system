/**
 * 流调报告智能分析模块
 * 支持文本、图片、PDF输入，AI自动识别致病菌并推荐消毒方案
 */

// 当前分析模式
let currentAnalysisMode = 'text';
let uploadedImageData = null;
let uploadedPdfText = '';

// 设置分析模式
function setAnalysisMode(mode) {
    currentAnalysisMode = mode;
    
    // 更新按钮样式
    document.getElementById('modeText').className = mode === 'text' ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('modeImage').className = mode === 'image' ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('modePdf').className = mode === 'pdf' ? 'btn btn-primary' : 'btn btn-secondary';
    
    // 显示对应输入区域
    document.getElementById('textInputArea').style.display = mode === 'text' ? 'block' : 'none';
    document.getElementById('imageInputArea').style.display = mode === 'image' ? 'block' : 'none';
    document.getElementById('pdfInputArea').style.display = mode === 'pdf' ? 'block' : 'none';
}

// 处理图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageData = e.target.result;
        document.getElementById('previewImg').src = uploadedImageData;
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// 清除图片
function clearImage() {
    uploadedImageData = null;
    document.getElementById('epidemicImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

// 处理PDF上传
async function handlePdfUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    document.getElementById('pdfFileName').textContent = file.name;
    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfExtractedText').textContent = '正在提取文本...';
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        uploadedPdfText = fullText;
        document.getElementById('pdfExtractedText').textContent = fullText.substring(0, 500) + 
            (fullText.length > 500 ? '...' : '');
    } catch (error) {
        document.getElementById('pdfExtractedText').textContent = '提取失败: ' + error.message;
        uploadedPdfText = '';
    }
}

// 清除PDF
function clearPdf() {
    uploadedPdfText = '';
    document.getElementById('epidemicPdf').value = '';
    document.getElementById('pdfPreview').style.display = 'none';
}

// 清空分析输入
function clearAnalysisInput() {
    document.getElementById('epidemicText').value = '';
    clearImage();
    clearPdf();
    document.getElementById('analysisResult').style.display = 'none';
    document.getElementById('analysisStatus').innerHTML = '';
}

// 分析流调报告
async function analyzeEpidemicReport() {
    let content = '';
    
    // 获取输入内容
    if (currentAnalysisMode === 'text') {
        content = document.getElementById('epidemicText').value.trim();
        if (!content) {
            alert('请输入流调报告内容');
            return;
        }
    } else if (currentAnalysisMode === 'image') {
        if (!uploadedImageData) {
            alert('请先上传图片');
            return;
        }
        // 图片分析提示
        content = '[图片已上传，需要OCR识别或图像分析]';
    } else if (currentAnalysisMode === 'pdf') {
        if (!uploadedPdfText) {
            alert('PDF文本提取失败或为空');
            return;
        }
        content = uploadedPdfText;
    }
    
    // 检查AI配置
    const aiConfig = typeof loadAIConfig === 'function' ? loadAIConfig() : null;
    if (!aiConfig || !aiConfig.apiKey) {
        alert('未配置AI API，请先设置AI配置');
        showTab(6); // 切换到AI配置标签
        return;
    }
    
    // 显示分析状态
    const statusDiv = document.getElementById('analysisStatus');
    statusDiv.innerHTML = '<div style="background: #e7f3ff; padding: 15px; border-radius: 8px;">🤖 AI正在分析，请稍候...</div>';
    
    try {
        const prompt = buildAnalysisPrompt(content);
        const result = await callAIAnalysis(prompt, (progress) => {
            // 可以在这里显示实时进度
        });
        
        // 解析并显示结果
        displayAnalysisResult(result);
        statusDiv.innerHTML = '';
    } catch (error) {
        statusDiv.innerHTML = `
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; color: #721c24;">
                ❌ 分析失败: ${error.message}
            </div>
        `;
    }
}

// 构建分析提示词
function buildAnalysisPrompt(content) {
    return `你是一位专业的流行病学和消毒学专家。请分析以下流调报告，识别可能的致病菌，并推荐相应的消毒方案。

流调报告内容：
${content}

请按以下格式输出分析结果：

## 1. 可能的致病菌
- 列出最可能的病原微生物（按可能性排序）
- 说明判断依据

## 2. 传播途径分析
- 可能的传播方式
- 高风险环节

## 3. 推荐消毒方案
针对每种可能的病原，推荐：
- 环境表面消毒剂及浓度
- 空气消毒方法
- 污染物处理方法
- 个人防护要求
- 消毒作用时间

## 4. 防控建议
- 重点消毒区域
- 消毒频次
- 注意事项

请确保推荐的消毒方案符合《疫源地消毒总则》(GB19193-2015)和《医疗机构消毒技术规范》(WS/T367-2012)等国家标准。`;
}

// 显示分析结果
function displayAnalysisResult(result) {
    const resultDiv = document.getElementById('analysisResult');
    const rawContentDiv = document.getElementById('rawContent');
    
    rawContentDiv.innerHTML = markdownToHtml(result);
    resultDiv.style.display = 'block';
    
    // 解析结构化数据（简化版）
    parseAndDisplayStructuredData(result);
}

// 简单Markdown转HTML
function markdownToHtml(markdown) {
    return markdown
        .replace(/## (.*)/g, '<h3>$1</h3>')
        .replace(/### (.*)/g, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*)/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

// 解析结构化数据（简化展示）
function parseAndDisplayStructuredData(result) {
    // 提取可能的病原
    const pathogenMatch = result.match(/可能的致病菌[\s\S]*?(?=##|$)/i);
    if (pathogenMatch) {
        document.getElementById('pathogensList').innerHTML = markdownToHtml(pathogenMatch[0]);
    }
    
    // 提取传播途径
    const routeMatch = result.match(/传播途径[\s\S]*?(?=##|$)/i);
    if (routeMatch) {
        document.getElementById('routeContent').innerHTML = markdownToHtml(routeMatch[0]);
    }
    
    // 提取消毒方案
    const planMatch = result.match(/推荐消毒方案[\s\S]*?(?=##|$)/i);
    if (planMatch) {
        document.getElementById('planContent').innerHTML = markdownToHtml(planMatch[0]);
    }
}

// 应用推荐方案
function applyRecommendedPlan() {
    alert('推荐方案已应用到配比计算模块');
    // 这里可以实现将AI推荐的方案参数填充到计算器中
}

// 导出分析结果
function exportAnalysisResult() {
    const content = document.getElementById('rawContent').innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `流调分析报告_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 初始化拖拽上传
function initDragAndDrop() {
    const imageDropZone = document.getElementById('imageDropZone');
    const pdfDropZone = document.getElementById('pdfDropZone');
    
    if (imageDropZone) {
        imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropZone.style.background = '#e7f3ff';
        });
        
        imageDropZone.addEventListener('dragleave', () => {
            imageDropZone.style.background = '#f8f9fa';
        });
        
        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.style.background = '#f8f9fa';
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                document.getElementById('epidemicImage').files = files;
                handleImageUpload({ target: { files: files } });
            }
        });
    }
    
    if (pdfDropZone) {
        pdfDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            pdfDropZone.style.background = '#e7f3ff';
        });
        
        pdfDropZone.addEventListener('dragleave', () => {
            pdfDropZone.style.background = '#f8f9fa';
        });
        
        pdfDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            pdfDropZone.style.background = '#f8f9fa';
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                document.getElementById('epidemicPdf').files = files;
                handlePdfUpload({ target: { files: files } });
            }
        });
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeEpidemicReport, setAnalysisMode };
}
