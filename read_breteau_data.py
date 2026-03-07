import pandas as pd
import os
from glob import glob
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 读取所有布雷图数据文件
yiwen_path = "/Users/liaoweizhou/Desktop/工作/10-病媒监测数据/数据库/伊蚊"
breteau_files = glob(os.path.join(yiwen_path, "*布雷图*.xls*"))

print(f"找到 {len(breteau_files)} 个布雷图数据文件:")
for f in breteau_files:
    print(f"  - {os.path.basename(f)}")

# 读取并合并所有数据
all_data = []
for file in breteau_files:
    try:
        # 尝试读取文件
        df = pd.read_excel(file, sheet_name=0)
        year = os.path.basename(file)[:4]
        if year.isdigit():
            df['年份'] = int(year)
        else:
            # 从文件名中提取年份
            import re
            year_match = re.search(r'(20\d{2})', os.path.basename(file))
            if year_match:
                df['年份'] = int(year_match.group(1))
        all_data.append(df)
        print(f"✓ 成功读取: {os.path.basename(file)} - {df.shape}")
    except Exception as e:
        print(f"✗ 读取失败: {os.path.basename(file)} - {e}")

# 显示每个文件的结构
print("\n" + "="*80)
print("📋 数据结构检查")
print("="*80)

for i, df in enumerate(all_data):
    print(f"\n文件 {i+1}:")
    print(f"  列名: {list(df.columns)}")
    print(f"  前3行:\n{df.head(3)}")
