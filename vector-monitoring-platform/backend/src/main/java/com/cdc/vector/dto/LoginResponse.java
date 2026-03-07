package com.cdc.vector.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 登录响应DTO
 */
@Data
@Builder
public class LoginResponse {
    
    private String token;
    private String tokenType;
    private Long expiresIn;
    private UserInfo userInfo;
    
    @Data
    @Builder
    public static class UserInfo {
        private Long id;
        private String username;
        private String realName;
        private String avatar;
        private String role;
    }
}