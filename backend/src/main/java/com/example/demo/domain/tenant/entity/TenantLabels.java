package com.example.demo.domain.tenant.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tenant_labels")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class TenantLabels extends BaseTimeEntity {

    @Id
    private Long tenantId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    // 메뉴 라벨 커스터마이징
    @Column(length = 50)
    private String courseLabel = "강의";  // 기본값: 강의, 변경 가능: 교육과정, 프로그램

    @Column(length = 50)
    private String termLabel = "차수";  // 기본값: 차수, 변경 가능: 기수, 회차

    @Column(length = 50)
    private String studentLabel = "수강생";  // 기본값: 수강생, 변경 가능: 학생, 교육생

    @Column(length = 50)
    private String instructorLabel = "강사";  // 기본값: 강사, 변경 가능: 교수, 트레이너

    @Column(length = 50)
    private String enrollmentLabel = "수강신청";  // 기본값: 수강신청, 변경 가능: 등록

    @Column(length = 50)
    private String applicationLabel = "신청";  // 기본값: 신청, 변경 가능: 지원

    @Column(length = 50)
    private String dashboardLabel = "대시보드";  // 기본값: 대시보드, 변경 가능: 현황판

    @Column(length = 100)
    private String platformName = "Learning Platform";  // 플랫폼 이름

    // 추가 커스텀 라벨 (JSON 형태로 저장)
    @Column(columnDefinition = "TEXT")
    private String customLabels;

    private TenantLabels(Tenant tenant) {
        this.tenant = tenant;
    }

    public static TenantLabels createDefault(Tenant tenant) {
        return new TenantLabels(tenant);
    }

    public void updateCourseLabel(String label) {
        this.courseLabel = label;
    }

    public void updateTermLabel(String label) {
        this.termLabel = label;
    }

    public void updateStudentLabel(String label) {
        this.studentLabel = label;
    }

    public void updateInstructorLabel(String label) {
        this.instructorLabel = label;
    }

    public void updateEnrollmentLabel(String label) {
        this.enrollmentLabel = label;
    }

    public void updateApplicationLabel(String label) {
        this.applicationLabel = label;
    }

    public void updateDashboardLabel(String label) {
        this.dashboardLabel = label;
    }

    public void updatePlatformName(String name) {
        this.platformName = name;
    }

    public void updateCustomLabels(String customLabels) {
        this.customLabels = customLabels;
    }

    public void updateAllLabels(
            String courseLabel,
            String termLabel,
            String studentLabel,
            String instructorLabel,
            String enrollmentLabel,
            String applicationLabel,
            String dashboardLabel,
            String platformName
    ) {
        if (courseLabel != null) this.courseLabel = courseLabel;
        if (termLabel != null) this.termLabel = termLabel;
        if (studentLabel != null) this.studentLabel = studentLabel;
        if (instructorLabel != null) this.instructorLabel = instructorLabel;
        if (enrollmentLabel != null) this.enrollmentLabel = enrollmentLabel;
        if (applicationLabel != null) this.applicationLabel = applicationLabel;
        if (dashboardLabel != null) this.dashboardLabel = dashboardLabel;
        if (platformName != null) this.platformName = platformName;
    }
}
