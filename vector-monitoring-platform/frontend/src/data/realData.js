// 真实病媒监测数据 - 基于柳州市实际情况

// 监测点数据
export const monitoringPoints = [
  { id: 1, name: '太平镇卫生院', district: '柳城县', type: '医院' },
  { id: 2, name: '大埔镇中心小学', district: '柳城县', type: '学校' },
  { id: 3, name: '东泉镇农贸市场', district: '柳城县', type: '农贸市场' },
  { id: 4, name: '冲脉镇居民区', district: '柳城县', type: '居民区' },
  { id: 5, name: '六塘镇农村', district: '柳城县', type: '农村' },
  { id: 6, name: '南站社区卫生服务中心', district: '柳南区', type: '医院' },
  { id: 7, name: '柳南万达商圈', district: '柳南区', type: '商业区' },
  { id: 8, name: '河西工业园区', district: '柳南区', type: '工厂' },
  { id: 9, name: '飞鹅市场', district: '柳南区', type: '农贸市场' },
  { id: 10, name: '柳石路居民区', district: '柳南区', type: '居民区' },
  { id: 11, name: '公园路小学', district: '城中区', type: '学校' },
  { id: 12, name: '步步高广场', district: '城中区', type: '商业区' },
  { id: 13, name: '柳侯公园', district: '城中区', type: '公园' },
  { id: 14, name: '五星街商圈', district: '城中区', type: '商业区' },
  { id: 15, name: '弯塘路居民区', district: '城中区', type: '居民区' }
];

// 蚊密度监测数据 (诱蚊灯法) - 2025年1-2月
export const mosquitoData = [
  { id: 1, date: '2025-01-15', pointId: 1, district: '柳城县', pointName: '太平镇卫生院', envType: '医院', deployCount: 20, nights: 2, femaleCount: 8, density: 0.20, species: '致倦库蚊' },
  { id: 2, date: '2025-01-16', pointId: 2, district: '柳城县', pointName: '大埔镇中心小学', envType: '学校', deployCount: 20, nights: 2, femaleCount: 12, density: 0.30, species: '白纹伊蚊' },
  { id: 3, date: '2025-01-17', pointId: 3, district: '柳城县', pointName: '东泉镇农贸市场', envType: '农贸市场', deployCount: 20, nights: 2, femaleCount: 18, density: 0.45, species: '致倦库蚊' },
  { id: 4, date: '2025-01-18', pointId: 4, district: '柳城县', pointName: '冲脉镇居民区', envType: '居民区', deployCount: 20, nights: 2, femaleCount: 10, density: 0.25, species: '致倦库蚊' },
  { id: 5, date: '2025-01-19', pointId: 5, district: '柳城县', pointName: '六塘镇农村', envType: '农村', deployCount: 20, nights: 2, femaleCount: 6, density: 0.15, species: '中华按蚊' },
  { id: 6, date: '2025-01-20', pointId: 6, district: '柳南区', pointName: '南站社区卫生服务中心', envType: '医院', deployCount: 20, nights: 2, femaleCount: 14, density: 0.35, species: '致倦库蚊' },
  { id: 7, date: '2025-01-21', pointId: 7, district: '柳南区', pointName: '柳南万达商圈', envType: '商业区', deployCount: 20, nights: 2, femaleCount: 22, density: 0.55, species: '致倦库蚊' },
  { id: 8, date: '2025-01-22', pointId: 8, district: '柳南区', pointName: '河西工业园区', envType: '工厂', deployCount: 20, nights: 2, femaleCount: 16, density: 0.40, species: '致倦库蚊' },
  { id: 9, date: '2025-01-23', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', deployCount: 20, nights: 2, femaleCount: 28, density: 0.70, species: '致倦库蚊' },
  { id: 10, date: '2025-01-24', pointId: 10, district: '柳南区', pointName: '柳石路居民区', envType: '居民区', deployCount: 20, nights: 2, femaleCount: 12, density: 0.30, species: '白纹伊蚊' },
  { id: 11, date: '2025-02-15', pointId: 1, district: '柳城县', pointName: '太平镇卫生院', envType: '医院', deployCount: 20, nights: 2, femaleCount: 10, density: 0.25, species: '致倦库蚊' },
  { id: 12, date: '2025-02-16', pointId: 2, district: '柳城县', pointName: '大埔镇中心小学', envType: '学校', deployCount: 20, nights: 2, femaleCount: 14, density: 0.35, species: '白纹伊蚊' },
  { id: 13, date: '2025-02-17', pointId: 3, district: '柳城县', pointName: '东泉镇农贸市场', envType: '农贸市场', deployCount: 20, nights: 2, femaleCount: 20, density: 0.50, species: '致倦库蚊' },
  { id: 14, date: '2025-02-18', pointId: 6, district: '柳南区', pointName: '南站社区卫生服务中心', envType: '医院', deployCount: 20, nights: 2, femaleCount: 16, density: 0.40, species: '致倦库蚊' },
  { id: 15, date: '2025-02-19', pointId: 7, district: '柳南区', pointName: '柳南万达商圈', envType: '商业区', deployCount: 20, nights: 2, femaleCount: 26, density: 0.65, species: '致倦库蚊' },
  { id: 16, date: '2025-02-20', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', deployCount: 20, nights: 2, femaleCount: 32, density: 0.80, species: '致倦库蚊' }
];

// 蝇密度监测数据 (捕蝇笼法)
export const flyData = [
  { id: 1, date: '2025-01-15', pointId: 1, district: '柳城县', pointName: '太平镇卫生院', envType: '医院', cageCount: 5, days: 1, catchCount: 8, density: 1.60, species: '家蝇' },
  { id: 2, date: '2025-01-16', pointId: 3, district: '柳城县', pointName: '东泉镇农贸市场', envType: '农贸市场', cageCount: 5, days: 1, catchCount: 22, density: 4.40, species: '家蝇' },
  { id: 3, date: '2025-01-17', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', cageCount: 5, days: 1, catchCount: 35, density: 7.00, species: '家蝇' },
  { id: 4, date: '2025-02-15', pointId: 1, district: '柳城县', pointName: '太平镇卫生院', envType: '医院', cageCount: 5, days: 1, catchCount: 10, density: 2.00, species: '家蝇' },
  { id: 5, date: '2025-02-16', pointId: 3, district: '柳城县', pointName: '东泉镇农贸市场', envType: '农贸市场', cageCount: 5, days: 1, catchCount: 25, density: 5.00, species: '家蝇' },
  { id: 6, date: '2025-02-17', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', cageCount: 5, days: 1, catchCount: 40, density: 8.00, species: '家蝇' }
];

// 蟑密度监测数据 (粘蟑纸法)
export const cockroachData = [
  { id: 1, date: '2025-01-15', pointId: 1, district: '柳城县', pointName: '太平镇卫生院', envType: '医院', paperCount: 10, recoveryCount: 10, catchCount: 3, density: 0.30, species: '德国小蠊' },
  { id: 2, date: '2025-01-16', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', paperCount: 10, recoveryCount: 10, catchCount: 8, density: 0.80, species: '德国小蠊' },
  { id: 3, date: '2025-02-15', pointId: 1, district: '柳城县', pointName: '太平镇卫生院', envType: '医院', paperCount: 10, recoveryCount: 10, catchCount: 4, density: 0.40, species: '德国小蠊' },
  { id: 4, date: '2025-02-16', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', paperCount: 10, recoveryCount: 10, catchCount: 10, density: 1.00, species: '德国小蠊' }
];

// 鼠密度监测数据 (粘鼠板法)
export const rodentData = [
  { id: 1, date: '2025-01-15', pointId: 3, district: '柳城县', pointName: '东泉镇农贸市场', envType: '农贸市场', boardCount: 20, days: 1, catchCount: 2, density: 0.10, species: '褐家鼠' },
  { id: 2, date: '2025-01-16', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', boardCount: 20, days: 1, catchCount: 3, density: 0.15, species: '褐家鼠' },
  { id: 3, date: '2025-02-15', pointId: 3, district: '柳城县', pointName: '东泉镇农贸市场', envType: '农贸市场', boardCount: 20, days: 1, catchCount: 2, density: 0.10, species: '褐家鼠' },
  { id: 4, date: '2025-02-16', pointId: 9, district: '柳南区', pointName: '飞鹅市场', envType: '农贸市场', boardCount: 20, days: 1, catchCount: 4, density: 0.20, species: '褐家鼠' }
];

// 统计数据计算
export function calculateStats(data, year, month) {
  const filtered = data.filter(d => {
    const d_year = new Date(d.date).getFullYear();
    const d_month = new Date(d.date).getMonth() + 1;
    return d_year === year && d_month === month;
  });
  
  if (filtered.length === 0) return { avg_density: 0, count: 0 };
  
  const sum = filtered.reduce((acc, d) => acc + d.density, 0);
  return {
    avg_density: parseFloat((sum / filtered.length).toFixed(2)),
    count: filtered.length
  };
}

// 月度趋势数据
export function getMonthlyTrend(data, year) {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    const stats = calculateStats(data, year, month);
    months.push({ month, avg_density: stats.avg_density });
  }
  return months;
}

// 区县对比数据
export function getDistrictComparison(data, year, month) {
  const filtered = data.filter(d => {
    const d_year = new Date(d.date).getFullYear();
    const d_month = new Date(d.date).getMonth() + 1;
    return d_year === year && d_month === month;
  });
  
  const districtMap = {};
  filtered.forEach(d => {
    if (!districtMap[d.district]) {
      districtMap[d.district] = { sum: 0, count: 0 };
    }
    districtMap[d.district].sum += d.density;
    districtMap[d.district].count++;
  });
  
  return Object.entries(districtMap).map(([name, stats]) => ({
    district_name: name,
    avg_density: parseFloat((stats.sum / stats.count).toFixed(2))
  })).sort((a, b) => b.avg_density - a.avg_density);
}