package com.cdc.vector.service;

import com.cdc.vector.dto.MonitoringQueryDTO;
import com.cdc.vector.entity.VectorMonitoring;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * 数据导出服务接口
 */
public interface DataExportService {
    
    /**
     * 导出监测数据到Excel
     * @param query 查询条件
     * @param response HTTP响应
     * @throws IOException IO异常
     */
    void exportToExcel(MonitoringQueryDTO query, HttpServletResponse response) throws IOException;
    
    /**
     * 获取导出数据
     * @param query 查询条件
     * @return 数据列表
     */
    List<VectorMonitoring> getExportData(MonitoringQueryDTO query);
}