import axios from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import { mockApi } from '@/api/mock'

// 是否使用Mock数据（后端未启动时使用）
const USE_MOCK = true

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 如果返回的不是标准格式，直接返回
    if (!res.hasOwnProperty('code')) {
      return res
    }
    
    if (res.code === 200) {
      return res.data
    } else {
      message.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    console.error('请求错误:', error)
    
    if (error.response) {
      const { status } = error.response
      
      if (status === 401) {
        message.error('登录已过期，请重新登录')
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
      } else if (status === 403) {
        message.error('没有权限执行此操作')
      } else if (status === 404) {
        message.error('请求的资源不存在')
      } else if (status === 500) {
        message.error('服务器内部错误')
      } else {
        message.error(error.response.data?.message || '请求失败')
      }
    } else {
      message.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

// Mock请求封装
const mockRequest = {
  post: async (url, data) => {
    // 根据URL路由到对应的mock方法
    if (url === '/user/login') return mockApi.login(data)
    if (url === '/monitoring') return mockApi.addMonitoring(data)
    if (url === '/ai/recognize') return mockApi.recognize(data)
    if (url.includes('/reports/')) return mockApi.generateReport(url.split('/').pop(), data)
    throw new Error('未实现的Mock接口: ' + url)
  },
  get: async (url, config) => {
    const params = config?.params || {}
    if (url === '/user/info') return mockApi.getUserInfo()
    if (url === '/dashboard/stats') return mockApi.getStats(params.year, params.month)
    if (url === '/dashboard/trend') return mockApi.getTrend(params.year, params.vectorType)
    if (url === '/dashboard/district-comparison') return mockApi.getDistrictComparison(params.year, params.month, params.vectorType)
    if (url === '/monitoring/list') return mockApi.getMonitoringList(params)
    throw new Error('未实现的Mock接口: ' + url)
  },
  put: async (url, data) => {
    return { success: true }
  },
  delete: async (url) => {
    return { success: true }
  }
}

// 导出带Mock支持的请求对象
export default new Proxy(request, {
  get(target, prop) {
    if (USE_MOCK && ['post', 'get', 'put', 'delete'].includes(prop)) {
      return mockRequest[prop]
    }
    return target[prop]
  }
})