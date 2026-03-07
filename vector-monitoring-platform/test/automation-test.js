// Playwright 自动化测试脚本
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3003';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// 确保截图目录存在
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const tests = [];

function addTest(name, status, message = '', screenshot = '') {
  tests.push({ name, status, message, screenshot, time: new Date().toLocaleString() });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

async function runTests() {
  console.log('🚀 启动浏览器自动化测试...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  const page = await context.newPage();
  
  try {
    // 测试1: 登录页面
    console.log('\n📍 测试1: 登录页面');
    try {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login.png') });
      
      const title = await page.textContent('.title');
      if (title.includes('疾控中心')) {
        addTest('登录页面加载', 'PASS', '页面标题正确显示', '01-login.png');
      } else {
        addTest('登录页面加载', 'FAIL', '页面标题不正确', '01-login.png');
      }
    } catch (e) {
      addTest('登录页面加载', 'FAIL', e.message);
    }

    // 测试2: 登录功能
    console.log('\n📍 测试2: 登录功能');
    try {
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[type="password"]', '123456');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-after-login.png') });
      
      const url = page.url();
      if (url.includes('/dashboard') || url === BASE_URL + '/') {
        addTest('登录功能', 'PASS', '成功跳转到首页', '02-after-login.png');
      } else {
        addTest('登录功能', 'FAIL', `登录后未跳转，当前URL: ${url}`, '02-after-login.png');
      }
    } catch (e) {
      addTest('登录功能', 'FAIL', e.message);
    }

    // 测试3: 数据看板
    console.log('\n📍 测试3: 数据看板');
    try {
      await page.waitForSelector('.stat-card', { timeout: 10000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-dashboard.png') });
      
      const statCards = await page.$$('.stat-card');
      const titles = await page.$$eval('.stat-card .label', els => els.map(e => e.textContent));
      
      if (statCards.length >= 4 && titles.some(t => t.includes('蚊'))) {
        addTest('数据看板统计卡片', 'PASS', `找到${statCards.length}个统计卡片，包含真实数据`, '03-dashboard.png');
      } else {
        addTest('数据看板统计卡片', 'FAIL', `统计卡片数量或内容不正确`, '03-dashboard.png');
      }
    } catch (e) {
      addTest('数据看板统计卡片', 'FAIL', e.message);
    }

    // 测试4: 图表显示
    console.log('\n📍 测试4: 图表显示');
    try {
      await page.waitForTimeout(1000);
      const charts = await page.$$('canvas');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-charts.png') });
      
      if (charts.length >= 1) {
        addTest('ECharts图表', 'PASS', `找到${charts.length}个图表`, '04-charts.png');
      } else {
        addTest('ECharts图表', 'FAIL', '未找到图表', '04-charts.png');
      }
    } catch (e) {
      addTest('ECharts图表', 'FAIL', e.message);
    }

    // 测试5: 数据录入页面
    console.log('\n📍 测试5: 数据录入页面');
    try {
      await page.goto(`${BASE_URL}/entry`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-entry.png') });
      
      const typeCards = await page.$$('.type-card');
      if (typeCards.length >= 8) {
        addTest('数据录入页面', 'PASS', `找到${typeCards.length}种监测类型`, '05-entry.png');
      } else {
        addTest('数据录入页面', 'FAIL', `监测类型数量不足: ${typeCards.length}`, '05-entry.png');
      }
    } catch (e) {
      addTest('数据录入页面', 'FAIL', e.message);
    }

    // 测试6: 选择监测类型
    console.log('\n📍 测试6: 监测类型选择和表单');
    try {
      await page.click('.type-card');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-form.png') });
      
      const form = await page.$('.entry-form');
      const aiSection = await page.$('.ai-card');
      
      if (form && aiSection) {
        addTest('监测表单显示', 'PASS', '表单和AI辅助区域正常显示', '06-form.png');
      } else {
        addTest('监测表单显示', 'FAIL', '表单或AI区域未显示', '06-form.png');
      }
    } catch (e) {
      addTest('监测表单显示', 'FAIL', e.message);
    }

    // 测试7: 数据分析页面
    console.log('\n📍 测试7: 数据分析页面');
    try {
      await page.goto(`${BASE_URL}/analysis`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-analysis.png') });
      
      const table = await page.$('table');
      const filterCard = await page.$('.filter-card');
      
      if (table && filterCard) {
        addTest('数据分析页面', 'PASS', '筛选条件和数据表格正常显示', '07-analysis.png');
      } else {
        addTest('数据分析页面', 'FAIL', '页面元素不完整', '07-analysis.png');
      }
    } catch (e) {
      addTest('数据分析页面', 'FAIL', e.message);
    }

    // 测试8: 报告中心页面
    console.log('\n📍 测试8: 报告中心页面');
    try {
      await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-reports.png') });
      
      const quickCards = await page.$$('.quick-report-card');
      const templates = await page.$$('.ant-list-item');
      
      if (quickCards.length >= 3 && templates.length >= 1) {
        addTest('报告中心页面', 'PASS', `快速报告${quickCards.length}个，模板列表正常`, '08-reports.png');
      } else {
        addTest('报告中心页面', 'FAIL', '页面元素不完整', '08-reports.png');
      }
    } catch (e) {
      addTest('报告中心页面', 'FAIL', e.message);
    }

    // 测试9: 系统设置页面
    console.log('\n📍 测试9: 系统设置页面');
    try {
      await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-settings.png') });
      
      const tabs = await page.$$('.ant-tabs-tab');
      if (tabs.length >= 4) {
        addTest('系统设置页面', 'PASS', `找到${tabs.length}个设置标签`, '09-settings.png');
      } else {
        addTest('系统设置页面', 'FAIL', `设置标签数量不足: ${tabs.length}`, '09-settings.png');
      }
    } catch (e) {
      addTest('系统设置页面', 'FAIL', e.message);
    }

    // 测试10: 侧边栏导航
    console.log('\n📍 测试10: 侧边栏导航');
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-sidebar.png') });
      
      const menuItems = await page.$$('.ant-menu-item');
      if (menuItems.length >= 5) {
        addTest('侧边栏导航', 'PASS', `找到${menuItems.length}个菜单项`, '10-sidebar.png');
      } else {
        addTest('侧边栏导航', 'FAIL', `菜单项数量不足: ${menuItems.length}`, '10-sidebar.png');
      }
    } catch (e) {
      addTest('侧边栏导航', 'FAIL', e.message);
    }

    // 生成测试报告
    generateReport();
    
  } catch (error) {
    console.error('测试执行失败:', error);
  } finally {
    await browser.close();
  }
}

function generateReport() {
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试报告');
  console.log('='.repeat(50));
  console.log(`总测试数: ${tests.length}`);
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`通过率: ${Math.round(passed/tests.length*100)}%`);
  console.log('='.repeat(50));
  
  // 生成HTML报告
  const html = `
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
    .screenshot { max-width: 400px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; }
    h3 { margin: 0 0 10px 0; }
  </style>
</head>
<body>
  <h1>🧪 病媒监测平台自动化测试报告</h1>
  <div class="summary">
    <h2>测试摘要</h2>
    <p>总测试数: ${tests.length}</p>
    <p class="pass">通过: ${passed}</p>
    <p class="fail">失败: ${failed}</p>
    <p>通过率: ${Math.round(passed/tests.length*100)}%</p>
    <p>测试时间: ${new Date().toLocaleString()}</p>
  </div>
  <h2>详细结果</h2>
  ${tests.map(t => `
  <div class="test-item ${t.status.toLowerCase()}">
    <h3>${t.status === 'PASS' ? '✅' : '❌'} ${t.name}</h3>
    <p>${t.message}</p>
    <p><small>测试时间: ${t.time}</small></p>
    ${t.screenshot ? `<img class="screenshot" src="${t.screenshot}" />` : ''}
  </div>
  `).join('')}
</body>
</html>`;
  
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'report.html'), html);
  console.log(`\n📄 详细报告: ${path.join(SCREENSHOT_DIR, 'report.html')}`);
  
  if (failed === 0) {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log(`\n⚠️ 有 ${failed} 个测试需要修复`);
    process.exit(1);
  }
}

// 检查服务器
async function checkServer() {
  console.log('🔍 检查服务器状态...');
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(BASE_URL, { timeout: 10000 });
    await browser.close();
    console.log('✅ 服务器可访问\n');
    return true;
  } catch (e) {
    console.error('❌ 无法连接到服务器:', e.message);
    console.log('\n请先启动前端服务:');
    console.log('  cd frontend && npm run dev');
    return false;
  }
}

(async () => {
  if (await checkServer()) {
    await runTests();
  } else {
    process.exit(1);
  }
})();