package com.cdc.vector.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 病媒监测数据实体类
 */
@Data
@TableName("vector_monitoring")
public class VectorMonitoring {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 病媒类型: MOSQUITO-蚊 FLY-蝇 COCKROACH-蟑 RODENT-鼠 TICK-蜱
     */
    private String vectorType;
    
    /**
     * 监测方法
     */
    private String monitorMethod;
    
    /**
     * 监测日期
     */
    private LocalDate monitorDate;
    
    /**
     * 监测点ID
     */
    private Long pointId;
    
    /**
     * 监测点名称（用于直接录入）
     */
    @TableField(exist = false)
    private String pointName;
    
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
    
    // ===== 通用监测数据字段 =====
    
    /**
     * 布放数量（灯/笼/张等）
     */
    private Integer deployCount;
    
    /**
     * 监测时长（天/夜/小时）
     */
    private BigDecimal duration;
    
    /**
     * 回收数量
     */
    private Integer recoveryCount;
    
    /**
     * 捕获数量
     */
    private Integer catchCount;
    
    /**
     * 密度值
     */
    private BigDecimal density;
    
    // ===== 蚊密度特有字段 =====
    
    /**
     * 雌蚊数量
     */
    private Integer femaleCount;
    
    /**
     * 蚊种组成JSON
     */
    private String mosquitoSpecies;
    
    // ===== 布雷图特有字段 =====
    
    /**
     * 调查户数
     */
    private Integer householdCount;
    
    /**
     * 积水容器数
     */
    private Integer waterCount;
    
    /**
     * 阳性容器数
     */
    private Integer positiveCount;
    
    /**
     * 布雷图指数
     */
    private BigDecimal breteauIndex;
    
    // ===== 叠帐法特有字段 =====
    
    /**
     * 叠帐数量
     */
    private Integer tentCount;
    
    // ===== 诱卵器特有字段 =====
    
    /**
     * 诱卵器数量
     */
    private Integer trapCount;
    
    // ===== 蜱虫特有字段 =====
    
    /**
     * 宿主类型
     */
    private String hostType;
    
    /**
     * 蜱虫数量
     */
    private Integer tickCount;
    
    /**
     * 蜱虫种类
     */
    private String tickSpecies;
    
    // ===== 通用字段 =====
    
    /**
     * 天气情况
     */
    private String weather;
    
    /**
     * 温度
     */
    private BigDecimal temperature;
    
    /**
     * 湿度
     */
    private BigDecimal humidity;
    
    /**
     * 现场照片JSON数组
     */
    private String photos;
    
    /**
     * 备注
     */
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private Long createBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateBy;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}