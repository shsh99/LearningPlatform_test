package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.DashboardStatisticsResponse;
import com.example.demo.domain.timeschedule.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 대시보드 통계 API
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * 대시보드 전체 통계 조회
     */
    @GetMapping({"", "/statistics"})
    public ResponseEntity<DashboardStatisticsResponse> getDashboardStatistics() {
        log.info("Getting dashboard statistics");
        DashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * 전체 현황 통계 조회
     */
    @GetMapping("/overall")
    public ResponseEntity<DashboardStatisticsResponse.OverallStatistics> getOverallStatistics() {
        log.info("Getting overall statistics");
        DashboardStatisticsResponse.OverallStatistics statistics = dashboardService.getOverallStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * 오늘의 일정 조회
     */
    @GetMapping("/today")
    public ResponseEntity<DashboardStatisticsResponse.TodaySchedules> getTodaySchedules() {
        log.info("Getting today's schedules");
        DashboardStatisticsResponse.TodaySchedules schedules = dashboardService.getTodaySchedules();
        return ResponseEntity.ok(schedules);
    }

    /**
     * 이번 주 일정 요약 조회
     */
    @GetMapping("/weekly")
    public ResponseEntity<DashboardStatisticsResponse.WeeklyScheduleSummary> getWeeklyScheduleSummary() {
        log.info("Getting weekly schedule summary");
        DashboardStatisticsResponse.WeeklyScheduleSummary summary = dashboardService.getWeeklyScheduleSummary();
        return ResponseEntity.ok(summary);
    }
}
