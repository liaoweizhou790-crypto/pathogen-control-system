
        // 初始化
        function init() {
            // 填充类别
            const categorySelect = document.getElementById('category');
            Object.keys(disinfectantDB).forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });

            // 填充消毒对象
            const objectSelect = document.getElementById('targetObject');
            Object.keys(recommendations).forEach(obj => {
                const option = document.createElement('option');
                option.value = obj;
                option.textContent = obj;
                objectSelect.appendChild(option);
            });

            // 加载记录和方案
            loadRecords();
            loadPresets();
            
            // 初始化流调分析模块
            if (document.getElementById('epidemicAnalysis')) {
                initEpidemicAnalysis();
            }
            
            // 初始化AI配置
            if (document.getElementById('aiConfig')) {
                initAIConfig();
            }
        }

        // ========== 传染病方案功能 ==========
        
        function updateDiseaseList() {
            const diseaseClass = document.getElementById('diseaseClass').value;
            const select = document.getElementById('diseaseName');
            select.innerHTML = '<option value="">请选择具体传染病</option>';
            
            if (diseaseClass && diseaseDB[diseaseClass]) {
                Object.keys(diseaseDB[diseaseClass]).forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                });
            }
            
            document.getElementById('diseasePlan').style.display = 'none';
        }
        
        function showDiseasePlan() {
            const diseaseClass = document.getElementById('diseaseClass').value;
            const diseaseName = document.getElementById('diseaseName').value;
            
            if (!diseaseClass || !diseaseName || !diseaseDB[diseaseClass][diseaseName]) {
                document.getElementById('diseasePlan').style.display = 'none';
                return;
            }
            
            const plan = diseaseDB[diseaseClass][diseaseName];
            document.getElementById('planTitle').textContent = `📋 ${diseaseName} 消毒方案`;
            
            let content = `
                <div style="margin-bottom: 15px;">
                    <span class="tag">${diseaseClass}传染病</span>
                    <span class="tag">危险等级: ${plan.level}</span>
                </div>
                <div class="result-item"><strong>病原体:</strong> ${plan.pathogen}</div>
                <div class="result-item"><strong>传播途径:</strong> ${plan.transmission}</div>
            `;
            
            // 环境消毒
            if (plan.environment) {
                const isChlorineEnv = plan.environment.type.includes('含氯');
                const concDisplayEnv = isChlorineEnv ? `（有效氯含量${plan.environment.conc}）` : `${plan.environment.conc}`;
                content += `<div class="result-item"><strong>环境表面消毒:</strong> ${plan.environment.type} ${concDisplayEnv}${plan.environment.unit}，作用${plan.environment.time}</div>`;
            }
            
            // 空气消毒
            if (plan.air) {
                if (plan.air.method && !plan.air.type) {
                    content += `<div class="result-item"><strong>空气消毒:</strong> ${plan.air.method}`;
                    if (plan.air.time) content += `，${plan.air.time}`;
                    content += `</div>`;
                } else if (plan.air.type) {
                    const isChlorineAir = plan.air.type.includes('含氯');
                    const concDisplayAir = isChlorineAir ? `（有效氯含量${plan.air.conc}）` : `${plan.air.conc}`;
                    content += `<div class="result-item"><strong>空气消毒:</strong> ${plan.air.type} ${concDisplayAir}${plan.air.unit}，${plan.air.method}，作用${plan.air.time}</div>`;
                }
            }
            
            // 织物消毒
            if (plan.fabric) {
                if (plan.fabric.method) {
                    content += `<div class="result-item"><strong>织物消毒:</strong> ${plan.fabric.method}`;
                    if (plan.fabric.time) content += `，${plan.fabric.time}`;
                    content += `</div>`;
                } else {
                    const isChlorineFabric = plan.fabric.type.includes('含氯');
                    const concDisplayFabric = isChlorineFabric ? `（有效氯含量${plan.fabric.conc}）` : `${plan.fabric.conc}`;
                    content += `<div class="result-item"><strong>织物消毒:</strong> ${plan.fabric.type} ${concDisplayFabric}${plan.fabric.unit}，作用${plan.fabric.time}</div>`;
                }
            }
            
            // 排泄物消毒
            if (plan.excreta) {
                const isChlorineExcreta = plan.excreta.type.includes('含氯');
                const concDisplayExcreta = isChlorineExcreta ? `（有效氯含量${plan.excreta.conc}）` : `${plan.excreta.conc}`;
                content += `<div class="result-item"><strong>排泄物消毒:</strong> ${plan.excreta.type} ${concDisplayExcreta}${plan.excreta.unit}，作用${plan.excreta.time}</div>`;
            }
            
            // 呕吐物消毒
            if (plan.vomit) {
                const isChlorineVomit = plan.vomit.type.includes('含氯');
                const concDisplayVomit = isChlorineVomit ? `（有效氯含量${plan.vomit.conc}）` : `${plan.vomit.conc}`;
                content += `<div class="result-item"><strong>呕吐物消毒:</strong> ${plan.vomit.type} ${concDisplayVomit}${plan.vomit.unit}，作用${plan.vomit.time}</div>`;
            }
            
            // 血液消毒
            if (plan.blood) {
                const isChlorineBlood = plan.blood.type.includes('含氯');
                const concDisplayBlood = isChlorineBlood ? `（有效氯含量${plan.blood.conc}）` : `${plan.blood.conc}`;
                content += `<div class="result-item"><strong>血液体液消毒:</strong> ${plan.blood.type} ${concDisplayBlood}${plan.blood.unit}，作用${plan.blood.time}</div>`;
            }
            
            // 餐饮具消毒
            if (plan.food) {
                if (plan.food.method) {
                    content += `<div class="result-item"><strong>餐饮具消毒:</strong> ${plan.food.method}`;
                    if (plan.food.time) content += `，${plan.food.time}`;
                    content += `</div>`;
                } else {
                    const isChlorineFood = plan.food.type.includes('含氯');
                    const concDisplayFood = isChlorineFood ? `（有效氯含量${plan.food.conc}）` : `${plan.food.conc}`;
                    content += `<div class="result-item"><strong>餐饮具消毒:</strong> ${plan.food.type} ${concDisplayFood}${plan.food.unit}，作用${plan.food.time}</div>`;
                }
            }
            
            // 器械消毒
            if (plan.instrument) {
                if (plan.instrument.method) {
                    content += `<div class="result-item"><strong>医疗器械消毒:</strong> ${plan.instrument.method}`;
                    if (plan.instrument.time) content += `，${plan.instrument.time}`;
                    content += `</div>`;
                } else {
                    const isChlorineInst = plan.instrument.type.includes('含氯');
                    const concDisplayInst = isChlorineInst ? `（有效氯含量${plan.instrument.conc}）` : `${plan.instrument.conc}`;
                    content += `<div class="result-item"><strong>医疗器械消毒:</strong> ${plan.instrument.type} ${concDisplayInst}${plan.instrument.unit}，作用${plan.instrument.time}</div>`;
                }
            }
            
            // 尸体处理
            if (plan.corpse) {
                content += `<div class="result-item"><strong>尸体处理:</strong> ${plan.corpse.method}`;
                if (plan.corpse.note) content += `，${plan.corpse.note}`;
                content += `</div>`;
            }
            
            // 灭蚤处理（鼠疫专用）
            if (plan.flea) {
                content += `<div class="result-item"><strong>🐭 灭蚤处理:</strong> ${plan.flea.method}`;
                if (plan.flea.note) content += `，${plan.flea.note}`;
                content += `</div>`;
            }
            
            // 特殊说明
            if (plan.note) {
                content += `<div class="steps" style="background: #fff3cd; border-left-color: #ffc107;"><strong>⚠️ 特别说明:</strong> ${plan.note}</div>`;
            }
            
            document.getElementById('planContent').innerHTML = content;
            document.getElementById('diseasePlan').style.display = 'block';
            
            // 保存当前方案供应用使用
            window.currentDiseasePlan = {
                name: diseaseName,
                class: diseaseClass,
                data: plan
            };
        }
        
        function applyDiseasePlan() {
            if (!window.currentDiseasePlan) return;
            
            const plan = window.currentDiseasePlan.data;
            // 优先使用环境消毒参数
            if (plan.environment) {
                // 设置类别
