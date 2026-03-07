import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from glob import glob
import os
import pickle

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 输出目录
output_dir = "/Users/liaoweizhou/.openclaw/workspace/output"
chart_dir = f"{output_dir}/charts"
os.makedirs(chart_dir, exist_ok=True)

# 加载数据
with open(f"{output_dir}/analysis_data.pkl", 'rb') as f:
    data = pickle.load(f)

df_valid = data['df_valid']
yearly_stats = data['yearly_stats']
monthly_stats = data['monthly_stats']
district_stats = data['district_stats']

# 1. 年度趋势折线图
fig, ax = plt.subplots(figsize=(12, 6))
years = yearly_stats.index
ax.plot(years, yearly_stats['平均BI'], 'b-o', linewidth=2, markersize=8, label='平均布雷图指数')
ax.fill_between(years, yearly_stats['平均BI'], alpha=0.3)
ax.axhline(y=5, color='r', linestyle='--', linewidth=2, label='风险阈值 (BI=5)')
ax.axhline(y=10, color='orange', linestyle='--', linewidth=2, label='高风险阈值 (BI=10)')
ax.set_xlabel('年份', fontsize=12)
ax.set_ylabel('布雷图指数', fontsize=12)
ax.set_title('柳州市伊蚊布雷图指数年度变化趋势 (2021-2025)', fontsize=14, fontweight='bold')
ax.legend(loc='upper left')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f"{chart_dir}/01_年度趋势图.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ 图表1: 年度趋势图已保存")

# 2. 月度分布柱状图
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# 平均BI月度分布
months = monthly_stats.index
axes[0].bar(months, monthly_stats['平均BI'], color='steelblue', alpha=0.8)
axes[0].axhline(y=5, color='r', linestyle='--', linewidth=2, label='风险阈值 (BI=5)')
axes[0].set_xlabel('月份', fontsize=12)
axes[0].set_ylabel('平均布雷图指数', fontsize=12)
axes[0].set_title('月度平均布雷图指数分布', fontsize=14, fontweight='bold')
axes[0].set_xticks(range(4, 13))
axes[0].legend()
axes[0].grid(True, alpha=0.3, axis='y')

# 监测点数月度分布
axes[1].bar(months, monthly_stats['监测点数'], color='green', alpha=0.8)
axes[1].set_xlabel('月份', fontsize=12)
axes[1].set_ylabel('监测点数', fontsize=12)
axes[1].set_title('月度监测点数量分布', fontsize=14, fontweight='bold')
axes[1].set_xticks(range(4, 13))
axes[1].grid(True, alpha=0.3, axis='y')

plt.tight_layout()
plt.savefig(f"{chart_dir}/02_月度分布图.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ 图表2: 月度分布图已保存")

# 3. 城区对比图（TOP10）
fig, ax = plt.subplots(figsize=(14, 8))
top10 = district_stats.head(10)
y_pos = np.arange(len(top10))
bars = ax.barh(y_pos, top10['平均BI'], color=['red' if x >= 5 else 'steelblue' for x in top10['平均BI']])
ax.set_yticks(y_pos)
ax.set_yticklabels(top10.index, fontsize=11)
ax.set_xlabel('平均布雷图指数', fontsize=12)
ax.set_title('各城区平均布雷图指数对比 (TOP10)', fontsize=14, fontweight='bold')
ax.axvline(x=5, color='red', linestyle='--', linewidth=2, label='风险阈值 (BI=5)')
ax.legend()
ax.grid(True, alpha=0.3, axis='x')

# 添加数值标签
for i, (idx, row) in enumerate(top10.iterrows()):
    ax.text(row['平均BI'] + 0.1, i, f"{row['平均BI']:.2f}", va='center', fontsize=10)

plt.tight_layout()
plt.savefig(f"{chart_dir}/03_城区对比图.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ 图表3: 城区对比图已保存")

# 4. 风险等级分布饼图
fig, ax = plt.subplots(figsize=(10, 8))
risk_counts = df_valid['风险等级'].value_counts()
colors = ['#2ecc71', '#f1c40f', '#e74c3c']  # 绿、黄、红
wedges, texts, autotexts = ax.pie(risk_counts, labels=risk_counts.index, autopct='%1.1f%%',
                                   colors=colors, startangle=90, textprops={'fontsize': 12})
ax.set_title('布雷图指数风险等级分布', fontsize=14, fontweight='bold')

# 添加图例
ax.legend(wedges, [f"{k}: {v}个 ({v/len(df_valid)*100:.1f}%)" for k, v in risk_counts.items()],
          title="风险等级", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))

plt.tight_layout()
plt.savefig(f"{chart_dir}/04_风险等级分布图.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ 图表4: 风险等级分布图已保存")

# 5. 年度监测规模变化图
fig, ax1 = plt.subplots(figsize=(12, 6))

# 监测点数
ax1.bar(years, yearly_stats['监测点数'], alpha=0.7, color='steelblue', label='监测点数')
ax1.set_xlabel('年份', fontsize=12)
ax1.set_ylabel('监测点数', fontsize=12, color='steelblue')
ax1.tick_params(axis='y', labelcolor='steelblue')
ax1.set_title('年度监测规模与布雷图指数变化', fontsize=14, fontweight='bold')

# 平均BI
ax2 = ax1.twinx()
ax2.plot(years, yearly_stats['平均BI'], 'ro-', linewidth=2, markersize=8, label='平均BI')
ax2.set_ylabel('平均布雷图指数', fontsize=12, color='red')
ax2.tick_params(axis='y', labelcolor='red')
ax2.axhline(y=5, color='orange', linestyle='--', linewidth=2, alpha=0.7)

# 合并图例
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

plt.tight_layout()
plt.savefig(f"{chart_dir}/05_监测规模变化图.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ 图表5: 监测规模变化图已保存")

# 6. 高风险区域时间分布热力图数据
fig, ax = plt.subplots(figsize=(14, 8))

# 创建年度-月份交叉表
year_month = df_valid.groupby(['年份', '月份'])['布雷图指数'].mean().unstack()
im = ax.imshow(year_month.values, cmap='YlOrRd', aspect='auto')

# 设置坐标轴
ax.set_xticks(range(len(year_month.columns)))
ax.set_xticklabels([f"{int(m)}月" for m in year_month.columns])
ax.set_yticks(range(len(year_month.index)))
ax.set_yticklabels([f"{int(y)}年" for y in year_month.index])

# 添加数值标签
for i in range(len(year_month.index)):
    for j in range(len(year_month.columns)):
        if not np.isnan(year_month.values[i, j]):
            text = ax.text(j, i, f"{year_month.values[i, j]:.1f}",
                          ha="center", va="center", color="black" if year_month.values[i, j] < 5 else "white",
                          fontsize=9)

ax.set_title('布雷图指数年度-月份热力图', fontsize=14, fontweight='bold')
plt.colorbar(im, ax=ax, label='平均布雷图指数')
plt.tight_layout()
plt.savefig(f"{chart_dir}/06_时空热力图.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ 图表6: 时空热力图已保存")

print("\n" + "="*80)
print("📊 所有图表生成完成！")
print(f"图表保存位置: {chart_dir}/")
print("="*80)
