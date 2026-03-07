package com.cdc.vector.security;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cdc.vector.entity.SysUser;
import com.cdc.vector.mapper.SysUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * 用户详情服务
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final SysUserMapper userMapper;
    
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        // 根据用户ID查询用户
        SysUser user = userMapper.selectById(Long.valueOf(userId));
        
        if (user == null || user.getDeleted() == 1) {
            throw new UsernameNotFoundException("用户不存在");
        }
        
        if (user.getStatus() == 0) {
            throw new UsernameNotFoundException("用户已被禁用");
        }
        
        // 构建UserDetails
        return new User(
            String.valueOf(user.getId()),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}