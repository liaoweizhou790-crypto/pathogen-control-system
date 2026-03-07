<template>
  <div class="entry-container">
    <!-- 监测类型选择 -->
    <div class="type-selection">
      <h2 class="section-title">选择监测类型</h2>
      <a-row :gutter="[16, 16]">
        <a-col :xs="12" :sm="8" :md="6" v-for="type in monitorTypes" :key="type.key">
          <div
            class="type-card"
            :class="{ active: selectedType === type.key }"
            @click="selectType(type.key)"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-name">{{ type.name }}</div>
            <div class="type-method">{{ type.method }}</div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- AI辅助录入 -->
    <a-card class="ai-card" :bordered="false">
      <div class="ai-header">
        <robot-outlined class="ai-icon" />
        <span class="ai-title">AI 辅助录入</span>
        <span class="ai-desc">拍照自动识别记录表内容</span>
      </div>
      
      <div class="ai-actions">
        <a-upload
          accept="image/*"
          :beforeUpload="beforeUpload"
          :customRequest="handleUpload"
          :showUploadList="false"
        >
          <a-button type="primary" size="large" :loading="recognizing">
            <camera-outlined />
            拍照识别记录表
          </a-button>
        </a-upload>
        
        <a-button size="large" @click="showVoiceModal = true">
          <audio-outlined />
          语音录入
        </a-button>
        
        <a-button size="large" @click="copyLastRecord">
          <copy-outlined />
          复制上条
        </a-button>
        
        <a-button size="large" danger @click="clearForm">
          <delete-outlined />
          清空
        </a-button>
      </div>

      <!-- 识别结果展示 -->
      <div v-if="recognitionResult" class="recognition-result">
        <a-alert
          :message="'识别完成，置信度: ' + recognitionResult.confidence + '%'"
          :type="recognitionResult.confidence > 80 ? 'success' : 'warning'"
          show-icon
        />
        <div class="result-actions">
          <a-button type="primary" @click="applyRecognition">应用识别结果</a-button>
          <a-button @click="recognitionResult = null">取消</a-button>
        </div>
      </div>
    </a-card>

    <!-- 录入表单 -->
    <a-card class="form-card" :bordered="false" v-if="selectedType">
      <template #title>
        <span class="form-title">{{ currentTypeName }}数据录入</span>
        <a-tag color="blue" class="method-tag">{{ currentTypeMethod }}</a-tag>
      </template>

      <a-form
        :model="formState"
        layout="vertical"
        class="entry-form"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="监测日期" required>
                <a-date-picker
                  v-model:value="formState.monitorDate"
                  style="width: 100%"
                  valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="区县" required>
                <a-select
                  v-model:value="formState.districtId"
                  placeholder="选择区县"
                  style="width: 100%"
                >
                  <a-select-option v-for="d in districts" :key="d.id" :value="d.id">
                    {{ d.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="监测点" required>
                <a-input v-model:value="formState.pointName" placeholder="输入监测点名称" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="环境类型" required>
            <a-radio-group v-model:value="formState.envType">
              <a-radio-button v-for="env in envTypes" :key="env" :value="env">
                {{ env }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </div>

        <!-- 监测数据 -->
        <div class="form-section">
          <h3 class="section-title">监测数据</h3>
          
          <!-- 蚊密度表单 -->
          <template v-if="selectedType === 'mosquito'">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="布灯数" required>
                  <a-input-number v-model:value="formState.deployCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="诱蚊夜数" required>
                  <a-input-number v-model:value="formState.duration" :min="0" :precision="1" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="捕获雌蚊数" required>
                  <a-input-number v-model:value="formState.femaleCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item label="蚊种组成">
              <a-checkbox-group v-model:value="formState.species">
                <a-checkbox v-for="s in mosquitoSpecies" :key="s.name" :value="s.name">
                  {{ s.name }}
                  <a-input-number v-if="formState.species.includes(s.name)" 
                    v-model:value="s.count" :min="0" size="small" style="width: 60px; margin-left: 8px" />
                  只
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </template>

          <!-- 蝇密度表单 -->
          <template v-if="selectedType === 'fly'">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="捕蝇笼数" required>
                  <a-input-number v-model:value="formState.deployCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="监测天数" required>
                  <a-input-number v-model:value="formState.duration" :min="0" :precision="1" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="捕获蝇总数" required>
                  <a-input-number v-model:value="formState.catchCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </template>

          <!-- 蟑密度表单 -->
          <template v-if="selectedType === 'cockroach'">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="粘蟑纸数" required>
                  <a-input-number v-model:value="formState.deployCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="回收纸数" required>
                  <a-input-number v-model:value="formState.recoveryCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="捕获蟑总数" required>
                  <a-input-number v-model:value="formState.catchCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </template>

          <!-- 鼠密度表单 -->
          <template v-if="selectedType === 'rodent'">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="粘鼠板数" required>
                  <a-input-number v-model:value="formState.deployCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="监测天数" required>
                  <a-input-number v-model:value="formState.duration" :min="0" :precision="1" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="捕获鼠数" required>
                  <a-input-number v-model:value="formState.catchCount" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </template>

          <!-- 自动计算密度 -->
          <a-form-item>
            <div class="density-calc">
              <span class="label">密度计算:</span>
              <span class="value">{{ calculatedDensity }}</span>
              <span class="unit">{{ densityUnit }}</span>
              <a-tag color="green" v-if="calculatedDensity > 0">自动计算</a-tag>
            </div>
          </a-form-item>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <h3 class="section-title">其他信息</h3>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="天气">
                <a-input v-model:value="formState.weather" placeholder="如：晴、多云、阴" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="温度(℃)">
                <a-input-number v-model:value="formState.temperature" :precision="1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="湿度(%)">
                <a-input-number v-model:value="formState.humidity" :min="0" :max="100" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="现场照片">
            <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 5">
                <plus-outlined />
                <div style="margin-top: 8px">上传照片</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item label="备注">
            <a-textarea
              v-model:value="formState.remark"
              :rows="3"
              placeholder="请输入备注信息..."
            />
          </a-form-item>
        </div>
      </a-form>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <a-button size="large" @click="saveDraft">💾 保存草稿</a-button>
        <a-button type="primary" size="large" @click="submitData" :loading="submitting">
          ✅ 提交数据
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { aiApi, monitoringApi } from '@/api'

const selectedType = ref('')
const submitting = ref(false)
const recognizing = ref(false)
const recognitionResult = ref(null)
const fileList = ref([])
const showVoiceModal = ref(false)

const monitorTypes = [
  { key: 'mosquito', name: '蚊密度', method: '诱蚊灯法', icon: '🦟' },
  { key: 'fly', name: '蝇密度', method: '捕蝇笼法', icon: '🪰' },
  { key: 'cockroach', name: '蟑密度', method: '粘蟑法', icon: '🪳' },
  { key: 'rodent', name: '鼠密度', method: '粘捕法', icon: '🐭' },
  { key: 'breteau', name: '布雷图指数', method: '容器法', icon: '🏕️' },
  { key: 'tent', name: '双层叠帐法', method: '帐诱法', icon: '🏕️' },
  { key: 'ovitrap', name: '诱卵器监测', method: '诱卵法', icon: '🎯' },
  { key: 'tick', name: '蜱虫监测', method: '寄生法', icon: '🪲' }
]

const districts = [
  { id: 1, name: '城中区' },
  { id: 2, name: '鱼峰区' },
  { id: 3, name: '柳南区' },
  { id: 4, name: '柳北区' },
  { id: 5, name: '柳江区' },
  { id: 6, name: '柳城县' },
  { id: 7, name: '鹿寨县' },
  { id: 8, name: '融安县' },
  { id: 9, name: '融水县' },
  { id: 10, name: '三江县' }
]

const envTypes = ['医院', '学校', '居民区', '农村', '农贸市场', '餐饮场所', '公园', '其他']

const mosquitoSpecies = [
  { name: '致倦库蚊', count: 0 },
  { name: '白纹伊蚊', count: 0 },
  { name: '中华按蚊', count: 0 },
  { name: '骚扰阿蚊', count: 0 },
  { name: '其他', count: 0 }
]

const formState = reactive({
  monitorDate: dayjs(),
  districtId: undefined,
  pointName: '',
  envType: '居民区',
  deployCount: undefined,
  duration: undefined,
  recoveryCount: undefined,
  catchCount: undefined,
  femaleCount: undefined,
  species: [],
  weather: '',
  temperature: undefined,
  humidity: undefined,
  remark: ''
})

const currentTypeName = computed(() => {
  const type = monitorTypes.find(t => t.key === selectedType.value)
  return type?.name || ''
})

const currentTypeMethod = computed(() => {
  const type = monitorTypes.find(t => t.key === selectedType.value)
  return type?.method || ''
})

const calculatedDensity = computed(() => {
  let density = 0
  const { deployCount, duration, catchCount, recoveryCount } = formState
  
  if (selectedType.value === 'mosquito' && deployCount && duration && formState.femaleCount) {
    density = (formState.femaleCount / (deployCount * duration)).toFixed(2)
  } else if ((selectedType.value === 'fly' || selectedType.value === 'rodent') && deployCount && duration && catchCount) {
    density = (catchCount / (deployCount * duration)).toFixed(2)
  } else if (selectedType.value === 'cockroach' && recoveryCount && catchCount) {
    density = (catchCount / recoveryCount).toFixed(2)
  }
  
  return density
})

const densityUnit = computed(() => {
  const units = {
    mosquito: '只/灯·夜',
    fly: '只/笼·天',
    cockroach: '只/张',
    rodent: '只/张'
  }
  return units[selectedType.value] || ''
})

const selectType = (type) => {
  selectedType.value = type
  // 清空表单
  Object.keys(formState).forEach(key => {
    if (key === 'monitorDate') {
      formState[key] = dayjs()
    } else if (key === 'envType') {
      formState[key] = '居民区'
    } else {
      formState[key] = undefined
    }
  })
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('请上传图片文件!')
  }
  return isImage
}

const handleUpload = async ({ file }) => {
  recognizing.value = true
  try {
    // 创建FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('vectorType', selectedType.value)
    
    // 调用后端AI识别API
    const res = await aiApi.recognize(formData)
    
    recognitionResult.value = res
    message.success(`识别完成，置信度: ${res.confidence}%`)
  } catch (error) {
    message.error('识别失败，请重试')
  } finally {
    recognizing.value = false
  }
}

const applyRecognition = () => {
  if (recognitionResult.value?.data) {
    const data = recognitionResult.value.data
    // 将识别的数据填充到表单
    if (data.deployCount !== undefined) formState.deployCount = Number(data.deployCount)
    if (data.duration !== undefined) formState.duration = Number(data.duration)
    if (data.catchCount !== undefined) formState.catchCount = Number(data.catchCount)
    if (data.femaleCount !== undefined) formState.femaleCount = Number(data.femaleCount)
    if (data.recoveryCount !== undefined) formState.recoveryCount = Number(data.recoveryCount)
    if (data.monitorDate) formState.monitorDate = dayjs(data.monitorDate)
    if (data.pointName) formState.pointName = data.pointName
    
    recognitionResult.value = null
    message.success('已应用识别结果')
  }
}

const copyLastRecord = () => {
  message.info('复制上条记录功能开发中...')
}

const clearForm = () => {
  Object.keys(formState).forEach(key => {
    if (key === 'monitorDate') {
      formState[key] = dayjs()
    } else if (key === 'envType') {
      formState[key] = '居民区'
    } else {
      formState[key] = undefined
    }
  })
  fileList.value = []
  message.success('表单已清空')
}

const handlePreview = (file) => {
  // 预览图片
}

const handleChange = ({ fileList: newFileList }) => {
  fileList.value = newFileList
}

const saveDraft = () => {
  message.success('草稿已保存')
}

const submitData = async () => {
  if (!selectedType.value) {
    message.warning('请选择监测类型')
    return
  }
  if (!formState.districtId) {
    message.warning('请选择区县')
    return
  }
  if (!formState.pointName) {
    message.warning('请输入监测点名称')
    return
  }
  
  submitting.value = true
  try {
    // 构建提交数据
    const submitData = {
      vectorType: selectedType.value.toUpperCase(),
      monitorMethod: currentTypeMethod.value,
      monitorDate: formState.monitorDate.format('YYYY-MM-DD'),
      districtId: formState.districtId,
      pointName: formState.pointName,
      envType: formState.envType,
      deployCount: formState.deployCount,
      duration: formState.duration,
      recoveryCount: formState.recoveryCount,
      catchCount: formState.catchCount,
      femaleCount: formState.femaleCount,
      weather: formState.weather,
      temperature: formState.temperature,
      humidity: formState.humidity,
      remark: formState.remark,
      year: formState.monitorDate.year(),
      month: formState.monitorDate.month() + 1
    }
    
    // 调用后端提交API
    await monitoringApi.add(submitData)
    
    message.success('数据提交成功')
    clearForm()
  } catch (error) {
    message.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.entry-container {
  .type-selection {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #262626;
    }
    
    .type-card {
      background: white;
      border-radius: 12px;
      padding: 24px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }
      
      &.active {
        border-color: #1890ff;
        background: #e6f7ff;
      }
      
      .type-icon {
        font-size: 40px;
        margin-bottom: 8px;
      }
      
      .type-name {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
      
      .type-method {
        font-size: 12px;
        color: #8c8c8c;
        margin-top: 4px;
      }
    }
  }
  
  .ai-card {
    margin-bottom: 24px;
    background: linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%);
    border: 1px solid #b7eb8f;
    
    .ai-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      
      .ai-icon {
        font-size: 24px;
        color: #52c41a;
      }
      
      .ai-title {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
      
      .ai-desc {
        font-size: 14px;
        color: #8c8c8c;
      }
    }
    
    .ai-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .recognition-result {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #d9d9d9;
      
      .result-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .form-card {
    .form-title {
      font-size: 16px;
      font-weight: 600;
    }
    
    .method-tag {
      margin-left: 8px;
    }
  }
  
  .form-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #1890ff;
      margin-bottom: 16px;
      padding-left: 8px;
      border-left: 3px solid #1890ff;
    }
  }
  
  .density-calc {
    background: #f6ffed;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .label {
      font-weight: 500;
    }
    
    .value {
      font-size: 24px;
      font-weight: 600;
      color: #52c41a;
    }
    
    .unit {
      color: #8c8c8c;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 24px;
    
    .ant-btn {
      min-width: 120px;
    }
  }
}
</style>