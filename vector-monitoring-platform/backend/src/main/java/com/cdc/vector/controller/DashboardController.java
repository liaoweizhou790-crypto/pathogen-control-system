package com.cdc.vector.controller;

import com.cdc.vector.common.Result;
import com.cdc.vector.service.VectorMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 数据看板控制器
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "数据看板", description = "首页数据统计相关接口")
public class DashboardController {
    
    private final VectorMonitoringService monitoringService;
    
    /**
     * 获取看板统计数据
     */
    @GetMapping("/stats")
    @Operation(summary = "获取看板统计数据")
    public Result<Map<String, Object>> getStats(
            @RequestParam Integer year,
            @RequestParam Integer month) {
        Map<String, Object> stats = monitoringService.getDashboardStats(year, month);
        return Result.success(stats);
    }
    
    /**
     * 获取趋势数据
     */
    @GetMapping("/trend")
    @Operation(summary = "获取病媒密度趋势数据")
    public Result<List<Map<String, Object>>> getTrend(
            @RequestParam Integer year,
            @RequestParam String vectorType) {
        List<Map<String, Object>> trendData = monitoringService.getTrendData(year, vectorType);
        return Result.success(trendData);
    }
    
    /**
     * 获取区县对比数据
     */
    @GetMapping("/district-comparison")
    @Operation(summary = "获取区县对比数据")
    public Result<List<Map<String, Object>>> getDistrictComparison(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam String vectorType) {
        List<Map<String, Object>> comparisonData = monitoringService.getDistrictComparison(year, month, vectorType);
        return Result.success(comparisonData);
    }
}