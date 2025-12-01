package com.example.demo.domain.tenant.service;

import com.example.demo.domain.tenant.dto.*;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.entity.TenantBranding;
import com.example.demo.domain.tenant.entity.TenantLabels;
import com.example.demo.domain.tenant.entity.TenantSettings;
import com.example.demo.domain.tenant.entity.TenantStatus;
import com.example.demo.domain.tenant.exception.TenantCodeAlreadyExistsException;
import com.example.demo.domain.tenant.exception.TenantNotFoundException;
import com.example.demo.domain.tenant.repository.TenantBrandingRepository;
import com.example.demo.domain.tenant.repository.TenantLabelsRepository;
import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.tenant.repository.TenantSettingsRepository;
import com.example.demo.global.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final TenantBrandingRepository brandingRepository;
    private final TenantSettingsRepository settingsRepository;
    private final TenantLabelsRepository labelsRepository;

    @Override
    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request) {
        if (tenantRepository.existsByCode(request.code())) {
            throw new TenantCodeAlreadyExistsException(request.code());
        }

        Tenant tenant = Tenant.create(request.code(), request.name(), request.domain());
        tenant = tenantRepository.save(tenant);

        // 기본 설정 생성
        TenantBranding branding = TenantBranding.createDefault(tenant);
        TenantSettings settings = TenantSettings.createDefault(tenant);
        TenantLabels labels = TenantLabels.createDefault(tenant);

        tenant.assignBranding(branding);
        tenant.assignSettings(settings);

        brandingRepository.save(branding);
        settingsRepository.save(settings);
        labelsRepository.save(labels);

        return TenantResponse.from(tenant);
    }

    @Override
    public TenantDetailResponse getTenant(Long tenantId) {
        Tenant tenant = tenantRepository.findByIdWithDetails(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        return TenantDetailResponse.from(tenant);
    }

    @Override
    public TenantDetailResponse getTenantByCode(String code) {
        Tenant tenant = tenantRepository.findByCodeWithDetails(code)
                .orElseThrow(() -> new TenantNotFoundException(code));
        return TenantDetailResponse.from(tenant);
    }

    @Override
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(TenantResponse::from)
                .toList();
    }

    @Override
    public List<TenantResponse> getActiveTenants() {
        return tenantRepository.findAllActive().stream()
                .map(TenantResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public TenantResponse updateTenant(Long tenantId, UpdateTenantRequest request) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));

        if (request.name() != null) {
            tenant.updateName(request.name());
        }
        if (request.domain() != null) {
            tenant.updateDomain(request.domain());
        }

        return TenantResponse.from(tenant);
    }

    @Override
    @Transactional
    public void deleteTenant(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        tenant.delete();
    }

    @Override
    @Transactional
    public void activateTenant(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        tenant.activate();
    }

    @Override
    @Transactional
    public void deactivateTenant(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        tenant.deactivate();
    }

    @Override
    public TenantBrandingResponse getBranding(Long tenantId) {
        TenantBranding branding = brandingRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        return TenantBrandingResponse.from(branding);
    }

    @Override
    @Transactional
    public TenantBrandingResponse updateBranding(Long tenantId, UpdateTenantBrandingRequest request) {
        TenantBranding branding = brandingRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));

        if (request.logoUrl() != null) {
            branding.updateLogo(request.logoUrl());
        }
        if (request.faviconUrl() != null) {
            branding.updateFavicon(request.faviconUrl());
        }
        if (request.fontFamily() != null) {
            branding.updateFontFamily(request.fontFamily());
        }
        if (request.fontUrl() != null) {
            branding.updateFontUrl(request.fontUrl());
        }
        if (request.customCss() != null) {
            branding.updateCustomCss(request.customCss());
        }

        // 색상 업데이트
        branding.updateAllColors(
                request.primaryColor() != null ? request.primaryColor() : branding.getPrimaryColor(),
                request.secondaryColor() != null ? request.secondaryColor() : branding.getSecondaryColor(),
                request.accentColor() != null ? request.accentColor() : branding.getAccentColor(),
                request.headerBgColor() != null ? request.headerBgColor() : branding.getHeaderBgColor(),
                request.headerTextColor() != null ? request.headerTextColor() : branding.getHeaderTextColor(),
                request.sidebarBgColor() != null ? request.sidebarBgColor() : branding.getSidebarBgColor(),
                request.sidebarTextColor() != null ? request.sidebarTextColor() : branding.getSidebarTextColor(),
                request.sidebarActiveColor() != null ? request.sidebarActiveColor() : branding.getSidebarActiveColor(),
                request.sidebarActiveTextColor() != null ? request.sidebarActiveTextColor() : branding.getSidebarActiveTextColor(),
                request.buttonPrimaryBgColor() != null ? request.buttonPrimaryBgColor() : branding.getButtonPrimaryBgColor(),
                request.buttonPrimaryTextColor() != null ? request.buttonPrimaryTextColor() : branding.getButtonPrimaryTextColor(),
                request.buttonSecondaryBgColor() != null ? request.buttonSecondaryBgColor() : branding.getButtonSecondaryBgColor(),
                request.buttonSecondaryTextColor() != null ? request.buttonSecondaryTextColor() : branding.getButtonSecondaryTextColor(),
                request.backgroundColor() != null ? request.backgroundColor() : branding.getBackgroundColor()
        );

        return TenantBrandingResponse.from(branding);
    }

    @Override
    public TenantSettingsResponse getSettings(Long tenantId) {
        TenantSettings settings = settingsRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        return TenantSettingsResponse.from(settings);
    }

    @Override
    @Transactional
    public TenantSettingsResponse updateSettings(Long tenantId, UpdateTenantSettingsRequest request) {
        TenantSettings settings = settingsRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));

        settings.updateAllFeatures(
                request.courseEnabled(),
                request.enrollmentEnabled(),
                request.applicationEnabled(),
                request.dashboardEnabled(),
                request.instructorManagementEnabled(),
                request.studentManagementEnabled(),
                request.reportEnabled(),
                request.notificationEnabled()
        );

        if (request.menuVisibility() != null) {
            settings.updateMenuVisibility(request.menuVisibility());
        }
        if (request.componentOrder() != null) {
            settings.updateComponentOrder(request.componentOrder());
        }

        settings.updateLimits(request.maxUsersLimit(), request.maxCoursesLimit());
        settings.updateGeneralSettings(
                request.sessionTimeoutMinutes(),
                request.defaultLanguage(),
                request.timezone()
        );

        return TenantSettingsResponse.from(settings);
    }

    @Override
    public TenantLabelsResponse getLabels(Long tenantId) {
        TenantLabels labels = labelsRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
        return TenantLabelsResponse.from(labels);
    }

    @Override
    @Transactional
    public TenantLabelsResponse updateLabels(Long tenantId, UpdateTenantLabelsRequest request) {
        TenantLabels labels = labelsRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));

        labels.updateAllLabels(
                request.courseLabel(),
                request.termLabel(),
                request.studentLabel(),
                request.instructorLabel(),
                request.enrollmentLabel(),
                request.applicationLabel(),
                request.dashboardLabel(),
                request.platformName()
        );

        if (request.customLabels() != null) {
            labels.updateCustomLabels(request.customLabels());
        }

        return TenantLabelsResponse.from(labels);
    }

    @Override
    public TenantDetailResponse getCurrentTenant() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return getTenant(tenantId);
    }

    @Override
    public TenantBrandingResponse getCurrentTenantBranding() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return getBranding(tenantId);
    }

    @Override
    public TenantSettingsResponse getCurrentTenantSettings() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return getSettings(tenantId);
    }

    @Override
    public TenantLabelsResponse getCurrentTenantLabels() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return getLabels(tenantId);
    }

    @Override
    @Transactional
    public TenantBrandingResponse updateCurrentTenantBranding(UpdateTenantBrandingRequest request) {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return updateBranding(tenantId, request);
    }

    @Override
    @Transactional
    public TenantSettingsResponse updateCurrentTenantSettings(UpdateTenantSettingsRequest request) {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return updateSettings(tenantId, request);
    }

    @Override
    @Transactional
    public TenantLabelsResponse updateCurrentTenantLabels(UpdateTenantLabelsRequest request) {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new TenantNotFoundException("current");
        }
        return updateLabels(tenantId, request);
    }

    @Override
    public TenantBrandingResponse getBrandingByCode(String code) {
        Tenant tenant = tenantRepository.findByCode(code)
                .orElseThrow(() -> new TenantNotFoundException(code));

        if (!tenant.isActive()) {
            throw new TenantNotFoundException(code);
        }

        TenantBranding branding = brandingRepository.findById(tenant.getId())
                .orElseThrow(() -> new TenantNotFoundException(code));
        return TenantBrandingResponse.from(branding);
    }

    @Override
    public TenantLabelsResponse getLabelsByCode(String code) {
        Tenant tenant = tenantRepository.findByCode(code)
                .orElseThrow(() -> new TenantNotFoundException(code));

        if (!tenant.isActive()) {
            throw new TenantNotFoundException(code);
        }

        TenantLabels labels = labelsRepository.findById(tenant.getId())
                .orElseThrow(() -> new TenantNotFoundException(code));
        return TenantLabelsResponse.from(labels);
    }

    @Override
    public boolean existsByCode(String code) {
        return tenantRepository.findByCode(code)
                .map(Tenant::isActive)
                .orElse(false);
    }

    @Override
    public List<PublicTenantResponse> getPublicActiveTenants() {
        return tenantRepository.findByStatus(TenantStatus.ACTIVE).stream()
                .map(PublicTenantResponse::from)
                .toList();
    }
}
