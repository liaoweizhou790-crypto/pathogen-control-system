package com.cdc.vector.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统用户实体类
 */
@Data
@TableName("sys_user")
public class SysUser {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String username;
    
    private String password;
    
    private String realName;
    
    private String phone;
    
    private String email;
    
    private String avatar;
    
    private Integer status;
    
    private String role;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}