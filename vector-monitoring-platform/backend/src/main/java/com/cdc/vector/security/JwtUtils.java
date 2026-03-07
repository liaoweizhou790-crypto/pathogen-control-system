package com.cdc.vector.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT工具类
 */
@Component
@Slf4j
public class JwtUtils {
    
    @Value("${jwt.secret:your-secret-key-here}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}")
    private Long expiration;
    
    /**
     * 生成JWT Token
     */
    public String generateToken(Long userId, String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withClaim("username", username)
                .withClaim("role", role)
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .sign(Algorithm.HMAC256(secret));
    }
    
    /**
     * 验证Token
     */
    public boolean validateToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("Token验证失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 从Token中获取用户ID
     */
    public Long getUserIdFromToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            DecodedJWT jwt = verifier.verify(token);
            return Long.valueOf(jwt.getSubject());
        } catch (JWTVerificationException e) {
            log.error("解析Token失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 从Token中获取用户名
     */
    public String getUsernameFromToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            DecodedJWT jwt = verifier.verify(token);
            return jwt.getClaim("username").asString();
        } catch (JWTVerificationException e) {
            log.error("解析Token失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 检查Token是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            DecodedJWT jwt = verifier.verify(token);
            return jwt.getExpiresAt().before(new Date());
        } catch (JWTVerificationException e) {
            return true;
        }
    }
}