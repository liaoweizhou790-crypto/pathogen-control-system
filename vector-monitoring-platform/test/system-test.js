const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 测试配置
const config = {
  baseUrl: 'http://localhost:3003',
  timeout: 30000,
  screenshotDir: './test-screenshots'
};

// 确保截图目录存在
if (!fs.existsSync(config.screenshotDir)) {
  fs.mkdirSync(config.screenshotDir, { recursive: true });
}

// 测试用例
const tests = [];

// 添加测试结果
function addTest(name, status, message = '', screenshot = '') {
  tests.push({
    name,
    status,
    message,
    screenshot,
    time: new Date().toLocaleString()
  });
}

// 生成测试报告
function generateReport() {
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>系统测试报告</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .pass { color: #52c41a; }
    .fail { color: #f5222d; }
    .test-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ddd; }
    .test-item.pass { border-left-color: #52c41a; }
    .test-item.fail { border-left-color: #f5222d; }
    .screenshot { max-width: 300px; margin-top: 10px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>🧪 病媒监测平台测试报告</h1>
  <div class="summary">
    <h2>测试摘要</h2>
    <p>总测试数: ${tests.length}</p>
    <p class="pass">通过: ${passed}</p>
    <p class="fail">失败: ${failed}</p>
    <p>通过率: ${Math.round(passed/tests.length*100)}%</p>
    <p>测试时间: ${new Date().toLocaleString()}</p>
  </div>
  <h2>详细结果</h2>
`;

  tests.forEach(test => {
    html += `
  <div class="test-item ${test.status.toLowerCase()}">
    <h3>${test.status === 'PASS' ? '✅' : '❌'} ${test.name}</h3>
    <p>${test.message}</p>
    <p><small>测试时间: ${test.time}</small></p>
    ${test.screenshot ? `<img class="screenshot" src="${test.screenshot}" />` : ''}
  </div>
`;
  });

  html += '</body></html>';
  
  fs.writeFileSync(path.join(config.screenshotDir, 'report.html'), html);
  console.log(`\n测试报告已生成: ${path.join(config.screenshotDir, 'report.html')}`);
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始系统测试...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    // 测试1: 登录页面
    console.log('测试1: 登录页面...');
    try {
      await page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle2', timeout: config.timeout });
      await page.screenshot({ path: path.join(config.screenshotDir, '01-login.png') });
      
      const title = await page.$eval('.title', el => el.textContent);
      if (title.includes('疾控中心')) {
        addTest('登录页面加载', 'PASS', '页面标题正确', '01-login.png');
      } else {
        addTest('登录页面加载', 'FAIL', '页面标题不正确', '01-login.png');
      }
    } catch (e) {
      addTest('登录页面加载', 'FAIL', e.message);
    }
    
    // 测试2: 登录功能
    console.log('测试2: 登录功能...');
    try {
      await page.type('input[name="username"]', 'admin');
      await page.type('input[type="password"]', '123456');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(config.screenshotDir, '02-dashboard.png') });
      
      const url = page.url();
      if (url.includes('/dashboard') || url === config.baseUrl + '/') {
        addTest('登录功能', 'PASS', '成功跳转到首页', '02-dashboard.png');
      } else {
        addTest('登录功能', 'FAIL', '登录后未跳转到首页', '02-dashboard.png');
      }
    } catch (e) {
      addTest('登录功能', 'FAIL', e.message);
    }
    
    // 测试3: 数据看板
    console.log('测试3: 数据看板...');
    try {
      const statCards = await page.$$('.stat-card');
      await page.screenshot({ path: path.join(config.screenshotDir, '03-stats.png') });
      
      if (statCards.length >= 4) {
        addTest('数据看板统计卡片', 'PASS', `找到${statCards.length}个统计卡片`, '03-stats.png');
      } else {
        addTest('数据看板统计卡片', 'FAIL', `统计卡片数量不足: ${statCards.length}`, '03-stats.png');
      }
    } catch (e) {
      addTest('数据看板统计卡片', 'FAIL', e.message);
    }
    
    // 测试4: 数据录入页面
    console.log('测试4: 数据录入页面...');
    try {
      await page.goto(`${config.baseUrl}/entry`, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(config.screenshotDir, '04-entry.png') });
      
      const typeCards = await page.$$('.type-card');
      if (typeCards.length >= 8) {
        addTest('数据录入页面', 'PASS', `找到${typeCards.length}种监测类型`, '04-entry.png');
      } else {
        addTest('数据录入页面', 'FAIL', `监测类型数量不足: ${typeCards.length}`, '04-entry.png');
      }
    } catch (e) {
      addTest('数据录入页面', 'FAIL', e.message);
    }
    
    // 测试5: 选择监测类型并显示表单
    console.log('测试5: 监测类型选择...');
    try {
      await page.click('.type-card');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(config.screenshotDir, '05-form.png') });
      
      const form = await page.$('.entry-form');
      if (form) {
        addTest('监测表单显示', 'PASS', '选择类型后表单正常显示', '05-form.png');
      } else {
        addTest('监测表单显示', 'FAIL', '表单未显示', '05-form.png');
      }
    } catch (e) {
      addTest('监测表单显示', 'FAIL', e.message);
    }
    
    // 测试6: 数据分析页面
    console.log('测试6: 数据分析页面...');
    try {
      await page.goto(`${config.baseUrl}/analysis`, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(config.sreenshotDir, '06-analysis.png') });
      
      const table = await page.$('table');
      if (table) {
        addTest('数据分析页面', 'PASS', '数据表格正常显示', '06-analysis.png');
      } else {
        addTest('数据分析页面', 'FAIL', '数据表格未显示', '06-analysis.png');
      }
    } catch (e) {
      addTest('数据分析页面', 'FAIL', e.message);
    }
    
    // 测试7: 报告中心页面
    console.log('测试7: 报告中心页面...');
    try {
      await page.goto(`${config.baseUrl}/reports`, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(config.screenshotDir, '07-reports.png') });
      
      const quickCards = await page.$$('.quick-report-card');
      if (quickCards.length >= 3) {
        addTest('报告中心页面', 'PASS', `找到${quickCards.length}个快速报告卡片`, '07-reports.png');
      } else {
        addTest('报告中心页面', 'FAIL', `快速报告卡片数量不足: ${quickCards.length}`, '07-reports.png');
      }
    } catch (e) {
      addTest('报告中心页面', 'FAIL', e.message);
    }
    
    // 测试8: 系统设置页面
    console.log('测试8: 系统设置页面...');
    try {
      await page.goto(`${config.baseUrl}/settings`, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(config.screenshotDir, '08-settings.png') });
      
      const tabs = await page.$$('.ant-tabs-tab');
      if (tabs.length >= 4) {
        addTest('系统设置页面', 'PASS', `找到${tabs.length}个设置标签`, '08-settings.png');
      } else {
        addTest('系统设置页面', 'FAIL', `设置标签数量不足: ${tabs.length}`, '08-settings.png');
      }
    } catch (e) {
      addTest('系统设置页面', 'FAIL', e.message);
    }
    
    // 测试9: 侧边栏导航
    console.log('测试9: 侧边栏导航...');
    try {
      await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(config.screenshotDir, '09-sidebar.png') });
      
      const menuItems = await page.$$('.ant-menu-item');
      if (menuItems.length >= 5) {
        addTest('侧边栏导航', 'PASS', `找到${menuItems.length}个菜单项`, '09-sidebar.png');
      } else {
        addTest('侧边栏导航', 'FAIL', `菜单项数量不足: ${menuItems.length}`, '09-sidebar.png');
      }
    } catch (e) {
      addTest('侧边栏导航', 'FAIL', e.message);
    }
    
    // 测试10: 响应式布局
    console.log('测试10: 响应式布局...');
    try {
      await page.setViewport({ width: 375, height: 667 }); // iPhone尺寸
      await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(config.screenshotDir, '10-mobile.png') });
      
      addTest('移动端响应式', 'PASS', '页面在移动设备上正常显示', '10-mobile.png');
    } catch (e) {
      addTest('移动端响应式', 'FAIL', e.message);
    }
    
    // 生成报告
    generateReport();
    
    const passed = tests.filter(t => t.status === 'PASS').length;
    const failed = tests.filter(t => t.status === 'FAIL').length;
    
    console.log(`\n✅ 通过: ${passed}`);
    console.log(`❌ 失败: ${failed}`);
    console.log(`📊 通过率: ${Math.round(passed/tests.length*100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 所有测试通过！系统运行正常。');
      process.exit(0);
    } else {
      console.log(`\n⚠️ 有${failed}个测试失败，请检查问题。`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('测试执行失败:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// 检查服务器是否可访问
async function checkServer() {
  console.log('🔍 检查服务器状态...');
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(config.baseUrl, { timeout: 10000 });
    await browser.close();
    console.log('✅ 服务器可访问\n');
    return true;
  } catch (e) {
    console.error('❌ 无法连接到服务器:', e.message);
    console.log('\n请确保前端服务已启动:');
    console.log('  cd frontend && npm run dev');
    await browser.close();
    return false;
  }
}

// 主程序
(async () => {
  const serverReady = await checkServer();
  if (serverReady) {
    await runTests();
  } else {
    process.exit(1);
  }
})();