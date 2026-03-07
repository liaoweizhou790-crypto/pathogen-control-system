package com.cdc.vector.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * AI识别响应DTO
 */
@Data
@Builder
public class AiRecognitionResponse {
    
    /**
     * 识别是否成功
     */
    private Boolean success;
    
    /**
     * 置信度 (0-100)
     */
    private Integer confidence;
    
    /**
     * 识别的病媒类型
     */
    private String vectorType;
    
    /**
     * 识别的监测方法
     */
    private String monitorMethod;
    
    /**
     * 识别出的字段数据
     */
    private Map<String, Object> data;
    
    /**
     * 原始文本（用于调试）
     */
    private String rawText;
    
    /**
     * 错误信息
     */
    private String errorMessage;
}