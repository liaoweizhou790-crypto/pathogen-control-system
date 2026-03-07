# -*- coding: utf-8 -*-
"""
伊蚊布雷图指数时空分布分析 - 修正版
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
import warnings
warnings.filterwarnings('ignore')

# 强制重新创建字体管理器
fm.fontManager.__init__()

# 适配系统的中文字体
cjk_list = ['CJK', 'Han', 'CN', 'TW', 'JP']
cjk_fonts = [f.name for f in fm.fontManager.ttflist if any(s.lower() in f.name.lower() for s in cjk_list)]

plt.rcParams['font.family'] = ['DejaVu Sans'] + cjk_fonts
plt.rcParams['axes.unicode_minus'] = False

# 数据文件路径
data_dir = "/Users/liaoweizhou/Desktop/工作/10-病媒监测数据/数据库/伊蚊/"
output_dir = "/Users/liaoweizhou/.openclaw/workspace/"

def load_year_data(year, filename):
    """加载单年份数据"""
    filepath = data_dir + filename
    
    try:
        # 读取原始数据（无header）
        df_raw = pd.read_excel(filepath, header=None)
        
        # 获取标题行
        headers_row0 = df_raw.iloc[0].tolist()
        headers_row1 = df_raw.iloc[1].tolist() if len(df_raw) > 1 else []
        
        # 找到阳性数列的索引位置
        positive_cols_idx = []
        for i, h in enumerate(headers_row1):
            if str(h) == '阳性数' and i > 0:
                positive_cols_idx.append(i)
        
        # 读取数据（跳过前两行标题）
        df_data = df_raw.iloc[2:].reset_index(drop=True)
        df_data.columns = range(len(df_data.columns))
        
        records = []
        for idx in range(len(df_data)):
            row = df_data.iloc[idx]
            
            # 提取基本信息
            month = str(row[0]) if pd.notna(row[0]) else None
            district = str(row[1]) if pd.notna(row[1]) else None
            address = str(row[2]) if pd.notna(row[2]) else None
            
            # 环境类型可能在第3列（2023年后）
            env_type = None
            household_idx = 4
            if year >= 2023 and pd.notna(row[3]):
                env_type = str(row[3])
            else:
                household_idx = 3  # 2021-2022年无环境类型列
            
            # 户数
            households = pd.to_numeric(row[household_idx], errors='coerce')
            
            # 计算总阳性容器数
            total_positive = 0
            for col_idx in positive_cols_idx:
                if col_idx < len(row):
                    val = pd.to_numeric(row[col_idx], errors='coerce')
                    if pd.notna(val):
                        total_positive += val
            
            # 计算布雷图指数
            if pd.notna(households) and households > 0:
                bi = total_positive / households * 100
            else:
                bi = np.nan
            
            if pd.notna(bi) and pd.notna(month) and pd.notna(district):
                records.append({
                    '年份': year,
                    '月份': month,
                    '监测区域': district.strip(),
                    '地址': address,
                    '环境类型': env_type,
                    '调查户数': households,
                    '阳性容器数': total_positive,
                    '布雷图指数': bi
                })
        
        return pd.DataFrame(records)
        
    except Exception as e:
        print(f"  错误: {e}")
        return pd.DataFrame()

# 风险等级判断
def get_risk_level(bi):
    """根据布雷图指数判断风险等级"""
    if pd.isna(bi):
        return '未知'
    elif bi < 5:
        return '安全'
    elif bi < 10:
        return '风险'
    else:
        return '高危'

# 主分析流程
def main_analysis():
    print("=" * 60)
    print("柳州市伊蚊布雷图指数监测数据分析")
    print("=" * 60)
    
    # 加载数据
    print("\n【1】数据加载...")
    
    files_info = [
        (2021, '2021年柳州市布雷图指数监测数据.xls'),
        (2022, '2022年柳州市布雷图指数监测数据.xls'),
        (2023, '2023年柳州市布雷图指数监测数据.xls'),
        (2024, '2024年柳州市布雷图指数监测数据.xls'),
        (2025, '2025年柳州市登革热媒介伊蚊监测布雷图指数总数据.xls')
    ]
    
    all_data = []
    for year, filename in files_info:
        print(f"  加载 {year}年数据...", end=' ')
        df_year = load_year_data(year, filename)
        if len(df_year) > 0:
            all_data.append(df_year)
            print(f"✓ ({len(df_year)}条)")
        else:
            print("✗")
    
    if not all_data:
        print("错误: 未能加载任何数据")
        return None
    
    # 合并数据
    df = pd.concat(all_data, ignore_index=True)
    print(f"\n总计: {len(df)} 条有效监测记录")
    
    # 添加风险等级
    df['风险等级'] = df['布雷图指数'].apply(get_risk_level)
    
    # 月份映射
    month_map = {}
    for m in range(1, 13):
        month_map[str(m)] = m
        month_map[f'{m}月'] = m
        month_map[str(m).zfill(2)] = m
    df['月份数值'] = df['月份'].map(month_map)
    
    # 统一区域名称
    def normalize_district(name):
        name = str(name).strip()
        name = name.replace('区', '').replace('县', '')
        # 统一命名
        name_map = {
            '阳和': '阳和新区',
            '柳东': '柳东新区',
            '北部生态新区': '北部新区',
            '城中': '城中区',
            '鱼峰': '鱼峰区',
            '柳南': '柳南区',
            '柳北': '柳北区',
            '柳江': '柳江区'
        }
        return name_map.get(name, name)
    
    df['监测区域'] = df['监测区域'].apply(normalize_district)
    
    # ========== 时间维度分析 ==========
    print("\n【2】时间维度分析")
    print("-" * 40)
    
    # 年度变化
    yearly_stats = df.groupby('年份').agg({
        '布雷图指数': ['mean', 'max', 'min', 'std', 'count'],
        '阳性容器数': 'sum',
        '调查户数': 'sum'
    }).round(2)
    yearly_stats.columns = ['平均值', '最大值', '最小值', '标准差', '监测次数', '总阳性容器', '总调查户数']
    # 重新计算年度平均布雷图指数
    yearly_stats['平均BI'] = (yearly_stats['总阳性容器'] / yearly_stats['总调查户数'] * 100).round(2)
    print("\n年度布雷图指数统计:")
    print(yearly_stats[['监测次数', '总调查户数', '总阳性容器', '平均BI', '最大值', '最小值']])
    
    # 月度分布
    monthly_stats = df.groupby('月份数值').agg({
        '布雷图指数': ['mean', 'max', 'count'],
        '阳性容器数': 'sum',
        '调查户数': 'sum'
    }).round(2)
    monthly_stats.columns = ['平均值', '最大值', '监测次数', '总阳性容器', '总调查户数']
    monthly_stats['平均BI'] = (monthly_stats['总阳性容器'] / monthly_stats['总调查户数'] * 100).round(2)
    print("\n月度布雷图指数统计:")
    print(monthly_stats[['监测次数', '平均BI', '最大值']])
    
    # 季节性分析
    df['季节'] = df['月份数值'].apply(lambda x: 
        '春季(3-5月)' if x in [3, 4, 5] else
        '夏季(6-8月)' if x in [6, 7, 8] else
        '秋季(9-11月)' if x in [9, 10, 11] else
        '冬季(12-2月)')
    
    season_stats = df.groupby('季节').agg({
        '布雷图指数': 'mean',
        '阳性容器数': 'sum',
        '调查户数': 'sum'
    })
    season_stats['平均BI'] = (season_stats['阳性容器数'] / season_stats['调查户数'] * 100).round(2)
    print("\n季节性布雷图指数平均值:")
    print(season_stats['平均BI'].sort_values(ascending=False))
    
    # ========== 空间维度分析 ==========
    print("\n【3】空间维度分析")
    print("-" * 40)
    
    # 区域统计
    area_stats = df.groupby('监测区域').agg({
        '布雷图指数': ['mean', 'max', 'count'],
        '阳性容器数': 'sum',
        '调查户数': 'sum'
    })
    area_stats.columns = ['平均值', '最大值', '监测次数', '总阳性容器', '总调查户数']
    area_stats['平均BI'] = (area_stats['总阳性容器'] / area_stats['总调查户数'] * 100).round(2)
    area_stats = area_stats.sort_values('平均BI', ascending=False)
    print("\n各区域布雷图指数统计（按平均BI排序）:")
    print(area_stats[['监测次数', '平均BI', '最大值']])
    
    # 高风险区域识别
    high_risk = df[df['布雷图指数'] >= 5]
    print(f"\n⚠️ 高风险记录(≥5)共 {len(high_risk)} 条 ({len(high_risk)/len(df)*100:.1f}%)")
    
    high_risk_areas = high_risk.groupby('监测区域').agg({
        '布雷图指数': ['count', 'max', 'mean']
    }).round(2)
    high_risk_areas.columns = ['高风险次数', '最高BI', '平均BI']
    high_risk_areas = high_risk_areas.sort_values('高风险次数', ascending=False)
    print("\n高风险区域分布:")
    print(high_risk_areas)
    
    # 风险等级分布
    risk_dist = df['风险等级'].value_counts()
    print("\n风险等级分布:")
    for level, count in risk_dist.items():
        pct = count / len(df) * 100
        print(f"  {level}: {count}条 ({pct:.1f}%)")
    
    # ========== 生成可视化图表 ==========
    print("\n【4】生成可视化图表...")
    
    # 年度趋势数据
    yearly_bi = yearly_stats['平均BI']
    
    # 图1: 年度趋势折线图
    fig1, ax1 = plt.subplots(figsize=(10, 6))
    ax1.plot(yearly_bi.index, yearly_bi.values, marker='o', linewidth=2.5, 
             markersize=10, color='#2E86AB', markerfacecolor='white', markeredgewidth=2)
    ax1.axhline(y=5, color='#E94F37', linestyle='--', linewidth=1.5, label='风险阈值 (BI=5)')
    ax1.axhline(y=10, color='#C73E1D', linestyle='--', linewidth=1.5, label='高危阈值 (BI=10)')
    ax1.fill_between(yearly_bi.index, 0, 5, alpha=0.1, color='green')
    ax1.fill_between(yearly_bi.index, 5, 10, alpha=0.1, color='orange')
    ax1.fill_between(yearly_bi.index, 10, yearly_bi.max()*1.2, alpha=0.1, color='red')
    ax1.set_xlabel('年份', fontsize=12, fontweight='bold')
    ax1.set_ylabel('布雷图指数 (BI)', fontsize=12, fontweight='bold')
    ax1.set_title('2021-2025年柳州市布雷图指数年度变化趋势', fontsize=14, fontweight='bold')
    ax1.set_xticks(yearly_bi.index)
    ax1.legend(loc='upper right')
    ax1.grid(True, alpha=0.3, linestyle='--')
    ax1.set_ylim(0, max(yearly_bi.max()*1.2, 12))
    
    # 添加数据标签
    for x, y in zip(yearly_bi.index, yearly_bi.values):
        ax1.annotate(f'{y:.2f}', xy=(x, y), xytext=(0, 10), 
                    textcoords='offset points', ha='center', fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}chart_01_yearly_trend.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("  ✓ 年度趋势图已保存")
    
    # 图2: 月度分布柱状图
    fig2, ax2 = plt.subplots(figsize=(12, 6))
    monthly_bi = monthly_stats['平均BI'].dropna()
    colors = ['#2E86AB' if v < 5 else '#E94F37' if v < 10 else '#C73E1D' for v in monthly_bi.values]
    bars = ax2.bar(monthly_bi.index, monthly_bi.values, color=colors, edgecolor='white', linewidth=0.5, width=0.7)
    ax2.axhline(y=5, color='#E94F37', linestyle='--', linewidth=1.5, label='风险阈值 (BI=5)')
    ax2.axhline(y=10, color='#C73E1D', linestyle='--', linewidth=1.5, label='高危阈值 (BI=10)')
    ax2.set_xlabel('月份', fontsize=12, fontweight='bold')
    ax2.set_ylabel('平均布雷图指数 (BI)', fontsize=12, fontweight='bold')
    ax2.set_title('各月份布雷图指数分布特征', fontsize=14, fontweight='bold')
    ax2.set_xticks(range(1, 13))
    ax2.set_xticklabels([f'{i}月' for i in range(1, 13)])
    ax2.legend()
    ax2.grid(True, alpha=0.3, axis='y', linestyle='--')
    ax2.set_ylim(0, max(monthly_bi.max()*1.2, 8))
    
    # 添加数据标签
    for bar, val in zip(bars, monthly_bi.values):
        height = bar.get_height()
        ax2.annotate(f'{val:.2f}', xy=(bar.get_x() + bar.get_width()/2, height),
                    xytext=(0, 3), textcoords='offset points', ha='center', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}chart_02_monthly_distribution.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("  ✓ 月度分布图已保存")
    
    # 图3: 区域对比条形图
    fig3, ax3 = plt.subplots(figsize=(12, 8))
    area_bi = area_stats['平均BI'].sort_values(ascending=True)
    colors = ['#2E86AB' if v < 5 else '#E94F37' if v < 10 else '#C73E1D' for v in area_bi.values]
    bars = ax3.barh(area_bi.index, area_bi.values, color=colors, edgecolor='white', linewidth=0.5, height=0.7)
    ax3.axvline(x=5, color='#E94F37', linestyle='--', linewidth=1.5, label='风险阈值 (BI=5)')
    ax3.axvline(x=10, color='#C73E1D', linestyle='--', linewidth=1.5, label='高危阈值 (BI=10)')
    ax3.set_xlabel('平均布雷图指数 (BI)', fontsize=12, fontweight='bold')
    ax3.set_ylabel('监测区域', fontsize=12, fontweight='bold')
    ax3.set_title('各监测区域布雷图指数对比', fontsize=14, fontweight='bold')
    ax3.legend(loc='lower right')
    ax3.grid(True, alpha=0.3, axis='x', linestyle='--')
    ax3.set_xlim(0, max(area_bi.max()*1.2, 10))
    
    # 添加数据标签
    for bar, val in zip(bars, area_bi.values):
        width = bar.get_width()
        ax3.annotate(f'{val:.2f}', xy=(width, bar.get_y() + bar.get_height()/2),
                    xytext=(5, 0), textcoords='offset points', ha='left', va='center', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}chart_03_area_comparison.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("  ✓ 区域对比图已保存")
    
    # 图4: 风险等级分布饼图
    fig4, ax4 = plt.subplots(figsize=(10, 8))
    risk_counts = df['风险等级'].value_counts()
    colors_pie = {'安全': '#2E86AB', '风险': '#F4A261', '高危': '#E94F37'}
    pie_colors = [colors_pie.get(x, '#999999') for x in risk_counts.index]
    
    def make_autopct(values):
        def my_autopct(pct):
            total = sum(values)
            val = int(round(pct*total/100.0))
            return f'{pct:.1f}%\n({val}条)'
        return my_autopct
    
    wedges, texts, autotexts = ax4.pie(
        risk_counts.values, 
        labels=risk_counts.index, 
        autopct=make_autopct(risk_counts.values),
        colors=pie_colors,
        explode=[0.03]*len(risk_counts),
        shadow=True,
        startangle=90,
        textprops={'fontsize': 11}
    )
    ax4.set_title('布雷图指数风险等级分布', fontsize=14, fontweight='bold', pad=20)
    
    # 添加图例说明
    legend_labels = [f'{label}: BI{"<5" if label=="安全" else "≥5" if label=="风险" else "≥10"}' 
                     for label in risk_counts.index]
    ax4.legend(wedges, legend_labels, title="风险等级标准", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}chart_04_risk_distribution.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("  ✓ 风险分布图已保存")
    
    # 图5: 年度-月份热力图
    fig5, ax5 = plt.subplots(figsize=(14, 6))
    pivot_data = df.pivot_table(values='布雷图指数', index='年份', columns='月份数值', aggfunc='mean')
    im = ax5.imshow(pivot_data.values, cmap='YlOrRd', aspect='auto', vmin=0, vmax=10)
    ax5.set_xticks(range(len(pivot_data.columns)))
    ax5.set_xticklabels([f'{int(c)}月' for c in pivot_data.columns])
    ax5.set_yticks(range(len(pivot_data.index)))
    ax5.set_yticklabels([f'{int(y)}年' for y in pivot_data.index])
    ax5.set_xlabel('月份', fontsize=12, fontweight='bold')
    ax5.set_ylabel('年份', fontsize=12, fontweight='bold')
    ax5.set_title('布雷图指数年度-月份热力分布', fontsize=14, fontweight='bold')
    
    # 添加数值标注
    for i in range(len(pivot_data.index)):
        for j in range(len(pivot_data.columns)):
            val = pivot_data.iloc[i, j]
            if not pd.isna(val):
                text_color = 'white' if val > 6 else 'black'
                ax5.text(j, i, f'{val:.1f}', ha='center', va='center', 
                        color=text_color, fontsize=9, fontweight='bold')
    
    cbar = plt.colorbar(im, ax=ax5)
    cbar.set_label('布雷图指数 (BI)', rotation=270, labelpad=20, fontsize=11)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}chart_05_heatmap.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("  ✓ 热力分布图已保存")
    
    # 保存汇总统计数据供Word报告使用
    results = {
        'total_records': len(df),
        'total_households': df['调查户数'].sum(),
        'total_positive': df['阳性容器数'].sum(),
        'overall_bi': df['阳性容器数'].sum() / df['调查户数'].sum() * 100,
        'yearly_stats': yearly_stats,
        'monthly_stats': monthly_stats,
        'season_stats': season_stats,
        'area_stats': area_stats,
        'high_risk_count': len(high_risk),
        'high_risk_areas': high_risk_areas,
        'risk_distribution': risk_dist,
        'data': df
    }
    
    print("\n【5】分析完成!")
    print("=" * 60)
    
    # 输出关键发现
    print("\n📊 关键发现:")
    print(f"  • 监测期间共调查 {results['total_households']:.0f} 户，发现阳性容器 {results['total_positive']:.0f} 个")
    print(f"  • 总体平均布雷图指数为 {results['overall_bi']:.2f}")
    print(f"  • 最高年度BI为 {yearly_bi.max():.2f} ({yearly_bi.idxmax()}年)")
    print(f"  • 高风险记录共 {len(high_risk)} 条")
    
    return results

if __name__ == '__main__':
    results = main_analysis()
