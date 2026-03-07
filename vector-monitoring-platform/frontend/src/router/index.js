import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '数据看板', icon: 'DashboardOutlined' }
      },
      {
        path: '/entry',
        name: 'DataEntry',
        component: () => import('@/views/DataEntry/index.vue'),
        meta: { title: '数据录入', icon: 'FormOutlined' }
      },
      {
        path: '/analysis',
        name: 'Analysis',
        component: () => import('@/views/Analysis/index.vue'),
        meta: { title: '数据分析', icon: 'LineChartOutlined' }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/views/Reports/index.vue'),
        meta: { title: '报告中心', icon: 'FileTextOutlined' }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: { title: '系统设置', icon: 'SettingOutlined' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 如果目标页面是公开的，直接放行
  if (to.meta && to.meta.public) {
    next()
    return
  }
  
  // 检查是否有token
  if (!userStore.token) {
    // 未登录，重定向到登录页
    next('/login')
  } else {
    // 已登录，放行
    next()
  }
})

export default router