#!/usr/bin/env python3
import pandas as pd
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

data = {'date': ['2025-01-15']*3 + ['2025-02-15']*3 + ['2025-03-15']*3,
        'location': ['A','B','C']*3,
        'habitat': ['居民区','农贸市场','绿化带']*3,
        'traps': [100]*9,
        'caught': [12,28,8,15,32,10,18,35,12]}
df = pd.DataFrame(data)
df['date'] = pd.to_datetime(df['date'])
df['month'] = df['date'].dt.strftime('%Y-%m')
df['capture_rate'] = (df['caught'] / df['traps'] * 100).round(2)

print("📊 鼠密度监测数据分析结果")
print("="*50)
print(f"平均捕鼠率: {df['capture_rate'].mean():.2f}%")
print(f"最高捕鼠率: {df['capture_rate'].max():.2f}%")
print(f"最低捕鼠率: {df['capture_rate'].min():.2f}%")
print("\n按生境统计:")
print(df.groupby('habitat')['capture_rate'].mean())
print("\n按月趋势:")
print(df.groupby('month')['capture_rate'].mean())
print("="*50)
print("✅ 分析完成!")