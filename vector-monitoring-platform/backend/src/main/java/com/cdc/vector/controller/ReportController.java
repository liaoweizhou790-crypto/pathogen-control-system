package com.cdc.vector.controller;

import com.cdc.vector.common.Result;
import com.cdc.vector.dto.MonitoringQueryDTO;
import com.cdc.vector.entity.GeneratedReport;
import com.cdc.vector.service.DataExportService;
import com.cdc.vector.service.ReportGenerationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/**
 * 报告和数据导出控制器
 */
@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Tag(name = "报告中心", description = "报告生成和数据导出")
public class ReportController {
    
    private final ReportGenerationService reportService;
    private final DataExportService exportService;
    
    /**
     * 生成月度报告
     */
    @PostMapping("/monthly")
    @Operation(summary = "生成月度报告")
    public Result<GeneratedReport> generateMonthlyReport(
            @RequestParam Integer year,
            @RequestParam Integer month) {
        GeneratedReport report = reportService.generateMonthlyReport(year, month);
        return Result.success(report);
    }
    
    /**
     * 生成季度报告
     */
    @PostMapping("/quarterly")
    @Operation(summary = "生成季度报告")
    public Result<GeneratedReport> generateQuarterlyReport(
            @RequestParam Integer year,
            @RequestParam Integer quarter) {
        GeneratedReport report = reportService.generateQuarterlyReport(year, quarter);
        return Result.success(report);
    }
    
    /**
     * 生成年度报告
     */
    @PostMapping("/annual")
    @Operation(summary = "生成年度报告")
    public Result<GeneratedReport> generateAnnualReport(
            @RequestParam Integer year) {
        GeneratedReport report = reportService.generateAnnualReport(year);
        return Result.success(report);
    }
    
    /**
     * 生成自定义报告
     */
    @PostMapping("/custom")
    @Operation(summary = "生成自定义报告")
    public Result<GeneratedReport> generateCustomReport(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam String title) {
        GeneratedReport report = reportService.generateCustomReport(startDate, endDate, title);
        return Result.success(report);
    }
    
    /**
     * 导出数据到Excel
     */
    @GetMapping("/export")
    @Operation(summary = "导出数据到Excel")
    public void exportToExcel(MonitoringQueryDTO query, HttpServletResponse response) throws IOException {
        exportService.exportToExcel(query, response);
    }
}