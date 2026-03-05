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
                const categoryMap = {
                    "含氯消毒剂": "含氯消毒剂",
                    "二氧化氯": "氧化物类",
                    "过氧乙酸": "过氧化物类",
                    "过氧化氢": "过氧化物类",
                    "戊二醛": "其他",
                    "75%乙醇": "醇类",
                    "碘伏": "其他"
                };
                
                const category = categoryMap[plan.environment.type] || "含氯消毒剂";
                document.getElementById('category').value = category;
                updateDisinfectants();
                
                // 选择具体消毒剂
                const disinfectantSelect = document.getElementById('disinfectant');
                for (let i = 0; i < disinfectantSelect.options.length; i++) {
                    if (disinfectantSelect.options[i].text.includes(plan.environment.type) ||
                        (plan.environment.type.includes("84") && disinfectantSelect.options[i].text.includes("84"))) {
                        disinfectantSelect.selectedIndex = i;
                        break;
                    }
                }
                updateConcentration();
                
                // 设置目标浓度
                document.getElementById('targetConc').value = plan.environment.conc;
                const unitSelect = document.getElementById('targetUnit');
                if (plan.environment.unit === "mg/L") {
                    unitSelect.value = "mg/L";
                } else {
                    unitSelect.value = "%";
                }
            }
            
            // 切换到计算标签
            document.querySelectorAll('.tab')[0].click();
            alert(`已应用 ${window.currentDiseasePlan.name} 的消毒方案参数，请检查并点击计算`);
        }
        
        function exportDiseasePlan() {
            if (!window.currentDiseasePlan) return;
            
            const plan = window.currentDiseasePlan.data;
            let text = `${window.currentDiseasePlan.name} 消毒方案\n`;
            text += `传染病类别: ${window.currentDiseasePlan.class}类\n`;
            text += `病原体: ${plan.pathogen}\n`;
            text += `传播途径: ${plan.transmission}\n`;
            text += `危险等级: ${plan.level}\n\n`;
            
            if (plan.environment) {
                text += `环境消毒: ${plan.environment.type} ${plan.environment.conc}${plan.environment.unit}，作用${plan.environment.time}\n`;
            }
            if (plan.excreta) {
                text += `排泄物消毒: ${plan.excreta.type} ${plan.excreta.conc}${plan.excreta.unit}，作用${plan.excreta.time}\n`;
            }
            if (plan.corpse) {
                text += `尸体处理: ${plan.corpse.method}`;
                if (plan.corpse.note) text += `，${plan.corpse.note}`;
                text += `\n`;
            }
            if (plan.note) {
                text += `\n特别说明: ${plan.note}\n`;
            }
            
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${window.currentDiseasePlan.name}_消毒方案.txt`;
            link.click();
        }

        // 切换标签页
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }

        // 更新消毒剂列表
        function updateDisinfectants() {
            const category = document.getElementById('category').value;
            const select = document.getElementById('disinfectant');
            select.innerHTML = '<option value="">请选择</option>';
            
            if (category && disinfectantDB[category]) {
                Object.keys(disinfectantDB[category]).forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                });
            }
        }

        // 更新浓度
        function updateConcentration() {
            const category = document.getElementById('category').value;
            const name = document.getElementById('disinfectant').value;
            
            if (category && name && disinfectantDB[category][name]) {
                const info = disinfectantDB[category][name];
                document.getElementById('sourceConc').value = info.conc;
                
                // 自动切换单位
                const unitSelect = document.getElementById('targetUnit');
                const unitLabel = document.querySelector('label[for="targetConc"]');
                
                // 显示/隐藏含氯量信息
                displayChlorineInfo(category, name, info);
                
                if (info.unitMode === 'clo2_mgl') {
                    // 二氧化氯专用 mg/L 模式
                    unitSelect.value = 'mg/L';
                    unitSelect.disabled = true;
                    unitLabel.textContent = '目标浓度 (mg/L)';
                    document.getElementById('targetConc').placeholder = '如: 100';
                    document.getElementById('targetConc').value = '';
                } else if (info.unitMode === 'percent') {
                    // 过氧化物/醇类等百分比模式
                    unitSelect.value = '%';
                    unitSelect.disabled = true;
                    unitLabel.textContent = '目标浓度 (%)';
                    document.getElementById('targetConc').placeholder = '如: 3';
                    document.getElementById('targetConc').value = '';
                } else {
                    // 含氯消毒剂模式 - 可切换
                    unitSelect.value = 'mg/L';
                    unitSelect.disabled = false;
                    unitLabel.textContent = '目标浓度';
                    document.getElementById('targetConc').placeholder = '如: 500';
                    document.getElementById('targetConc').value = '';
                }
            }
        }
        
        // 显示含氯消毒剂信息
        function displayChlorineInfo(category, name, info) {
            // 查找或创建信息容器
            let infoContainer = document.getElementById('chlorineInfoContainer');
            if (!infoContainer) {
                // 在form-row后插入信息容器
                const targetRow = document.querySelector('#calc .form-row');
                infoContainer = document.createElement('div');
                infoContainer.id = 'chlorineInfoContainer';
                targetRow.parentNode.insertBefore(infoContainer, targetRow.nextSibling);
            }
            
            // 判断是否为固体
            const isSolid = info.type === '固体';
            const typeIcon = isSolid ? '📦' : '🧪';
            const typeLabel = isSolid ? '固体/粉剂' : '液体';
            
            // 只有含氯消毒剂才显示详细信息
            if (category === '含氯消毒剂') {
                // 计算有效氯含量描述
                let chlorineLevel = '';
                let levelColor = '';
                if (info.conc >= 50) {
                    chlorineLevel = '高浓度';
                    levelColor = '#e74c3c';
                } else if (info.conc >= 20) {
                    chlorineLevel = '中高浓度';
                    levelColor = '#f39c12';
                } else if (info.conc >= 5) {
                    chlorineLevel = '中浓度';
                    levelColor = '#3498db';
                } else {
                    chlorineLevel = '低浓度';
                    levelColor = '#27ae60';
                }
                
                // 计算相当于多少mg/L的有效氯
                const mgPerLiter = info.conc * 10000;
                
                // 固体和液体的用量单位不同
                const unitText = isSolid ? '每100g含有效氯' : '每100mL含有效氯';
                const amountText = isSolid ? `${(info.conc * 1000).toLocaleString()}mg` : `${(info.conc * 1000).toLocaleString()}mg`;
                
                infoContainer.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${levelColor};"
                    >
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"
                        >
                            <div>
                                <div style="font-weight: bold; color: #333; margin-bottom: 5px;"
                                >
                                    ${typeIcon} ${name} - ${typeLabel}
                                    <span style="background: ${levelColor}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 10px;"
                                    >${chlorineLevel}</span>
                                </div>
                                <div style="font-size: 14px; color: #666;"
                                >
                                    原液浓度: <strong style="color: ${levelColor}; font-size: 16px;"
                                    >${info.conc}%</strong> 
                                    <span style="margin: 0 10px;"
                                    >|</span>
                                    有效氯: <strong>${mgPerLiter.toLocaleString()} mg/L</strong>
                                </div>
                            </div>
                            <div style="text-align: right;"
                            >
                                <div style="font-size: 12px; color: #999; margin-bottom: 5px;"
                                >${typeLabel}</div>
                                <div style="font-size: 14px; color: ${isSolid ? '#e67e22' : '#3498db'}; font-weight: bold;"
                                >
                                    ${isSolid ? '⚖️ 按重量配比' : '💧 按体积配比'}
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 13px; color: #666;"
                        >
                            💡 <strong>说明：</strong>${unitText}${amountText}，
                            ${isSolid ? '需先溶解于水后再使用，按<strong>重量(g)</strong>计算用量' : '直接使用原液，按<strong>体积(mL)</strong>计算用量'}
                        </div>
                        
                        ${isSolid ? `
                        <div style="margin-top: 8px; padding: 8px; background: #fff3e0; border-radius: 4px; font-size: 12px; color: #e65100;"
                        >
                            ⚠️ <strong>固体消毒剂使用提示：</strong>粉剂需充分搅拌溶解，建议先用少量水调成糊状，再加水至目标体积
                        </div>
                        ` : ''}
                    </div>
                `;
            } else if (category === '过氧化物类') {
                // 过氧化物类显示不同的信息
                let peroxideType = '';
                if (name.includes('二氧化氯')) {
                    peroxideType = '二氧化氯含量';
                } else if (name.includes('过氧乙酸')) {
                    peroxideType = '过氧乙酸含量';
                } else if (name.includes('过氧化氢')) {
                    peroxideType = '过氧化氢含量';
                }
                
                // 判断是否为固体（二氧化氯泡腾片）
                const isPeroxideSolid = info.type === '固体';
                
                infoContainer.innerHTML = `
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e74c3c;"
                    >
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"
                        >
                            <div>
                                <div style="font-weight: bold; color: #333; margin-bottom: 5px;"
                                >
                                    ${isPeroxideSolid ? '📦' : '⚗️'} ${name} ${isPeroxideSolid ? '- 固体/片剂' : ''}
                                </div>
                                <div style="font-size: 14px; color: #666;"
                                >
                                    原液浓度: <strong style="color: #e74c3c; font-size: 16px;"
                                    >${info.conc}%</strong>
                                    ${isPeroxideSolid ? '<span style="margin-left: 10px; color: #e67e22; font-weight: bold;">⚖️ 按重量/片数配比</span>' : ''}
                                </div>
                            </div>
                            <div style="text-align: right;"
                            >
                                <div style="font-size: 18px; font-weight: bold; color: #e74c3c;"
                                >
                                    ${peroxideType}
                                </div>
                                <div style="font-size: 12px; color: #999;"
                                >${isPeroxideSolid ? '按片剂说明使用' : '腐蚀性较强，注意防护'}</div>
                            </div>
                        </div>
                        ${isPeroxideSolid ? `
                        <div style="margin-top: 8px; padding: 8px; background: #fff3e0; border-radius: 4px; font-size: 12px; color: #e65100;"
                        >
                            ⚠️ <strong>泡腾片使用提示：</strong>将片剂投入水中，待完全溶解后再使用。具体用量请参考产品说明书
                        </div>
                        ` : ''}
                    </div>
                `;
            } else if (category === '醇类') {
                infoContainer.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f0fff4 0%, #e0ffe4 100%); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #27ae60;"
                    >
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"
                        >
                            <div>
                                <div style="font-weight: bold; color: #333; margin-bottom: 5px;"
                                >
                                    🍶 ${name} - 液体
                                </div>
                                <div style="font-size: 14px; color: #666;"
                                >
                                    乙醇含量: <strong style="color: #27ae60; font-size: 16px;"
                                    >${info.conc}%</strong>
                                    <span style="margin-left: 10px; color: #3498db; font-weight: bold;"
                                    >💧 按体积配比</span>
                                </div>
                            </div>
                            <div style="text-align: right;"
                            >
                                <div style="font-size: 14px; color: #27ae60;"
                                >
                                    易挥发，易燃
                                </div>
                                <div style="font-size: 12px; color: #999;"
                                >远离火源</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // 其他类型清空显示
                infoContainer.innerHTML = '';
            }
        }

        // 切换计算模式
        function changeMode() {
            const mode = document.querySelector('input[name="calcMode"]:checked').value;
            document.getElementById('volumeRow').style.display = mode === 'volume' ? 'grid' : 'none';
        }

        // 更新占位符
        function updatePlaceholder() {
            const unit = document.getElementById('targetUnit').value;
            const input = document.getElementById('targetConc');
            input.placeholder = unit === 'mg/L' ? '如: 500' : '如: 0.5';
        }

        // 计算
