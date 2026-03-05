// 传染病消毒方案数据库
// 根据《中华人民共和国传染病防治法》（2025年修订）
        const diseaseDB = {
            "甲类": {
                "鼠疫": {
                    pathogen: "鼠疫耶尔森菌",
                    transmission: "蚤叮咬、呼吸道飞沫、接触传播",
                    level: "最高",
                    environment: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    excreta: { type: "含氯消毒剂", conc: "20000", unit: "mg/L", time: "120分钟" },
                    vomit: { type: "含氯消毒剂", conc: "20000", unit: "mg/L", time: "120分钟" },
                    corpse: { method: "立即火化", note: "用浸有5000-10000mg/L含氯消毒剂或过氧乙酸溶液的纱布堵塞口、鼻、耳、肛门、阴道等" },
                    vehicle: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    personal: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    flea: { type: "杀虫/灭鼠", method: "灭鼠灭蚤", note: "同时进行灭鼠、灭蚤处理，使用杀虫剂喷洒鼠洞和孳生地，控制鼠密度" },
                    note: "终末消毒必须在专业人员指导下进行，消毒人员需三级防护。特别注意：鼠疫传播媒介为鼠蚤，必须同步进行灭鼠、灭蚤处理，控制传染源"
                },
                "霍乱": {
                    pathogen: "霍乱弧菌",
                    transmission: "粪-口途径、污染的水和食物",
                    level: "最高",
                    environment: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    excreta: { type: "含氯消毒剂", conc: "20000", unit: "mg/L", time: "120分钟" },
                    vomit: { type: "含氯消毒剂", conc: "20000", unit: "mg/L", time: "120分钟" },
                    water: { type: "含氯消毒剂", conc: "10", unit: "mg/L", time: "60分钟" },
                    food: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    corpse: { method: "立即火化", note: "用浸有5000-10000mg/L含氯消毒剂或过氧乙酸溶液的纱布堵塞" },
                    note: "患者排泄物、呕吐物必须随时消毒，消毒后排放"
                }
            },
            "乙类": {
                "新型冠状病毒感染": {
                    pathogen: "SARS-CoV-2",
                    transmission: "呼吸道飞沫、密切接触、气溶胶传播",
                    level: "高",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    air: { type: "过氧化氢", conc: "3", unit: "%", method: "气溶胶喷雾", time: "60分钟" },
                    fabric: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    corpse: { method: "火化", note: "用浸有5000-10000mg/L含氯消毒剂或过氧乙酸溶液的纱布堵塞" },
                    note: "重点消毒高频接触表面，通风每天3次，每次30分钟"
                },
                "传染性非典型肺炎": {
                    pathogen: "SARS冠状病毒",
                    transmission: "呼吸道飞沫、密切接触",
                    level: "最高（按甲类管理）",
                    environment: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    air: { type: "过氧乙酸", conc: "0.5", unit: "%", method: "气溶胶喷雾", time: "60分钟" },
                    fabric: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    excreta: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    corpse: { method: "立即火化", note: "用浸有5000-10000mg/L含氯消毒剂或过氧乙酸溶液的纱布堵塞" },
                    note: "按甲类传染病管理，严格终末消毒"
                },
                "炭疽(肺炭疽)": {
                    pathogen: "炭疽芽孢杆菌",
                    transmission: "接触、呼吸道、消化道",
                    level: "最高（按甲类管理）",
                    environment: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    spore: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "240分钟", note: "芽孢需高浓度长时间" },
                    fabric: { type: "焚烧", note: "污染织物建议焚烧处理" },
                    corpse: { method: "火化", note: "禁止尸检，密闭运输至火化场" },
                    note: "芽孢抵抗力极强，普通消毒难以杀灭，需专业处理"
                },
                "艾滋病": {
                    pathogen: "HIV病毒",
                    transmission: "血液、性接触、母婴传播",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    blood: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    instrument: { type: "戊二醛", conc: "2", unit: "%", time: "30-60分钟" },
                    note: "HIV对消毒剂敏感，常规消毒即可，避免直接接触血液体液"
                },
                "病毒性肝炎": {
                    pathogen: "甲/乙/丙/丁/戊型肝炎病毒",
                    transmission: "粪-口（甲、戊）、血液体液（乙、丙、丁）",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "5000-10000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    blood: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    food: { type: "煮沸", method: "煮沸15分钟", note: "餐具首选煮沸消毒" },
                    note: "乙肝病毒抵抗力较强，需保证消毒浓度和作用时间"
                },
                "脊髓灰质炎": {
                    pathogen: "脊髓灰质炎病毒",
                    transmission: "粪-口途径",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    toy: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    note: "病毒抵抗力中等，注意粪便、呕吐物和污染物消毒"
                },
                "麻疹": {
                    pathogen: "麻疹病毒",
                    transmission: "呼吸道飞沫、接触传播",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", method: "浸泡消毒" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "病毒抵抗力弱，常规消毒即可，空气消毒可用二氧化氯"
                },
                "人感染高致病性禽流感": {
                    pathogen: "高致病性禽流感病毒(H5N1/H7N9等)",
                    transmission: "呼吸道飞沫、接触感染禽类/环境",
                    level: "最高（按甲类管理）",
                    environment: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    air: { type: "过氧乙酸", conc: "0.5", unit: "%", method: "气溶胶喷雾", time: "60分钟" },
                    fabric: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    excreta: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    corpse: { method: "立即火化", note: "用浸有5000-10000mg/L含氯消毒剂或过氧乙酸溶液的纱布堵塞" },
                    note: "按甲类传染病管理，严格终末消毒，密切接触者医学观察"
                },
                "流行性出血热": {
                    pathogen: "汉坦病毒",
                    transmission: "鼠类排泄物、呼吸道、消化道",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    rodent: { type: "鼠类控制", method: "灭鼠", note: "同时进行鼠密度监测" },
                    excreta: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    note: "重点防鼠灭鼠，污染场所彻底消毒"
                },
                "狂犬病": {
                    pathogen: "狂犬病毒",
                    transmission: "动物咬伤、抓伤",
                    level: "高",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    wound: { type: "肥皂水", method: "肥皂水冲洗", time: "15分钟", note: "再用碘伏消毒" },
                    fabric: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", method: "浸泡消毒" },
                    animal: { type: "焚烧", method: "焚烧或深埋", note: "病兽尸体深埋2米以下" },
                    note: "伤口处理最关键，尽快接种疫苗和免疫球蛋白，污染织物需消毒处理"
                },
                "流行性乙型脑炎": {
                    pathogen: "乙脑病毒",
                    transmission: "蚊媒传播",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    mosquito: { type: "蚊媒控制", method: "灭蚊", note: "清除积水，使用杀虫剂" },
                    note: "重点防蚊灭蚊，病毒抵抗力弱"
                },
                "登革热": {
                    pathogen: "登革病毒",
                    transmission: "伊蚊叮咬",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    mosquito: { type: "伊蚊控制", method: "清除积水容器", note: "翻盆倒罐，消灭孳生地" },
                    note: "无特效疫苗，以灭蚊为主"
                },
                "猴痘": {
                    pathogen: "猴痘病毒",
                    transmission: "密切接触、飞沫、污染物",
                    level: "高",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    fabric: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    skin: { type: "碘伏", conc: "0.5", unit: "%", method: "皮肤消毒" },
                    note: "病毒抵抗力较强，消毒浓度要高，注意个人防护"
                },
                "肺结核": {
                    pathogen: "结核分枝杆菌",
                    transmission: "呼吸道飞沫",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟" },
                    air: { type: "紫外线", method: "紫外线照射", time: "30-60分钟" },
                    sputum: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    note: "结核杆菌抵抗力强，需延长消毒时间"
                },
                "伤寒和副伤寒": {
                    pathogen: "伤寒沙门菌、副伤寒沙门菌",
                    transmission: "粪-口途径、污染的水和食物",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "120分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "120分钟" },
                    fly: { type: "灭蝇", method: "防蝇灭蝇", note: "做好防蝇灭蝇措施，防止机械性传播" },
                    water: { type: "煮沸", method: "煮沸", time: "5分钟" },
                    food: { type: "煮沸", method: "煮沸15分钟" },
                    note: "患者排泄物随时消毒，餐具专用，做好防蝇灭蝇措施"
                },
                "细菌性和阿米巴性痢疾": {
                    pathogen: "志贺菌/溶组织内阿米巴",
                    transmission: "粪-口途径、污染的水和食物",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "120分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "120分钟" },
                    fly: { type: "灭蝇", method: "防蝇灭蝇", note: "做好防蝇灭蝇措施，防止机械性传播" },
                    water: { type: "煮沸", method: "煮沸", time: "5分钟" },
                    food: { type: "煮沸", method: "煮沸15分钟" },
                    note: "患者排泄物、呕吐物随时消毒，注意水源和食品卫生，做好防蝇灭蝇措施"
                },
                "流行性脑脊髓膜炎": {
                    pathogen: "脑膜炎奈瑟菌",
                    transmission: "呼吸道飞沫",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "通风", method: "开窗通风", time: "每天3次" },
                    fabric: { type: "曝晒", method: "日光曝晒", time: "4小时" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "细菌抵抗力弱，常规消毒即可"
                },
                "百日咳": {
                    pathogen: "百日咳鲍特菌",
                    transmission: "呼吸道飞沫",
                    level: "低",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "通风", method: "通风", note: "保持空气流通" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "常规消毒即可"
                },
                "白喉": {
                    pathogen: "白喉棒状杆菌",
                    transmission: "呼吸道飞沫、接触",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "注意呼吸道隔离，空气消毒可用二氧化氯"
                },
                "猩红热": {
                    pathogen: "A组链球菌",
                    transmission: "呼吸道飞沫、接触",
                    level: "低",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "常规消毒，空气消毒可用二氧化氯"
                },
                "布鲁氏菌病": {
                    pathogen: "布鲁氏菌",
                    transmission: "接触感染动物、食用未煮熟肉制品",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    animal: { type: "焚烧", method: "深埋或焚烧", note: "病畜无害化处理" },
                    note: "重点动物检疫，生熟分开"
                },
                "淋病、梅毒": {
                    pathogen: "淋病奈瑟菌、梅毒螺旋体",
                    transmission: "性接触、母婴",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    fabric: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", method: "浸泡消毒" },
                    instrument: { type: "高压蒸汽", method: "121℃高压蒸汽", time: "15分钟" },
                    note: "螺旋体抵抗力极弱，常规消毒即可，污染织物需消毒处理"
                },
                "钩端螺旋体病": {
                    pathogen: "钩端螺旋体",
                    transmission: "接触疫水、皮肤黏膜",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    water: { type: "含氯消毒剂", conc: "5", unit: "mg/L", time: "30分钟" },
                    note: "重点控制鼠类和猪"
                },
                "疟疾": {
                    pathogen: "疟原虫",
                    transmission: "按蚊叮咬",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    mosquito: { type: "灭蚊", method: "灭蚊", note: "防蚊灭蚊为主" },
                    note: "无直接人传人，无需特殊消毒"
                }
            },
            "丙类": {
                "流行性感冒": {
                    pathogen: "流感病毒",
                    transmission: "呼吸道飞沫、接触",
                    level: "低",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "蒸煮", method: "蒸煮", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    note: "常规消毒，重点通风，空气消毒可用二氧化氯"
                },
                "流行性腮腺炎": {
                    pathogen: "腮腺炎病毒",
                    transmission: "呼吸道飞沫",
                    level: "低",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "蒸煮", method: "蒸煮", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "常规消毒，空气消毒可用二氧化氯"
                },
                "风疹": {
                    pathogen: "风疹病毒",
                    transmission: "呼吸道飞沫",
                    level: "低",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "蒸煮", method: "蒸煮", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "30分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "30分钟" },
                    note: "常规消毒，空气消毒可用二氧化氯"
                },
                "手足口病": {
                    pathogen: "肠道病毒",
                    transmission: "粪-口、呼吸道、接触",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    air: { type: "二氧化氯", conc: "500", unit: "mg/L", method: "气溶胶喷雾", time: "30分钟" },
                    fabric: { type: "蒸煮", method: "蒸煮", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    toy: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    hand: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "1分钟" },
                    note: "儿童玩具、餐具重点消毒，注意手卫生，患者排泄物和呕吐物需严格消毒"
                },
                "感染性腹泻病": {
                    pathogen: "诺如病毒、轮状病毒等",
                    transmission: "粪-口途径",
                    level: "中",
                    environment: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟" },
                    fabric: { type: "蒸煮", method: "蒸煮", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "10000", unit: "mg/L", time: "60分钟" },
                    food: { type: "煮沸", method: "煮沸15分钟" },
                    note: "诺如病毒抵抗力强，需高浓度含氯消毒剂"
                },
                "急性出血性结膜炎": {
                    pathogen: "肠道病毒70型、柯萨奇病毒",
                    transmission: "接触传播",
                    level: "低",
                    environment: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟" },
                    hand: { type: "75%乙醇", method: "手消毒" },
                    fabric: { type: "蒸煮", method: "蒸煮", time: "30分钟" },
                    excreta: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟" },
                    vomit: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟" },
                    note: "注意手卫生，个人用品专用，患者排泄物和呕吐物需消毒处理"
                }
            }
        };
