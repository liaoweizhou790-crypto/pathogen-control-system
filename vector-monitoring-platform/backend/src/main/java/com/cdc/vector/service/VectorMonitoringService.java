package com.cdc.vector.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cdc.vector.entity.VectorMonitoring;

import java.util.List;
import java.util.Map;

/**
 * 病媒监测数据Service接口
 */
public interface VectorMonitoringService extends IService<VectorMonitoring> {
    
    /**
     * 获取看板统计数据
     */
    Map<String, Object> getDashboardStats(Integer year, Integer month);
    
    /**
     * 获取病媒密度趋势
     */
    List<Map<String, Object>> getTrendData(Integer year, String vectorType);
    
    /**
     * 获取区县对比数据
     */
    List<Map<String, Object>> getDistrictComparison(Integer year, Integer month, String vectorType);
}