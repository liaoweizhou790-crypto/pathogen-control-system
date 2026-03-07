package com.cdc.vector.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cdc.vector.entity.MonitoringPoint;
import org.apache.ibatis.annotations.Mapper;

/**
 * 监测点Mapper
 */
@Mapper
public interface MonitoringPointMapper extends BaseMapper<MonitoringPoint> {
}