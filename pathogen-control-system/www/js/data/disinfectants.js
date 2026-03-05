/**
 * 消毒剂数据库
 * unitMode: 'chlorine' = 含氯模式(%->mg/L), 'peroxide' = 过氧化物模式(%%), 'other' = 直接百分比
 */
const disinfectantDB = {
    "含氯消毒剂": {
        "84消毒液": { conc: 5.0, type: "液体", unitMode: "chlorine" },
        "漂白粉": { conc: 25.0, type: "固体", unitMode: "chlorine" },
        "次氯酸钠溶液": { conc: 10.0, type: "液体", unitMode: "chlorine" },
        "二氯异氰尿酸钠": { conc: 60.0, type: "固体", unitMode: "chlorine" },
        "三氯异氰尿酸": { conc: 90.0, type: "固体", unitMode: "chlorine" },
        "氯胺T": { conc: 25.0, type: "固体", unitMode: "chlorine" }
    },
    "醇类": {
        "95%乙醇": { conc: 95.0, type: "液体", unitMode: "percent" },
        "75%乙醇": { conc: 75.0, type: "液体", unitMode: "percent" }
    },
    "氧化物类": {
        "二氧化氯(稳定型)": { conc: 2.0, type: "液体", unitMode: "clo2_mgl" },
        "二氧化氯(泡腾片)": { conc: 10.0, type: "固体", unitMode: "clo2_mgl" }
    },
    "过氧化物类": {
        "过氧化氢(双氧水)": { conc: 30.0, type: "液体", unitMode: "percent" },
        "过氧乙酸": { conc: 15.0, type: "液体", unitMode: "percent" }
    },
    "季铵盐类": {
        "苯扎溴铵(新洁尔灭)": { conc: 5.0, type: "液体", unitMode: "chlorine" },
        "双链季铵盐": { conc: 10.0, type: "液体", unitMode: "chlorine" }
    },
    "其他": {
        "碘伏": { conc: 0.5, type: "液体", unitMode: "percent" },
        "碘酊": { conc: 2.0, type: "液体", unitMode: "percent" },
        "来苏儿(煤酚皂)": { conc: 50.0, type: "液体", unitMode: "percent" },
        "戊二醛": { conc: 2.0, type: "液体", unitMode: "percent" }
    }
};
