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
                                    原液浓度: <strong style="color: ${levelColor}; font-size: 16px;">${info.conc}%</strong> 
                                    <span style="margin: 0 10px;">|</span>
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
                                    原液浓度: <strong style="color: #e74c3c; font-size: 16px;">${info.conc}%</strong>
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
                                    乙醇含量: <strong style="color: #27ae60; font-size: 16px;">${info.conc}%</strong>
                                    <span style="margin-left: 10px; color: #3498db; font-weight: bold;">💧 按体积配比</span>
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