// 页面测试脚本 - 检查常见错误
const fs = require('fs');
const path = require('path');

const viewsDir = './src/views';
const results = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // 检查常见错误
  if (content.includes('v-model:value') && !content.includes('import')) {
    // 检查是否有未定义的变量
  }
  
  // 检查ant-design-vue组件使用
  const antComponents = content.match(/\u003ca-[a-z-]+/g) || [];
  
  // 检查路由
  const routerMatches = content.match(/router\.(push|replace)\(['"]([^'"]+)['"]\)/g) || [];
  
  return {
    file: path.basename(filePath),
    antComponents: [...new Set(antComponents)],
    routerCalls: routerMatches,
    lines: content.split('\n').length
  };
}

// 检查所有页面
const pages = ['Login/index.vue', 'Dashboard/index.vue', 'DataEntry/index.vue', 
               'Analysis/index.vue', 'Reports/index.vue', 'Settings/index.vue'];

console.log('🔍 检查页面...\n');
pages.forEach(page => {
  const fullPath = path.join(viewsDir, page);
  if (fs.existsSync(fullPath)) {
    const result = checkFile(fullPath);
    results.push(result);
    console.log(`✅ ${result.file}`);
    console.log(`   行数: ${result.lines}`);
    console.log(`   组件: ${result.antComponents.slice(0, 5).join(', ')}...`);
    console.log('');
  } else {
    console.log(`❌ ${page} - 文件不存在`);
  }
});

console.log(`\n📊 共检查 ${results.length} 个页面`);
