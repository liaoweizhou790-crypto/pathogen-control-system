package com.cdc.vector.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * 监测数据查询DTO
 */
@Data
public class MonitoringQueryDTO {
    
    /**
     * 病媒类型
     */
    private String vectorType;
    
    /**
     * 开始日期
     */
    private LocalDate startDate;
    
    /**
     * 结束日期
     */
    private LocalDate endDate;
    
    /**
     * 区县ID
     */
    private Long districtId;
    
    /**
     * 年份
     */
    private Integer year;
    
    /**
     * 月份
     */
    private Integer month;
    
    /**
     * 页码
     */
    private Integer pageNum = 1;
    
    /**
     * 每页大小
     */
    private Integer pageSize = 10;
}