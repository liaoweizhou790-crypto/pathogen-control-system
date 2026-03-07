import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'

// 全局样式
import './styles/index.scss'

const app = createApp(App)

// 注册所有图标
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key])
})

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')