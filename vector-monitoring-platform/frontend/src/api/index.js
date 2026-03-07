import request from '@/utils/request'

/**
 * 看板相关API
 */
export const dashboardApi = {
  // 获取统计数据
  getStats: (year, month) => {
    return request.get('/dashboard/stats', { params: { year, month } })
  },
  
  // 获取趋势数据
  getTrend: (year, vectorType) => {
    return request.get('/dashboard/trend', { params: { year, vectorType } })
  },
  
  // 获取区县对比
  getDistrictComparison: (year, month, vectorType) => {
    return request.get('/dashboard/district-comparison', { 
      params: { year, month, vectorType } 
    })
  }
}

/**
 * 监测数据相关API
 */
export const monitoringApi = {
  // 新增监测数据
  add: (data) => {
    return request.post('/monitoring', data)
  },
  
  // 更新监测数据
  update: (id, data) => {
    return request.put(`/monitoring/${id}`, data)
  },
  
  // 删除监测数据
  delete: (id) => {
    return request.delete(`/monitoring/${id}`)
  },
  
  // 获取详情
  getById: (id) => {
    return request.get(`/monitoring/${id}`)
  },
  
  // 获取列表
  list: (params) => {
    return request.get('/monitoring/list', { params })
  }
}

/**
 * AI识别相关API
 */
export const aiApi = {
  // 图片识别
  recognize: (formData) => {
    return request.post('/ai/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

/**
 * 报告相关API
 */
export const reportApi = {
  // 生成月度报告
  generateMonthly: (year, month) => {
    return request.post('/report/monthly', null, { params: { year, month } })
  },
  
  // 生成季度报告
  generateQuarterly: (year, quarter) => {
    return request.post('/report/quarterly', null, { params: { year, quarter } })
  },
  
  // 生成年度报告
  generateAnnual: (year) => {
    return request.post('/report/annual', null, { params: { year } })
  },
  
  // 生成自定义报告
  generateCustom: (startDate, endDate, title) => {
    return request.post('/report/custom', null, { params: { startDate, endDate, title } })
  },
  
  // 导出数据
  exportData: (params) => {
    return request.get('/report/export', { params, responseType: 'blob' })
  }
}

/**
 * 用户相关API
 */
export const userApi = {
  // 登录
  login: (data) => {
    return request.post('/user/login', data)
  },
  
  // 获取用户信息
  getInfo: () => {
    return request.get('/user/info')
  },
  
  // 更新用户信息
  updateInfo: (data) => {
    return request.put('/user/info', data)
  }
}