<template>
  <div class="dashboard-container">
    <!-- 顶部筛选 -->
    <div class="filter-bar">
      <a-card :bordered="false">
        <a-flex justify="space-between" align="center">
          <a-flex align="center" gap="16">
            <span class="filter-label">📅 数据周期:</span>
            <a-range-picker
              v-model:value="dateRange"
              format="YYYY-MM"
              :picker="'month'"
              style="width: 240px"
            />
          </a-flex>
          
          <a-flex gap="8">
            <a-button @click="setPeriod('month')">本月</a-button>
            <a-button @click="setPeriod('quarter')">本季</a-button>
            <a-button type="primary" @click="setPeriod('year')">本年</a-button>
          </a-flex>
        </a-flex>
      </a-card>
    </div>
    
    <!-- 核心指标卡片 -->
    <div class="stats-row" v-loading="loading">
      <a-row :gutter="16">
        <a-col :span="6">
          <div class="stat-card mosquito">
            <div class="icon">🦟</div>
            <div class="label">蚊密度</div>
            <div class="value">{{ mosquitoStat.value }}</div>
            <div class="unit">只/灯·夜</div>
            <div class="trend" :class="mosquitoStat.trend > 0 ? 'up' : mosquitoStat.trend < 0 ? 'down' : 'flat'">
              <ArrowUpOutlined v-if="mosquitoStat.trend > 0" />
              <ArrowDownOutlined v-else-if="mosquitoStat.trend < 0" />
              <MinusOutlined v-else />
              {{ Math.abs(mosquitoStat.trend) }}% 环比上月
            </div>
          </div>
        </a-col>
        
        <a-col :span="6">
          <div class="stat-card fly">
            <div class="icon">🪰</div>
            <div class="label">蝇密度</div>
            <div class="value">{{ flyStat.value }}</div>
            <div class="unit">只/笼·天</div>
            <div class="trend" :class="flyStat.trend > 0 ? 'up' : flyStat.trend < 0 ? 'down' : 'flat'">
              <ArrowUpOutlined v-if="flyStat.trend > 0" />
              <ArrowDownOutlined v-else-if="flyStat.trend < 0" />
              <MinusOutlined v-else />
              {{ Math.abs(flyStat.trend) }}% 环比上月
            </div>
          </div>
        </a-col>
        
        <a-col :span="6">
          <div class="stat-card cockroach">
            <div class="icon">🪳</div>
            <div class="label">蟑密度</div>
            <div class="value">{{ cockroachStat.value }}</div>
            <div class="unit">只/张</div>
            <div class="trend" :class="cockroachStat.trend > 0 ? 'up' : cockroachStat.trend < 0 ? 'down' : 'flat'">
              <ArrowUpOutlined v-if="cockroachStat.trend > 0" />
              <ArrowDownOutlined v-else-if="cockroachStat.trend < 0" />
              <MinusOutlined v-else />
              {{ Math.abs(cockroachStat.trend) }}% 环比上月
            </div>
          </div>
        </a-col>
        
        <a-col :span="6">
          <div class="stat-card rodent">
            <div class="icon">🐭</div>
            <div class="label">鼠密度</div>
            <div class="value">{{ rodentStat.value }}</div>
            <div class="unit">只/张</div>
            <div class="trend" :class="rodentStat.trend > 0 ? 'up' : rodentStat.trend < 0 ? 'down' : 'flat'">
              <ArrowUpOutlined v-if="rodentStat.trend > 0" />
              <ArrowDownOutlined v-else-if="rodentStat.trend < 0" />
              <MinusOutlined v-else />
              {{ Math.abs(rodentStat.trend) }}% 环比上月
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-row">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card title="📈 密度季节消长趋势" :bordered="false" class="chart-card">
            <div ref="trendChart" class="chart"></div>
          </a-card>
        </a-col>
        
        <a-col :span="8">
          <a-card title="🗺️ 城区分布对比" :bordered="false" class="chart-card">
            <div ref="districtChart" class="chart"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    
    <!-- 底部区域 -->
    <div class="bottom-row">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="📊 监测完成情况" :bordered="false">
            <a-row align="middle" justify="center" style="padding: 40px 0">
              <a-col :span="12">
                <a-progress
                  type="circle"
                  :percent="85"
                  :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }"
                  :size="160"
                />
              </a-col>
              <a-col :span="12">
                <div class="progress-info">
                  <p><strong>已完成监测:</strong> 85%</p>
                  <p><strong>未完成监测:</strong> 15%</p>
                  <p><strong>本月计划:</strong> 120 个监测点</p>
                  <p><strong>已完成:</strong> 102 个监测点</p>
                  <a-button type="primary" size="small" @click="goToEntry">去录入</a-button>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        
        <a-col :span="12">
          <a-card title="⚠️ 风险预警" :bordered="false" class="warning-card">
            <a-list :data-source="warnings">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <a-tag :color="item.level">
                        {{ item.level === 'error' ? '严重' : item.level === 'warning' ? '警告' : '提示' }}
                      </a-tag>
                      <span class="warning-title">{{ item.title }}</span>
                    </template>
                    <template #description>
                      {{ item.description }}
                    </template>
                  </a-list-item-meta>
                  
                  <template #actions>
                    <a @click="viewDetail(item)">查看</a>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { dashboardApi } from '@/api'

const router = useRouter()
const trendChart = ref(null)
const districtChart = ref(null)
const loading = ref(false)

// 统计数据
const statsData = reactive({
  MOSQUITO: { avg_density: 0.52, count: 45 },
  FLY: { avg_density: 2.15, count: 38 },
  COCKROACH: { avg_density: 0.35, count: 42 },
  RODENT: { avg_density: 0.08, count: 40 }
})

// 日期范围
const dateRange = ref([
  dayjs().subtract(11, 'month'),
  dayjs()
])

// 计算当前显示的月份和年份
const currentYear = computed(() => dateRange.value[1].year())
const currentMonth = computed(() => dateRange.value[1].month() + 1)

// 统计卡片数据
const mosquitoStat = computed(() => ({
  value: statsData.MOSQUITO?.avg_density?.toFixed(2) || '0.00',
  trend: -12,
  count: statsData.MOSQUITO?.count || 0
}))

const flyStat = computed(() => ({
  value: statsData.FLY?.avg_density?.toFixed(2) || '0.00',
  trend: 5,
  count: statsData.FLY?.count || 0
}))

const cockroachStat = computed(() => ({
  value: statsData.COCKROACH?.avg_density?.toFixed(2) || '0.00',
  trend: 0,
  count: statsData.COCKROACH?.count || 0
}))

const rodentStat = computed(() => ({
  value: statsData.RODENT?.avg_density?.toFixed(2) || '0.00',
  trend: -8,
  count: statsData.RODENT?.count || 0
}))

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await dashboardApi.getStats(currentYear.value, currentMonth.value)
    Object.assign(statsData, res)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  try {
    const mosquitoData = await dashboardApi.getTrend(currentYear.value, 'MOSQUITO')
    const flyData = await dashboardApi.getTrend(currentYear.value, 'FLY')
    updateTrendChart(mosquitoData, flyData)
  } catch (error) {
    console.error('加载趋势数据失败:', error)
  }
}

// 加载区县对比数据
const loadDistrictData = async () => {
  try {
    const data = await dashboardApi.getDistrictComparison(currentYear.value, currentMonth.value, 'MOSQUITO')
    updateDistrictChart(data)
  } catch (error) {
    console.error('加载区县数据失败:', error)
  }
}

// 刷新所有数据
const refreshData = async () => {
  loading.value = true
  await Promise.all([
    loadStats(),
    loadTrendData(),
    loadDistrictData()
  ])
  loading.value = false
}

// 监听日期变化
watch(dateRange, () => {
  refreshData()
}, { deep: true })

const warnings = ref([
  {
    level: 'error',
    title: '柳南区蚊密度超标',
    description: '布雷图指数达到15，超过警戒线（10），需立即采取灭蚊措施'
  },
  {
    level: 'warning',
    title: '城中区蝇密度上升',
    description: '近两周蝇密度持续上升，较上月增加25%，需加强监测'
  },
  {
    level: 'warning',
    title: '柳江县监测点完成率低',
    description: '本月监测点完成率仅65%，请督促尽快完成监测任务'
  }
])

const setPeriod = (period) => {
  const now = dayjs()
  switch(period) {
    case 'month':
      dateRange.value = [now.startOf('month'), now]
      break
    case 'quarter':
      dateRange.value = [now.startOf('quarter'), now]
      break
    case 'year':
      dateRange.value = [now.startOf('year'), now]
      break
  }
}

const goToEntry = () => {
  router.push('/entry')
}

const viewDetail = (item) => {
  // TODO: 查看详情
}

// 初始化趋势图
const updateTrendChart = (mosquitoData, flyData) => {
  if (!trendChart.value) return
  
  const chart = echarts.init(trendChart.value)
  
  // 处理数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const mosquitoSeries = new Array(12).fill(0)
  const flySeries = new Array(12).fill(0)
  
  if (mosquitoData) {
    mosquitoData.forEach(item => {
      const month = item.month - 1
      if (month >= 0 && month < 12) {
        mosquitoSeries[month] = parseFloat(item.avg_density).toFixed(2)
      }
    })
  }
  
  if (flyData) {
    flyData.forEach(item => {
      const month = item.month - 1
      if (month >= 0 && month < 12) {
        flySeries[month] = parseFloat(item.avg_density).toFixed(2)
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['蚊密度', '蝇密度']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value',
      name: '密度'
    },
    series: [
      {
        name: '蚊密度',
        type: 'line',
        smooth: true,
        data: mosquitoSeries,
        itemStyle: { color: '#722ED1' }
      },
      {
        name: '蝇密度',
        type: 'line',
        smooth: true,
        data: flySeries,
        itemStyle: { color: '#FA8C16' }
      }
    ]
  }
  
  chart.setOption(option, true)
}

// 初始化城区对比图
const updateDistrictChart = (data) => {
  if (!districtChart.value) return
  
  const chart = echarts.init(districtChart.value)
  
  // 处理数据
  const districts = data ? data.map(item => item.district_name).reverse() : ['城中', '鱼峰', '柳南', '柳北', '柳江']
  const values = data ? data.map(item => parseFloat(item.avg_density).toFixed(2)).reverse() : [0.5, 0.45, 0.42, 0.38, 0.35]
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: districts
    },
    series: [
      {
        name: '蚊密度',
        type: 'bar',
        data: values,
        itemStyle: { color: '#722ED1' }
      }
    ]
  }
  
  chart.setOption(option, true)
}

onMounted(() => {
  refreshData()
  
  // 初始化空图表
  if (trendChart.value) {
    const chart = echarts.init(trendChart.value)
    chart.setOption({
      title: { text: '加载中...', left: 'center', top: 'center' }
    })
  }
  if (districtChart.value) {
    const chart = echarts.init(districtChart.value)
    chart.setOption({
      title: { text: '加载中...', left: 'center', top: 'center' }
    })
  }
  
  window.addEventListener('resize', () => {
    if (trendChart.value) echarts.init(trendChart.value).resize()
    if (districtChart.value) echarts.init(districtChart.value).resize()
  })
})
</script>

<style scoped lang="scss">
.dashboard-container {
  .filter-bar {
    margin-bottom: 16px;
    
    .filter-label {
      font-size: 14px;
      color: #262626;
      font-weight: 500;
    }
  }
  
  .stats-row {
    margin-bottom: 16px;
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      border-top: 4px solid transparent;
      
      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
      }
      
      &.mosquito {
        border-top-color: #722ED1;
        .icon { color: #722ED1; }
      }
      
      &.fly {
        border-top-color: #FA8C16;
        .icon { color: #FA8C16; }
      }
      
      &.cockroach {
        border-top-color: #52C41A;
        .icon { color: #52C41A; }
      }
      
      &.rodent {
        border-top-color: #F5222D;
        .icon { color: #F5222D; }
      }
      
      .icon {
        font-size: 40px;
        margin-bottom: 8px;
      }
      
      .label {
        font-size: 14px;
        color: #8c8c8c;
        margin-bottom: 8px;
      }
      
      .value {
        font-size: 32px;
        font-weight: 600;
        color: #262626;
        line-height: 1;
      }
      
      .unit {
        font-size: 12px;
        color: #8c8c8c;
        margin-top: 4px;
      }
      
      .trend {
        margin-top: 12px;
        font-size: 12px;
        font-weight: 500;
        
        &.up {
          color: #f5222d;
        }
        
        &.down {
          color: #52c41a;
        }
        
        &.flat {
          color: #8c8c8c;
        }
      }
    }
  }
  
  .charts-row {
    margin-bottom: 16px;
    
    .chart-card {
      .chart {
        height: 350px;
      }
    }
  }
  
  .bottom-row {
    .progress-info {
      p {
        margin: 8px 0;
        font-size: 14px;
        color: #595959;
      }
    }
    
    .warning-card {
      .warning-title {
        margin-left: 8px;
        font-weight: 500;
      }
    }
  }
}
</style>