<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="220"
      class="sidebar"
    >
      <div class="logo-area">
        <span class="logo-icon">🏥</span>
        <span v-if="!collapsed" class="logo-text">病媒监测平台</span>
      </div>
      
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        class="menu"
      >
        <a-menu-item key="/dashboard">
          <router-link to="/dashboard">
            <DashboardOutlined />
            <span>数据看板</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="/entry">
          <router-link to="/entry">
            <FormOutlined />
            <span>数据录入</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="/analysis">
          <router-link to="/analysis">
            <LineChartOutlined />
            <span>数据分析</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="/reports">
          <router-link to="/reports">
            <FileTextOutlined />
            <span>报告中心</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="/settings">
          <router-link to="/settings">
            <SettingOutlined />
            <span>系统设置</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <!-- 主内容区 -->
    <a-layout class="main-layout">
      <!-- 顶部导航 -->
      <a-layout-header class="header">
        <a-flex justify="space-between" align="center" class="header-content">
          <a-flex align="center" gap="16">
            <a-button type="text" @click="() => collapsed = !collapsed">
              <MenuFoldOutlined v-if="collapsed" />
              <MenuUnfoldOutlined v-else />
            </a-button>
            
            <breadcrumb class="breadcrumb">
              <a-breadcrumb-item>首页</a-breadcrumb-item>
              <a-breadcrumb-item>{{ currentRouteTitle }}</a-breadcrumb-item>
            </breadcrumb>
          </a-flex>
          
          <a-flex align="center" gap="16">
            <a-input-search
              placeholder="搜索..."
              style="width: 240px"
              class="search-input"
            />
            
            <a-badge :count="5" class="notification-badge">
              <a-button type="text">
                <BellOutlined />
              </a-button>
            </a-badge>
            
            <a-dropdown>
              <a-flex align="center" gap="8" class="user-info">
                <a-avatar :size="32" class="avatar">👤</a-avatar>
                <span class="username">{{ userStore.userInfo?.realName || '管理员' }}</span>
                <DownOutlined />
              </a-flex>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <UserOutlined /> 个人中心
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <SettingOutlined /> 系统设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined /> 退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-flex>
        </a-flex>
      </a-layout-header>
      
      <!-- 内容区 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      
      <!-- 页脚 -->
      <a-layout-footer class="footer">
        <p>© 2026 柳州市疾病预防控制中心 版权所有</p>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref([route.path])

// 监听路由变化
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]
})

// 当前路由标题
const currentRouteTitle = computed(() => {
  const titles = {
    '/dashboard': '数据看板',
    '/entry': '数据录入',
    '/analysis': '数据分析',
    '/reports': '报告中心',
    '/settings': '系统设置'
  }
  return titles[route.path] || ''
})

// 退出登录
const handleLogout = () => {
  userStore.logout()
  message.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
}

.sidebar {
  background: #001529;
  
  .logo-area {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .logo-icon {
      font-size: 32px;
      margin-right: 12px;
    }
    
    .logo-text {
      color: white;
      font-size: 16px;
      font-weight: 500;
      white-space: nowrap;
    }
  }
  
  .menu {
    background: transparent;
    border-right: none;
    padding-top: 8px;
    
    :deep(.ant-menu-item) {
      margin: 4px 8px;
      border-radius: 6px;
      
      a {
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
      }
      
      &.ant-menu-item-selected {
        background: #1890ff;
        
        a {
          color: white;
        }
      }
      
      &:hover:not(.ant-menu-item-selected) {
        background: rgba(255, 255, 255, 0.1);
        
        a {
          color: white;
        }
      }
    }
  }
}

.main-layout {
  .header {
    background: white;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    
    .header-content {
      height: 100%;
      
      .breadcrumb {
        font-size: 14px;
      }
      
      .search-input {
        border-radius: 20px;
      }
      
      .notification-badge {
        .ant-btn {
          font-size: 18px;
        }
      }
      
      .user-info {
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.3s;
        
        &:hover {
          background: #f5f5f5;
        }
        
        .avatar {
          background: #1890ff;
        }
        
        .username {
          font-size: 14px;
          color: #262626;
        }
      }
    }
  }
  
  .content {
    padding: 24px;
    min-height: calc(100vh - 128px);
    background: #f5f5f5;
  }
  
  .footer {
    text-align: center;
    background: white;
    padding: 16px;
    
    p {
      margin: 0;
      color: #8c8c8c;
      font-size: 12px;
    }
  }
}
</style>