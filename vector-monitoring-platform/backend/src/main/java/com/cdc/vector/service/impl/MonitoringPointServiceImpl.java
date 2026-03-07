package com.cdc.vector.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cdc.vector.entity.MonitoringPoint;
import com.cdc.vector.mapper.MonitoringPointMapper;
import com.cdc.vector.service.MonitoringPointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 监测点服务实现
 */
@Service
@RequiredArgsConstructor
public class MonitoringPointServiceImpl extends ServiceImpl<MonitoringPointMapper, MonitoringPoint> 
        implements MonitoringPointService {
    
    @Override
    @Transactional
    public MonitoringPoint findOrCreatePoint(Long districtId, String pointName, String envType) {
        // 先查找是否已存在
        LambdaQueryWrapper<MonitoringPoint> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MonitoringPoint::getDistrictId, districtId)
               .eq(MonitoringPoint::getPointName, pointName)
               .eq(MonitoringPoint::getDeleted, 0);
        
        MonitoringPoint point = getOne(wrapper);
        
        if (point != null) {
            return point;
        }
        
        // 不存在则创建
        point = new MonitoringPoint();
        point.setPointCode(generatePointCode(districtId));
        point.setPointName(pointName);
        point.setDistrictId(districtId);
        point.setEnvType(envType);
        point.setStatus(1);
        
        save(point);
        return point;
    }
    
    /**
     * 生成监测点编码
     */
    private String generatePointCode(Long districtId) {
        long count = count() + 1;
        return String.format("P%02d%06d", districtId, count);
    }
}