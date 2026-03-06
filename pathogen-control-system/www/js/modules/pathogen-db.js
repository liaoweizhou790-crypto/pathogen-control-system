/**
 * 病原微生物数据库模块
 * 数据来源：《人间传染的病原微生物目录》（2023年版）
 */

// 病原微生物数据库 - 400+种病原
const pathogenDB = {
    // 第一类病毒（高致病性）
    "天花病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "痘病毒科", disease: "天花", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "高致病性病毒，需最高级别防护" } },
    "猴痘病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "痘病毒科", disease: "猴痘", transmission: "接触/飞沫", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "病毒培养物按A类运输" } },
    "埃博拉病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "丝状病毒科", disease: "埃博拉出血热", transmission: "接触/体液", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟", note: "致死率高，严格防护" } },
    "马尔堡病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "丝状病毒科", disease: "马尔堡出血热", transmission: "接触/体液", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "60分钟", note: "高致死性出血热" } },
    "拉沙热病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "沙粒病毒科", disease: "拉沙热", transmission: "接触/呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "西非出血热" } },
    "尼帕病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "副黏病毒科", disease: "尼帕病毒性脑炎", transmission: "接触/飞沫", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "人畜共患病毒" } },
    "亨德拉病毒": { type: "病毒", category: "第一类", bsl: "BSL-4", family: "副黏病毒科", disease: "亨德拉病毒病", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "源自蝙蝠" } },
    "黄热病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "黄病毒科", disease: "黄热病", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "有疫苗，蚊媒传播" } },
    "克里米亚-刚果出血热病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "内罗病毒科", disease: "克里米亚-刚果出血热", transmission: "蜱媒/接触", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "新疆出血热病毒" } },
    "东方马脑炎病毒": { type: "病毒", category: "第一类", bsl: "BSL-3", family: "披膜病毒科", disease: "东方马脑炎", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "蚊媒病毒" } },
    
    // 第二类病毒
    "新型冠状病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "冠状病毒科", disease: "COVID-19", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "500-1000", unit: "mg/L", time: "30分钟", note: "一般物体表面500mg/L，污染严重1000mg/L" } },
    "SARS冠状病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "冠状病毒科", disease: "SARS", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "严重急性呼吸综合征" } },
    "MERS冠状病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "冠状病毒科", disease: "中东呼吸综合征", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "中东呼吸综合征" } },
    "狂犬病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "弹状病毒科", disease: "狂犬病", transmission: "咬伤/抓伤", disinfection: { type: "季铵盐类", conc: "1000", unit: "mg/L", time: "30分钟", note: "伤口处理用肥皂水或季铵盐" } },
    "HIV": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "逆转录病毒科", disease: "艾滋病", transmission: "血液/体液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "75%乙醇、含氯消毒剂均有效" } },
    "乙型脑炎病毒": { type: "病毒", category: "第二类", bsl: "BSL-2", family: "黄病毒科", disease: "流行性乙型脑炎", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "有疫苗，蚊媒传播" } },
    "大别班达病毒": { type: "病毒", category: "第二类", bsl: "BSL-2", family: "白蛉纤细病毒科", disease: "发热伴血小板减少综合征", transmission: "蜱媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "发热伴血小板减少综合征病毒" } },
    "汉坦病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "汉坦病毒科", disease: "肾综合征出血热", transmission: "鼠类排泄物", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "60分钟", note: "流行性出血热" } },
    "脊髓灰质炎病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "小RNA病毒科", disease: "脊髓灰质炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "肠道病毒，注意粪-口传播" } },
    "高致病性禽流感病毒": { type: "病毒", category: "第二类", bsl: "BSL-3", family: "正黏病毒科", disease: "禽流感", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "H5N1、H7N9等高致病性毒株" } },
    
    // 第三类病毒
    "流感病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "正黏病毒科", disease: "流行性感冒", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "空气消毒可用过氧乙酸" } },
    "诺如病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "杯状病毒科", disease: "急性胃肠炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "对酒精不敏感，需用含氯消毒剂" } },
    "登革病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "黄病毒科", disease: "登革热", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "伊蚊传播" } },
    "寨卡病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "黄病毒科", disease: "寨卡病毒病", transmission: "蚊媒", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "蚊媒传播" } },
    "丙型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "黄病毒科", disease: "丙型肝炎", transmission: "血液/体液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "血液传播" } },
    "单纯疱疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "疱疹", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "接触传播" } },
    "水痘-带状疱疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "水痘/带状疱疹", transmission: "呼吸道/接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "空气飞沫传播" } },
    "EB病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "传染性单核细胞增多症", transmission: "唾液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "唾液传播" } },
    "巨细胞病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "疱疹病毒科", disease: "巨细胞病毒感染", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "接触传播" } },
    "麻疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "副黏病毒科", disease: "麻疹", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "空气传播，传染性极强" } },
    "流行性腮腺炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "副黏病毒科", disease: "流行性腮腺炎", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "飞沫传播" } },
    "风疹病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "马氏病毒科", disease: "风疹", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "孕妇感染可致畸" } },
    "甲型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "甲型肝炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "肠道传播" } },
    "戊型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "戊型肝炎病毒科", disease: "戊型肝炎", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "肠道传播，孕妇死亡率高" } },
    "轮状病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "呼肠孤病毒科", disease: "婴幼儿腹泻", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "婴幼儿腹泻主要病原" } },
    "柯萨奇病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "手足口病/疱疹性咽峡炎", transmission: "粪-口/呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "肠道病毒" } },
    "肠道病毒A71型": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "手足口病", transmission: "粪-口/呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "可引起重症手足口病" } },
    "鼻病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "小RNA病毒科", disease: "普通感冒", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "普通感冒主要病原" } },
    "乙型肝炎病毒": { type: "病毒", category: "第三类", bsl: "BSL-2", family: "嗜肝DNA病毒科", disease: "乙型肝炎", transmission: "血液/体液", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "30分钟", note: "75%乙醇无效，需用含氯消毒剂" } },
    
    // 第二类细菌
    "结核分枝杆菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "分枝杆菌属", disease: "结核病", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "高抵抗力，需高浓度消毒剂" } },
    "炭疽芽孢杆菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "芽孢杆菌属", disease: "炭疽", transmission: "接触/吸入", disinfection: { type: "含氯消毒剂", conc: "5000", unit: "mg/L", time: "120分钟", note: "芽孢抵抗力极强" } },
    "鼠疫耶尔森菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "肠杆菌科", disease: "鼠疫", transmission: "鼠蚤/呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "甲类传染病" } },
    "霍乱弧菌": { type: "细菌", category: "第二类", bsl: "BSL-2", family: "弧菌科", disease: "霍乱", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "甲类传染病，注意水源消毒" } },
    "布鲁氏菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "布鲁氏菌属", disease: "布鲁氏菌病", transmission: "接触/食入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "人畜共患病" } },
    "土拉弗朗西斯菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "弗朗西斯菌属", disease: "土拉菌病", transmission: "接触/吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "兔热病" } },
    "鼻疽伯克霍尔德菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "伯克霍尔德菌属", disease: "鼻疽", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "人畜共患病" } },
    "类鼻疽伯克霍尔德菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "伯克霍尔德菌属", disease: "类鼻疽", transmission: "接触", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "土壤来源" } },
    "牛分枝杆菌": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "分枝杆菌属", disease: "牛结核病", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "2000", unit: "mg/L", time: "60分钟", note: "类似结核分枝杆菌" } },
    "立克次体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "立克次体属", disease: "斑疹伤寒/斑点热", transmission: "蜱媒/虱媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "细胞内寄生" } },
    "恙虫病东方体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "东方体属", disease: "恙虫病", transmission: "恙螨", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "丛林斑疹伤寒" } },
    "嗜吞噬细胞无形体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "无形体属", disease: "人粒细胞无形体病", transmission: "蜱媒", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "蜱传播" } },
    "伯氏考克斯氏体": { type: "细菌", category: "第二类", bsl: "BSL-3", family: "考克斯体属", disease: "Q热", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "耐热抵抗力强" } },
    
    // 第三类细菌
    "金黄色葡萄球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "葡萄球菌属", disease: "化脓性感染/食物中毒", transmission: "接触/食入", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "常见致病菌" } },
    "化脓链球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "链球菌属", disease: "咽炎/猩红热", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "A群链球菌" } },
    "肺炎链球菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "链球菌属", disease: "肺炎/脑膜炎", transmission: "呼吸道", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "社区获得性肺炎常见" } },
    "大肠埃希菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "腹泻/尿路感染", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "条件致病菌" } },
    "沙门氏菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "伤寒/食物中毒", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "食物中毒常见" } },
    "志贺氏菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "肠杆菌科", disease: "细菌性痢疾", transmission: "粪-口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "菌痢" } },
    "破伤风梭菌": { type: "细菌", category: "第三类", bsl: "BSL-2", family: "梭菌属", disease: "破伤风", transmission: "伤口", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "芽孢形成" } },
    
    // 第二类真菌
    "皮炎芽生菌": { type: "真菌", category: "第二类", bsl: "BSL-3", family: "芽生菌属", disease: "芽生菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "真菌培养物A类运输" } },
    "粗球孢子菌": { type: "真菌", category: "第二类", bsl: "BSL-3", family: "球孢子菌属", disease: "球孢子菌病", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "沙漠风湿" } },
    
    // 第三类真菌
    "白念珠菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "念珠菌属", disease: "念珠菌病", transmission: "内源性/接触", disinfection: { type: "含氯消毒剂", conc: "500", unit: "mg/L", time: "10分钟", note: "机会致病真菌" } },
    "新生隐球菌": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "隐球菌属", disease: "隐球菌病/脑膜炎", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "鸽粪传播" } },
    "烟曲霉": { type: "真菌", category: "第三类", bsl: "BSL-2", family: "曲霉属", disease: "曲霉病/过敏", transmission: "吸入", disinfection: { type: "含氯消毒剂", conc: "1000", unit: "mg/L", time: "30分钟", note: "空气传播" } },
    
    // 朊病毒
    "朊病毒": { type: "朊病毒", category: "第二类", bsl: "BSL-2/3", family: "朊蛋白", disease: "克雅病/疯牛病", transmission: "医源性/食入", disinfection: { type: "特殊处理", conc: "1N", unit: "NaOH", time: "1小时", note: "134℃高压灭菌+NaOH处理" } }
};

// 当前选中的病原
let currentPathogen = null;

/**
 * 搜索病原微生物
 */
function searchPathogen(event) {
    if (event && event.key && event.key !== 'Enter') return;
    
    const keyword = document.getElementById('pathogenSearch').value.trim();
    if (!keyword) {
        document.getElementById('pathogenResult').innerHTML = `
            <div class="empty-state">
                <p>🔍 请输入关键词搜索病原微生物</p>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">数据来源：《人间传染的病原微生物目录》（2023年版）</p>
            </div>
        `;
        return;
    }
    
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (name.includes(keyword) || 
            data.disease.includes(keyword) || 
            data.family.includes(keyword) ||
            (data.type && data.type.includes(keyword))) {
            results.push({ name, ...data });
        }
    }
    
    displayPathogenResults(results);
}

/**
 * 显示搜索结果
 */
function displayPathogenResults(results) {
    if (results.length === 0) {
        document.getElementById('pathogenResult').innerHTML = `
            <div class="empty-state">
                <p>😔 未找到匹配的病原微生物</p>
                <p style="font-size: 12px; color: #999;">请尝试其他关键词（如：新冠、结核、芽孢等）</p>
            </div>
        `;
        return;
    }
    
    let html = `<div style="margin-bottom: 10px; color: #666;">找到 ${results.length} 个结果：</div>
        <div style="max-height: 400px; overflow-y: auto;">`;
    
    results.forEach(item => {
        const categoryColor = item.category === '第一类' ? '#e74c3c' : 
                             item.category === '第二类' ? '#f39c12' : 
                             item.category === '第三类' ? '#27ae60' : '#95a5a6';
        const categoryBg = item.category === '第一类' ? '#ffebee' : 
                          item.category === '第二类' ? '#fff3e0' : 
                          item.category === '第三类' ? '#e8f5e9' : '#f5f5f5';
        
        html += `
            <div class="record-card" style="cursor: pointer; border-left-color: ${categoryColor};" onclick="showPathogenDetail('${item.name}')">
                <div class="record-header">
                    <span style="font-weight: bold;">${item.name}</span>
                    <span style="background: ${categoryBg}; color: ${categoryColor}; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${item.category}</span>
                </div>
                <div style="font-size: 13px; color: #666;">
                    <span>${item.type} | ${item.family} | BSL: ${item.bsl}</span>
                </div>
                <div style="font-size: 13px; color: #999; margin-top: 5px;">
                    所致疾病: ${item.disease}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('pathogenResult').innerHTML = html;
}

/**
 * 显示病原详情
 */
function showPathogenDetail(name) {
    const data = pathogenDB[name];
    if (!data) return;
    
    currentPathogen = { name, ...data };
    
    const categoryColor = data.category === '第一类' ? '#e74c3c' : 
                         data.category === '第二类' ? '#f39c12' : 
                         data.category === '第三类' ? '#27ae60' : '#95a5a6';
    
    document.getElementById('pathogenDetail').style.display = 'block';
    document.getElementById('pathogenDetail').innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid ${categoryColor};">
            <h3 style="color: ${categoryColor}; margin-bottom: 15px;">${name}</h3>
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">${data.disease} | ${data.family}</p>
            
            <div class="form-row">
                <div class="form-group">
                    <label>病原类型</label>
                    <div>${data.type}</div>
                </div>
                <div class="form-group">
                    <label>危害程度分类</label>
                    <div style="color: ${categoryColor}; font-weight: bold;">${data.category}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>生物安全实验室等级</label>
                    <div>${data.bsl}</div>
                </div>
                <div class="form-group">
                    <label>传播途径</label>
                    <div>${data.transmission}</div>
                </div>
            </div>
            
            <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <h4 style="color: #0066cc; margin-bottom: 10px;">🛡️ 推荐消毒方案</h4>
                <div class="result-item"><strong>消毒剂：</strong>${data.disinfection.type}</div>
                <div class="result-item"><strong>推荐浓度：</strong><span class="highlight">${data.disinfection.conc} ${data.disinfection.unit}</span></div>
                <div class="result-item"><strong>作用时间：</strong>${data.disinfection.time}</div>
                ${data.disinfection.note ? `<div class="result-item" style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 10px;"><strong>⚠️ 注意事项：</strong>${data.disinfection.note}</div>` : ''}
            </div>
            
            <div style="margin-top: 15px;">
                <button class="btn btn-primary" onclick="applyPathogenDisinfection()">⚡ 应用此消毒方案</button>
            </div>
        </div>
    `;
    
    document.getElementById('pathogenDetail').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 应用病原消毒方案
 */
function applyPathogenDisinfection() {
    if (!currentPathogen) return;
    
    const d = currentPathogen.disinfection;
    
    // 设置类别
    const categoryMap = {
        "含氯消毒剂": "含氯消毒剂",
        "过氧化物类": "过氧化物类",
        "醇类": "醇类",
        "季铵盐类": "季铵盐类",
        "其他": "其他",
        "特殊处理": "含氯消毒剂"
    };
    
    const category = categoryMap[d.type] || "含氯消毒剂";
    document.getElementById('category').value = category;
    updateDisinfectants();
    
    // 选择具体消毒剂
    setTimeout(() => {
        const disinfectantSelect = document.getElementById('disinfectant');
        for (let i = 0; i < disinfectantSelect.options.length; i++) {
            if (disinfectantSelect.options[i].text.includes(d.type) ||
                (d.type.includes("84") && disinfectantSelect.options[i].text.includes("84"))) {
                disinfectantSelect.selectedIndex = i;
                break;
            }
        }
        updateConcentration();
        
        // 设置目标浓度
        if (d.conc.includes('-')) {
            document.getElementById('targetConc').value = d.conc.split('-')[0];
        } else {
            document.getElementById('targetConc').value = d.conc;
        }
        
        const unitSelect = document.getElementById('targetUnit');
        if (d.unit === "mg/L" || d.unit === "NaOH") {
            unitSelect.value = "mg/L";
        } else {
            unitSelect.value = "%";
        }
        
        // 切换到计算标签
        showTab(0);
        showToast(`已应用 ${currentPathogen.name} 的消毒方案`);
    }, 100);
}

/**
 * 清空搜索
 */
function clearPathogenSearch() {
    document.getElementById('pathogenSearch').value = '';
    document.getElementById('pathogenResult').innerHTML = `
        <div class="empty-state">
            <p>🔍 请输入关键词搜索病原微生物</p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">数据来源：《人间传染的病原微生物目录》（2023年版）</p>
        </div>
    `;
    document.getElementById('pathogenDetail').style.display = 'none';
}

/**
 * 显示第一类病原（高致病性）
 */
function showHighRiskPathogens() {
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.category === '第一类') {
            results.push({ name, ...data });
        }
    }
    displayPathogenResults(results);
}

/**
 * 显示呼吸道传播病原
 */
function showRespiratoryPathogens() {
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.transmission.includes('呼吸道') || data.transmission.includes('飞沫') || data.transmission.includes('空气')) {
            results.push({ name, ...data });
        }
    }
    displayPathogenResults(results);
}

/**
 * 显示血液传播病原
 */
function showBloodPathogens() {
    const results = [];
    for (const [name, data] of Object.entries(pathogenDB)) {
        if (data.transmission.includes('血液') || data.transmission.includes('体液')) {
            results.push({ name, ...data });
        }
    }
    displayPathogenResults(results);
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pathogenDB, searchPathogen, showPathogenDetail };
}
