<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onErrorCaptured } from 'vue'
import { message } from 'ant-design-vue'

// 全局错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('全局错误捕获:', err)
  console.error('错误组件:', instance)
  console.error('错误信息:', info)
  message.error('页面加载出错，请刷新重试')
  return false
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>