package com.cdc.vector.service.impl;

import com.cdc.vector.entity.GeneratedReport;
import com.cdc.vector.entity.VectorMonitoring;
import com.cdc.vector.mapper.VectorMonitoringMapper;
import com.cdc.vector.service.ReportGenerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 报告生成服务实现
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReportGenerationServiceImpl implements ReportGenerationService {
    
    private final VectorMonitoringMapper monitoringMapper;
    
    @Override
    public GeneratedReport generateMonthlyReport(Integer year, Integer month) {
        log.info("生成月度报告: {}年{}月", year, month);
        
        // 获取当月数据
        List<VectorMonitoring> dataList = monitoringMapper.selectByYearMonth(year, month);
        
        // 统计各类病媒密度
        Map<String, StatResult> stats = calculateStats(dataList);
        
        // 生成报告内容
        String content = buildMonthlyReportContent(year, month, stats, dataList.size());
        
        // 创建报告记录
        GeneratedReport report = new GeneratedReport();
        report.setReportTitle(year + "年" + month + "月病媒监测月报");
        report.setReportType("MONTH");
        report.setStartDate(LocalDate.of(year, month, 1));
        report.setEndDate(LocalDate.of(year, month, 1).withDayOfMonth(
            LocalDate.of(year, month, 1).lengthOfMonth()
        ));
        report.setContent(content);
        report.setStatus(1);
        
        return report;
    }
    
    @Override
    public GeneratedReport generateQuarterlyReport(Integer year, Integer quarter) {
        log.info("生成季度报告: {}年第{}季度", year, quarter);
        
        int startMonth = (quarter - 1) * 3 + 1;
        int endMonth = startMonth + 2;
        
        // 获取季度数据
        List<VectorMonitoring> dataList = monitoringMapper.selectByYearMonthRange(year, startMonth, endMonth);
        
        Map<String, StatResult> stats = calculateStats(dataList);
        
        String content = buildQuarterlyReportContent(year, quarter, stats, dataList.size());
        
        GeneratedReport report = new GeneratedReport();
        report.setReportTitle(year + "年第" + quarter + "季度病媒监测季报");
        report.setReportType("QUARTER");
        report.setStartDate(LocalDate.of(year, startMonth, 1));
        report.setEndDate(LocalDate.of(year, endMonth, 1).withDayOfMonth(
            LocalDate.of(year, endMonth, 1).lengthOfMonth()
        ));
        report.setContent(content);
        report.setStatus(1);
        
        return report;
    }
    
    @Override
    public GeneratedReport generateAnnualReport(Integer year) {
        log.info("生成年度报告: {}年", year);
        
        // 获取全年数据
        List<VectorMonitoring> dataList = monitoringMapper.selectByYear(year);
        
        Map<String, StatResult> stats = calculateStats(dataList);
        
        String content = buildAnnualReportContent(year, stats, dataList.size());
        
        GeneratedReport report = new GeneratedReport();
        report.setReportTitle(year + "年度病媒监测年报");
        report.setReportType("YEAR");
        report.setStartDate(LocalDate.of(year, 1, 1));
        report.setEndDate(LocalDate.of(year, 12, 31));
        report.setContent(content);
        report.setStatus(1);
        
        return report;
    }
    
    @Override
    public GeneratedReport generateCustomReport(LocalDate startDate, LocalDate endDate, String title) {
        log.info("生成自定义报告: {} 至 {}", startDate, endDate);
        
        // 获取自定义时间段数据
        List<VectorMonitoring> dataList = monitoringMapper.selectByDateRange(startDate, endDate);
        
        Map<String, StatResult> stats = calculateStats(dataList);
        
        String content = buildCustomReportContent(startDate, endDate, title, stats, dataList.size());
        
        GeneratedReport report = new GeneratedReport();
        report.setReportTitle(title);
        report.setReportType("CUSTOM");
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setContent(content);
        report.setStatus(1);
        
        return report;
    }
    
    /**
     * 统计数据
     */
    private Map<String, StatResult> calculateStats(List<VectorMonitoring> dataList) {
        Map<String, StatResult> stats = new HashMap<>();
        
        stats.put("MOSQUITO", new StatResult("蚊密度"));
        stats.put("FLY", new StatResult("蝇密度"));
        stats.put("COCKROACH", new StatResult("蟑密度"));
        stats.put("RODENT", new StatResult("鼠密度"));
        
        for (VectorMonitoring item : dataList) {
            StatResult stat = stats.get(item.getVectorType());
            if (stat != null && item.getDensity() != null) {
                stat.add(item.getDensity());
            }
        }
        
        return stats;
    }
    
    /**
     * 构建月度报告内容
     */
    private String buildMonthlyReportContent(Integer year, Integer month, 
                                            Map<String, StatResult> stats, int totalCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(year).append("年").append(month).append("月病媒监测月报\n\n");
        
        sb.append("## 一、监测概况\n\n");
        sb.append("本月共完成监测记录 ").append(totalCount).append(" 条，涉及蚊、蝇、蟑、鼠等多种病媒生物。\n\n");
        
        sb.append("## 二、密度统计\n\n");
        sb.append("| 病媒类型 | 平均密度 | 监测次数 | 趋势 |\n");
        sb.append("|---------|---------|---------|-----|\n");
        
        for (Map.Entry<String, StatResult> entry : stats.entrySet()) {
            StatResult stat = entry.getValue();
            sb.append("| ").append(stat.name).append(" | ")
              .append(stat.getAvg()).append(" | ")
              .append(stat.count).append(" | ")
              .append("- |\n");
        }
        
        sb.append("\n## 三、分析与建议\n\n");
        sb.append("根据监测数据分析，本月病媒生物密度整体处于正常水平。建议继续加强重点区域的监测工作。\n");
        
        return sb.toString();
    }
    
    /**
     * 构建季度报告内容
     */
    private String buildQuarterlyReportContent(Integer year, Integer quarter,
                                              Map<String, StatResult> stats, int totalCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(year).append("年第").append(quarter).append("季度病媒监测季报\n\n");
        
        sb.append("## 一、季度概况\n\n");
        sb.append("本季度共完成监测记录 ").append(totalCount).append(" 条。\n\n");
        
        sb.append("## 二、季度分析\n\n");
        sb.append("本季度病媒生物密度变化趋势如下...\n");
        
        return sb.toString();
    }
    
    /**
     * 构建年度报告内容
     */
    private String buildAnnualReportContent(Integer year,
                                           Map<String, StatResult> stats, int totalCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(year).append("年度病媒监测年报\n\n");
        
        sb.append("## 一、年度概况\n\n");
        sb.append("本年度共完成监测记录 ").append(totalCount).append(" 条。\n\n");
        
        sb.append("## 二、年度总结\n\n");
        sb.append("全年病媒生物监测工作总体情况良好...\n");
        
        sb.append("\n## 三、明年工作计划\n\n");
        sb.append("1. 继续加强重点区域的监测工作\n");
        sb.append("2. 完善监测数据信息化管理\n");
        sb.append("3. 提升应急处置能力\n");
        
        return sb.toString();
    }
    
    /**
     * 构建自定义报告内容
     */
    private String buildCustomReportContent(LocalDate startDate, LocalDate endDate,
                                           String title, Map<String, StatResult> stats, int totalCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(title).append("\n\n");
        
        sb.append("## 一、统计期间\n\n");
        sb.append(startDate).append(" 至 ").append(endDate).append("\n\n");
        
        sb.append("## 二、监测概况\n\n");
        sb.append("共完成监测记录 ").append(totalCount).append(" 条。\n");
        
        return sb.toString();
    }
    
    /**
     * 统计结果内部类
     */
    private static class StatResult {
        String name;
        int count = 0;
        BigDecimal sum = BigDecimal.ZERO;
        
        StatResult(String name) {
            this.name = name;
        }
        
        void add(BigDecimal value) {
            count++;
            sum = sum.add(value);
        }
        
        String getAvg() {
            if (count == 0) return "0.00";
            return sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP).toString();
        }
    }
}