# 病媒监测平台项目结构

```
vector-monitoring-platform/
├── frontend/                    # 前端项目 (Vue 3)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 公共组件
│   │   │   ├── Layout/         # 布局组件
│   │   │   ├── Charts/         # 图表组件
│   │   │   └── Forms/          # 表单组件
│   │   ├── views/              # 页面视图
│   │   │   ├── Dashboard/      # 数据看板
│   │   │   ├── DataEntry/      # 数据录入
│   │   │   ├── Analysis/       # 数据分析
│   │   │   ├── Reports/        # 报告中心
│   │   │   └── Settings/       # 系统设置
│   │   ├── router/             # 路由配置
│   │   ├── store/              # Pinia状态管理
│   │   ├── api/                # API接口
│   │   ├── utils/              # 工具函数
│   │   └── styles/             # 全局样式
│   ├── package.json
│   └── vite.config.js
├── backend/                     # 后端项目 (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/cdc/vector/
│   │   │   │       ├── controller/    # 控制器
│   │   │   │       ├── service/       # 业务层
│   │   │   │       ├── mapper/        # 数据访问
│   │   │   │       ├── entity/        # 实体类
│   │   │   │       ├── dto/           # 数据传输对象
│   │   │   │       ├── config/        # 配置类
│   │   │   │       └── utils/         # 工具类
│   │   │   └── resources/
│   │   │       ├── mapper/            # MyBatis映射
│   │   │       ├── application.yml
│   │   │       └── application-dev.yml
│   │   └── test/
│   └── pom.xml
├── database/                    # 数据库脚本
│   ├── init/
│   │   ├── 01_create_database.sql
│   │   ├── 02_create_tables.sql
│   │   └── 03_init_data.sql
│   └── migrations/
└── docs/                        # 文档
    ├── api/                     # API文档
    ├── design/                  # 设计文档
    └── deploy/                  # 部署文档
```

## 技术栈

### 前端
- Vue 3 + Composition API
- Vite 构建工具
- Vue Router 4
- Pinia 状态管理
- Ant Design Vue 组件库
- ECharts 图表库
- Axios HTTP请求

### 后端
- Spring Boot 3.x
- Spring Security (JWT认证)
- MyBatis Plus (ORM)
- MySQL 8.0
- Redis (缓存)
- Lombok
- Knife4j (API文档)

### 开发工具
- VSCode (前端)
- IntelliJ IDEA (后端)
- Navicat (数据库)
- Git版本控制

## 开发计划

### 第一周：基础架构
- [ ] 前端项目初始化
- [ ] 后端项目初始化
- [ ] 数据库设计
- [ ] 登录认证模块

### 第二周：核心功能
- [ ] 数据看板
- [ ] 数据录入（4种基础类型）
- [ ] AI识别集成

### 第三周：扩展功能
- [ ] 数据分析
- [ ] 报告生成
- [ ] 移动端适配

### 第四周：测试优化
- [ ] 功能测试
- [ ] 性能优化
- [ ] 部署上线
