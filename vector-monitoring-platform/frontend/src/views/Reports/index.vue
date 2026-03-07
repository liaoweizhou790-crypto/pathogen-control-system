<template>
  <div class="reports-container">
    <!-- 快速生成报告 -->
    <a-card title="🚀 快速生成报告" :bordered="false">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card class="quick-report-card" hoverable @click="generateReport('month')"
          >
            <file-text-outlined class="report-icon" />
            <h3>生成月报</h3>
            <p>生成当月病媒监测数据汇总报告</p>
          </a-card>
        </a-col>
        
        <a-col :span="8">
          <a-card class="quick-report-card" hoverable @click="generateReport('quarter')"
          >
            <file-text-outlined class="report-icon" />
            <h3>生成季报</h3>
            <p>生成季度病媒监测分析报告</p>
          </a-card>
        </a-col>
        
        <a-col :span="8">
          <a-card class="quick-report-card" hoverable @click="generateReport('year')"
          >
            <file-text-outlined class="report-icon" />
            <h3>生成年报</h3>
            <p>生成年度病媒监测总结报告</p>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    
    <!-- 报告模板 -->
    <a-card title="📋 报告模板" :bordered="false" style="margin-top: 16px">
      <a-list :data-source="templates">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :title="item.name"
              :description="item.description"
            >
              <template #avatar>
                <file-text-outlined class="template-icon" />
              </template>
            </a-list-item-meta>
            
            <template #actions>
              <a-button type="link" @click="editTemplate(item)">编辑</a-button>
              <a-button type="primary" @click="useTemplate(item)">使用</a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
    
    <!-- 历史报告 -->
    <a-card title="📁 历史报告" :bordered="false" style="margin-top: 16px">
      <a-table
        :columns="columns"
        :data-source="reportList"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag color="success">✓ 已生成</a-tag>
          </template>
          
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="previewReport(record)">👁️ 预览</a-button>
            <a-button type="link" @click="downloadReport(record)">📥 下载</a-button>
            <a-button type="link" danger @click="deleteReport(record)">🗑️ 删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 生成报告弹窗 -->
    <a-modal
      v-model:visible="reportModalVisible"
      title="生成报告"
      @ok="confirmGenerate"
      :confirmLoading="generating"
    >
      <a-form :model="reportForm" layout="vertical">
        <a-form-item label="报告类型">
          <a-radio-group v-model:value="reportForm.type">
            <a-radio value="month">月报</a-radio>
            <a-radio value="quarter">季报</a-radio>
            <a-radio value="year">年报</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="reportForm.dateRange" style="width: 100%" />
        </a-form-item>
        
        <a-form-item label="报告标题">
          <a-input v-model:value="reportForm.title" placeholder="请输入报告标题" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { reportApi } from '@/api'

const reportModalVisible = ref(false)
const generating = ref(false)

const reportForm = reactive({
  type: 'month',
  dateRange: [dayjs().startOf('month'), dayjs()],
  title: ''
})

const templates = ref([
  {
    id: 1,
    name: '月度监测报告模板',
    description: '包含当月监测数据汇总、密度统计分析、城区对比图表'
  },
  {
    id: 2,
    name: '季度分析报告模板',
    description: '包含季度监测分析、季节消长趋势、防治效果评估'
  },
  {
    id: 3,
    name: '年度总结报告模板',
    description: '包含全年监测总结、年度对比分析、下年工作建议'
  }
])

const columns = [
  { title: '报告名称', dataIndex: 'title', key: 'title' },
  { title: '报告类型', dataIndex: 'type', key: 'type' },
  { title: '生成时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
]

const reportList = ref([
  {
    id: 1,
    title: '2025年2月病媒监测月报',
    type: '月报',
    createTime: '2025-03-01 10:30:00',
    status: '已生成'
  },
  {
    id: 2,
    title: '2025年1月病媒监测月报',
    type: '月报',
    createTime: '2025-02-01 09:15:00',
    status: '已生成'
  },
  {
    id: 3,
    title: '2024年度病媒监测年报',
    type: '年报',
    createTime: '2025-01-15 14:20:00',
    status: '已生成'
  }
])

const generateReport = (type) => {
  reportForm.type = type
  reportForm.title = dayjs().format('YYYY年M月') + '病媒监测' + 
    (type === 'month' ? '月报' : type === 'quarter' ? '季报' : '年报')
  reportModalVisible.value = true
}

const confirmGenerate = async () => {
  generating.value = true
  try {
    const year = dayjs(reportForm.dateRange[0]).year()
    const month = dayjs(reportForm.dateRange[0]).month() + 1
    
    let res
    if (reportForm.type === 'month') {
      res = await reportApi.generateMonthly(year, month)
    } else if (reportForm.type === 'quarter') {
      const quarter = Math.ceil(month / 3)
      res = await reportApi.generateQuarterly(year, quarter)
    } else {
      res = await reportApi.generateAnnual(year)
    }
    
    // 添加到列表
    reportList.value.unshift({
      id: Date.now(),
      title: res.reportTitle,
      type: reportForm.type === 'month' ? '月报' : reportForm.type === 'quarter' ? '季报' : '年报',
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: '已生成'
    })
    
    message.success('报告生成成功')
    reportModalVisible.value = false
  } catch (error) {
    message.error('生成失败: ' + error.message)
  } finally {
    generating.value = false
  }
}

const editTemplate = (item) => {
  message.info('编辑模板功能开发中...')
}

const useTemplate = (item) => {
  message.success(`使用模板: ${item.name}`)
  reportModalVisible.value = true
}

const previewReport = (record) => {
  message.info('预览报告: ' + record.title)
}

const downloadReport = (record) => {
  message.success('开始下载: ' + record.title)
}

const deleteReport = (record) => {
  // TODO: 确认删除
  message.success('删除成功')
}
</script>

<style scoped lang="scss">
.reports-container {
  .quick-report-card {
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .report-icon {
      font-size: 48px;
      color: #1890ff;
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    p {
      color: #8c8c8c;
      margin: 0;
    }
  }
  
  .template-icon {
    font-size: 32px;
    color: #1890ff;
  }
}
</style>