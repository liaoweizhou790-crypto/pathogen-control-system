<template>
  <div class="settings-container">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="profile" tab="👤 个人中心">
        <a-card :bordered="false">
          <a-form
            :model="profileForm"
            layout="vertical"
            style="max-width: 500px"
          >
            <a-form-item label="头像">
              <a-avatar :size="80" style="background-color: #1890ff">👤</a-avatar>
              <a-button style="margin-left: 16px">更换头像</a-button>
            </a-form-item>
            
            <a-form-item label="用户名">
              <a-input v-model:value="profileForm.username" disabled />
            </a-form-item>
            
            <a-form-item label="真实姓名">
              <a-input v-model:value="profileForm.realName" />
            </a-form-item>
            
            <a-form-item label="手机号">
              <a-input v-model:value="profileForm.phone" />
            </a-form-item>
            
            <a-form-item label="邮箱">
              <a-input v-model:value="profileForm.email" />
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary" @click="saveProfile">保存修改</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
      
      <a-tab-pane key="password" tab="🔒 修改密码">
        <a-card :bordered="false">
          <a-form
            :model="passwordForm"
            layout="vertical"
            style="max-width: 500px"
          >
            <a-form-item label="原密码">
              <a-input-password v-model:value="passwordForm.oldPassword" />
            </a-form-item>
            
            <a-form-item label="新密码">
              <a-input-password v-model:value="passwordForm.newPassword" />
            </a-form-item>
            
            <a-form-item label="确认新密码">
              <a-input-password v-model:value="passwordForm.confirmPassword" />
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary" @click="changePassword">修改密码</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
      
      <a-tab-pane key="system" tab="⚙️ 系统设置">
        <a-card title="基本设置" :bordered="false">
          <a-form layout="vertical">
            <a-form-item label="系统名称">
              <a-input value="柳州市疾病预防控制中心消毒与病媒生物管理平台" />
            </a-form-item>
            
            <a-form-item label="数据保留时间">
              <a-select value="5">
                <a-select-option value="3">3年</a-select-option>
                <a-select-option value="5">5年</a-select-option>
                <a-select-option value="10">10年</a-select-option>
              </a-select>
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary">保存设置</a-button>
            </a-form-item>
          </a-form>
        </a-card>
        
        <a-card title="AI识别配置" :bordered="false" style="margin-top: 16px">
          <a-form layout="vertical">
            <a-form-item label="Kimi API Key">
              <a-input-password placeholder="输入Kimi API Key" />
            </a-form-item>
            
            <a-form-item label="识别置信度阈值">
              <a-slider :min="50" :max="100" :value="80" />
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary">测试连接</a-button>
              <a-button style="margin-left: 8px">保存配置</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
      
      <a-tab-pane key="about" tab="ℹ️ 关于系统">
        <a-card :bordered="false">
          <div class="about-content">
            <div class="logo-large">🏥</div>
            <h2>柳州市疾病预防控制中心</h2>
            <h3>消毒与病媒生物管理平台</h3>
            
            <div class="version-info">
              <p><strong>版本号:</strong> v1.0.0</p>
              <p><strong>发布日期:</strong> 2026年2月</p>
              <p><strong>技术支持:</strong> 系统开发-病原微生物 AI助手</p>
            </div>
            
            <a-divider />
            
            <p class="copyright">© 2026 柳州市疾病预防控制中心 版权所有</p>
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

const activeTab = ref('profile')

const profileForm = reactive({
  username: 'admin',
  realName: '管理员',
  phone: '19907728279',
  email: 'admin@cdc.liuzhou.gov.cn'
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saveProfile = () => {
  message.success('个人信息已保存')
}

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  message.success('密码修改成功')
}
</script>

<style scoped lang="scss">
.settings-container {
  .about-content {
    text-align: center;
    padding: 40px 0;
    
    .logo-large {
      font-size: 80px;
      margin-bottom: 24px;
    }
    
    h2 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    h3 {
      font-size: 18px;
      color: #8c8c8c;
      font-weight: normal;
      margin-bottom: 32px;
    }
    
    .version-info {
      p {
        margin: 8px 0;
        color: #595959;
      }
    }
    
    .copyright {
      color: #bfbfbf;
      font-size: 14px;
    }
  }
}
</style>