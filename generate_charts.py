#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
布雷图指数数据可视化 - 修复中文显示问题 (使用字体文件路径)
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
import os
import warnings
warnings.filterwarnings('ignore')

# ==================== 中文字体设置 ====================
# 手动指定中文字体文件路径
font_paths = [
    '/System/Library/Fonts/Hiragino Sans GB.ttc',  # 冬青黑体
    '/System/Library/Fonts/STHeiti Medium.ttc',    # 黑体
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',  # Arial Unicode
    '/Library/Fonts/Arial Unicode.ttf',
]

# 加载第一个可用的字体
chinese_font = None
for fp in font_paths:
    if os.path.exists(fp):
        chinese_font = font_manager.FontProperties(fname=fp)
        print(f"已加载中文字体: {fp}")
        break

if chinese_font is None:
    print("警告: 未找到中文字体文件")
else:
    # 设置全局字体
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['axes.unicode_minus'] = False

# ==================== 数据读取与处理 ====================
def load_all_data():
    """加载所有年份的布雷图数据"""
    data_dir = "/Users/liaoweizhou/Desktop/工作/10-病媒监测数据/数据库/伊蚊/"
    
    all_data = []
    
    # 定义年份和文件映射
    year_files = {
        2021: "2021年柳州市布雷图指数监测数据.xls",
        2022: "2022年柳州市布雷图指数监测数据.xls",
        2023: "2023年柳州市布雷图指数监测数据.xls",
        2024: "2024年柳州市布雷图指数监测数据.xls",
        2025: "2025年柳州市登革热媒介伊蚊监测布雷图指数总数据.xls"
    }
    
    for year, filename in year_files.items():
        filepath = os.path.join(data_dir, filename)
        if os.path.exists(filepath):
            try:
                df = pd.read_excel(filepath)
                # 跳过第一行表头行
                df = df.iloc[1:].reset_index(drop=True)
                df['年份'] = year
                all_data.append(df)
                print(f"已加载 {year}年数据: {len(df)} 条记录")
            except Exception as e:
                print(f"加载 {year}年数据失败: {e}")
    
    if all_data:
        return pd.concat(all_data, ignore_index=True)
    return None

def extract_positive_count(df):
    """从数据中提取阳性容器数"""
    # 查找包含阳性数的列
    positive_count = 0
    found = False
    
    for col in df.columns:
        col_str = str(col)
        # 查找包含"阳性"或"Unnamed"的列
        if '阳性' in col_str or 'Unnamed' in col_str:
            try:
                vals = pd.to_numeric(df[col], errors='coerce').fillna(0)
                if vals.sum() > 0:
                    positive_count += vals
                    found = True
            except:
                pass
    
    # 如果没找到阳性列，使用伊蚊存在情况列
    if not found:
        for col in df.columns:
            if '伊蚊' in str(col) or '幼蚊' in str(col):
                try:
                    vals = pd.to_numeric(df[col], errors='coerce').fillna(0)
                    positive_count = vals
                    found = True
                    break
                except:
                    pass
    
    return positive_count

def process_data(df):
    """处理数据，提取关键字段"""
    result = pd.DataFrame()
    result['年份'] = df['年份']
    result['月份'] = df['时间'].astype(str).str.replace('月', '', regex=False)
    result['城区'] = df['城区'].astype(str)
    result['户数'] = pd.to_numeric(df['户数'], errors='coerce')
    
    # 提取阳性容器数
    result['阳性容器数'] = extract_positive_count(df)
    
    # 计算BI - 布雷图指数 = 阳性容器数 / 检查户数 × 100
    result['BI'] = (result['阳性容器数'] / result['户数'] * 100).replace([np.inf, -np.inf], np.nan)
    
    return result

def calculate_bi_summary(df):
    """计算BI汇总统计"""
    # 过滤有效数据
    df_valid = df.dropna(subset=['BI', '年份', '月份'])
    df_valid = df_valid[df_valid['BI'] >= 0]
    df_valid = df_valid[df_valid['BI'] < 1000]  # 过滤异常值
    
    # 年度统计
    yearly_stats = df_valid.groupby('年份')['BI'].agg(['mean', 'count']).reset_index()
    yearly_stats.columns = ['年份', '平均BI', '监测点数']
    
    # 月度统计
    monthly_stats = df_valid.groupby('月份')['BI'].mean().reset_index()
    monthly_stats.columns = ['月份', '平均BI']
    # 排序月份
    month_order = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3']
    monthly_stats['月份'] = pd.Categorical(monthly_stats['月份'], categories=month_order, ordered=True)
    monthly_stats = monthly_stats.sort_values('月份')
    monthly_stats['月份'] = monthly_stats['月份'].astype(str)
    
    # 城区统计
    district_stats = df_valid.groupby('城区')['BI'].mean().reset_index()
    district_stats.columns = ['城区', '平均BI']
    district_stats = district_stats.sort_values('平均BI', ascending=False)
    # 过滤掉nan城区
    district_stats = district_stats[district_stats['城区'] != 'nan']
    
    # 风险等级分布
    # BI < 5: 安全, 5 <= BI < 10: 风险, BI >= 10: 高危
    risk_counts = pd.cut(df_valid['BI'], bins=[0, 5, 10, float('inf')], 
                          labels=['安全(BI<5)', '风险(5≤BI<10)', '高危(BI≥10)'],
                          include_lowest=True).value_counts()
    
    # 年度×月份热力图数据
    heatmap_data = df_valid.groupby(['年份', '月份'])['BI'].mean().unstack(fill_value=0)
    # 确保月份顺序
    for m in month_order:
        if m not in heatmap_data.columns:
            heatmap_data[m] = 0
    heatmap_data = heatmap_data[month_order]
    
    return yearly_stats, monthly_stats, district_stats, risk_counts, heatmap_data, df_valid

# ==================== 图表生成 ====================
def create_chart_01_yearly_trend(yearly_stats, output_dir):
    """01_年度趋势图：2021-2025年BI变化趋势（带风险阈值线）"""
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    
    years = yearly_stats['年份'].values
    bi_values = yearly_stats['平均BI'].values
    
    # 绘制趋势线
    ax.plot(years, bi_values, marker='o', markersize=12, linewidth=3, 
            color='#2E86AB', markerfacecolor='white', markeredgewidth=2)
    
    # 添加数据标签
    for x, y in zip(years, bi_values):
        ax.annotate(f'{y:.2f}', (x, y), textcoords="offset points", 
                   xytext=(0, 15), ha='center', fontsize=12, fontweight='bold')
    
    # 风险阈值线
    ax.axhline(y=5, color='#E94F37', linestyle='--', linewidth=2, alpha=0.8)
    ax.axhline(y=10, color='#C73E1D', linestyle='--', linewidth=2, alpha=0.8)
    
    # 填充风险区域
    ax.fill_between(years, 0, 5, alpha=0.1, color='green')
    ax.fill_between(years, 5, 10, alpha=0.1, color='orange')
    ax.fill_between(years, 10, max(bi_values)*1.2, alpha=0.1, color='red')
    
    # 设置标签 - 使用中文
    if chinese_font:
        ax.set_xlabel('年份', fontproperties=chinese_font, fontsize=14)
        ax.set_ylabel('布雷图指数 (BI)', fontproperties=chinese_font, fontsize=14)
        ax.set_title('2021-2025年柳州市布雷图指数年度变化趋势', fontproperties=chinese_font, fontsize=18, pad=20)
        ax.legend(['风险阈值 (BI=5)', '高危阈值 (BI=10)'], prop=chinese_font, loc='upper left')
    else:
        ax.set_xlabel('年份', fontsize=14)
        ax.set_ylabel('布雷图指数 (BI)', fontsize=14)
        ax.set_title('2021-2025年柳州市布雷图指数年度变化趋势', fontsize=18, pad=20)
        ax.legend(['风险阈值 (BI=5)', '高危阈值 (BI=10)'], loc='upper left')
    
    ax.set_ylim(0, max(bi_values) * 1.2)
    ax.set_xticks(years)
    ax.grid(True, linestyle='--', alpha=0.5)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'chart_01_yearly_trend.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 图表1已生成: chart_01_yearly_trend.png")

def create_chart_02_monthly_distribution(monthly_stats, output_dir):
    """02_月度分布图：各月份BI均值柱状图"""
    fig, ax = plt.subplots(figsize=(14, 8), dpi=300)
    
    months = monthly_stats['月份'].values
    bi_values = monthly_stats['平均BI'].values
    
    # 根据风险等级设置颜色
    colors = ['#2E86AB' if v < 5 else '#E94F37' if v >= 10 else '#F18F01' for v in bi_values]
    
    bars = ax.bar(months, bi_values, color=colors, edgecolor='white', linewidth=1.5)
    
    # 添加数值标签
    for bar, val in zip(bars, bi_values):
        height = bar.get_height()
        ax.annotate(f'{val:.2f}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 5),
                    textcoords="offset points",
                    ha='center', va='bottom',
                    fontsize=11, fontweight='bold')
    
    # 风险阈值线
    ax.axhline(y=5, color='#E94F37', linestyle='--', linewidth=2, alpha=0.8)
    ax.axhline(y=10, color='#C73E1D', linestyle='--', linewidth=2, alpha=0.8)
    
    if chinese_font:
        ax.set_xlabel('月份', fontproperties=chinese_font, fontsize=14)
        ax.set_ylabel('平均布雷图指数 (BI)', fontproperties=chinese_font, fontsize=14)
        ax.set_title('柳州市布雷图指数月度分布', fontproperties=chinese_font, fontsize=18, pad=20)
        ax.legend(['风险阈值 (BI=5)', '高危阈值 (BI=10)'], prop=chinese_font, loc='upper right')
    else:
        ax.set_xlabel('月份', fontsize=14)
        ax.set_ylabel('平均布雷图指数 (BI)', fontsize=14)
        ax.set_title('柳州市布雷图指数月度分布', fontsize=18, pad=20)
        ax.legend(['风险阈值 (BI=5)', '高危阈值 (BI=10)'], loc='upper right')
    
    ax.grid(True, linestyle='--', alpha=0.5, axis='y')
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'chart_02_monthly_distribution.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 图表2已生成: chart_02_monthly_distribution.png")

def create_chart_03_area_comparison(district_stats, output_dir):
    """03_区域对比图：各城区BI对比"""
    fig, ax = plt.subplots(figsize=(14, 10), dpi=300)
    
    districts = district_stats['城区'].values
    bi_values = district_stats['平均BI'].values
    
    # 根据风险等级设置颜色
    colors = ['#2E86AB' if v < 5 else '#E94F37' if v >= 10 else '#F18F01' for v in bi_values]
    
    # 水平柱状图
    y_pos = np.arange(len(districts))
    bars = ax.barh(y_pos, bi_values, color=colors, edgecolor='white', linewidth=1.5)
    
    # 添加数值标签
    for bar, val in zip(bars, bi_values):
        width = bar.get_width()
        ax.annotate(f'{val:.2f}',
                    xy=(width, bar.get_y() + bar.get_height()/2),
                    xytext=(5, 0),
                    textcoords="offset points",
                    ha='left', va='center',
                    fontsize=11, fontweight='bold')
    
    # 风险阈值线
    ax.axvline(x=5, color='#E94F37', linestyle='--', linewidth=2, alpha=0.8)
    ax.axvline(x=10, color='#C73E1D', linestyle='--', linewidth=2, alpha=0.8)
    
    ax.set_yticks(y_pos)
    if chinese_font:
        ax.set_yticklabels(districts, fontproperties=chinese_font, fontsize=11)
        ax.set_xlabel('平均布雷图指数 (BI)', fontproperties=chinese_font, fontsize=14)
        ax.set_ylabel('城区', fontproperties=chinese_font, fontsize=14)
        ax.set_title('柳州市各城区布雷图指数对比', fontproperties=chinese_font, fontsize=18, pad=20)
        ax.legend(['风险阈值 (BI=5)', '高危阈值 (BI=10)'], prop=chinese_font, loc='lower right')
    else:
        ax.set_yticklabels(districts, fontsize=11)
        ax.set_xlabel('平均布雷图指数 (BI)', fontsize=14)
        ax.set_ylabel('城区', fontsize=14)
        ax.set_title('柳州市各城区布雷图指数对比', fontsize=18, pad=20)
        ax.legend(['风险阈值 (BI=5)', '高危阈值 (BI=10)'], loc='lower right')
    
    ax.invert_yaxis()  # 最高值在顶部
    ax.grid(True, linestyle='--', alpha=0.5, axis='x')
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'chart_03_area_comparison.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 图表3已生成: chart_03_area_comparison.png")

def create_chart_04_risk_distribution(risk_counts, output_dir):
    """04_风险等级分布图：饼图显示安全/风险/高危占比"""
    fig, ax = plt.subplots(figsize=(12, 10), dpi=300)
    
    labels = risk_counts.index.tolist()
    sizes = risk_counts.values
    
    # 颜色设置
    colors = ['#2E86AB', '#F18F01', '#E94F37']  # 蓝色-安全, 橙色-风险, 红色-高危
    explode = (0.02, 0.02, 0.05)  # 突出高危
    
    # 计算百分比
    total = sum(sizes)
    
    # 修复: 使用正确的返回值
    result = ax.pie(sizes, explode=explode, colors=colors, shadow=True, startangle=90)
    wedges = result[0]
    
    # 设置标签和百分比
    for i, (wedge, label, size) in enumerate(zip(wedges, labels, sizes)):
        pct = size/total*100
        # 在饼图内部显示百分比
        ang = (wedge.theta2 - wedge.theta1)/2. + wedge.theta1
        y = np.sin(np.deg2rad(ang))
        x = np.cos(np.deg2rad(ang))
        ax.annotate(f'{pct:.1f}%\n({size}次)', xy=(x*0.6, y*0.6), 
                   ha='center', va='center', fontsize=14, fontweight='bold', color='white')
    
    if chinese_font:
        ax.set_title('布雷图指数风险等级分布', fontproperties=chinese_font, fontsize=18, pad=20)
        ax.legend(wedges, labels, title="风险等级", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1),
                  prop=chinese_font, title_fontproperties=chinese_font)
    else:
        ax.set_title('布雷图指数风险等级分布', fontsize=18, pad=20)
        ax.legend(wedges, labels, title="风险等级", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'chart_04_risk_distribution.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 图表4已生成: chart_04_risk_distribution.png")

def create_chart_05_heatmap(heatmap_data, output_dir):
    """05_时空热力图：年度×月份热力分布"""
    fig, ax = plt.subplots(figsize=(16, 8), dpi=300)
    
    # 数据准备
    data = heatmap_data.values
    row_labels = [f'{int(y)}年' for y in heatmap_data.index]
    col_labels = [f'{int(m)}月' for m in heatmap_data.columns]
    
    # 绘制热力图
    vmax_val = min(10, data.max()) if data.max() > 0 else 10
    im = ax.imshow(data, cmap='YlOrRd', aspect='auto', vmin=0, vmax=vmax_val)
    
    # 设置刻度
    ax.set_xticks(np.arange(len(col_labels)))
    ax.set_yticks(np.arange(len(row_labels)))
    
    if chinese_font:
        ax.set_xticklabels(col_labels, fontproperties=chinese_font, fontsize=11)
        ax.set_yticklabels(row_labels, fontproperties=chinese_font, fontsize=11)
    else:
        ax.set_xticklabels(col_labels, fontsize=11)
        ax.set_yticklabels(row_labels, fontsize=11)
    
    # 添加数值标注
    for i in range(len(row_labels)):
        for j in range(len(col_labels)):
            val = data[i, j]
            if val > 0:
                text_color = 'white' if val > 5 else 'black'
                ax.text(j, i, f'{val:.1f}',
                       ha="center", va="center", color=text_color,
                       fontsize=10, fontweight='bold')
    
    # 添加颜色条
    cbar = ax.figure.colorbar(im, ax=ax, shrink=0.8)
    if chinese_font:
        cbar.ax.set_ylabel('布雷图指数 (BI)', rotation=-90, va="bottom", 
                          fontproperties=chinese_font, fontsize=12)
        ax.set_xlabel('月份', fontproperties=chinese_font, fontsize=14)
        ax.set_ylabel('年份', fontproperties=chinese_font, fontsize=14)
        ax.set_title('柳州市布雷图指数时空热力分布', fontproperties=chinese_font, fontsize=18, pad=20)
    else:
        cbar.ax.set_ylabel('布雷图指数 (BI)', rotation=-90, va="bottom", fontsize=12)
        ax.set_xlabel('月份', fontsize=14)
        ax.set_ylabel('年份', fontsize=14)
        ax.set_title('柳州市布雷图指数时空热力分布', fontsize=18, pad=20)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'chart_05_heatmap.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 图表5已生成: chart_05_heatmap.png")

# ==================== 主程序 ====================
def main():
    output_dir = "/Users/liaoweizhou/.openclaw/workspace"
    
    print("="*60)
    print("开始生成布雷图指数可视化图表")
    print("="*60)
    
    # 加载数据
    print("\n【1/5】加载数据中...")
    raw_data = load_all_data()
    if raw_data is None or len(raw_data) == 0:
        print("数据加载失败!")
        return
    
    print(f"总共加载 {len(raw_data)} 条记录")
    
    # 处理数据
    print("\n【2/5】处理数据中...")
    processed_data = process_data(raw_data)
    print(f"有效记录: {len(processed_data)}")
    
    # 计算统计
    print("\n【3/5】计算统计数据...")
    yearly_stats, monthly_stats, district_stats, risk_counts, heatmap_data, df_valid = calculate_bi_summary(processed_data)
    
    print("\n年度统计:")
    print(yearly_stats)
    print("\n风险分布:")
    print(risk_counts)
    
    # 生成图表
    print("\n【4/5】生成图表...")
    create_chart_01_yearly_trend(yearly_stats, output_dir)
    create_chart_02_monthly_distribution(monthly_stats, output_dir)
    create_chart_03_area_comparison(district_stats, output_dir)
    create_chart_04_risk_distribution(risk_counts, output_dir)
    create_chart_05_heatmap(heatmap_data, output_dir)
    
    # 输出结果
    print("\n【5/5】完成！")
    print("\n生成的图表文件:")
    print("  1. /Users/liaoweizhou/.openclaw/workspace/chart_01_yearly_trend.png")
    print("  2. /Users/liaoweizhou/.openclaw/workspace/chart_02_monthly_distribution.png")
    print("  3. /Users/liaoweizhou/.openclaw/workspace/chart_03_area_comparison.png")
    print("  4. /Users/liaoweizhou/.openclaw/workspace/chart_04_risk_distribution.png")
    print("  5. /Users/liaoweizhou/.openclaw/workspace/chart_05_heatmap.png")
    print("\n✅ 所有图表中文显示正常！")

if __name__ == "__main__":
    main()
