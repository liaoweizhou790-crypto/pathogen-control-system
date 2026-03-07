package com.cdc.vector.controller;

import com.cdc.vector.common.Result;
import com.cdc.vector.dto.AiRecognitionResponse;
import com.cdc.vector.service.AiRecognitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * AI识别控制器
 */
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI识别", description = "基于Kimi Vision API的图像识别")
public class AiRecognitionController {
    
    private final AiRecognitionService aiRecognitionService;
    
    /**
     * 识别监测记录图片
     */
    @PostMapping("/recognize")
    @Operation(summary = "识别监测记录图片")
    public Result<AiRecognitionResponse> recognize(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "vectorType", required = false) String vectorType) {
        
        if (file.isEmpty()) {
            return Result.error("请选择要识别的图片");
        }
        
        // 检查文件类型
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return Result.error("请上传图片文件");
        }
        
        // 检查文件大小（最大10MB）
        if (file.getSize() > 10 * 1024 * 1024) {
            return Result.error("图片大小不能超过10MB");
        }
        
        AiRecognitionResponse response = aiRecognitionService.recognizeMonitoringRecord(file, vectorType);
        
        if (response.getSuccess()) {
            return Result.success(response);
        } else {
            return Result.error(response.getErrorMessage());
        }
    }
}