package com.cdc.vector.controller;

import com.cdc.vector.common.Result;
import com.cdc.vector.entity.MonitoringPoint;
import com.cdc.vector.entity.VectorMonitoring;
import com.cdc.vector.service.MonitoringPointService;
import com.cdc.vector.service.VectorMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据录入控制器
 */
@RestController
@RequestMapping("/monitoring")
@RequiredArgsConstructor
@Tag(name = "数据录入", description = "病媒监测数据录入相关接口")
public class MonitoringController {
    
    private final VectorMonitoringService monitoringService;
    private final MonitoringPointService pointService;
    
    /**
     * 新增监测数据
     */
    @PostMapping
    @Operation(summary = "新增监测数据")
    public Result<Long> add(@RequestBody @Validated VectorMonitoring monitoring) {
        // 如果提供了监测点名称但没有pointId，创建或查找监测点
        if (monitoring.getPointId() == null && monitoring.getPointName() != null) {
            MonitoringPoint point = pointService.findOrCreatePoint(
                monitoring.getDistrictId(),
                monitoring.getPointName(),
                monitoring.getEnvType()
            );
            monitoring.setPointId(point.getId());
        }
        
        monitoringService.save(monitoring);
        return Result.success(monitoring.getId());
    }
    
    /**
     * 更新监测数据
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新监测数据")
    public Result<Void> update(@PathVariable Long id, 
                                 @RequestBody @Validated VectorMonitoring monitoring) {
        monitoring.setId(id);
        monitoringService.updateById(monitoring);
        return Result.success();
    }
    
    /**
     * 删除监测数据
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除监测数据")
    public Result<Void> delete(@PathVariable Long id) {
        monitoringService.removeById(id);
        return Result.success();
    }
    
    /**
     * 获取监测数据详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取监测数据详情")
    public Result<VectorMonitoring> getById(@PathVariable Long id) {
        VectorMonitoring monitoring = monitoringService.getById(id);
        return Result.success(monitoring);
    }
    
    /**
     * 获取监测数据列表
     */
    @GetMapping("/list")
    @Operation(summary = "获取监测数据列表")
    public Result<List<VectorMonitoring>> list(
            @RequestParam(required = false) String vectorType,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        // TODO: 添加查询条件
        List<VectorMonitoring> list = monitoringService.list();
        return Result.success(list);
    }
}