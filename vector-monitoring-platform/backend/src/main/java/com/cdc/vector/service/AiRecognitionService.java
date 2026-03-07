package com.cdc.vector.service;

import com.cdc.vector.dto.AiRecognitionResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * AI识别服务接口
 */
public interface AiRecognitionService {
    
    /**
     * 识别监测记录图片
     * @param imageFile 图片文件
     * @param vectorType 病媒类型（可选，用于提高识别准确率）
     * @return 识别结果
     */
    AiRecognitionResponse recognizeMonitoringRecord(MultipartFile imageFile, String vectorType);
}