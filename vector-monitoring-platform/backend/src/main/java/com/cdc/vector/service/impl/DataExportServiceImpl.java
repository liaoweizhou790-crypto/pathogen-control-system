package com.cdc.vector.service.impl;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cdc.vector.dto.MonitoringQueryDTO;
import com.cdc.vector.entity.VectorMonitoring;
import com.cdc.vector.mapper.VectorMonitoringMapper;
import com.cdc.vector.service.DataExportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据导出服务实现
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataExportServiceImpl implements DataExportService {
    
    private final VectorMonitoringMapper monitoringMapper;
    
    @Override
    public void exportToExcel(MonitoringQueryDTO query, HttpServletResponse response) throws IOException {
        // 设置响应头
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        
        // 设置文件名
        String fileName = URLEncoder.encode(
            "病媒监测数据_" + query.getStartDate() + "_" + query.getEndDate(), 
            StandardCharsets.UTF_8
        ).replaceAll("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
        
        // 获取导出数据
        List<VectorMonitoring> dataList = getExportData(query);
        
        // 转换为Excel数据
        List<Map<String, Object>> excelData = convertToExcelData(dataList);
        
        // 写入Excel
        EasyExcel.write(response.getOutputStream())
            .head(head())
            .sheet("监测数据")
            .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
            .doWrite(excelData);
    }
    
    @Override
    public List<VectorMonitoring> getExportData(MonitoringQueryDTO query) {
        LambdaQueryWrapper<VectorMonitoring> wrapper = new LambdaQueryWrapper<>();
        
        if (query.getVectorType() != null) {
            wrapper.eq(VectorMonitoring::getVectorType, query.getVectorType());
        }
        if (query.getDistrictId() != null) {
            wrapper.eq(VectorMonitoring::getDistrictId, query.getDistrictId());
        }
        if (query.getYear() != null) {
            wrapper.eq(VectorMonitoring::getYear, query.getYear());
        }
        if (query.getMonth() != null) {
            wrapper.eq(VectorMonitoring::getMonth, query.getMonth());
        }
        if (query.getStartDate() != null) {
            wrapper.ge(VectorMonitoring::getMonitorDate, query.getStartDate());
        }
        if (query.getEndDate() != null) {
            wrapper.le(VectorMonitoring::getMonitorDate, query.getEndDate());
        }
        
        wrapper.orderByDesc(VectorMonitoring::getMonitorDate);
        
        return monitoringMapper.selectList(wrapper);
    }
    
    /**
     * 转换为Excel数据格式
     */
    private List<Map<String, Object>> convertToExcelData(List<VectorMonitoring> dataList) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        Map<String, String> typeMap = new HashMap<>();
        typeMap.put("MOSQUITO", "蚊密度");
        typeMap.put("FLY", "蝇密度");
        typeMap.put("COCKROACH", "蟑密度");
        typeMap.put("RODENT", "鼠密度");
        
        for (VectorMonitoring item : dataList) {
            Map<String, Object> row = new HashMap<>();
            row.put("监测日期", item.getMonitorDate());
            row.put("病媒类型", typeMap.getOrDefault(item.getVectorType(), item.getVectorType()));
            row.put("监测方法", item.getMonitorMethod());
            row.put("区县ID", item.getDistrictId());
            row.put("监测点ID", item.getPointId());
            row.put("布放数量", item.getDeployCount());
            row.put("监测时长", item.getDuration());
            row.put("回收数量", item.getRecoveryCount());
            row.put("捕获数量", item.getCatchCount());
            row.put("雌蚊数量", item.getFemaleCount());
            row.put("密度值", item.getDensity());
            row.put("天气", item.getWeather());
            row.put("备注", item.getRemark());
            result.add(row);
        }
        
        return result;
    }
    
    /**
     * Excel表头
     */
    private List<List<String>> head() {
        List<List<String>> head = new ArrayList<>();
        String[] headers = {"监测日期", "病媒类型", "监测方法", "区县ID", "监测点ID", 
                          "布放数量", "监测时长", "回收数量", "捕获数量", "雌蚊数量", 
                          "密度值", "天气", "备注"};
        for (String h : headers) {
            List<String> list = new ArrayList<>();
            list.add(h);
            head.add(list);
        }
        return head;
    }
}