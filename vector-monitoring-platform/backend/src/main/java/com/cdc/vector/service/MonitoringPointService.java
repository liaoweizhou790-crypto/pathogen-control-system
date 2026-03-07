package com.cdc.vector.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cdc.vector.entity.MonitoringPoint;

/**
 * 监测点服务接口
 */
public interface MonitoringPointService extends IService<MonitoringPoint> {
    
    /**
     * 查找或创建监测点
     * @param districtId 区县ID
     * @param pointName 监测点名称
     * @param envType 环境类型
     * @return 监测点
     */
    MonitoringPoint findOrCreatePoint(Long districtId, String pointName, String envType);
}