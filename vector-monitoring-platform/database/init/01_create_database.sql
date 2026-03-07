-- 病媒监测平台数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS vector_monitoring 
    DEFAULT CHARACTER SET utf8mb4 
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE vector_monitoring;

-- 用户表
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    avatar VARCHAR(200) COMMENT '头像',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
    role VARCHAR(20) DEFAULT 'USER' COMMENT '角色: ADMIN-管理员 USER-普通用户',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-未删除 1-已删除',
    UNIQUE KEY uk_username (username)
) COMMENT '系统用户表';

-- 区县表
CREATE TABLE sys_district (
    id BIGINT PRIMARY KEY COMMENT '区县ID',
    code VARCHAR(20) NOT NULL COMMENT '区县编码',
    name VARCHAR(50) NOT NULL COMMENT '区县名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父级ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_code (code)
) COMMENT '区县表';

-- 监测点表
CREATE TABLE monitoring_point (
    id BIGINT PRIMARY KEY COMMENT '监测点ID',
    point_code VARCHAR(50) NOT NULL COMMENT '监测点编码',
    point_name VARCHAR(200) NOT NULL COMMENT '监测点名称',
    district_id BIGINT NOT NULL COMMENT '区县ID',
    address VARCHAR(500) COMMENT '详细地址',
    env_type VARCHAR(50) COMMENT '环境类型: 医院/学校/居民区/农村/农贸市场等',
    longitude DECIMAL(10, 7) COMMENT '经度',
    latitude DECIMAL(10, 7) COMMENT '纬度',
    point_type VARCHAR(20) COMMENT '监测点类型',
    contact_name VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-停用 1-启用',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_point_code (point_code),
    KEY idx_district_id (district_id)
) COMMENT '监测点表';

-- 四害监测数据表（通用）
CREATE TABLE vector_monitoring (
    id BIGINT PRIMARY KEY COMMENT '监测记录ID',
    vector_type VARCHAR(20) NOT NULL COMMENT '病媒类型: MOSQUITO-蚊 FLY-蝇 COCKROACH-蟑 RODENT-鼠 TICK-蜱',
    monitor_method VARCHAR(50) NOT NULL COMMENT '监测方法',
    monitor_date DATE NOT NULL COMMENT '监测日期',
    point_id BIGINT NOT NULL COMMENT '监测点ID',
    district_id BIGINT NOT NULL COMMENT '区县ID',
    year INT COMMENT '年份',
    month INT COMMENT '月份',
    
    -- 通用监测数据字段
    deploy_count INT COMMENT '布放数量（灯/笼/张等）',
    duration DECIMAL(10, 2) COMMENT '监测时长（天/夜/小时）',
    recovery_count INT COMMENT '回收数量',
    catch_count INT COMMENT '捕获数量',
    density DECIMAL(10, 4) COMMENT '密度值',
    
    -- 蚊密度特有字段
    female_count INT COMMENT '雌蚊数量',
    mosquito_species VARCHAR(200) COMMENT '蚊种组成JSON',
    
    -- 布雷图特有字段
    household_count INT COMMENT '调查户数',
    water_count INT COMMENT '积水容器数',
    positive_count INT COMMENT '阳性容器数',
    breteau_index DECIMAL(10, 2) COMMENT '布雷图指数',
    
    -- 叠帐法特有字段
    tent_count INT COMMENT '叠帐数量',
    
    -- 诱卵器特有字段
    trap_count INT COMMENT '诱卵器数量',
    
    -- 蜱虫特有字段
    host_type VARCHAR(50) COMMENT '宿主类型',
    tick_count INT COMMENT '蜱虫数量',
    tick_species VARCHAR(200) COMMENT '蜱虫种类',
    
    -- 通用字段
    weather VARCHAR(100) COMMENT '天气情况',
    temperature DECIMAL(5, 2) COMMENT '温度',
    humidity DECIMAL(5, 2) COMMENT '湿度',
    photos JSON COMMENT '现场照片JSON数组',
    remark TEXT COMMENT '备注',
    create_by BIGINT COMMENT '创建人ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_by BIGINT COMMENT '更新人ID',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    KEY idx_vector_type (vector_type),
    KEY idx_monitor_date (monitor_date),
    KEY idx_point_id (point_id),
    KEY idx_district_id (district_id),
    KEY idx_year_month (year, month)
) COMMENT '病媒监测数据表';

-- 报告模板表
CREATE TABLE report_template (
    id BIGINT PRIMARY KEY COMMENT '模板ID',
    template_name VARCHAR(200) NOT NULL COMMENT '模板名称',
    template_type VARCHAR(50) NOT NULL COMMENT '模板类型: MONTH-月报 QUARTER-季报 YEAR-年报 SPECIAL-专项',
    content TEXT COMMENT '模板内容HTML',
    parameters JSON COMMENT '模板参数配置',
    status TINYINT DEFAULT 1,
    create_by BIGINT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_by BIGINT,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) COMMENT '报告模板表';

-- 生成的报告表
CREATE TABLE generated_report (
    id BIGINT PRIMARY KEY COMMENT '报告ID',
    template_id BIGINT COMMENT '模板ID',
    report_title VARCHAR(500) NOT NULL COMMENT '报告标题',
    report_type VARCHAR(50) COMMENT '报告类型',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    content TEXT COMMENT '报告内容',
    file_path VARCHAR(500) COMMENT '文件路径',
    file_size BIGINT COMMENT '文件大小',
    download_count INT DEFAULT 0 COMMENT '下载次数',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_by BIGINT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    KEY idx_template_id (template_id),
    KEY idx_create_time (create_time)
) COMMENT '生成的报告表';

-- 操作日志表
CREATE TABLE operation_log (
    id BIGINT PRIMARY KEY COMMENT '日志ID',
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    operation VARCHAR(100) COMMENT '操作描述',
    method VARCHAR(200) COMMENT '请求方法',
    params TEXT COMMENT '请求参数',
    ip VARCHAR(50) COMMENT 'IP地址',
    spend_time INT COMMENT '耗时(ms)',
    status TINYINT COMMENT '状态: 0-失败 1-成功',
    error_msg TEXT COMMENT '错误信息',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY idx_user_id (user_id),
    KEY idx_create_time (create_time)
) COMMENT '操作日志表';

-- 初始化数据

-- 插入默认管理员
INSERT INTO sys_user (id, username, password, real_name, role, status) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '系统管理员', 'ADMIN', 1);

-- 插入柳州区县数据
INSERT INTO sys_district (id, code, name, sort_order) VALUES
(1, '450202', '城中区', 1),
(2, '450203', '鱼峰区', 2),
(3, '450204', '柳南区', 3),
(4, '450205', '柳北区', 4),
(5, '450206', '柳江区', 5),
(6, '450222', '柳城县', 6),
(7, '450223', '鹿寨县', 7),
(8, '450224', '融安县', 8),
(9, '450225', '融水县', 9),
(10, '450226', '三江县', 10);