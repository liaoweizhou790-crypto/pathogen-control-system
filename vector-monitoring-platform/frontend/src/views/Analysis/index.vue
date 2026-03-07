<template>
  <div class="analysis-container">
    <!-- 查询条件 -->
    <a-card class="filter-card" :bordered="false">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="监测类型">
          <a-select v-model:value="filterForm.vectorType" style="width: 120px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="mosquito">蚊密度</a-select-option>
            <a-select-option value="fly">蝇密度</a-select-option>
            <a-select-option value="cockroach">蟑密度</a-select-option>
            <a-select-option value="rodent">鼠密度</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="filterForm.dateRange" />
        </a-form-item>
        
        <a-form-item label="区县">
          <a-select v-model:value="filterForm.districtId" style="width: 120px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="d in districts" :key="d.id" :value="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <search-outlined /> 查询
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <!-- 图表区域 -->
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="12">
        <a-card title="📈 密度变化趋势" :bordered="false">
          <div ref="trendChart" style="height: 350px"></div>
        </a-card>
      </a-col>
      
      <a-col :span="12">
        <a-card title="📊 城区对比分析" :bordered="false">
          <div ref="districtChart" style="height: 350px"></div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 数据列表 -->
    <a-card style="margin-top: 16px" :bordered="false" title="📋 监测数据列表">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="handleView(record)">查看</a-button>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
          </template>
          
          <template v-if="column.key === 'vectorType'">
            <a-tag :color="getVectorColor(record.vectorType)">
              {{ getVectorName(record.vectorType) }}
            </a-tag>
          </template>
        </template>
      </a-table>
      
      <div style="margin-top: 16px; text-align: right">
        <a-button type="primary" @click="handleExport">
          <download-outlined /> 导出数据
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { monitoringApi } from '@/api'

const filterForm = reactive({
  vectorType: '',
  dateRange: [dayjs().subtract(1, 'month'), dayjs()],
  districtId: ''
})

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

const columns = [
  { title: '监测日期', dataIndex: 'monitorDate', key: 'monitorDate' },
  { title: '区县', dataIndex: 'districtName', key: 'districtName' },
  { title: '监测点', dataIndex: 'pointName', key: 'pointName' },
  { title: '类型', dataIndex: 'vectorType', key: 'vectorType' },
  { title: '密度值', dataIndex: 'density', key: 'density' },
  { title: '操作', key: 'action' }
]

const tableData = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const trendChart = ref(null)
const districtChart = ref(null)

const handleSearch = async () => {
  loading.value = true
  try {
    // 调用后端API获取数据
    const params = {
      vectorType: filterForm.vectorType ? filterForm.vectorType.toUpperCase() : null,
      districtId: filterForm.districtId,
      startDate: filterForm.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: filterForm.dateRange?.[1]?.format('YYYY-MM-DD')
    }
    
    const res = await monitoringApi.list(params)
    tableData.value = res || []
    pagination.total = res?.length || 0
  } catch (error) {
    message.error('查询失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  filterForm.vectorType = ''
  filterForm.dateRange = [dayjs().subtract(1, 'month'), dayjs()]
  filterForm.districtId = ''
}

const handleView = (record) => {
  // TODO: 查看详情
}

const handleEdit = (record) => {
  // TODO: 编辑数据
}

const handleExport = () => {
  // 构建导出URL
  const params = new URLSearchParams()
  if (filterForm.vectorType) params.append('vectorType', filterForm.vectorType.toUpperCase())
  if (filterForm.districtId) params.append('districtId', filterForm.districtId)
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    params.append('startDate', filterForm.dateRange[0].format('YYYY-MM-DD'))
    params.append('endDate', filterForm.dateRange[1].format('YYYY-MM-DD'))
  }
  
  // 下载文件
  const url = `/api/report/export?${params.toString()}`
  window.open(url, '_blank')
  message.success('开始导出数据')
}

const getVectorName = (type) => {
  const names = {
    mosquito: '蚊密度',
    fly: '蝇密度',
    cockroach: '蟑密度',
    rodent: '鼠密度'
  }
  return names[type] || type
}

const getVectorColor = (type) => {
  const colors = {
    mosquito: 'purple',
    fly: 'orange',
    cockroach: 'green',
    rodent: 'red'
  }
  return colors[type] || 'default'
}

onMounted(() => {
  handleSearch()
  
  // 初始化图表
  if (trendChart.value) {
    const chart = echarts.init(trendChart.value)
    chart.setOption({
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月'] },
      yAxis: { type: 'value' },
      series: [{ data: [0.3, 0.4, 0.5, 0.52, 0.6], type: 'line' }]
    })
  }
  
  if (districtChart.value) {
    const chart = echarts.init(districtChart.value)
    chart.setOption({
      xAxis: { type: 'category', data: ['柳城', '柳南', '城中', '鱼峰', '柳北'] },
      yAxis: { type: 'value' },
      series: [{ data: [0.52, 0.48, 0.45, 0.42, 0.38], type: 'bar' }]
    })
  }
})
</script>

<style scoped lang="scss">
.analysis-container {
  .filter-card {
    .ant-form-inline {
      .ant-form-item {
        margin-right: 16px;
        margin-bottom: 0;
      }
    }
  }
}
</style>