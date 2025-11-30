package com.example.demo.domain.tenant.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tenant_settings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class TenantSettings extends BaseTimeEntity {

    @Id
    private Long tenantId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    // 기능 ON/OFF (Feature Flags)
    @Column(nullable = false)
    private Boolean courseEnabled = true;

    @Column(nullable = false)
    private Boolean enrollmentEnabled = true;

    @Column(nullable = false)
    private Boolean applicationEnabled = true;

    @Column(nullable = false)
    private Boolean dashboardEnabled = true;

    @Column(nullable = false)
    private Boolean instructorManagementEnabled = true;

    @Column(nullable = false)
    private Boolean studentManagementEnabled = true;

    @Column(nullable = false)
    private Boolean reportEnabled = false;

    @Column(nullable = false)
    private Boolean notificationEnabled = false;

    // 메뉴 가시성 설정 (JSON 형태로 저장)
    @Column(columnDefinition = "TEXT")
    private String menuVisibility;

    // 컴포넌트 순서 설정 (JSON 형태로 저장)
    @Column(columnDefinition = "TEXT")
    private String componentOrder;

    // 일반 설정
    @Column(nullable = false)
    private Integer maxUsersLimit = 1000;

    @Column(nullable = false)
    private Integer maxCoursesLimit = 100;

    @Column(nullable = false)
    private Integer sessionTimeoutMinutes = 30;

    @Column(length = 10)
    private String defaultLanguage = "ko";

    @Column(length = 50)
    private String timezone = "Asia/Seoul";

    private TenantSettings(Tenant tenant) {
        this.tenant = tenant;
    }

    public static TenantSettings createDefault(Tenant tenant) {
        return new TenantSettings(tenant);
    }

    // Feature flag 업데이트 메서드
    public void updateCourseEnabled(boolean enabled) {
        this.courseEnabled = enabled;
    }

    public void updateEnrollmentEnabled(boolean enabled) {
        this.enrollmentEnabled = enabled;
    }

    public void updateApplicationEnabled(boolean enabled) {
        this.applicationEnabled = enabled;
    }

    public void updateDashboardEnabled(boolean enabled) {
        this.dashboardEnabled = enabled;
    }

    public void updateInstructorManagementEnabled(boolean enabled) {
        this.instructorManagementEnabled = enabled;
    }

    public void updateStudentManagementEnabled(boolean enabled) {
        this.studentManagementEnabled = enabled;
    }

    public void updateReportEnabled(boolean enabled) {
        this.reportEnabled = enabled;
    }

    public void updateNotificationEnabled(boolean enabled) {
        this.notificationEnabled = enabled;
    }

    public void updateMenuVisibility(String menuVisibility) {
        this.menuVisibility = menuVisibility;
    }

    public void updateComponentOrder(String componentOrder) {
        this.componentOrder = componentOrder;
    }

    public void updateLimits(Integer maxUsersLimit, Integer maxCoursesLimit) {
        if (maxUsersLimit != null) {
            this.maxUsersLimit = maxUsersLimit;
        }
        if (maxCoursesLimit != null) {
            this.maxCoursesLimit = maxCoursesLimit;
        }
    }

    public void updateGeneralSettings(Integer sessionTimeoutMinutes, String defaultLanguage, String timezone) {
        if (sessionTimeoutMinutes != null) {
            this.sessionTimeoutMinutes = sessionTimeoutMinutes;
        }
        if (defaultLanguage != null) {
            this.defaultLanguage = defaultLanguage;
        }
        if (timezone != null) {
            this.timezone = timezone;
        }
    }

    public void updateAllFeatures(
            Boolean courseEnabled,
            Boolean enrollmentEnabled,
            Boolean applicationEnabled,
            Boolean dashboardEnabled,
            Boolean instructorManagementEnabled,
            Boolean studentManagementEnabled,
            Boolean reportEnabled,
            Boolean notificationEnabled
    ) {
        if (courseEnabled != null) this.courseEnabled = courseEnabled;
        if (enrollmentEnabled != null) this.enrollmentEnabled = enrollmentEnabled;
        if (applicationEnabled != null) this.applicationEnabled = applicationEnabled;
        if (dashboardEnabled != null) this.dashboardEnabled = dashboardEnabled;
        if (instructorManagementEnabled != null) this.instructorManagementEnabled = instructorManagementEnabled;
        if (studentManagementEnabled != null) this.studentManagementEnabled = studentManagementEnabled;
        if (reportEnabled != null) this.reportEnabled = reportEnabled;
        if (notificationEnabled != null) this.notificationEnabled = notificationEnabled;
    }
}
