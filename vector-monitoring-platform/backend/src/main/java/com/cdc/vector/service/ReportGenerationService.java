package com.cdc.vector.service;

import com.cdc.vector.entity.GeneratedReport;

import java.time.LocalDate;

/**
 * 报告生成服务接口
 */
public interface ReportGenerationService {
    
    /**
     * 生成月度报告
     * @param year 年份
     * @param month 月份
     * @return 生成的报告
     */
    GeneratedReport generateMonthlyReport(Integer year, Integer month);
    
    /**
     * 生成季度报告
     * @param year 年份
     * @param quarter 季度(1-4)
     * @return 生成的报告
     */
    GeneratedReport generateQuarterlyReport(Integer year, Integer quarter);
    
    /**
     * 生成年度报告
     * @param year 年份
     * @return 生成的报告
     */
    GeneratedReport generateAnnualReport(Integer year);
    
    /**
     * 生成自定义报告
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param title 报告标题
     * @return 生成的报告
     */
    GeneratedReport generateCustomReport(LocalDate startDate, LocalDate endDate, String title);
}