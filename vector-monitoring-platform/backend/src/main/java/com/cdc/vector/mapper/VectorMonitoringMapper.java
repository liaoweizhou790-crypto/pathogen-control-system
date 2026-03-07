package com.cdc.vector.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cdc.vector.entity.VectorMonitoring;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 病媒监测数据Mapper
 */
@Mapper
public interface VectorMonitoringMapper extends BaseMapper<VectorMonitoring> {
    
    /**
     * 统计指定月份的各类病媒密度
     */
    @Select("SELECT vector_type, AVG(density) as avg_density, COUNT(*) as count " +
            "FROM vector_monitoring " +
            "WHERE year = #{year} AND month = #{month} AND deleted = 0 " +
            "GROUP BY vector_type")
    List<Map<String, Object>> selectDensityByMonth(@Param("year") Integer year, @Param("month") Integer month);
    
    /**
     * 获取指定类型病媒的月度趋势
     */
    @Select("SELECT month, AVG(density) as avg_density " +
            "FROM vector_monitoring " +
            "WHERE year = #{year} AND vector_type = #{vectorType} AND deleted = 0 " +
            "GROUP BY month ORDER BY month")
    List<Map<String, Object>> selectTrendByYear(@Param("year") Integer year, @Param("vectorType") String vectorType);
    
    /**
     * 统计各区县的病媒密度
     */
    @Select("SELECT d.name as district_name, AVG(v.density) as avg_density " +
            "FROM vector_monitoring v " +
            "LEFT JOIN sys_district d ON v.district_id = d.id " +
            "WHERE v.year = #{year} AND v.month = #{month} " +
            "AND v.vector_type = #{vectorType} AND v.deleted = 0 " +
            "GROUP BY v.district_id ORDER BY avg_density DESC")
    List<Map<String, Object>> selectDistrictComparison(@Param("year") Integer year, 
                                                           @Param("month") Integer month, 
                                                           @Param("vectorType") String vectorType);
    
    /**
     * 根据年月查询数据
     */
    @Select("SELECT * FROM vector_monitoring WHERE year = #{year} AND month = #{month} AND deleted = 0")
    List<VectorMonitoring> selectByYearMonth(@Param("year") Integer year, @Param("month") Integer month);
    
    /**
     * 根据年月范围查询数据
     */
    @Select("SELECT * FROM vector_monitoring WHERE year = #{year} AND month BETWEEN #{startMonth} AND #{endMonth} AND deleted = 0")
    List<VectorMonitoring> selectByYearMonthRange(@Param("year") Integer year, @Param("startMonth") Integer startMonth, @Param("endMonth") Integer endMonth);
    
    /**
     * 根据年份查询数据
     */
    @Select("SELECT * FROM vector_monitoring WHERE year = #{year} AND deleted = 0")
    List<VectorMonitoring> selectByYear(@Param("year") Integer year);
    
    /**
     * 根据日期范围查询数据
     */
    @Select("SELECT * FROM vector_monitoring WHERE monitor_date BETWEEN #{startDate} AND #{endDate} AND deleted = 0")
    List<VectorMonitoring> selectByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}