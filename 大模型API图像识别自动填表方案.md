# 大模型API图像识别自动填表方案

## 1. 方案概述

### 1.1 核心思路
利用多模态大模型（支持图像识别）的API能力，直接识别纸质记录表图片，提取结构化数据，自动填充到系统表单中。

### 1.2 技术路线
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  拍摄记录表  │ → │ 大模型API   │ → │ 自动填表    │
│  (移动端)   │    │  (图像识别) │    │  (确认提交) │
└─────────────┘    └─────────────┘    └─────────────┘
       ↓                  ↓                  ↓
   图片上传        结构化JSON数据      数据库存储
```

---

## 2. 大模型API选型

### 2.1 推荐方案对比

| 模型 | 图像识别能力 | API价格 | 国内访问 | 推荐度 |
|------|-------------|---------|---------|--------|
| **Kimi-V1** | ⭐⭐⭐⭐⭐ | 中等 | ✅ 直连 | ⭐⭐⭐⭐⭐ |
| **GPT-4V** | ⭐⭐⭐⭐⭐ | 较高 | ❌ 需代理 | ⭐⭐⭐⭐ |
| **Claude 3** | ⭐⭐⭐⭐⭐ | 高 | ❌ 需代理 | ⭐⭐⭐ |
| **通义千问-VL** | ⭐⭐⭐⭐ | 低 | ✅ 直连 | ⭐⭐⭐⭐ |
| **文心一言** | ⭐⭐⭐⭐ | 低 | ✅ 直连 | ⭐⭐⭐ |

### 2.2 推荐方案：Kimi-V1

**选择理由：**
- ✅ 图像识别准确率高（尤其表格和文字）
- ✅ 中文理解能力强
- ✅ 国内直接访问，无需代理
- ✅ 价格合理（比GPT-4V便宜）
- ✅ 支持大图片（最高20MB）
- ✅ 响应速度快

**API文档：** https://platform.moonshot.cn/docs/vision

---

## 3. 系统实现方案

### 3.1 系统架构

```
┌─────────────────────────────────────────────────────┐
│                    移动端/前端                        │
│  ┌───────────────────────────────────────────────┐  │
│  │  1. 用户拍摄纸质记录表                          │  │
│  │  2. 选择记录类型（蚊/蝇/蟑/鼠/蜱/伊蚊）         │  │
│  │  3. 上传图片到后端                              │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ 图片上传
                      ▼
┌─────────────────────────────────────────────────────┐
│                    后端服务                           │
│  ┌───────────────────────────────────────────────┐  │
│  │  4. 接收图片，调用大模型API                     │  │
│  │  5. 解析返回的结构化数据                        │  │
│  │  6. 数据校验（格式、范围、逻辑）                │  │
│  │  7. 返回前端预览                                │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ JSON数据
                      ▼
┌─────────────────────────────────────────────────────┐
│                    用户确认界面                       │
│  ┌───────────────────────────────────────────────┐  │
│  │  8. 展示识别结果，高亮可疑字段                  │  │
│  │  9. 用户确认或手动修正                          │  │
│  │  10. 提交保存到数据库                           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 3.2 核心代码实现

#### 后端API调用（Python示例）

```python
import requests
import base64
import json
from datetime import datetime

class RecordRecognizer:
    """大模型记录表识别器"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = "https://api.moonshot.cn/v1/chat/completions"
        
        # 各类记录表的字段定义
        self.record_templates = {
            "mosquito": {
                "fields": ["monitor_date", "district", "location", "env_type", 
                          "lamp_count", "night_count", "female_count", "density", "species"],
                "description": "蚊密度监测记录表（诱蚊灯法）"
            },
            "fly": {
                "fields": ["monitor_date", "district", "location", "env_type",
                          "cage_count", "bait_days", "catch_count", "density", "species"],
                "description": "蝇密度监测记录表（捕蝇笼法）"
            },
            "cockroach": {
                "fields": ["monitor_date", "district", "location", "env_type",
                          "paper_count", "recovery_count", "catch_count", "density"],
                "description": "蟑密度监测记录表（粘蟑法）"
            },
            "rodent": {
                "fields": ["monitor_date", "district", "location", "env_type",
                          "board_count", "recovery_count", "catch_count", "density"],
                "description": "鼠密度监测记录表（粘捕法）"
            },
            "tick": {
                "fields": ["monitor_date", "district", "location", "host_type",
                          "tick_count", "tick_species"],
                "description": "蜱虫监测记录表"
            },
            "breteau": {
                "fields": ["monitor_date", "district", "location", "env_type",
                          "household_count", "water_count", "positive_count", "breteau_index"],
                "description": "布雷图指数监测记录表"
            },
            "tent": {
                "fields": ["monitor_date", "district", "location", "env_type",
                          "tent_count", "duration", "catch_count", "density"],
                "description": "双层叠帐法监测记录表"
            },
            "ovitrap": {
                "fields": ["monitor_date", "district", "location", "env_type",
                          "trap_count", "recovery_count", "positive_count"],
                "description": "诱蚊诱卵器监测记录表"
            }
        }
    
    def recognize(self, image_path, record_type):
        """
        识别记录表图片
        
        Args:
            image_path: 图片路径
            record_type: 记录类型（mosquito/fly/cockroach/rodent/tick/breteau/tent/ovitrap）
        
        Returns:
            dict: 结构化数据
        """
        # 读取图片并转base64
        with open(image_path, 'rb') as f:
            image_base64 = base64.b64encode(f.read()).decode('utf-8')
        
        template = self.record_templates.get(record_type)
        if not template:
            raise ValueError(f"未知的记录类型: {record_type}")
        
        # 构建Prompt
        prompt = f"""
你是一名专业的病媒生物监测数据录入助手。请仔细识别这张{template['description']}，提取以下字段信息：

{self._build_field_description(template['fields'])}

请以JSON格式返回，格式如下：
{{
    "monitor_date": "2025-02-25",
    "district": "柳城县",
    "location": "太平镇卫生院",
    ...
}}

注意：
1. 日期格式统一为 YYYY-MM-DD
2. 数字字段只返回数值，不要带单位
3. 如果某个字段无法识别，返回 null
4. 确保JSON格式正确，可以被直接解析
"""
        
        # 调用Kimi API
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "moonshot-v1-8k-vision-preview",  # 视觉模型
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                    ]
                }
            ],
            "temperature": 0.1  # 低温度，更确定的回答
        }
        
        response = requests.post(self.api_url, headers=headers, json=payload)
        result = response.json()
        
        # 解析返回的JSON
        content = result['choices'][0]['message']['content']
        
        # 提取JSON部分（模型可能会返回Markdown格式的JSON）
        import re
        json_match = re.search(r'```json\n(.*?)\n```', content, re.DOTALL)
        if json_match:
            content = json_match.group(1)
        
        data = json.loads(content)
        
        # 计算置信度（简单规则：非空字段占比）
        confidence = sum(1 for v in data.values() if v is not None) / len(data)
        
        return {
            "success": True,
            "data": data,
            "confidence": round(confidence, 2),
            "raw_response": content
        }
    
    def _build_field_description(self, fields):
        """构建字段描述"""
        field_descriptions = {
            "monitor_date": "监测日期",
            "district": "区县名称（如：柳城县、城中区等）",
            "location": "详细监测地点",
            "env_type": "环境类型（如：医院、学校、农贸市场等）",
            "lamp_count": "布灯数量",
            "night_count": "诱蚊夜数",
            "female_count": "捕获雌蚊数量",
            "cage_count": "捕蝇笼数量",
            "bait_days": "诱蝇天数",
            "catch_count": "捕获数量",
            "paper_count": "粘蟑纸布放数量",
            "board_count": "粘鼠板布放数量",
            "recovery_count": "回收数量",
            "density": "密度值（只/灯·夜 或 只/笼·天等）",
            "species": "蚊种/蝇种组成",
            "host_type": "宿主动物类型",
            "tick_count": "蜱虫数量",
            "tick_species": "蜱虫种类",
            "household_count": "调查户数",
            "water_count": "积水容器数",
            "positive_count": "阳性容器数",
            "breteau_index": "布雷图指数",
            "tent_count": "叠帐数量",
            "duration": "诱蚊时长（分钟）",
            "trap_count": "诱卵器放置数量"
        }
        
        desc = []
        for field in fields:
            desc.append(f"- {field}: {field_descriptions.get(field, field)}")
        return "\n".join(desc)


# 使用示例
if __name__ == "__main__":
    recognizer = RecordRecognizer(api_key="your-api-key")
    
    # 识别蚊密度记录表
    result = recognizer.recognize(
        image_path="/path/to/蚊密度记录表.jpg",
        record_type="mosquito"
    )
    
    print(json.dumps(result, ensure_ascii=False, indent=2))
```

#### 后端API接口（FastAPI示例）

```python
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import shutil
import os

app = FastAPI()
recognizer = RecordRecognizer(api_key="your-api-key")

@app.post("/api/ai/recognize-record")
async def recognize_record(
    file: UploadFile = File(...),
    record_type: str = Form(...)
):
    """
    识别纸质记录表API
    
    Args:
        file: 上传的图片文件
        record_type: 记录类型
    
    Returns:
        识别结果
    """
    try:
        # 保存上传的文件
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 调用识别器
        result = recognizer.recognize(temp_path, record_type)
        
        # 删除临时文件
        os.remove(temp_path)
        
        return JSONResponse(content=result)
    
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500
        )
```

---

## 4. 前端实现

### 4.1 移动端界面

```html
<!-- 拍照识别页面 -->
<template>
  <div class="recognize-page">
    <!-- 步骤1：选择记录类型 -->
    <div class="step-1" v-if="currentStep === 1">
      <h2>选择记录类型</h2>
      <van-grid :column-num="2">
        <van-grid-item 
          v-for="type in recordTypes" 
          :key="type.value"
          :text="type.label"
          :class="{ active: selectedType === type.value }"
          @click="selectType(type.value)"
        />
      </van-grid>
      <van-button type="primary" @click="nextStep" :disabled="!selectedType">
        下一步
      </van-button>
    </div>
    
    <!-- 步骤2：拍照上传 -->
    <div class="step-2" v-if="currentStep === 2">
      <h2>拍摄记录表</h2>
      <div class="upload-area">
        <van-uploader 
          v-model="fileList" 
          :max-count="1"
          :after-read="afterRead"
          accept="image/*"
        />
      </div>
      <p class="tips">请确保光线充足，文字清晰可见</p>
      <van-button type="primary" @click="startRecognize" :loading="recognizing">
        开始识别
      </van-button>
    </div>
    
    <!-- 步骤3：结果确认 -->
    <div class="step-3" v-if="currentStep === 3">
      <h2>识别结果确认</h2>
      <van-cell-group>
        <van-cell 
          v-for="(value, key) in recognizeResult" 
          :key="key"
          :title="fieldLabels[key]"
          :value="value || '未识别'"
          :class="{ 'low-confidence': lowConfidenceFields.includes(key) }"
        />
      </van-cell-group>
      
      <div class="confidence-info">
        <van-tag :type="confidence >= 0.9 ? 'success' : 'warning'">
          识别置信度: {{ (confidence * 100).toFixed(0) }}%
        </van-tag>
      </div>
      
      <div class="actions">
        <van-button type="default" @click="editResult">手动修正</van-button>
        <van-button type="primary" @click="confirmSubmit">确认提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      selectedType: '',
      fileList: [],
      recognizing: false,
      recognizeResult: {},
      confidence: 0,
      lowConfidenceFields: [],
      recordTypes: [
        { label: '蚊密度（诱蚊灯）', value: 'mosquito' },
        { label: '蝇密度（捕蝇笼）', value: 'fly' },
        { label: '蟑密度（粘蟑）', value: 'cockroach' },
        { label: '鼠密度（粘捕）', value: 'rodent' },
        { label: '蜱虫监测', value: 'tick' },
        { label: '布雷图指数', value: 'breteau' },
        { label: '双层叠帐法', value: 'tent' },
        { label: '诱蚊诱卵器', value: 'ovitrap' }
      ],
      fieldLabels: {
        monitor_date: '监测日期',
        district: '区县',
        location: '监测地点',
        env_type: '环境类型',
        lamp_count: '布灯数',
        female_count: '捕获数',
        density: '密度'
        // ... 其他字段
      }
    }
  },
  methods: {
    async startRecognize() {
      this.recognizing = true
      
      const formData = new FormData()
      formData.append('file', this.fileList[0].file)
      formData.append('record_type', this.selectedType)
      
      try {
        const res = await fetch('/api/ai/recognize-record', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        
        if (data.success) {
          this.recognizeResult = data.data
          this.confidence = data.confidence
          // 标记低置信度字段（简单规则：数值字段为null或0）
          this.lowConfidenceFields = Object.keys(data.data).filter(
            key => !data.data[key] || data.data[key] === 0
          )
          this.currentStep = 3
        }
      } catch (error) {
        this.$toast.fail('识别失败，请重试')
      } finally {
        this.recognizing = false
      }
    },
    
    confirmSubmit() {
      // 提交数据到后端保存
      this.$emit('submit', {
        type: this.selectedType,
        data: this.recognizeResult
      })
    }
  }
}
</script>
```

---

## 5. 成本估算

### 5.1 Kimi API费用（推荐）

| 模型 | 输入价格 | 输出价格 | 单张图片识别成本 |
|------|---------|---------|-----------------|
| moonshot-v1-8k-vision | ¥0.012/1K tokens | ¥0.012/1K tokens | 约 ¥0.05-0.10 |

**月度成本估算：**
- 假设每月识别500张记录表
- 单张成本：¥0.08（平均）
- **月度成本：¥40**
- **年度成本：¥480**

### 5.2 对比自建OCR方案

| 方案 | 初期投入 | 月度成本 | 准确率 | 维护成本 |
|------|---------|---------|--------|---------|
| **大模型API** | 0 | ¥40 | 95%+ | 低 |
| **自建OCR** | ¥50,000+（服务器+训练） | ¥500+ | 85-90% | 高 |
| **购买OCR软件** | ¥30,000+ | ¥1,000+ | 90% | 中 |

**结论：大模型API方案性价比最高**

---

## 6. 实施步骤

### 6.1 第一阶段（1-2周）：基础功能

1. **申请API Key**
   - 注册 Moonshot 平台账号
   - 申请 API Key
   - 充值（建议先充 ¥100 测试）

2. **开发后端接口**
   - 实现图片接收API
   - 实现大模型调用封装
   - 实现数据校验逻辑

3. **开发前端页面**
   - 拍照上传组件
   - 结果展示页面
   - 手动修正表单

4. **测试优化**
   - 使用真实记录表测试
   - 调整Prompt提高准确率
   - 优化用户体验

### 6.2 第二阶段（2-3周）：完善功能

1. **支持更多记录类型**
2. **添加批量识别功能**
3. **实现自动学习和优化**
4. **添加识别历史记录**

---

## 7. Prompt优化技巧

### 7.1 提高识别准确率的Prompt技巧

```python
# 技巧1：提供字段示例
"监测日期格式示例：2025-02-25"
"密度格式示例：0.5（只/灯·夜）"

# 技巧2：说明特殊情况处理
"如果手写数字难以辨认，根据上下文合理推断"
"如果某些字段为空，返回null"

# 技巧3：添加表格结构说明
"这是一个表格，包含以下列：时间、区县、地址、环境类型..."

# 技巧4：要求置信度评估
"对每个识别出的字段，给出置信度评分（0-1）"
```

### 7.2 示例优化后的Prompt

```python
prompt = f"""
你是一名专业的病媒生物监测数据录入专家，拥有多年数据录入经验。

任务：识别这张{template['description']}，提取关键字段信息。

【字段说明】
{field_desc}

【格式要求】
1. 日期格式：YYYY-MM-DD
2. 数字：纯数字，不带单位
3. 区县：只填写名称，如"柳城县"，不要加"市""县"等后缀
4. 无法识别的字段填 null

【输出格式】
必须返回有效的JSON格式：
{{
    "monitor_date": "2025-02-25",
    "district": "柳城县",
    "location": "太平镇卫生院",
    ...
}}

【注意】
- 仔细辨认手写数字，6和8、1和7容易混淆
- 如果表格有合并单元格，注意数据对应关系
- 优先识别印刷体文字，手写文字作为参考
"""
```

---

## 8. 预期效果

| 指标 | 传统录入 | 大模型识别 | 提升 |
|------|---------|-----------|------|
| **单条录入时间** | 10分钟 | 1-2分钟 | **80-90%** |
| **准确率** | 95% | 97%+ | **+2%** |
| **人工成本** | 100% | 20% | **-80%** |
| **实施成本** | - | ¥40/月 | 极低 |
| **上线时间** | - | 1-2周 | 快速 |

---

## 9. 下一步行动

1. **申请 Kimi API Key**
   - 访问 https://platform.moonshot.cn
   - 注册账号并申请 API Key
   - 充值 ¥100 用于测试

2. **准备测试样本**
   - 收集各类型纸质记录表扫描件/照片
   - 每种类型准备10-20张用于测试

3. **开发原型**
   - 先实现一种记录类型的识别
   - 测试并优化Prompt
   - 完善前端界面

4. **集成到平台**
   - 与病媒监测平台集成
   - 数据直接入库
   - 正式上线使用

---

*方案设计：系统开发-病原微生物 AI助手*
*日期：2026年2月25日*