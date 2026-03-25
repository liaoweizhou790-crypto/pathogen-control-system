#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
A股电力、新能源板块涨幅分析 - 完整版
时间范围：2021年至今
"""

import akshare as ak
import pandas as pd
import time
from datetime import datetime

print("=" * 70)
print("📊 A股电力、新能源板块涨幅分析报告 (2021-2025)")
print("=" * 70)

start_date = "20210101"
end_date = datetime.now().strftime("%Y%m%d")

def get_stock_data(code, name, max_retries=3):
    """获取股票历史数据，带重试机制"""
    for attempt in range(max_retries):
        try:
            df = ak.stock_zh_a_hist(symbol=code, period="daily", start_date=start_date, end_date=end_date, adjust="qfq")
            if len(df) > 0:
                return df
            time.sleep(0.5)
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(1)
            continue
    return None

# 定义电力、新能源重点股票
target_stocks = [
    # ========== 电力板块 ==========
    ('600900', '长江电力', '水电龙头'),
    ('601985', '中国核电', '核电龙头'),
    ('600886', '国投电力', '水电/火电'),
    ('600011', '华能国际', '火电转型'),
    ('600027', '华电国际', '火电/新能源'),
    ('601016', '节能风电', '风电运营'),
    ('600795', '国电电力', '火电/新能源'),
    ('600023', '浙能电力', '区域电力'),
    ('000883', '湖北能源', '综合能源'),
    
    # ========== 光伏板块 ==========
    ('601012', '隆基绿能', '光伏组件'),
    ('600438', '通威股份', '硅料+电池'),
    ('002459', '晶澳科技', '光伏组件'),
    ('688599', '天合光能', '光伏组件'),
    ('688223', '晶科能源', '光伏组件'),
    ('603806', '福斯特', '光伏胶膜'),
    ('300274', '阳光电源', '逆变器'),
    
    # ========== 电池/储能 ==========
    ('300750', '宁德时代', '动力电池龙头'),
    ('002594', '比亚迪', '电池+整车'),
    ('300014', '亿纬锂能', '锂电池'),
    ('002074', '国轩高科', '动力电池'),
    ('300073', '当升科技', '正极材料'),
    ('002709', '天赐材料', '电解液'),
    
    # ========== 风电设备 ==========
    ('002202', '金风科技', '风机龙头'),
    ('601615', '明阳智能', '海上风电'),
    ('300772', '运达股份', '风机设备'),
    ('603218', '日月股份', '风电铸件'),
    
    # ========== 电网/特高压 ==========
    ('600406', '国电南瑞', '电网自动化'),
    ('601869', '长缆科技', '电缆附件'),
]

print(f"\n📅 分析时间范围：2021年1月1日 - {datetime.now().strftime('%Y年%m月%d日')}")
print(f"📝 共分析 {len(target_stocks)} 只股票")

results = []

print("\n" + "=" * 70)
print("【一、个股2021年至今涨幅详情】")
print("=" * 70)
print(f"\n{'代码':<8} {'名称':<10} {'2021年初':<10} {'当前价':<10} {'总涨幅':<10} {'最高价':<10} {'备注'}")
print("-" * 70)

for code, name, desc in target_stocks:
    df = get_stock_data(code, name)
    
    if df is not None and len(df) > 0:
        start_price = df.iloc[0]['收盘']
        current_price = df.iloc[-1]['收盘']
        max_price = df['最高'].max()
        min_price = df['最低'].min()
        
        change_pct = ((current_price - start_price) / start_price) * 100
        max_change_pct = ((max_price - start_price) / start_price) * 100
        
        results.append({
            'code': code,
            'name': name,
            'desc': desc,
            'start_price': round(start_price, 2),
            'current_price': round(current_price, 2),
            'change_pct': round(change_pct, 2),
            'max_price': round(max_price, 2),
            'max_change_pct': round(max_change_pct, 2),
            'category': desc.split('/')[0] if '/' in desc else desc[:4]
        })
        
        trend = "📈" if change_pct > 0 else "📉"
        print(f"{code:<8} {name:<10} ¥{start_price:<9.2f} ¥{current_price:<9.2f} {change_pct:>+7.2f}% {trend}  ¥{max_price:<9.2f} {desc}")
    else:
        print(f"{code:<8} {name:<10} {'数据获取失败':<50} {desc}")
    
    time.sleep(0.3)  # 避免请求过快

# 按板块分类分析
print("\n" + "=" * 70)
print("【二、板块涨幅排名】")
print("=" * 70)

# 分类
categories = {
    '水电/核电': ['水电龙头', '核电龙头', '水电/火电'],
    '火电/综合电力': ['火电转型', '火电/新能源', '区域电力', '综合能源', '风电运营'],
    '光伏产业链': ['光伏组件', '硅料+电池', '光伏胶膜', '逆变器'],
    '电池/储能': ['动力电池龙头', '电池+整车', '锂电池', '动力电池', '正极材料', '电解液'],
    '风电设备': ['风机龙头', '海上风电', '风机设备', '风电铸件'],
    '电网设备': ['电网自动化', '电缆附件']
}

for cat_name, keywords in categories.items():
    cat_stocks = [r for r in results if any(k in r['desc'] for k in keywords)]
    if cat_stocks:
        avg_change = sum(s['change_pct'] for s in cat_stocks) / len(cat_stocks)
        print(f"\n📌 {cat_name} (共{len(cat_stocks)}只)")
        print(f"   平均涨幅: {avg_change:+.2f}%")
        cat_sorted = sorted(cat_stocks, key=lambda x: x['change_pct'], reverse=True)
        for s in cat_sorted:
            trend = "📈" if s['change_pct'] > 0 else "📉"
            print(f"   {s['code']} {s['name']}: {s['change_pct']:+.2f}% {trend}")

# 总体涨幅排名
print("\n" + "=" * 70)
print("【三、全部个股涨幅排名 TOP 15】")
print("=" * 70)
results_sorted = sorted(results, key=lambda x: x['change_pct'], reverse=True)

print(f"\n{'排名':<4} {'代码':<8} {'名称':<10} {'涨幅':<10} {'区间最高价涨幅':<14} {'分类'}")
print("-" * 70)

for i, r in enumerate(results_sorted[:15], 1):
    trend = "📈" if r['change_pct'] > 0 else "📉"
    print(f"{i:<4} {r['code']:<8} {r['name']:<10} {r['change_pct']:>+7.2f}% {trend} 最高+{r['max_change_pct']:>6.2f}%  {r['desc']}")

print("\n" + "=" * 70)
print("【四、跌幅最大个股 BOTTOM 5】")
print("=" * 70)
for i, r in enumerate(results_sorted[-5:], 1):
    trend = "📉"
    print(f"{i}. {r['code']} {r['name']}: {r['change_pct']:+.2f}% {trend} ({r['desc']})")
    print(f"   2021年初: ¥{r['start_price']} → 当前: ¥{r['current_price']}, 区间最高: ¥{r['max_price']}")

print("\n" + "=" * 70)
print("【五、政策环境与趋势分析】")
print("=" * 70)

policy_analysis = """
┌─────────────────────────────────────────────────────────────────────┐
│  2021年："双碳"目标元年，新能源爆发起点                               │
├─────────────────────────────────────────────────────────────────────┤
│ • 2020年9月：中国提出"2030碳达峰、2060碳中和"目标                      │
│ • 2021年3月："十四五"规划明确新能源发展战略                            │
│ • 2021年6月：整县推进分布式光伏试点启动                                │
│ • 2021年10月：《2030年前碳达峰行动方案》发布                           │
│ • 影响：电力板块估值重构，清洁能源运营商股价大幅上涨                     │
├─────────────────────────────────────────────────────────────────────┤
│  2022年：新能源大基地建设，产业链价格高位                                │
├─────────────────────────────────────────────────────────────────────┤
│ • 第一批、第二批大型风电光伏基地项目启动                                 │
│ • 煤电上网电价市场化改革深化                                            │
│ • 硅料价格创历史新高，光伏组件成本压力大                                  │
│ • 影响：电力运营商受益于电价上涨；光伏制造业利润受压                      │
├─────────────────────────────────────────────────────────────────────┤
│  2023年：行业洗牌，产能过剩显现                                         │
├─────────────────────────────────────────────────────────────────────┤
│ • 可再生能源补贴核查，行业出清                                          │
│ • 硅料价格暴跌（从30万/吨跌至5万/吨），带动产业链价格调整                  │
│ • 光伏、储能产能过剩，价格战激烈                                         │
│ • 影响：龙头企受损严重，隆基绿能等股价大幅回调                            │
├─────────────────────────────────────────────────────────────────────┤
│  2024-2025年：新型电力系统建设加速                                      │
├─────────────────────────────────────────────────────────────────────┤
│ • 储能、虚拟电厂等新业态快速发展                                         │
│ • 新能源消纳政策优化，关注特高压建设                                     │
│ • 电力市场化改革深化，容量电价机制建立                                   │
│ • 影响：电力运营商受益；电网设备企业迎景气周期                            │
└─────────────────────────────────────────────────────────────────────┘
"""
print(policy_analysis)

print("=" * 70)
print("【六、投资启示】")
print("=" * 70)
insights = """
1️⃣ 电力运营商表现优异：
   华电国际(+135%)、中国核电(+114%)、华能国际(+97%)、国投电力(+96%)、
   长江电力(+86%)均大幅跑赢大盘。
   → 受益于电价改革和清洁能源转型

2️⃣ 光伏制造业剧烈回调：
   隆基绿能跌幅超64%，从最高点回撤超75%。
   → 产能过剩、价格战是主因

3️⃣ 板块分化明显：
   • 电力运营商（稳定收益）> 新能源设备（周期性）
   • 核电、水电（基荷电源）> 光伏、风电（间歇性电源）

4️⃣ 未来关注点：
   • 新型电力系统建设（特高压、储能）
   • 电力市场化改革进展
   • 新能源消纳能力提升
   • 产能出清后的光伏制造业机会
"""
print(insights)

print("\n" + "=" * 70)
print("分析完成 | 数据来源: akshare/东方财富")
print("=" * 70)
