package com.cdc.vector.service.impl;

import com.cdc.vector.dto.AiRecognitionResponse;
import com.cdc.vector.service.AiRecognitionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 * Kimi AI识别服务实现
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KimiAiRecognitionServiceImpl implements AiRecognitionService {
    
    @Value("${kimi.api.key:}")
    private String apiKey;
    
    @Value("${kimi.api.url:https://api.moonshot.cn/v1/chat/completions}")
    private String apiUrl;
    
    @Value("${kimi.api.model:moonshot-v1-8k-vision-preview}")
    private String model;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public AiRecognitionResponse recognizeMonitoringRecord(MultipartFile imageFile, String vectorType) {
        try {
            // 检查API Key
            if (apiKey == null || apiKey.isEmpty()) {
                log.warn("Kimi API Key未配置，返回模拟数据");
                return generateMockResponse(vectorType);
            }
            
            // 将图片转为Base64
            String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
            
            // 构建提示词
            String prompt = buildPrompt(vectorType);
            
            // 构建请求体
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.1);
            
            List<Map<String, Object>> messages = new ArrayList<>();
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            
            List<Map<String, Object>> content = new ArrayList<>();
            
            // 添加文本内容
            Map<String, Object> textContent = new HashMap<>();
            textContent.put("type", "text");
            textContent.put("text", prompt);
            content.add(textContent);
            
            // 添加图片内容
            Map<String, Object> imageContent = new HashMap<>();
            imageContent.put("type", "image_url");
            Map<String, String> imageUrl = new HashMap<>();
            imageUrl.put("url", "data:image/jpeg;base64," + base64Image);
            imageContent.put("image_url", imageUrl);
            content.add(imageContent);
            
            message.put("content", content);
            messages.add(message);
            requestBody.put("messages", messages);
            
            // 发送请求
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            // 解析响应
            return parseResponse(response.getBody());
            
        } catch (Exception e) {
            log.error("AI识别失败: {}", e.getMessage(), e);
            return AiRecognitionResponse.builder()
                .success(false)
                .errorMessage("识别失败: " + e.getMessage())
                .build();
        }
    }
    
    /**
     * 构建提示词
     */
    private String buildPrompt(String vectorType) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("请识别这张病媒生物监测记录表，提取以下字段信息：\n\n");
        
        if ("mosquito".equals(vectorType)) {
            prompt.append("蚊密度监测（诱蚊灯法）：\n");
            prompt.append("- 布灯数\n");
            prompt.append("- 诱蚊夜数\n");
            prompt.append("- 捕获雌蚊数\n");
            prompt.append("- 蚊种组成（各类蚊子的数量）\n");
            prompt.append("- 监测日期\n");
            prompt.append("- 监测点名称\n");
        } else if ("fly".equals(vectorType)) {
            prompt.append("蝇密度监测（捕蝇笼法）：\n");
            prompt.append("- 捕蝇笼数\n");
            prompt.append("- 监测天数\n");
            prompt.append("- 捕获蝇总数\n");
            prompt.append("- 监测日期\n");
            prompt.append("- 监测点名称\n");
        } else {
            prompt.append("请根据表格类型自动识别：\n");
            prompt.append("- 病媒类型（蚊/蝇/蟑/鼠等）\n");
            prompt.append("- 监测方法\n");
            prompt.append("- 各项数量数据\n");
            prompt.append("- 监测日期\n");
            prompt.append("- 监测点名称\n");
        }
        
        prompt.append("\n请以JSON格式返回识别结果，格式如下：\n");
        prompt.append("{\n");
        prompt.append("  \"vectorType\": \"病媒类型\",\n");
        prompt.append("  \"monitorMethod\": \"监测方法\",\n");
        prompt.append("  \"data\": {\n");
        prompt.append("    \"deployCount\": 布放数量,\n");
        prompt.append("    \"duration\": 监测时长,\n");
        prompt.append("    \"catchCount\": 捕获数量,\n");
        prompt.append("    \"monitorDate\": \"YYYY-MM-DD\",\n");
        prompt.append("    \"pointName\": \"监测点名称\"\n");
        prompt.append("  },\n");
        prompt.append("  \"confidence\": 置信度(0-100)\n");
        prompt.append("}");
        
        return prompt.toString();
    }
    
    /**
     * 解析API响应
     */
    private AiRecognitionResponse parseResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode choices = root.path("choices");
            
            if (choices.isEmpty()) {
                return AiRecognitionResponse.builder()
                    .success(false)
                    .errorMessage("API返回为空")
                    .build();
            }
            
            String content = choices.get(0).path("message").path("content").asText();
            
            // 尝试从响应中提取JSON
            String jsonStr = extractJson(content);
            JsonNode result = objectMapper.readTree(jsonStr);
            
            Map<String, Object> data = new HashMap<>();
            JsonNode dataNode = result.path("data");
            if (dataNode.isObject()) {
                dataNode.fields().forEachRemaining(entry -> {
                    data.put(entry.getKey(), entry.getValue());
                });
            }
            
            return AiRecognitionResponse.builder()
                .success(true)
                .confidence(result.path("confidence").asInt(80))
                .vectorType(result.path("vectorType").asText())
                .monitorMethod(result.path("monitorMethod").asText())
                .data(data)
                .rawText(content)
                .build();
                
        } catch (Exception e) {
            log.error("解析响应失败: {}", e.getMessage());
            return AiRecognitionResponse.builder()
                .success(false)
                .errorMessage("解析失败: " + e.getMessage())
                .rawText(responseBody)
                .build();
        }
    }
    
    /**
     * 从文本中提取JSON
     */
    private String extractJson(String text) {
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }
    
    /**
     * 生成模拟响应（用于测试）
     */
    private AiRecognitionResponse generateMockResponse(String vectorType) {
        Map<String, Object> data = new HashMap<>();
        data.put("deployCount", 20);
        data.put("duration", 2.0);
        data.put("catchCount", 15);
        data.put("monitorDate", "2025-02-25");
        data.put("pointName", "太平镇卫生院");
        
        return AiRecognitionResponse.builder()
            .success(true)
            .confidence(92)
            .vectorType(vectorType != null ? vectorType : "mosquito")
            .monitorMethod("诱蚊灯法")
            .data(data)
            .rawText("模拟识别结果")
            .build();
    }
}