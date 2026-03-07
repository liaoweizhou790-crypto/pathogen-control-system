<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">🏥</span>
        </div>
        <h1 class="title">柳州市疾病预防控制中心</h1>
        <p class="subtitle">消毒与病媒生物管理平台</p>
      </div>
      
      <a-form
        :model="formState"
        name="loginForm"
        @finish="handleLogin"
        class="login-form"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
            @pressEnter="handleLogin"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-flex justify="space-between" align="center">
            <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </a-flex>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="login-btn"
          >
            登 录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="login-footer">
        <p>© 2026 柳州市疾病预防控制中心 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import { userApi } from '@/api'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const formState = reactive({
  username: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  if (!formState.username || !formState.password) {
    message.warning('请输入用户名和密码')
    return
  }
  
  loading.value = true
  try {
    console.log('开始登录...', formState.username)
    
    // 调用后端登录接口
    const res = await userApi.login({
      username: formState.username,
      password: formState.password
    })
    
    console.log('登录成功:', res)
    
    // 保存Token
    if (res && res.token) {
      userStore.setToken(res.token)
      userStore.setUserInfo(res.userInfo || { username: formState.username })
      message.success('登录成功')
      router.push('/')
    } else {
      throw new Error('登录响应异常')
    }
  } catch (error) {
    console.error('登录失败:', error)
    message.error(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  .logo {
    margin-bottom: 20px;
    
    .logo-icon {
      font-size: 64px;
      display: inline-block;
    }
  }
  
  .title {
    font-size: 22px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 16px;
    color: #8c8c8c;
    font-weight: 500;
  }
}

.login-form {
  .ant-input-affix-wrapper {
    height: 48px;
    border-radius: 8px;
    
    .anticon {
      color: #bfbfbf;
      font-size: 16px;
    }
  }
  
  .forgot-link {
    color: #1890ff;
    font-size: 14px;
    
    &:hover {
      color: #40a9ff;
    }
  }
  
  .login-btn {
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    border: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }
  }
}

.login-footer {
  margin-top: 30px;
  text-align: center;
  
  p {
    font-size: 12px;
    color: #bfbfbf;
    margin: 0;
  }
}
</style>