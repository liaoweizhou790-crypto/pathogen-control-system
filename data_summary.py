import pandas as pd
import os
from glob import glob

base_path = "/Users/liaoweizhou/Desktop/工作/10-病媒监测数据/数据库/"

print("=" * 80)
print("📊 柳州市病媒生物监测数据概况报告")
print("=" * 80)

# 1. 四害密度数据概况
print("\n" + "="*80)
print("📁 一、四害密度监测数据")
print("="*80)

# 综合标准格式
comprehensive_file = os.path.join(base_path, "柳州市四害密度_综合_标准格式.xlsx")
df_comp = pd.read_excel(comprehensive_file)
print(f"\n【综合标准格式数据】")
print(f"  • 数据条数: {len(df_comp)} 条")
print(f"  • 数据年份: {df_comp['监测日期'].str[:4].unique().tolist()}")
print(f"  • 四害类型分布:")
for pest_type in df_comp['四害类型'].unique():
    count = len(df_comp[df_comp['四害类型'] == pest_type])
    print(f"    - {pest_type}: {count} 条记录")

# 各专项数据库
databases = {
    "鼠密度（粘捕法）": "柳州市鼠密度（粘捕法）数据库.xlsx",
    "蚊密度（诱蚊灯法）": "柳州市蚊密度（诱蚊灯法）数据库.xlsx", 
    "蝇密度（捕蝇笼法）": "柳州市蝇密度（捕蝇笼法）.xlsx",
    "蟑密度（粘蟑法）": "柳州市蟑密度（粘蟑法)数据库.xlsx"
}

for name, file in databases.items():
    filepath = os.path.join(base_path, file)
    if os.path.exists(filepath):
        df = pd.read_excel(filepath, header=None)
        print(f"\n【{name}数据库】")
        print(f"  • 文件: {file}")
        print(f"  • 数据规模: {df.shape[0]} 行 × {df.shape[1]} 列")

# 2. 伊蚊专项监测数据
print("\n" + "="*80)
print("📁 二、伊蚊专项监测数据")
print("="*80)

yiwen_path = os.path.join(base_path, "伊蚊")
yiwen_files = glob(os.path.join(yiwen_path, "*.xls*"))

print(f"\n伊蚊监测数据文件数量: {len(yiwen_files)} 个")

# 按类型分类
breteau_files = [f for f in yiwen_files if "布雷图" in f]
ovitrap_files = [f for f in yiwen_files if "诱蚊诱卵器" in f]
double_tent_files = [f for f in yiwen_files if "双层叠帐" in f]

print(f"\n【数据类型分布】")
print(f"  • 布雷图指数监测: {len(breteau_files)} 个文件")
print(f"    - 年份: {[os.path.basename(f)[:4] for f in breteau_files]}")
print(f"  • 诱蚊诱卵器监测: {len(ovitrap_files)} 个文件")
print(f"    - 年份: {[os.path.basename(f)[:4] for f in ovitrap_files]}")
print(f"  • 双层叠帐法监测: {len(double_tent_files)} 个文件")
print(f"    - 年份: {[os.path.basename(f)[:4] for f in double_tent_files]}")

# 3. 数据模板文件
print("\n" + "="*80)
print("📁 三、数据模板文件")
print("="*80)

template_files = [
    "蚊密度监测数据导入模板.xlsx",
    "蝇密度监测数据导入模板.xlsx"
]

for template in template_files:
    filepath = os.path.join(base_path, template)
    if os.path.exists(filepath):
        print(f"  ✓ {template}")

# 4. 数据质量概况
print("\n" + "="*80)
print("📋 四、数据质量概况")
print("="*80)

print(f"\n【综合标准格式数据完整性】")
for col in df_comp.columns:
    non_null = df_comp[col].notna().sum()
    total = len(df_comp)
    pct = (non_null / total) * 100
    if pct < 100:
        print(f"  • {col}: {non_null}/{total} ({pct:.1f}%)")

print("\n" + "="*80)
print("✅ 数据概况检查完成")
print("="*80)
print("\n📌 可用分析任务:")
print("   1. 四害密度年度/月度趋势分析")
print("   2. 四害密度达标率统计")
print("   3. 伊蚊布雷图指数时空分布分析")
print("   4. 病媒监测数据质量报告")
print("   5. 生成监测分析Word报告")
