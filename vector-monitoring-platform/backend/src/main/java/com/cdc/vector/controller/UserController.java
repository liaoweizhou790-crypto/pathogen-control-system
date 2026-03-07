package com.cdc.vector.controller;

import com.cdc.vector.common.Result;
import com.cdc.vector.dto.LoginRequest;
import com.cdc.vector.dto.LoginResponse;
import com.cdc.vector.entity.SysUser;
import com.cdc.vector.mapper.SysUserMapper;
import com.cdc.vector.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户登录、注册、信息管理")
public class UserController {
    
    private final SysUserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<LoginResponse> login(@RequestBody @Validated LoginRequest request) {
        // 查询用户
        SysUser user = userMapper.selectByUsername(request.getUsername());
        
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        
        if (user.getDeleted() == 1) {
            return Result.error("用户不存在");
        }
        
        if (user.getStatus() == 0) {
            return Result.error("用户已被禁用");
        }
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Result.error("用户名或密码错误");
        }
        
        // 生成JWT Token
        String token = jwtUtils.generateToken(user.getId(), user.getUsername(), user.getRole());
        
        // 构建响应
        LoginResponse response = LoginResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .expiresIn(86400L)
            .userInfo(LoginResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build()
            )
            .build();
        
        return Result.success(response);
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    @Operation(summary = "获取当前用户信息")
    public Result<SysUser> getUserInfo() {
        // TODO: 从SecurityContext获取当前用户ID
        return Result.success(new SysUser());
    }
}