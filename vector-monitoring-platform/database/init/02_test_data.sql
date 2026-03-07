-- 病媒监测平台测试数据
USE vector_monitoring;

-- 插入监测点数据
INSERT INTO monitoring_point (id, point_code, point_name, district_id, env_type, status, create_time) VALUES
(1, 'P0600001', '太平镇卫生院', 6, '医院', 1, NOW()),
(2, 'P0600002', '大埔镇中心校', 6, '学校', 1, NOW()),
(3, 'P0600003', '东泉镇农贸市场', 6, '农贸市场', 1, NOW()),
(4, 'P0600004', '沙埔镇居民区', 6, '居民区', 1, NOW()),
(5, 'P0300001', '南站街道办', 3, '居民区', 1, NOW()),
(6, 'P0300002', '柳铁中心医院', 3, '医院', 1, NOW()),
(7, 'P0300003', '河西小学', 3, '学校', 1, NOW()),
(8, 'P0100001', '城中街道办', 1, '居民区', 1, NOW()),
(9, 'P0100002', '市人民医院', 1, '医院', 1, NOW()),
(10, 'P0200001', '鱼峰街道办', 2, '居民区', 1, NOW());

-- 插入蚊密度监测数据 (2025年1-2月)
INSERT INTO vector_monitoring (id, vector_type, monitor_method, monitor_date, point_id, district_id, year, month, deploy_count, duration, female_count, density, weather, create_time, deleted) VALUES
(1, 'MOSQUITO', '诱蚊灯法', '2025-01-15', 1, 6, 2025, 1, 20, 2.0, 18, 0.45, '晴', NOW(), 0),
(2, 'MOSQUITO', '诱蚊灯法', '2025-01-20', 2, 6, 2025, 1, 20, 2.0, 22, 0.55, '多云', NOW(), 0),
(3, 'MOSQUITO', '诱蚊灯法', '2025-01-25', 5, 3, 2025, 1, 20, 2.0, 15, 0.38, '晴', NOW(), 0),
(4, 'MOSQUITO', '诱蚊灯法', '2025-01-28', 6, 3, 2025, 1, 20, 2.0, 25, 0.63, '阴', NOW(), 0),
(5, 'MOSQUITO', '诱蚊灯法', '2025-02-05', 1, 6, 2025, 2, 20, 2.0, 21, 0.53, '晴', NOW(), 0),
(6, 'MOSQUITO', '诱蚊灯法', '2025-02-10', 2, 6, 2025, 2, 20, 2.0, 26, 0.65, '多云', NOW(), 0),
(7, 'MOSQUITO', '诱蚊灯法', '2025-02-15', 5, 3, 2025, 2, 20, 2.0, 19, 0.48, '晴', NOW(), 0),
(8, 'MOSQUITO', '诱蚊灯法', '2025-02-20', 6, 3, 2025, 2, 20, 2.0, 28, 0.70, '晴', NOW(), 0),
(9, 'MOSQUITO', '诱蚊灯法', '2025-02-22', 8, 1, 2025, 2, 20, 2.0, 20, 0.50, '晴', NOW(), 0),
(10, 'MOSQUITO', '诱蚊灯法', '2025-02-24', 9, 1, 2025, 2, 20, 2.0, 24, 0.60, '多云', NOW(), 0);

-- 插入蝇密度监测数据
INSERT INTO vector_monitoring (id, vector_type, monitor_method, monitor_date, point_id, district_id, year, month, deploy_count, duration, catch_count, density, weather, create_time, deleted) VALUES
(11, 'FLY', '捕蝇笼法', '2025-01-10', 3, 6, 2025, 1, 5, 1.0, 8, 1.60, '晴', NOW(), 0),
(12, 'FLY', '捕蝇笼法', '2025-01-15', 7, 3, 2025, 1, 5, 1.0, 12, 2.40, '晴', NOW(), 0),
(13, 'FLY', '捕蝇笼法', '2025-02-05', 3, 6, 2025, 2, 5, 1.0, 10, 2.00, '多云', NOW(), 0),
(14, 'FLY', '捕蝇笼法', '2025-02-12', 7, 3, 2025, 2, 5, 1.0, 14, 2.80, '晴', NOW(), 0),
(15, 'FLY', '捕蝇笼法', '2025-02-18', 10, 2, 2025, 2, 5, 1.0, 11, 2.20, '晴', NOW(), 0);

-- 插入蟑密度监测数据
INSERT INTO vector_monitoring (id, vector_type, monitor_method, monitor_date, point_id, district_id, year, month, deploy_count, recovery_count, catch_count, density, weather, create_time, deleted) VALUES
(16, 'COCKROACH', '粘蟑法', '2025-01-20', 4, 6, 2025, 1, 20, 18, 6, 0.33, '晴', NOW(), 0),
(17, 'COCKROACH', '粘蟑法', '2025-02-08', 4, 6, 2025, 2, 20, 19, 7, 0.37, '多云', NOW(), 0),
(18, 'COCKROACH', '粘蟑法', '2025-02-15', 5, 3, 2025, 2, 20, 20, 8, 0.40, '晴', NOW(), 0);

-- 插入鼠密度监测数据
INSERT INTO vector_monitoring (id, vector_type, monitor_method, monitor_date, point_id, district_id, year, month, deploy_count, duration, catch_count, density, weather, create_time, deleted) VALUES
(19, 'RODENT', '粘捕法', '2025-01-25', 3, 6, 2025, 1, 50, 3.0, 2, 0.04, '晴', NOW(), 0),
(20, 'RODENT', '粘捕法', '2025-02-10', 3, 6, 2025, 2, 50, 3.0, 3, 0.06, '晴', NOW(), 0);

-- 插入一些2024年的历史数据
INSERT INTO vector_monitoring (id, vector_type, monitor_method, monitor_date, point_id, district_id, year, month, deploy_count, duration, female_count, density, weather, create_time, deleted) VALUES
(21, 'MOSQUITO', '诱蚊灯法', '2024-06-15', 1, 6, 2024, 6, 20, 2.0, 45, 1.13, '晴', NOW(), 0),
(22, 'MOSQUITO', '诱蚊灯法', '2024-07-20', 1, 6, 2024, 7, 20, 2.0, 52, 1.30, '晴', NOW(), 0),
(23, 'MOSQUITO', '诱蚊灯法', '2024-08-10', 1, 6, 2024, 8, 20, 2.0, 48, 1.20, '多云', NOW(), 0),
(24, 'MOSQUITO', '诱蚊灯法', '2024-09-05', 1, 6, 2024, 9, 20, 2.0, 35, 0.88, '晴', NOW(), 0);

SELECT '测试数据插入完成！' AS result;