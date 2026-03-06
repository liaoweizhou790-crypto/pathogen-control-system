}

// 切换标签页
function showTab(index) {
    document.querySelectorAll('.tab').forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.tab-content').forEach((c, i) => {
        c.classList.toggle('active', i === index);
    });
}

// 显示原生风格提示
function showNativeToast(message) {
    if (isCapacitor() && Capacitor.Plugins && Capacitor.Plugins.Toast) {
        Capacitor.Plugins.Toast.show({ text: message });
    } else {
        // 使用更友好的提示而不是alert
        showToast(message);
    }
}

// 显示轻量级提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10002;
        animation: fadeInOut 2s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// 打开文件 - 方案一实现
function openDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    const ext = doc.name.split('.').pop().toLowerCase();
    
    // 根据文件类型选择不同的打开方式
    if (ext === 'txt') {
        // 文本文件：应用内直接显示
        showTextContent(doc);
    } else if (ext === 'pdf') {
        // PDF文件：应用内预览
        showPdfPreview(doc);
    } else {
        // Office文件：保存到Download目录再打开
        saveAndOpenOfficeFile(doc);
    }
}

// 显示文本文件内容
function showTextContent(doc) {
    try {
        const textContent = atob(doc.data.split(',')[1]);
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
        `;
        
        modal.innerHTML = `
            <div style="background: #333; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px; font-weight: bold;">📃 ${doc.name}</span>
                <div>
                    <button onclick="copyTextContent(this)" 
                            style="background: #667eea; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-right: 10px; cursor: pointer;"
                            data-text="${encodeURIComponent(textContent)}">
                        📋 复制
                    </button>
                    <button onclick="this.closest('.modal-overlay').remove()" 
                            style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        ✕ 关闭
                    </button>
                </div>
            </div>
            <pre id="text-content-display" style="flex: 1; background: #1e1e1e; color: #d4d4d4; padding: 20px; margin: 0; overflow: auto; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        `;
        
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    } catch (e) {
        showToast('无法显示文本内容');
    }
}

// 复制文本内容
function copyTextContent(btn) {
    const text = decodeURIComponent(btn.getAttribute('data-text'));
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('已复制到剪贴板');
        });
    } else {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制到剪贴板');
    }
}

// 显示PDF预览
function showPdfPreview(doc) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
    `;
    
    modal.innerHTML = `
        <div style="background: #333; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px; font-weight: bold;">📄 ${doc.name}</span>
            <div>
                <button onclick="downloadDocument(${doc.id})" 
                        style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-right: 10px; cursor: pointer;">
                    ⬇️ 保存
                </button>
                <button onclick="this.closest('.modal-overlay').remove()" 
                        style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    ✕ 关闭
                </button>
            </div>
        </div>
        <iframe src="${doc.data}" style="flex: 1; width: 100%; border: none;" type="application/pdf"></iframe>
    `;
    
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
}

// 保存Office文件到Download目录并打开
async function saveAndOpenOfficeFile(doc) {
    if (!isCapacitor()) {
        // Web环境：直接下载
        fallbackDownload(doc);
        showFileLocationGuide(doc.name);
        return;
    }

    // 显示加载提示
    const loadingModal = document.createElement('div');
    loadingModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    loadingModal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">📂</div>
            <div style="font-size: 16px; color: #333;">正在保存文件...</div>
            <div style="font-size: 14px; color: #999; margin-top: 10px;">${doc.name}</div>
        </div>
    `;
    document.body.appendChild(loadingModal);

    try {
        const { Filesystem, Directory, Encoding } = Capacitor.Plugins;
        
        // 保存到 Downloads 目录
        await Filesystem.writeFile({
            path: doc.name,
            data: doc.data.split(',')[1],
            directory: Directory.Downloads,
            encoding: Encoding.Base64
        });

        // 获取文件URI
        const fileUri = await Filesystem.getUri({
            path: doc.name,
            directory: Directory.Downloads
        });

        loadingModal.remove();
        showNativeToast('文件已保存到下载目录');

        // 尝试用 FileOpener 打开
        try {
            const { FileOpener } = Capacitor.Plugins;
            await FileOpener.open({
                filePath: fileUri.uri,
                contentType: getMimeType(doc.name)
            });
        } catch (openError) {
            console.log('FileOpener failed:', openError);
            // 如果打开失败，显示手动打开指引
            showManualOpenGuide(doc.name);
        }

    } catch (error) {
        console.error('保存文件失败:', error);
        loadingModal.remove();
        
        // 如果 Downloads 目录失败，尝试 ExternalStorage
        try {
            const { Filesystem, Directory, Encoding } = Capacitor.Plugins;
            await Filesystem.writeFile({
                path: doc.name,
                data: doc.data.split(',')[1],
                directory: Directory.ExternalStorage,
                encoding: Encoding.Base64
            });
            
            showNativeToast('文件已保存');
            showFileLocationGuide(doc.name);
        } catch (e) {
            showToast('保存文件失败，请重试');
        }
    }
}

// 显示手动打开指引
function showManualOpenGuide(filename) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 15px; max-width: 340px; width: 100%;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                <div style="font-size: 18px; font-weight: bold; color: #28a745;">文件已保存</div>
                <div style="color: #666; font-size: 14px; margin-top: 5px; word-break: break-all;">${filename}</div>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
                <div style="font-weight: bold; color: #856404; margin-bottom: 10px;">📂 如何打开文件：</div>
                <ol style="color: #856404; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>打开手机的<strong>"文件管理"</strong>应用</li>
                    <li>进入<strong>"下载"</strong>或<strong>"Download"</strong>文件夹</li>
                    <li>找到文件并点击打开</li>
                </ol>
            </div>
            
            <button onclick="this.closest('.modal-overlay').remove();" 
                    style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold;">
                知道了
            </button>
        </div>
    `;
    
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
}

// Web环境回退方案 - 下载
function fallbackDownload(doc) {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 显示文件位置指引
function showFileLocationGuide(filename) {
    const isNative = isCapacitor();
    
    setTimeout(() => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            padding: 20px;
        `;
        
        const nativeInstructions = isNative 
            ? `
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
                    <div style="font-weight: bold; color: #856404; margin-bottom: 10px;">📂 在手机上查找文件：</div>
                    <ol style="color: #856404; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li>打开手机的<strong>"文件管理"</strong>或<strong>"我的文件"</strong>应用</li>
                        <li>查找<strong>"下载"</strong>或<strong>"Download"</strong>文件夹</li>
                        <li>如果找不到，尝试查看<strong>"最近文件"</strong></li>
                        <li>找到文件 <strong>${filename}</strong> 后点击打开</li>
                    </ol>
                </div>
                <div style="background: #e7f3ff; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #0066cc;">
                    <strong>💡 提示：</strong>也可以下拉手机桌面，在搜索栏中输入文件名快速查找。
                </div>
            `
            : `
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
                    <div style="font-weight: bold; color: #856404; margin-bottom: 10px;">📂 文件已下载：</div>
                    <p style="color: #856404; font-size: 14px; margin: 0;">
                        文件已保存到浏览器的默认下载位置。<br>
                        在电脑上，通常位于<strong>"下载"</strong>文件夹。
                    </p>
                </div>
            `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; max-width: 340px; width: 100%;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <div style="font-size: 18px; font-weight: bold; color: #28a745;">文件已保存</div>
                    <div style="color: #666; font-size: 14px; margin-top: 5px; word-break: break-all;">${filename}</div>
                </div>
                
                ${nativeInstructions}
                
                <button onclick="this.closest('.modal-overlay').remove();" 
                        style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold;">
                    知道了
                </button>
            </div>
        `;
        
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }, 500);
}

// ==================== 病原微生物数据库 ====================
const pathogenDB = {
    // 第一类病毒（高致病性）
    "天花病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "痘病毒科", disease: "天花", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "高致病性病毒，需最高级别防护" } },
    "猴痘病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "痘病毒科", disease: "猴痘", transmission: "接触/飞沫", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "病毒培养物按A类运输" } },
    "埃博拉病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "丝状病毒科", disease: "埃博拉出血热", transmission: "接触/体液", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟", note: "致死率高，严格防护" } },
    "马尔堡病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "丝状病毒科", disease: "马尔堡出血热", transmission: "接触/体液", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟", note: "高致死性出血热" } },
    "拉沙热病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "沙粒病毒科", disease: "拉沙热", transmission: "接触/呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "西非出血热" } },
    "尼帕病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "副黏病毒科", disease: "尼帕病毒性脑炎", transmission: "接触/飞沫", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "人畜共患病毒" } },
    "亨德拉病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "副黏病毒科", disease: "亨德拉病毒病", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "源自蝙蝠" } },
    "黄热病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "黄病毒科", disease: "黄热病", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "有疫苗，蚊媒传播" } },
    "克里米亚-刚果出血热病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "内罗病毒科", disease: "克里米亚-刚果出血热", transmission: "蜱媒/接触", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "新疆出血热病毒" } },
    "东方马脑炎病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "披膜病毒科", disease: "东方马脑炎", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "蚊媒病毒" } },
    
    // 第二类病毒
    "新型冠状病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "冠状病毒科", disease: "COVID-19", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "500-1000", unit: "mg/L", time: "30分钟", note: "一般物体表面500mg/L，污染严重1000mg/L" } },
    "SARS冠状病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "冠状病毒科", disease: "SARS", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "严重急性呼吸综合征" } },
    "MERS冠状病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "冠状病毒科", disease: "中东呼吸综合征", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "中东呼吸综合征" } },
    "狂犬病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "弹状病毒科", disease: "狂犬病", transmission: "咬伤/抓伤", disinfection: { type: "季铵盐类", conc: "1000", unit: "mg/L", time: "30分钟", note: "伤口处理用肥皂水或季铵盐" } },
    "HIV": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "逆转录病毒科", disease: "艾滋病", transmission: "血液/体液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "75%乙醇、含氯消毒剂均有效" } },
    "乙型脑炎病毒": { type: "病毒", category: "第二类", bsl: "BSL-2", family: "黄病毒科", disease: "流行性乙型脑炎", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "有疫苗，蚊媒传播" } },
    "大别班达病毒": { type: "病毒", category: "第二类", bsl: "BSL-2", family: "白蛉纤细病毒科", disease: "发热伴血小板减少综合征", transmission: "蜱媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "发热伴血小板减少综合征病毒" } },
    "汉坦病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "汉坦病毒科", disease: "肾综合征出血热", transmission: "鼠类排泄物", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟", note: "流行性出血热" } },
    "脊髓灰质炎病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "小RNA病毒科", disease: "脊髓灰质炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "肠道病毒，注意粪-口传播" } },
    "高致病性禽流感病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "正黏病毒科", disease: "禽流感", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "H5N1、H7N9等高致病性毒株" } },
    
    // 第三类病毒
    "流感病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "正黏病毒科", disease: "流行性感冒", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "空气消毒可用过氧乙酸" } },
    "诺如病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "杯状病毒科", disease: "急性胃肠炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "对酒精不敏感，需用含氯消毒剂" } },
    "登革病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "黄病毒科", disease: "登革热", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "伊蚊传播" } },
    "寨卡病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "黄病毒科", disease: "寨卡病毒病", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "蚊媒传播" } },
    "丙型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "黄病毒科", disease: "丙型肝炎", transmission: "血液/体液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "血液传播" } },
    "单纯疱疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "疱疹", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "接触传播" } },
    "水痘-带状疱疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "水痘/带状疱疹", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "空气飞沫传播" } },
    "EB病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "传染性单核细胞增多症", transmission: "唾液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "唾液传播" } },
    "巨细胞病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "巨细胞病毒感染", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "接触传播" } },
    "麻疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "副黏病毒科", disease: "麻疹", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "空气传播，传染性极强" } },
    "流行性腮腺炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "副黏病毒科", disease: "流行性腮腺炎", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "飞沫传播" } },
    "风疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "马氏病毒科", disease: "风疹", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "孕妇感染可致畸" } },
    "甲型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "甲型肝炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "肠道传播" } },
    "戊型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "戊型肝炎病毒科", disease: "戊型肝炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "肠道传播，孕妇死亡率高" } },
    "轮状病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "呼肠孤病毒科", disease: "婴幼儿腹泻", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "婴幼儿腹泻主要病原" } },
    "柯萨奇病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "手足口病/疱疹性咽峡炎", transmission: "粪-口/呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "肠道病毒" } },
    "肠道病毒A71型": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "手足口病", transmission: "粪-口/呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "可引起重症手足口病" } },
    "鼻病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "普通感冒", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "普通感冒主要病原" } },
    "乙型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "嗜肝DNA病毒科", disease: "乙型肝炎", transmission: "血液/体液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "75%乙醇无效，需用含氯消毒剂" } },
    
    // 第二类细菌
    "结核分枝杆菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "分枝杆菌属", disease: "结核病", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "高抵抗力，需高浓度消毒剂" } },
    "炭疽芽孢杆菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "芽孢杆菌属", disease: "炭疽", transmission: "接触/吸入", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "120分钟", note: "芽孢抵抗力极强" } },
    "鼠疫耶尔森菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "肠杆菌科", disease: "鼠疫", transmission: "鼠蚤/呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "甲类传染病" } },
    "霍乱弧菌": { type: "细菌", category: "第二类", bsl: "BSL-2", family: "弧菌科", disease: "霍乱", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "甲类传染病，注意水源消毒" } },
    "布鲁氏菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "布鲁氏菌属", disease: "布鲁氏菌病", transmission: "接触/食入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "人畜共患病" } },
    "土拉弗朗西斯菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "弗朗西斯菌属", disease: "土拉菌病", transmission: "接触/吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "兔热病" } },
    "鼻疽伯克霍尔德菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "伯克霍尔德菌属", disease: "鼻疽", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "人畜共患病" } },
    "类鼻疽伯克霍尔德菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "伯克霍尔德菌属", disease: "类鼻疽", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "土壤来源" } },
    "牛分枝杆菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "分枝杆菌属", disease: "牛结核病", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "类似结核分枝杆菌" } },
    "立克次体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "立克次体属", disease: "斑疹伤寒/斑点热", transmission: "蜱媒/虱媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "细胞内寄生" } },
    "恙虫病东方体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "东方体属", disease: "恙虫病", transmission: "恙螨", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "丛林斑疹伤寒" } },
    "嗜吞噬细胞无形体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "无形体属", disease: "人粒细胞无形体病", transmission: "蜱媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "蜱传播" } },
    "伯氏考克斯氏体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "考克斯体属", disease: "Q热", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "耐热抵抗力强" } },
    
    // 第三类细菌
    "金黄色葡萄球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "葡萄球菌属", disease: "化脓性感染/食物中毒", transmission: "接触/食入", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "常见致病菌" } },
    "化脓链球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "链球菌属", disease: "咽炎/猩红热", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "A群链球菌" } },
    "肺炎链球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "链球菌属", disease: "肺炎/脑膜炎", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "社区获得性肺炎常见" } },
    "肠球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠球菌属", disease: "尿路感染/心内膜炎", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "医院感染重要病原" } },
    "大肠埃希菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "腹泻/尿路感染", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "条件致病菌" } },
    "肺炎克雷伯菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "肺炎/败血症", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "产ESBL菌株耐药" } },
    "沙门氏菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "伤寒/食物中毒", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "食物中毒常见" } },
    "志贺氏菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "细菌性痢疾", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "菌痢" } },
    "副溶血弧菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "弧菌科", disease: "食物中毒", transmission: "食入", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "海产品相关" } },
    "创伤弧菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "弧菌科", disease: "伤口感染/败血症", transmission: "伤口接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "海洋创伤弧菌" } },
    "流感嗜血杆菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "嗜血杆菌属", disease: "肺炎/脑膜炎", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "儿童感染" } },
    "百日咳鲍特氏菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "鲍特氏菌属", disease: "百日咳", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "呼吸道传播" } },
    "脑膜炎奈瑟菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "奈瑟菌属", disease: "流行性脑脊髓膜炎", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "流脑，空气传播" } },
    "淋病奈瑟菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "奈瑟菌属", disease: "淋病", transmission: "性接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "性传播疾病" } },
    "幽门螺杆菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "螺杆菌属", disease: "胃炎/胃溃疡/胃癌", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "胃部定植" } },
    "铜绿假单胞菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "假单胞菌属", disease: "医院感染", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "多重耐药" } },
    "鲍曼不动杆菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "不动杆菌属", disease: "医院感染", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "多重耐药" } },
    "军团菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "军团菌属", disease: "军团菌病", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "空调水源传播" } },
    "破伤风梭菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "梭菌属", disease: "破伤风", transmission: "伤口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "芽孢形成" } },
    "肉毒梭菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "梭菌属", disease: "肉毒中毒", transmission: "食入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "毒素按第二类管理" } },
    "产气荚膜梭菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "梭菌属", disease: "气性坏疽/食物中毒", transmission: "伤口/食入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "厌氧菌" } },
    "艰难梭菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "梭菌属", disease: "抗生素相关腹泻", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "10分钟", note: "芽孢抵抗力强" } },
    "梅毒螺旋体": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "密螺旋体属", disease: "梅毒", transmission: "性接触/母婴", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "苍白密螺旋体" } },
    "钩端螺旋体": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "钩端螺旋体属", disease: "钩端螺旋体病", transmission: "接触疫水", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "水传播" } },
    "伯氏疏螺旋体": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "疏螺旋体属", disease: "莱姆病", transmission: "蜱媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "蜱传播" } },
    "衣原体": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "衣原体属", disease: "沙眼/泌尿生殖道感染", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "细胞内寄生" } },
    "支原体": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "支原体属", disease: "肺炎/尿道炎", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "无细胞壁" } },
    "空肠弯曲菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "弯曲菌属", disease: "腹泻", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "食源性腹泻" } },
    "单核增生李斯特菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "李斯特菌属", disease: "李斯特菌病", transmission: "食入", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "孕妇易感" } },
    "嗜肺军团菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "军团菌属", disease: "军团菌病", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "空调冷却塔" } },
    "霍乱弧菌": { type: "细菌", category: "第二类", bsl: "BSL-2", family: "弧菌科", disease: "霍乱", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "甲类传染病" } },
    
    // 第二类真菌
    "皮炎芽生菌": { type: "真菌", category: "第二类", bsl: "BSL-3", family: "芽生菌属", disease: "芽生菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "真菌培养物A类运输" } },
    "粗球孢子菌": { type: "真菌", category: "第二类", bsl: "BSL-3", family: "球孢子菌属", disease: "球孢子菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "沙漠风湿" } },
    "荚膜组织胞浆菌": { type: "真菌", category: "第二类", bsl: "BSL-3", family: "组织胞浆菌属", disease: "组织胞浆菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "鸟粪传播" } },
    "巴西副球孢子菌": { type: "真菌", category: "第二类", bsl: "BSL-3", family: "副球孢子菌属", disease: "副球孢子菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "南美芽生菌病" } },
    
    // 第三类真菌
    "白念珠菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "念珠菌属", disease: "念珠菌病", transmission: "内源性/接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "机会致病真菌" } },
    "新生隐球菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "隐球菌属", disease: "隐球菌病/脑膜炎", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "鸽粪传播" } },
    "烟曲霉": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "曲霉属", disease: "曲霉病/过敏", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "空气传播" } },
    "黄曲霉": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "曲霉属", disease: "曲霉病/黄曲霉毒素中毒", transmission: "食入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "产毒素" } },
    "毛霉": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "毛霉属", disease: "毛霉病", transmission: "吸入/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "侵袭性强" } },
    "马尔尼菲篮状菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "篮状菌属", disease: "马尔尼菲篮状菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "竹鼠传播" } },
    "皮肤癣菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "癣菌属", disease: "癣/脚气", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "表皮真菌" } },
    "申克孢子丝菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "孢子丝菌属", disease: "孢子丝菌病", transmission: "伤口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "玫瑰园丁病" } },
    "耳念珠菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "念珠菌属", disease: "侵袭性念珠菌病", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "多重耐药" } },
    
    // 朊病毒
    "朊病毒": { type: "朊病毒", category: "第二类", bsl: "BSL-2/3", family: "朊蛋白", disease: "克雅病/疯牛病", transmission: "医源性/食入", disinfection: { type: "特殊处理", conc: "1N", unit: "NaOH", time: "1小时", note: "134℃高压灭菌+NaOH处理" } },
    "疯牛病朊蛋白": { type: "朊病毒", category: "第二类", bsl: "BSL-3", family: "朊蛋白", disease: "牛海绵状脑病", transmission: "食入", disinfection: { type: "特殊处理", conc: "1N", unit: "NaOH", time: "1小时", note: "需要134℃高压灭菌" } },
    "变异型克雅病": { type: "朊病毒", category: "第二类", bsl: "BSL-3", family: "朊蛋白", disease: "vCJD", transmission: "食入", disinfection: { type: "特殊处理", conc: "1N", unit: "NaOH", time: "1小时", note: "疯牛病相关" } }
};

// 当前选中的病原
let currentPathogen = null;

// 搜索病原微生物
function searchPathogen(event) {
    if (event && event.key && event.key !== 'Enter') return;
    
    const keyword = document.getElementById('pathogenSearch').value.trim();
    if (!keyword) {
        document.getElementById('pathogenResult').innerHTML = `
            <div class="empty-state">
                <p>🔍 请输入关键词搜索病原微生物</p>
            </div>
        `;
        return;
    }
    
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (name.includes(keyword) || 
            data.disease.includes(keyword) || 
            data.family.includes(keyword) ||
            (data.type && data.type.includes(keyword))) {
            results.push({ name, ...data });
        }
    }
    
    displayPathogenResults(results);
}

// 显示搜索结果
function displayPathogenResults(results) {
    if (results.length === 0) {
        document.getElementById('pathogenResult').innerHTML = `
            <div class="empty-state">
                <p>😔 未找到匹配的病原微生物</p>
                <p style="font-size: 12px; color: #999;">请尝试其他关键词（如：新冠、结核、芽孢等）</p>
            </div>
        `;
        return;
    }
    
    let html = `<div style="margin-bottom: 10px; color: #666;">找到 ${results.length} 个结果：</div>
        <div style="max-height: 400px; overflow-y: auto;">`;
    
    results.forEach(item => {
        const categoryColor = item.category === '第一类' ? '#e74c3c' : 
                             item.category === '第二类' ? '#f39c12' : 
                             item.category === '第三类' ? '#27ae60' : '#95a5a6';
        const categoryBg = item.category === '第一类' ? '#ffebee' : 
                          item.category === '第二类' ? '#fff3e0' : 
                          item.category === '第三类' ? '#e8f5e9' : '#f5f5f5';
        
        html += `
            <div class="record-card" style="cursor: pointer; border-left-color: ${categoryColor};" onclick="showPathogenDetail('${item.name}')">
                <div class="record-header">
                    <span style="font-weight: bold;">${item.name}</span>
                    <span style="background: ${categoryBg}; color: ${categoryColor}; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${item.category}</span>
                </div>
                <div style="font-size: 13px; color: #666;">
                    <span>${item.type} | ${item.family} | BSL: ${item.bsl}</span>
                </div>
                <div style="font-size: 13px; color: #999; margin-top: 5px;">
                    所致疾病: ${item.disease}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('pathogenResult').innerHTML = html;
    document.getElementById('pathogenDetail').style.display = 'none';
}

// 显示病原详情
function showPathogenDetail(name) {
    const data = pathogenDB[name];
    if (!data) return;
    
    currentPathogen = { name, ...data };
    
    const categoryColor = data.category === '第一类' ? '#e74c3c' : 
                         data.category === '第二类' ? '#f39c12' : 
                         data.category === '第三类' ? '#27ae60' : '#95a5a6';
    
    document.getElementById('detailTitle').innerHTML = `
        <span style="color: ${categoryColor};">${name}</span> 
        <span style="font-size: 14px; color: #666;">${data.disease}</span>
    `;
    
    document.getElementById('detailContent').innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>病原类型</label>
                <div>${data.type}</div>
            </div>
            <div class="form-group">
                <label>分类学地位</label>
                <div>${data.family}</div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>危害程度分类</label>
                <div style="color: ${categoryColor}; font-weight: bold;">${data.category}</div>
            </div>
            <div class="form-group">
                <label>生物安全实验室等级</label>
                <div>${data.bsl}</div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>所致疾病</label>
                <div>${data.disease}</div>
            </div>
            <div class="form-group">
                <label>传播途径</label>
                <div>${data.transmission}</div>
            </div>
        </div>
    `;
    
    // 消毒推荐
    const d = data.disinfection;
    document.getElementById('disinfectionRecommendation').innerHTML = `
        <div class="result-item">
            <strong>推荐消毒剂：</strong>${d.type}
        </div>
        <div class="result-item">
            <strong>推荐浓度：</strong><span class="highlight">${d.conc} ${d.unit}</span>
        </div>
        <div class="result-item">
            <strong>作用时间：</strong>${d.time}
        </div>
        ${d.note ? `<div class="result-item" style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <strong>⚠️ 注意事项：</strong>${d.note}
        </div>` : ''}
    `;
    
    document.getElementById('pathogenDetail').style.display = 'block';
    document.getElementById('pathogenDetail').scrollIntoView({ behavior: 'smooth' });
}

// 应用病原消毒方案
function applyPathogenDisinfection() {
    if (!currentPathogen) return;
    
    const d = currentPathogen.disinfection;
    
    // 设置类别
    const categoryMap = {
        "含氯消毒剂": "含氯消毒剂",
        "过氧化物类": "过氧化物类",
        "醇类": "醇类",
        "季铵盐类": "季铵盐类",
        "其他": "其他",
        "特殊处理": "含氯消毒剂"
    };
    
    const category = categoryMap[d.type] || "含氯消毒剂";
    document.getElementById('category').value = category;
    updateDisinfectants();
    
    // 选择具体消毒剂
    setTimeout(() => {
        const disinfectantSelect = document.getElementById('disinfectant');
        for (let i = 0; i < disinfectantSelect.options.length; i++) {
            if (disinfectantSelect.options[i].text.includes(d.type) ||
                (d.type.includes("84") && disinfectantSelect.options[i].text.includes("84"))) {
                disinfectantSelect.selectedIndex = i;
                break;
            }
        }
        updateConcentration();
        
        // 设置目标浓度
        if (d.conc.includes('-')) {
            document.getElementById('targetConc').value = d.conc.split('-')[0];
        } else {
            document.getElementById('targetConc').value = d.conc;
        }
        
        const unitSelect = document.getElementById('targetUnit');
        if (d.unit === "mg/L" || d.unit === "NaOH") {
            unitSelect.value = "mg/L";
        } else {
            unitSelect.value = "%";
        }
        
        // 切换到计算标签
        document.querySelectorAll('.tab')[0].click();
        alert(`已应用 ${currentPathogen.name} 的消毒方案：${d.type} ${d.conc}${d.unit}，${d.time}`);
    }, 100);
}

// 清空搜索
function clearPathogenSearch() {
    document.getElementById('pathogenSearch').value = '';
    document.getElementById('pathogenCategoryFilter').value = '';
    document.getElementById('pathogenTypeFilter').value = '';
    document.getElementById('bslFilter').value = '';
    document.getElementById('pathogenResult').innerHTML = `
        <div class="empty-state">
            <p>🔍 请输入关键词搜索病原微生物，或使用筛选条件</p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">数据来源：《人间传染的病原微生物目录》（2023年版）</p>
        </div>
    `;
    document.getElementById('pathogenDetail').style.display = 'none';
}

// 按分类筛选
function filterPathogenByCategory() {
    const category = document.getElementById('pathogenCategoryFilter').value;
    if (!category) {
        document.getElementById('pathogenResult').innerHTML = `
            <div class="empty-state">
                <p>🔍 请选择危害程度分类或使用搜索功能</p>
            </div>
        `;
        return;
    }
    
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.category === category) {
            results.push({ name, ...data });
        }
    }
    
    displayPathogenResults(results);
}

// 按类型筛选
function filterPathogenByType() {
    const type = document.getElementById('pathogenTypeFilter').value;
    if (!type) return;
    
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.type === type) {
            results.push({ name, ...data });
        }
    }
    
    displayPathogenResults(results);
}

// 按BSL筛选
function filterPathogenByBSL() {
    const bsl = document.getElementById('bslFilter').value;
    if (!bsl) return;
    
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.bsl.includes(bsl)) {
            results.push({ name, ...data });
        }
    }
    
    displayPathogenResults(results);
}

// 显示第一类病原（高致病性）
function showHighRiskPathogens() {
    document.getElementById('pathogenCategoryFilter').value = '第一类';
    filterPathogenByCategory();
}

// 显示呼吸道传播病原
function showRespiratoryPathogens() {
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.transmission.includes('呼吸道') || data.transmission.includes('飞沫') || data.transmission.includes('空气')) {
            results.push({ name, ...data });
        }
    }
    displayPathogenResults(results);
}

// 显示血液传播病原
function showBloodPathogens() {
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.transmission.includes('血液') || data.transmission.includes('体液')) {
            results.push({ name, ...data });
        }
    }
    displayPathogenResults(results);
}

// ==================== 病原微生物模块结束 ====================

// ==================== 流调分析模块 ====================

// 当前分析模式
let currentAnalysisMode = 'text';
let uploadedImageData = null;
let uploadedPdfText = null;
let lastAnalysisResult = null;

// 切换分析模式
function setAnalysisMode(mode) {
    currentAnalysisMode = mode;
    
    // 更新按钮样式
    document.getElementById('modeText').className = mode === 'text' ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('modeImage').className = mode === 'image' ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('modePdf').className = mode === 'pdf' ? 'btn btn-primary' : 'btn btn-secondary';
    
    // 显示/隐藏对应输入区域
    document.getElementById('textInputArea').style.display = mode === 'text' ? 'block' : 'none';
    document.getElementById('imageInputArea').style.display = mode === 'image' ? 'block' : 'none';
    document.getElementById('pdfInputArea').style.display = mode === 'pdf' ? 'block' : 'none';
}

// 处理图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showAnalysisStatus('请选择图片文件', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showAnalysisStatus('图片大小不能超过10MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageData = e.target.result;
        document.getElementById('previewImg').src = uploadedImageData;
        document.getElementById('imagePreview').style.display = 'block';
        showAnalysisStatus('图片已加载，点击AI智能分析开始识别', 'success');
    };
    reader.readAsDataURL(file);
}

// 清除图片
function clearImage() {
    uploadedImageData = null;
    document.getElementById('epidemicImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

// 处理PDF上传
async function handlePdfUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        showAnalysisStatus('请选择PDF文件', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showAnalysisStatus('PDF大小不能超过10MB', 'error');
        return;
    }
    
    document.getElementById('pdfFileName').textContent = file.name;
    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfExtractedText').textContent = '正在提取文本内容...';
    
    try {
        // 使用PDF.js提取文本
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
        document.getElementById('pdfExtractedText').textContent = fullText.substring(0, 500) + (fullText.length > 500 ? '...' : '');
        showAnalysisStatus('PDF文本已提取，点击AI智能分析开始识别', 'success');
    } catch (error) {
        console.error('PDF解析错误:', error);
        document.getElementById('pdfExtractedText').textContent = 'PDF文本提取失败，将尝试直接分析PDF内容';
        showAnalysisStatus('PDF文本提取失败，AI将尝试直接分析', 'warning');
    }
}

// 清除PDF
function clearPdf() {
    uploadedPdfText = null;
    document.getElementById('epidemicPdf').value = '';
    document.getElementById('pdfPreview').style.display = 'none';
}

// 清空分析输入
function clearAnalysisInput() {
    document.getElementById('epidemicText').value = '';
    clearImage();
    clearPdf();
    document.getElementById('analysisResult').style.display = 'none';
    lastAnalysisResult = null;
}

// 显示分析状态
function showAnalysisStatus(message, type) {
    const statusDiv = document.getElementById('analysisStatus');
    const colors = {
        success: '#d4edda',
        error: '#f8d7da',
        warning: '#fff3cd',
        info: '#e7f3ff'
    };
    const borderColors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#0066cc'
    };
    const textColors = {
        success: '#155724',
        error: '#721c24',
        warning: '#856404',
        info: '#004085'
    };
    
    statusDiv.innerHTML = `
        <div style="background: ${colors[type]}; border-left: 4px solid ${borderColors[type]}; padding: 12px; border-radius: 5px; color: ${textColors[type]};">
            ${message}
        </div>
    `;
    
    if (type === 'success' || type === 'warning') {
        setTimeout(() => { statusDiv.innerHTML = ''; }, 5000);
    }
}

// AI分析流调报告
async function analyzeEpidemicReport() {
    const config = loadAIConfig();
    
    if (!config.apiKey) {
        showAnalysisStatus('请先配置AI API（点击"AI配置"标签页）', 'error');
        return;
    }
    
    // 获取输入内容
    let content = '';
    let contentType = '';
    
    if (currentAnalysisMode === 'text') {
        content = document.getElementById('epidemicText').value.trim();
        if (!content) {
            showAnalysisStatus('请输入流调报告内容', 'error');
            return;
        }
        contentType = '文本';
    } else if (currentAnalysisMode === 'image') {
        if (!uploadedImageData) {
            showAnalysisStatus('请先上传图片', 'error');
            return;
        }
        content = uploadedImageData;
        contentType = '图片';
    } else if (currentAnalysisMode === 'pdf') {
        if (!uploadedPdfText) {
            showAnalysisStatus('PDF文本提取失败，请尝试使用文本模式手动粘贴内容', 'error');
            return;
        }
        content = uploadedPdfText;
        contentType = 'PDF';
    }
    
    // 显示分析中状态
    document.getElementById('analysisResult').style.display = 'none';
    showAnalysisStatus('🔍 AI正在分析流调报告，请稍候...', 'info');
    
    try {
        // 处理baseUrl末尾斜杠
        let baseUrl = config.baseUrl.trim();
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        
        // 构建系统提示词
        const systemPrompt = `你是一位专业的流行病学和消毒学专家。请分析提供的流调报告，识别可能的致病菌，并推荐相应的消毒方案。

请按以下JSON格式返回分析结果：
{
    "pathogens": [
        {
            "name": "病原名称",
            "probability": "高/中/低",
            "reason": "判断依据",
            "category": "细菌/病毒/真菌/其他",
            "dangerLevel": "第一/二/三/四类"
        }
    ],
    "transmission": {
        "routes": ["传播途径1", "传播途径2"],
        "riskLevel": "高/中/低",
        "keyPoints": "防控要点"
    },
    "disinfection": {
        "environment": {
            "type": "消毒剂类型",
            "concentration": "推荐浓度",
            "method": "使用方法",
            "time": "作用时间"
        },
        "surface": {
            "type": "消毒剂类型",
            "concentration": "推荐浓度",
            "method": "使用方法",
            "time": "作用时间"
        },
        "air": {
            "type": "消毒方式",
            "method": "操作方法",
            "time": "作用时间"
        },
        "ppe": {
            "level": "防护级别",
            "equipment": ["防护装备1", "防护装备2"]
        }
    },
    "analysis": "详细的分析说明"
}

注意：
1. 基于报告中的症状、接触史、实验室检查等信息进行分析
2. 优先考虑常见的传染病原体
3. 消毒方案应符合GB19193-2025标准
4. 如果是高致病性病原（第一类、第二类），必须明确标注并给出严格的消毒和防护建议`;

        // 构建用户消息
        let userMessage = '';
        let messages = [];
        
        if (currentAnalysisMode === 'image') {
            // 图片模式使用vision API
            messages = [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: '请分析这张流调报告图片，识别可能的致病菌并推荐消毒方案。' },
                        { type: 'image_url', image_url: { url: content } }
                    ]
                }
            ];
        } else {
            // 文本/PDF模式
            userMessage = `请分析以下流调报告：\n\n${content}`;
            messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ];
        }
        
        // 构建请求体
        const requestBody = {
            model: config.model,
            messages: messages,
            max_tokens: config.maxTokens,
            temperature: config.temperature
        };
        
        // 使用AbortController实现超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
        
        // 发送请求
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
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
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // 解析AI返回的JSON
        let analysisResult;
        try {
            // 尝试从AI响应中提取JSON
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('无法解析AI返回的结果');
            }
        } catch (parseError) {
            console.error('JSON解析错误:', parseError);
            // 如果解析失败，使用原始文本作为分析结果
            analysisResult = {
                pathogens: [],
                transmission: { routes: [], riskLevel: '未知', keyPoints: '' },
                disinfection: {},
                analysis: aiResponse
            };
        }
        
        // 保存分析结果
        lastAnalysisResult = analysisResult;
        
        // 显示分析结果
        displayAnalysisResult(analysisResult);
        
        showAnalysisStatus(`${contentType}分析完成！`, 'success');
        
    } catch (error) {
        console.error('AI分析错误:', error);
        let errorMsg = error.message;
        
        if (error.name === 'AbortError') {
            errorMsg = '分析超时（60秒），请重试或缩短输入内容';
        } else if (error.message.includes('Failed to fetch')) {
            errorMsg = '网络请求失败，请检查网络连接和API配置';
        }
        
        showAnalysisStatus(`分析失败: ${errorMsg}`, 'error');
    }
}

// 显示分析结果
function displayAnalysisResult(result) {
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.style.display = 'block';
    
    // 显示可能的病原
    const pathogensDiv = document.getElementById('pathogensList');
    if (result.pathogens && result.pathogens.length > 0) {
        pathogensDiv.innerHTML = result.pathogens.map(p => `
            <div style="background: white; padding: 12px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid ${p.dangerLevel === '第一类' || p.dangerLevel === '第二类' ? '#dc3545' : '#28a745'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <strong style="font-size: 16px;">${p.name}</strong>
                    <span style="background: ${p.probability === '高' ? '#dc3545' : p.probability === '中' ? '#ffc107' : '#6c757d'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${p.probability}概率</span>
                </div>
                <div style="color: #666; font-size: 13px; margin-bottom: 5px;">${p.reason}</div>
                <div style="display: flex; gap: 10px; font-size: 12px; color: #999;">
                    <span>📂 ${p.category}</span>
                    <span>⚠️ ${p.dangerLevel}</span>
                </div>
            </div>
        `).join('');
    } else {
        pathogensDiv.innerHTML = '<div style="color: #999; padding: 10px;">未能识别具体病原，请参考AI分析详情</div>';
    }
    
    // 显示传播途径
    const routeDiv = document.getElementById('routeContent');
    if (result.transmission) {
        routeDiv.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <div style="margin-bottom: 10px;">
                    <strong>传播途径：</strong>${result.transmission.routes ? result.transmission.routes.join('、') : '未知'}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>风险等级：</strong>
                    <span style="color: ${result.transmission.riskLevel === '高' ? '#dc3545' : result.transmission.riskLevel === '中' ? '#ffc107' : '#28a745'}; font-weight: bold;">
                        ${result.transmission.riskLevel}
                    </span>
                </div>
                <div>
                    <strong>防控要点：</strong>${result.transmission.keyPoints || '暂无'}
                </div>
            </div>
        `;
    } else {
        routeDiv.innerHTML = '<div style="color: #999; padding: 10px;">暂无传播途径信息</div>';
    }
    
    // 显示推荐方案
    const planDiv = document.getElementById('planContent');
    if (result.disinfection) {
        const d = result.disinfection;
        let planHtml = '<div style="background: white; padding: 15px; border-radius: 8px;">';
        
        if (d.environment) {
            planHtml += `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #667eea;">🌍 环境消毒</strong>
                    <div style="margin-top: 5px; padding-left: 15px;">
                        <div>消毒剂：${d.environment.type} ${d.environment.concentration}</div>
                        <div>方法：${d.environment.method}</div>
                        <div>时间：${d.environment.time}</div>
                    </div>
                </div>
            `;
        }
        
        if (d.surface) {
            planHtml += `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #667eea;">🖐️ 物体表面</strong>
                    <div style="margin-top: 5px; padding-left: 15px;">
                        <div>消毒剂：${d.surface.type} ${d.surface.concentration}</div>
                        <div>方法：${d.surface.method}</div>
                        <div>时间：${d.surface.time}</div>
                    </div>
                </div>
            `;
        }
        
        if (d.air) {
            planHtml += `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #667eea;">💨 空气消毒</strong>
                    <div style="margin-top: 5px; padding-left: 15px;">
                        <div>方式：${d.air.type}</div>
                        <div>方法：${d.air.method}</div>
                        <div>时间：${d.air.time}</div>
                    </div>
                </div>
            `;
        }
        
        if (d.ppe) {
            planHtml += `
                <div>
                    <strong style="color: #667eea;">🛡️ 个人防护</strong>
                    <div style="margin-top: 5px; padding-left: 15px;">
                        <div>防护级别：${d.ppe.level}</div>
                        <div>防护装备：${d.ppe.equipment ? d.ppe.equipment.join('、') : '暂无'}</div>
                    </div>
                </div>
            `;
        }
        
        planHtml += '</div>';
        planDiv.innerHTML = planHtml;
    } else {
        planDiv.innerHTML = '<div style="color: #999; padding: 10px;">暂无推荐消毒方案</div>';
    }
    
    // 显示AI分析原始文本
    document.getElementById('rawContent').textContent = result.analysis || JSON.stringify(result, null, 2);
    
    // 滚动到结果区域
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 应用推荐方案到计算器
function applyRecommendedPlan() {
    if (!lastAnalysisResult || !lastAnalysisResult.disinfection) {
        showAnalysisStatus('没有可应用的推荐方案', 'error');
        return;
    }
    
    const d = lastAnalysisResult.disinfection;
    let applied = false;
    
    // 优先应用环境消毒方案
    if (d.environment) {
        applyDisinfectionPlan(d.environment);
        applied = true;
    } else if (d.surface) {
        applyDisinfectionPlan(d.surface);
        applied = true;
    }
    
    if (applied) {
        showAnalysisStatus('推荐方案已应用到配比计算器！', 'success');
    } else {
        showAnalysisStatus('推荐方案缺少具体参数，无法自动应用', 'warning');
    }
}

// 辅助函数：应用消毒方案到计算器
function applyDisinfectionPlan(plan) {
    // 解析浓度和单位
    let conc = plan.concentration || '';
    let unit = 'mg/L';
    
    if (conc.includes('%')) {
        unit = '%';
        conc = conc.replace('%', '').trim();
    } else if (conc.includes('mg/L')) {
        unit = 'mg/L';
        conc = conc.replace('mg/L', '').trim();
    }
    
    // 设置目标浓度
    document.getElementById('targetConc').value = conc || '500';
    document.getElementById('targetUnit').value = unit;
    
    // 尝试匹配消毒剂类型
    const type = plan.type || '';
    const categoryMap = {
        '含氯': '含氯消毒剂',
        '84': '含氯消毒剂',
        '次氯酸': '含氯消毒剂',
        '过氧乙酸': '过氧化物类',
        '过氧化氢': '过氧化物类',
        '二氧化氯': '二氧化氯',
        '乙醇': '醇类',
        '酒精': '醇类',
        '碘': '碘类',
        '季铵': '季铵盐类',
        '戊二醛': '醛类'
    };
    
    let category = '含氯消毒剂';
    for (const key in categoryMap) {
        if (type.includes(key)) {
            category = categoryMap[key];
            break;
        }
    }
    
    document.getElementById('category').value = category;
    updateDisinfectants();
    
    // 切换到计算标签
    switchTab('calc');
}

// 导出分析结果为PDF
function exportAnalysisResult() {
    if (!lastAnalysisResult) {
        showAnalysisStatus('没有可导出的分析结果', 'error');
        return;
    }
    
    // 创建PDF内容
    const result = lastAnalysisResult;
    const dateStr = new Date().toLocaleString('zh-CN');
    
    let pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>流调分析报告</title>
        <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: "SimSun", "Microsoft YaHei", sans-serif; line-height: 1.6; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { color: #667eea; margin: 0; font-size: 24px; }
            .header p { color: #666; margin: 5px 0; font-size: 12px; }
            .section { margin-bottom: 20px; }
            .section h2 { color: #667eea; font-size: 16px; border-left: 4px solid #667eea; padding-left: 10px; margin-bottom: 10px; }
            .pathogen { background: #f8f9fa; padding: 10px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #28a745; }
            .pathogen.high-risk { border-left-color: #dc3545; }
            .pathogen-name { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
            .pathogen-info { font-size: 12px; color: #666; }
            .disinfection-item { background: #f8f9fa; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
            .disinfection-title { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f5f5f5; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔍 流调报告智能分析报告</h1>
            <p>生成时间：${dateStr}</p>
            <p>柳州市疾病预防控制中心 消毒与病媒生物防制所</p>
        </div>
    `;
    
    // 可能的病原
    pdfContent += `
        <div class="section">
            <h2>🦠 可能的致病菌</h2>
    `;
    if (result.pathogens && result.pathogens.length > 0) {
        result.pathogens.forEach(p => {
            const riskClass = p.dangerLevel === '第一类' || p.dangerLevel === '第二类' ? 'high-risk' : '';
            pdfContent += `
                <div class="pathogen ${riskClass}">
                    <div class="pathogen-name">${p.name} <span style="color: ${p.probability === '高' ? '#dc3545' : '#28a745'};">(${p.probability}概率)</span></div>
                    <div class="pathogen-info">
                        <strong>分类：</strong>${p.category} | 
                        <strong>危害等级：</strong>${p.dangerLevel} | 
                        <strong>判断依据：</strong>${p.reason}
                    </div>
                </div>
            `;
        });
    } else {
        pdfContent += '<p style="color: #999;">未能识别具体病原</p>';
    }
    pdfContent += '</div>';
    
    // 传播途径
    if (result.transmission) {
        pdfContent += `
            <div class="section">
                <h2>📡 传播途径</h2>
                <table>
                    <tr><th>项目</th><th>内容</th></tr>
                    <tr><td>传播途径</td><td>${result.transmission.routes ? result.transmission.routes.join('、') : '未知'}</td></tr>
                    <tr><td>风险等级</td><td style="color: ${result.transmission.riskLevel === '高' ? '#dc3545' : '#28a745'}; font-weight: bold;">${result.transmission.riskLevel}</td></tr>
                    <tr><td>防控要点</td><td>${result.transmission.keyPoints || '暂无'}</td></tr>
                </table>
            </div>
        `;
    }
    
    // 推荐消毒方案
    if (result.disinfection) {
        pdfContent += `
            <div class="section">
                <h2>🛡️ 推荐消毒方案</h2>
        `;
        const d = result.disinfection;
        
        if (d.environment) {
            pdfContent += `
                <div class="disinfection-item">
                    <div class="disinfection-title">🌍 环境消毒</div>
                    <table>
                        <tr><th>消毒剂</th><td>${d.environment.type} ${d.environment.concentration}</td></tr>
                        <tr><th>使用方法</th><td>${d.environment.method}</td></tr>
                        <tr><th>作用时间</th><td>${d.environment.time}</td></tr>
                    </table>
                </div>
            `;
        }
        
        if (d.surface) {
            pdfContent += `
                <div class="disinfection-item">
                    <div class="disinfection-title">🖐️ 物体表面消毒</div>
                    <table>
                        <tr><th>消毒剂</th><td>${d.surface.type} ${d.surface.concentration}</td></tr>
                        <tr><th>使用方法</th><td>${d.surface.method}</td></tr>
                        <tr><th>作用时间</th><td>${d.surface.time}</td></tr>
                    </table>
                </div>
            `;
        }
        
        if (d.air) {
            pdfContent += `
                <div class="disinfection-item">
                    <div class="disinfection-title">💨 空气消毒</div>
                    <table>
                        <tr><th>消毒方式</th><td>${d.air.type}</td></tr>
                        <tr><th>操作方法</th><td>${d.air.method}</td></tr>
                        <tr><th>作用时间</th><td>${d.air.time}</td></tr>
                    </table>
                </div>
            `;
        }
        
        if (d.ppe) {
            pdfContent += `
                <div class="disinfection-item">
                    <div class="disinfection-title">🛡️ 个人防护</div>
                    <table>
                        <tr><th>防护级别</th><td>${d.ppe.level}</td></tr>
                        <tr><th>防护装备</th><td>${d.ppe.equipment ? d.ppe.equipment.join('、') : '暂无'}</td></tr>
                    </table>
                </div>
            `;
        }
        
        pdfContent += '</div>';
    }
    
    // AI分析详情
    if (result.analysis) {
        pdfContent += `
            <div class="section">
                <h2>📝 AI分析详情</h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 12px; white-space: pre-wrap;">${result.analysis}</div>
            </div>
        `;
    }
    
    // 页脚
    pdfContent += `
        <div class="footer">
            <p>本报告由柳州市疾病预防控制中心病原微生物防控系统AI辅助生成</p>
            <p>仅供参考，具体防控措施请结合实际情况和专业判断</p>
            <p>系统版本：V1.5.1</p>
        </div>
    </body>
    </html>
    `;
    
    // 创建新窗口并打印为PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    // 等待样式加载后打印
    setTimeout(() => {
        printWindow.print();
    }, 500);
    
    showAnalysisStatus('PDF报告已生成，请在打印对话框中选择"保存为PDF"', 'success');
}

// 拖拽上传支持
function initDragAndDrop() {
    const imageZone = document.getElementById('imageDropZone');
    const pdfZone = document.getElementById('pdfDropZone');
    
    if (imageZone) {
        imageZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageZone.style.background = '#e7f3ff';
        });
        
        imageZone.addEventListener('dragleave', () => {
            imageZone.style.background = '#f8f9fa';
        });
        
        imageZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageZone.style.background = '#f8f9fa';
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                const input = document.getElementById('epidemicImage');
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                input.files = dt.files;
                handleImageUpload({ target: input });
            }
        });
    }
    
    if (pdfZone) {
        pdfZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            pdfZone.style.background = '#e7f3ff';
        });
        
        pdfZone.addEventListener('dragleave', () => {
            pdfZone.style.background = '#f8f9fa';
        });
        
        pdfZone.addEventListener('drop', (e) => {
            e.preventDefault();
            pdfZone.style.background = '#f8f9fa';
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                const input = document.getElementById('epidemicPdf');
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                input.files = dt.files;
                handlePdfUpload({ target: input });
            }
        });
    }
}

// 初始化流调分析模块
function initEpidemicAnalysis() {
    // 默认选择文本模式
    setAnalysisMode('text');
    
    // 初始化拖拽上传
    initDragAndDrop();
}

// ==================== 流调分析模块结束 ====================

// ==================== AI配置模块 ====================

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

// AI提供商配置模板
const aiProviderTemplates = {
    kimi: {
        baseUrl: 'https://api.moonshot.cn/v1',
        model: 'kimi-coding/k2p5',
        name: 'Kimi (Moonshot)'
    },
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        name: 'OpenAI'
    },
    claude: {
        baseUrl: 'https://api.anthropic.com/v1',
        model: 'claude-3-opus-20240229',
        name: 'Claude (Anthropic)'
    },
    custom: {
        baseUrl: '',
        model: '',
        name: '自定义 API'
    }
};

// 加载AI配置
function loadAIConfig() {
    const saved = localStorage.getItem('aiConfig');
    if (saved) {
        return { ...defaultAIConfig, ...JSON.parse(saved) };
    }
    return defaultAIConfig;
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
    
    // 显示保存成功提示
    const resultDiv = document.getElementById('aiTestResult');
    resultDiv.innerHTML = `
        <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 12px; border-radius: 5px; color: #155724;">
            ✅ 配置已保存到本地
        </div>
    `;
    
    setTimeout(() => {
        resultDiv.innerHTML = '';
    }, 3000);
}

// 恢复默认配置
function resetAIConfig() {
    if (!confirm('确定恢复默认配置吗？当前配置将被覆盖。')) {
        return;
    }
    
    localStorage.removeItem('aiConfig');
    displayAIConfig(defaultAIConfig);
    
    const resultDiv = document.getElementById('aiTestResult');
    resultDiv.innerHTML = `
        <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 12px; border-radius: 5px; color: #155724;">
            ✅ 已恢复默认配置
        </div>
    `;
    
    setTimeout(() => {
        resultDiv.innerHTML = '';
    }, 3000);
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
    document.getElementById('aiLocalMode').checked = config.localMode;
}

// 更新AI配置字段（当选择不同提供商时）
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
        // 处理baseUrl末尾斜杠
        let baseUrl = config.baseUrl.trim();
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        // 构建请求头
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        };

        // 构建请求体（简单测试消息）
        const body = JSON.stringify({
            model: config.model,
            messages: [
                { role: 'user', content: '你好，这是一条测试消息，请回复"连接成功"。' }
            ],
            max_tokens: 50,
            temperature: 0.7
        });

        // 使用AbortController实现超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

        // 发送测试请求
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
            // 改进错误处理 - 先尝试获取文本，再尝试JSON
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

        // 针对常见错误提供具体建议
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

// ==================== AI配置模块结束 ====================

        // 启动应用程序（在所有函数定义之后调用）
        init();
    </script>
    
    <footer style="text-align: center; padding: 20px; color: white; margin-top: 30px; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
        <p style="margin: 5px 0;">🧬 柳州市疾病预防控制中心 病原微生物防控系统</p>
        <p style="margin: 5px 0;">消毒与病媒生物防制所</p>
        <p style="margin: 5px 0; font-size: 12px; opacity: 0.8;">未经许可不得修改或商用</p>
    </footer>
</body>
</html>
