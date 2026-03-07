// Mock API 服务 - 使用真实监测数据
import { 
  mosquitoData, 
  flyData, 
  cockroachData, 
  rodentData,
  monitoringPoints,
  calculateStats,
  getMonthlyTrend,
  getDistrictComparison
} from '@/data/realData.js'

const MOCK_USER = {
  id: 1,
  username: 'admin',
  realName: '廖维洲',
  avatar: null,
  role: 'ADMIN'
}

const MOCK_TOKEN = 'mock-jwt-token-' + Date.now()

// 所有监测数据合并
const allMonitoringData = [
  ...mosquitoData.map(d => ({ ...d, vectorType: 'MOSQUITO', monitorMethod: '诱蚊灯法' })),
  ...flyData.map(d => ({ ...d, vectorType: 'FLY', monitorMethod: '捕蝇笼法' })),
  ...cockroachData.map(d => ({ ...d, vectorType: 'COCKROACH', monitorMethod: '粘蟑法' })),
  ...rodentData.map(d => ({ ...d, vectorType: 'RODENT', monitorMethod: '粘捕法' }))
]

export const mockApi = {
  // 登录
  login: async (data) => {
    await delay(500)
    if (data.username === 'admin') {
      return {
        token: MOCK_TOKEN,
        tokenType: 'Bearer',
        expiresIn: 86400,
        userInfo: MOCK_USER
      }
    }
    throw new Error('用户名或密码错误')
  },

  // 获取用户信息
  getUserInfo: async () => {
    await delay(300)
    return MOCK_USER
  },

  // 获取统计数据 - 使用真实数据
  getStats: async (year, month) => {
    await delay(400)
    return {
      MOSQUITO: calculateStats(mosquitoData, year, month),
      FLY: calculateStats(flyData, year, month),
      COCKROACH: calculateStats(cockroachData, year, month),
      RODENT: calculateStats(rodentData, year, month)
    }
  },

  // 获取趋势数据 - 使用真实数据
  getTrend: async (year, vectorType) => {
    await delay(400)
    let data
    switch(vectorType) {
      case 'MOSQUITO': data = mosquitoData; break
      case 'FLY': data = flyData; break
      case 'COCKROACH': data = cockroachData; break
      case 'RODENT': data = rodentData; break
      default: data = mosquitoData
    }
    return getMonthlyTrend(data, year)
  },

  // 获取区县对比 - 使用真实数据
  getDistrictComparison: async (year, month, vectorType) => {
    await delay(400)
    let data
    switch(vectorType) {
      case 'MOSQUITO': data = mosquitoData; break
      case 'FLY': data = flyData; break
      case 'COCKROACH': data = cockroachData; break
      case 'RODENT': data = rodentData; break
      default: data = mosquitoData
    }
    return getDistrictComparison(data, year, month)
  },

  // 新增监测数据
  addMonitoring: async (data) => {
    await delay(600)
    const newRecord = {
      id: Date.now(),
      ...data,
      date: data.monitorDate
    }
    allMonitoringData.push(newRecord)
    return { id: newRecord.id }
  },

  // 获取监测列表 - 使用真实数据
  getMonitoringList: async (params) => {
    await delay(400)
    let result = [...allMonitoringData]
    
    // 筛选
    if (params.vectorType) {
      result = result.filter(d => d.vectorType === params.vectorType)
    }
    if (params.districtId) {
      // 根据ID找到区县名称再筛选
      result = result.filter(d => d.districtId === params.districtId)
    }
    
    // 转换格式
    return result.map(d => ({
      id: d.id,
      monitorDate: d.date,
      districtName: d.district,
      pointName: d.pointName,
      vectorType: d.vectorType,
      density: d.density
    })).slice(0, 20) // 限制返回数量
  },

  // AI识别 - 返回真实的监测点数据作为识别结果
  recognize: async (formData) => {
    await delay(2000)
    
    // 随机选择一个真实监测点作为识别结果
    const randomPoint = monitoringPoints[Math.floor(Math.random() * monitoringPoints.length)]
    const vectorTypes = ['MOSQUITO', 'FLY', 'COCKROACH', 'RODENT']
    const randomType = vectorTypes[Math.floor(Math.random() * vectorTypes.length)]
    
    const methodMap = {
      'MOSQUITO': '诱蚊灯法',
      'FLY': '捕蝇笼法', 
      'COCKROACH': '粘蟑法',
      'RODENT': '粘捕法'
    }
    
    return {
      success: true,
      confidence: 92,
      vectorType: randomType,
      monitorMethod: methodMap[randomType],
      data: {
        deployCount: randomType === 'MOSQUITO' ? 20 : randomType === 'FLY' ? 5 : randomType === 'COCKROACH' ? 10 : 20,
        duration: randomType === 'MOSQUITO' ? 2 : randomType === 'FLY' ? 1 : randomType === 'COCKROACH' ? 1 : 1,
        catchCount: Math.floor(Math.random() * 20) + 5,
        femaleCount: Math.floor(Math.random() * 15) + 5,
        monitorDate: new Date().toISOString().split('T')[0],
        pointName: randomPoint.name,
        districtId: randomPoint.district === '柳城县' ? 6 : randomPoint.district === '柳南区' ? 3 : 1,
        envType: randomPoint.type
      }
    }
  },

  // 生成报告
  generateReport: async (type, params) => {
    await delay(1500)
    
    const year = params.year || 2025
    const month = params.month || 2
    
    // 获取真实统计数据
    const mosquitoStats = calculateStats(mosquitoData, year, month)
    const flyStats = calculateStats(flyData, year, month)
    const cockroachStats = calculateStats(cockroachData, year, month)
    const rodentStats = calculateStats(rodentData, year, month)
    
    let title, content
    
    if (type === 'month') {
      title = `${year}年${month}月病媒监测月报`
      content = `# ${title}

## 一、监测概况

本月共完成监测点15个，涉及蚊、蝇、蟑、鼠等多种病媒生物监测。

## 二、密度统计

| 病媒类型 | 平均密度 | 监测次数 | 监测方法 |
|---------|---------|---------|---------|
| 蚊密度 | ${mosquitoStats.avg_density} 只/灯·夜 | ${mosquitoStats.count}次 | 诱蚊灯法 |
| 蝇密度 | ${flyStats.avg_density} 只/笼·天 | ${flyStats.count}次 | 捕蝇笼法 |
| 蟑密度 | ${cockroachStats.avg_density} 只/张 | ${cockroachStats.count}次 | 粘蟑法 |
| 鼠密度 | ${rodentStats.avg_density} 只/张 | ${rodentStats.count}次 | 粘捕法 |

## 三、主要监测点数据

- 飞鹅市场（柳南区）：蚊密度0.80只/灯·夜，蝇密度8.00只/笼·天
- 东泉镇农贸市场（柳城县）：蚊密度0.50只/灯·夜，蝇密度5.00只/笼·天
- 太平镇卫生院（柳城县）：蚊密度0.25只/灯·夜

## 四、分析与建议

1. 农贸市场蝇密度较高，需加强防蝇设施建设
2. 医院和学校蚊密度控制在较低水平
3. 建议加强对重点区域的环境治理

---
报告生成时间：${new Date().toLocaleString()}
柳州市疾病预防控制中心消毒与病媒生物防制所`
    } else {
      title = params.title || '测试报告'
      content = '# ' + title + '\n\n报告内容...'
    }
    
    return {
      id: Date.now(),
      title,
      content,
      status: 1
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}