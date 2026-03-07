package com.cdc.vector.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 监测点实体类
 */
@Data
@TableName("monitoring_point")
public class MonitoringPoint {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String pointCode;
    
    private String pointName;
    
    private Long districtId;
    
    private String address;
    
    private String envType;
    
    private BigDecimal longitude;
    
    private BigDecimal latitude;
    
    private String pointType;
    
    private String contactName;
    
    private String contactPhone;
    
    private Integer status;
    
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}