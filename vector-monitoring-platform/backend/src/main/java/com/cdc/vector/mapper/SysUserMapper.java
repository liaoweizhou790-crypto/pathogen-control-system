package com.cdc.vector.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cdc.vector.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 用户Mapper
 */
@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {
    
    /**
     * 根据用户名查询用户
     */
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    SysUser selectByUsername(String username);
}