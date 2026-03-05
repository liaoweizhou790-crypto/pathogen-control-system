        const recommendations = {
            "环境表面消毒": {
                "含氯消毒剂": [
                    { name: "一般物体表面", value: 500, time: "10-30分钟" },
                    { name: "污染表面", value: 1000, time: "30分钟" },
                    { name: "传染病疫区", value: 2000, time: "60分钟" },
                    { name: "血液体液污染", value: 2000, time: "60分钟" }
                ],
                "醇类": [
                    { name: "一般物体表面", value: 75, time: "3-10分钟", unit: "%" }
                ],
                "过氧化物类": [
                    { name: "一般物体表面(过氧乙酸)", value: 0.5, time: "10-30分钟", unit: "%" },
                    { name: "一般物体表面(二氧化氯)", value: 100, time: "10-30分钟", unit: "mg/L" }
                ],
                "季铵盐类": [
                    { name: "一般物体表面", value: 1000, time: "10-15分钟" }
                ]
            },
            "餐饮具消毒": {
                "含氯消毒剂": [
                    { name: "一般消毒", value: 250, time: "20分钟" },
                    { name: "传染病消毒", value: 500, time: "30分钟" },
                    { name: "肝炎病毒污染", value: 1000, time: "30分钟" }
                ],
                "过氧化物类": [
                    { name: "浸泡消毒(过氧乙酸)", value: 0.2, time: "30分钟", unit: "%" },
                    { name: "浸泡消毒(二氧化氯)", value: 100, time: "10-20分钟", unit: "mg/L" }
                ]
            },
            "果蔬消毒": {
                "含氯消毒剂": [
                    { name: "一般清洗", value: 100, time: "10分钟" },
                    { name: "常规消毒", value: 200, time: "10分钟" },
                    { name: "疫源地果蔬", value: 500, time: "30分钟" }
                ],
                "过氧化物类": [
                    { name: "果蔬消毒(过氧乙酸)", value: 0.1, time: "10分钟", unit: "%" },
                    { name: "果蔬消毒(二氧化氯)", value: 50, time: "10-20分钟", unit: "mg/L" }
                ]
            },
            "织物消毒": {
                "含氯消毒剂": [
                    { name: "一般织物", value: 250, time: "20分钟" },
                    { name: "传染病织物", value: 500, time: "30分钟" },
                    { name: "血污染物", value: 2000, time: "60分钟" }
                ],
                "过氧化物类": [
                    { name: "织物浸泡(二氧化氯)", value: 100, time: "30分钟", unit: "mg/L" },
                    { name: "织物浸泡(二氧化氯-芽孢污染)", value: 500, time: "30分钟", unit: "mg/L" },
                    { name: "织物浸泡(过氧乙酸)", value: 0.2, time: "30-60分钟", unit: "%" }
                ]
            },
            "手消毒": {
                "含氯消毒剂": [
                    { name: "卫生手消毒", value: 500, time: "1分钟" },
                    { name: "外科手消毒", value: 1000, time: "3分钟" }
                ],
                "醇类": [
                    { name: "卫生手消毒", value: 75, time: "1分钟", unit: "%" },
                    { name: "外科手消毒", value: 75, time: "3-5分钟", unit: "%" }
                ],
                "季铵盐类": [
                    { name: "卫生手消毒", value: 1000, time: "1分钟" }
                ],
                "过氧化物类": [
                    { name: "手消毒(过氧化氢)", value: 3, time: "1-3分钟", unit: "%" }
                ]
            },
            "皮肤消毒": {
                "醇类": [
                    { name: "注射部位", value: 75, time: "1分钟", unit: "%" },
                    { name: "手术部位", value: 75, time: "3-5分钟", unit: "%" }
                ],
                "其他": [
                    { name: "创面消毒", value: 0.5, time: "2分钟", unit: "%(碘伏)" }
                ],
                "过氧化物类": [
                    { name: "皮肤消毒(过氧化氢)", value: 3, time: "1-3分钟", unit: "%" }
                ]
            },
            "医疗器械消毒": {
                "含氯消毒剂": [
                    { name: "高水平消毒", value: 2000, time: "30分钟" },
                    { name: "中水平消毒", value: 1000, time: "20分钟" }
                ],
                "过氧化物类": [
                    { name: "浸泡消毒(过氧乙酸)", value: 0.2, time: "10-30分钟", unit: "%" },
                    { name: "高水平消毒(过氧化氢)", value: 6, time: "30分钟", unit: "%" },
                    { name: "医疗器械(二氧化氯)", value: 500, time: "30分钟", unit: "mg/L" }
                ],
                "其他": [
                    { name: "高水平消毒(戊二醛)", value: 2.0, time: "20-45分钟", unit: "%(戊二醛)" },
                    { name: "灭菌(戊二醛)", value: 2.0, time: "10小时", unit: "%(戊二醛)" }
                ]
            },
            "空气消毒": {
                "过氧化物类": [
                    { name: "空气喷雾(二氧化氯)", value: 500, time: "30分钟", unit: "mg/L", note: "推荐使用" },
                    { name: "空气喷雾(过氧乙酸)", value: 0.2, time: "30-60分钟", unit: "%" },
                    { name: "空气消毒(过氧化氢)", value: 3, time: "30-60分钟", unit: "%" }
                ]
            },
            "疫源地消毒": {
                "含氯消毒剂": [
                    { name: "一般疫区", value: 1000, time: "60分钟" },
                    { name: "严重疫区", value: 2000, time: "120分钟" },
                    { name: "排泄物", value: 20000, time: "120分钟" },
                    { name: "呕吐物", value: 20000, time: "120分钟" }
                ],
                "过氧化物类": [
                    { name: "疫源地(过氧乙酸)", value: 0.5, time: "30-60分钟", unit: "%" },
                    { name: "疫源地(二氧化氯)", value: 500, time: "30-60分钟", unit: "mg/L" }
                ]
            },
            "饮用水消毒": {
                "含氯消毒剂": [
                    { name: "常规消毒", value: 1, time: "30分钟" },
                    { name: "应急消毒", value: 2, time: "30分钟" },
                    { name: "疫情期消毒", value: 2, time: "60分钟" }
                ],
                "过氧化物类": [
                    { name: "饮用水(二氧化氯)", value: 0.5, time: "30分钟", unit: "mg/L" },
                    { name: "应急消毒(二氧化氯)", value: 1, time: "30分钟", unit: "mg/L" }
                ]
            },
            "污水消毒": {
                "含氯消毒剂": [
                    { name: "一般污水", value: 500, time: "60分钟" },
                    { name: "医疗污水", value: 1000, time: "90分钟" },
                    { name: "传染病污水", value: 2000, time: "90分钟" }
                ],
                "过氧化物类": [
                    { name: "污水消毒(二氧化氯)", value: 10, time: "30分钟", unit: "mg/L" }
                ]
            },
            "冷链/物流消毒": {
                "含氯消毒剂": [
                    { name: "外包装", value: 500, time: "30分钟" },
                    { name: "冷链食品表面", value: 500, time: "30分钟" }
                ],
                "过氧化物类": [
                    { name: "冷链表面(二氧化氯)", value: 150, time: "20分钟", unit: "mg/L" },
                    { name: "冷链表面(过氧乙酸)", value: 0.3, time: "20分钟", unit: "%" }
                ]
            }
        };
