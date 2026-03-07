package com.cdc.vector.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cdc.vector.entity.VectorMonitoring;
import com.cdc.vector.mapper.VectorMonitoringMapper;
import com.cdc.vector.service.VectorMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 病媒监测数据Service实现
 */
@Service
@RequiredArgsConstructor
public class VectorMonitoringServiceImpl extends ServiceImpl<VectorMonitoringMapper, VectorMonitoring> 
        implements VectorMonitoringService {
    
    @Override
    public Map<String, Object> getDashboardStats(Integer year, Integer month) {
        Map<String, Object> stats = new HashMap<>();
        
        // 获取各类病媒的密度统计
        List<Map<String, Object>> densityStats = baseMapper.selectDensityByMonth(year, month);
        
        // 转换为Map方便前端使用
        for (Map<String, Object> item : densityStats) {
            String vectorType = (String) item.get("vector_type");
            stats.put(vectorType, item);
        }
        
        return stats;
    }
    
    @Override
    public List<Map<String, Object>> getTrendData(Integer year, String vectorType) {
        return baseMapper.selectTrendByYear(year, vectorType);
    }
    
    @Override
    public List<Map<String, Object>> getDistrictComparison(Integer year, Integer month, String vectorType) {
        return baseMapper.selectDistrictComparison(year, month, vectorType);
    }
}