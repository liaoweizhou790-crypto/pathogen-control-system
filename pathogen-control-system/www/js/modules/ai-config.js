/**
 * AI配置模块 - 流调报告智能分析
 * 支持 OpenAI、Kimi、Claude 等多种模型
 */

// 默认AI配置
const defaultAIConfig = {
    provider: 'kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKey: '',
    model: 'kimi-coding/k2p5',
    temperature: 0.7,
    maxTokens: 4096,
    localMode: false
};

// AI提供商模板
const aiProviderTemplates = {
    kimi: {
        baseUrl: 'https://api.moonshot.cn/v1',
        model: 'kimi-coding/k2p5'
    },
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4'
    },
    claude: {
        baseUrl: 'https://api.anthropic.com/v1',
        model: 'claude-3-opus-20240229'
    },
    custom: {
        baseUrl: '',
        model: ''
    }
};

// 加载AI配置
function loadAIConfig() {
    const saved = localStorage.getItem('aiConfig');
    return saved ? JSON.parse(saved) : defaultAIConfig;
}

// 保存AI配置
function saveAIConfig() {
    const config = {
        provider: document.getElementById('aiProvider').value,
        baseUrl: document.getElementById('aiBaseUrl').value,
        apiKey: document.getElementById('aiApiKey').value,
        model: document.getElementById('aiModel').value,
        temperature: parseFloat(document.getElementById('aiTemperature').value),
        maxTokens: parseInt(document.getElementById('aiMaxTokens').value),
        localMode: document.getElementById('aiLocalMode').checked
    };
    
    localStorage.setItem('aiConfig', JSON.stringify(config));
    
    const resultDiv = document.getElementById('aiTestResult');
    resultDiv.innerHTML = `
        <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 12px; border-radius: 5px; color: #155724;">
            ✅ 配置已保存到本地
        </div>
    `;
    
    setTimeout(() => { resultDiv.innerHTML = ''; }, 3000);
}

// 恢复默认配置
function resetAIConfig() {
    if (!confirm('确定恢复默认配置吗？当前配置将被覆盖。')) return;
    
    localStorage.removeItem('aiConfig');
    displayAIConfig(defaultAIConfig);
    
    const resultDiv = document.getElementById('aiTestResult');
    resultDiv.innerHTML = `
        <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 12px; border-radius: 5px; color: #155724;">
            ✅ 已恢复默认配置
        </div>
    `;
    
    setTimeout(() => { resultDiv.innerHTML = ''; }, 3000);
}

// 显示AI配置
function displayAIConfig(config) {
    document.getElementById('aiProvider').value = config.provider;
    document.getElementById('aiBaseUrl').value = config.baseUrl;
    document.getElementById('aiApiKey').value = config.apiKey;
    document.getElementById('aiModel').value = config.model;
    document.getElementById('aiTemperature').value = config.temperature;
    document.getElementById('tempValue').textContent = config.temperature;
    document.getElementById('aiMaxTokens').value = config.maxTokens;
    if (document.getElementById('aiLocalMode')) {
        document.getElementById('aiLocalMode').checked = config.localMode;
    }
}

// 更新AI配置字段
function updateAIConfigFields() {
    const provider = document.getElementById('aiProvider').value;
    const template = aiProviderTemplates[provider];
    
    if (template && provider !== 'custom') {
        document.getElementById('aiBaseUrl').value = template.baseUrl;
        document.getElementById('aiModel').value = template.model;
    }
}

// 测试AI连接
async function testAIConnection() {
    const config = {
        provider: document.getElementById('aiProvider').value,
        baseUrl: document.getElementById('aiBaseUrl').value,
        apiKey: document.getElementById('aiApiKey').value,
        model: document.getElementById('aiModel').value
    };

    const resultDiv = document.getElementById('aiTestResult');

    if (!config.apiKey) {
        resultDiv.innerHTML = `
            <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 12px; border-radius: 5px; color: #721c24;">
                ❌ 请先输入API Key
            </div>
        `;
        return;
    }

    resultDiv.innerHTML = `
        <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 12px; border-radius: 5px; color: #004085;">
            ⏳ 正在测试连接...
        </div>
    `;

    try {
        let baseUrl = config.baseUrl.trim();
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        };

        const body = JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: '你好，这是一条测试消息，请回复"连接成功"。' }],
            max_tokens: 50,
            temperature: 0.7
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: body,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || '无回复内容';
            resultDiv.innerHTML = `
                <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 12px; border-radius: 5px; color: #155724;">
                    ✅ 连接成功！模型: ${config.model}
                    <br><small>回复: ${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}</small>
                </div>
            `;
        } else {
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error?.message || errorJson.message || errorText;
                } catch {
                    errorMessage = errorText || `HTTP ${response.status}`;
                }
            } catch {
                errorMessage = `HTTP ${response.status}`;
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        let errorMsg = error.message;
        let suggestion = '';

        if (error.name === 'AbortError') {
            errorMsg = '请求超时（15秒）';
            suggestion = '请检查网络连接或API服务状态';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg = '网络请求失败';
            suggestion = '1. 检查网络连接<br>2. 如果是本地部署，请确认服务已启动<br>3. 检查API地址是否正确<br>4. 可能是CORS跨域问题（需配置代理）';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            errorMsg = 'API Key 无效或已过期';
            suggestion = '请检查API Key是否正确';
        } else if (error.message.includes('404')) {
            errorMsg = 'API地址不存在';
            suggestion = '请检查Base URL是否正确，确保包含 /v1 路径';
        } else if (error.message.includes('429')) {
            errorMsg = '请求过于频繁或额度不足';
            suggestion = '请稍后重试或检查API额度';
        }

        resultDiv.innerHTML = `
            <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 12px; border-radius: 5px; color: #721c24;">
                ❌ 连接失败: ${errorMsg}
                ${suggestion ? `<br><small style="margin-top: 8px; display: block;">💡 ${suggestion}</small>` : ''}
            </div>
        `;
    }
}

// 初始化AI配置页面
function initAIConfig() {
    const config = loadAIConfig();
    displayAIConfig(config);
}

// 调用AI进行分析
async function callAIAnalysis(prompt, onProgress) {
    const config = loadAIConfig();
    
    if (!config.apiKey && !config.localMode) {
        throw new Error('未配置API Key，请先在AI配置页面设置');
    }

    let baseUrl = config.baseUrl.trim();
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    };

    const body = JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true
    });

    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: headers,
        body: body
    });

    if (!response.ok) {
        throw new Error(`AI请求失败: ${response.status}`);
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    fullContent += content;
                    if (onProgress) onProgress(fullContent);
                } catch (e) {
                    // 忽略解析错误
                }
            }
        }
    }

    return fullContent;
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadAIConfig, callAIAnalysis };
}
