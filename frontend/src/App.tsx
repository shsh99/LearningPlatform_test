import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { NoticeProvider } from './components/notice';
import { TenantLayout, DefaultLayout } from './components/layout';

// 페이지 컴포넌트
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { CoursePage } from './pages/course/CoursePage';
import { CourseDetailPage } from './pages/course/CourseDetailPage';
import { CreateCourseApplicationPage } from './pages/courseapplication/CreateCourseApplicationPage';
import { MyCourseApplicationsPage } from './pages/courseapplication/MyCourseApplicationsPage';
import { MyEnrollmentsPage } from './pages/enrollment/MyEnrollmentsPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { OperatorDashboardPage } from './pages/operator/OperatorDashboardPage';
import { OperatorAssignmentsPage } from './pages/operator/OperatorAssignmentsPage';
import { CourseTermManagementPage } from './pages/timeschedule/CourseTermManagementPage';
import { CourseTermDetailPage } from './pages/timeschedule/CourseTermDetailPage';
import { InstructorAssignmentManagementPage } from './pages/timeschedule/InstructorAssignmentManagementPage';
import { InstructorInformationSystemPage } from './pages/timeschedule/InstructorInformationSystemPage';
import { StudentInformationSystemPage } from './pages/enrollment/StudentInformationSystemPage';
import { MyLearningPage } from './pages/learning/MyLearningPage';
import { MyAssignedCoursesPage } from './pages/instructor/MyAssignedCoursesPage';
import { BrandingSettingsPage } from './pages/tenant-admin/BrandingSettingsPage';
import { OperatorManagementPage } from './pages/tenant-admin/OperatorManagementPage';
import { TenantAdminDashboardPage } from './pages/tenant-admin/TenantAdminDashboardPage';
import LayoutSettingsPage from './pages/tenant-admin/LayoutSettingsPage';
import { TenantManagementPage } from './pages/super-admin/TenantManagementPage';
import { CreateTenantAdminPage } from './pages/super-admin/CreateTenantAdminPage';
import { TenantApplicationManagementPage } from './pages/super-admin/TenantApplicationManagementPage';
import { SuperAdminDashboardPage } from './pages/super-admin/SuperAdminDashboardPage';
import { NoticeManagementPage } from './pages/super-admin/NoticeManagementPage';
import { ApplyTenantPage } from './pages/ApplyTenantPage';
import { TenantNoticeManagementPage } from './pages/tenant-admin/TenantNoticeManagementPage';

/**
 * 테넌트 내부 라우트 (회사별 페이지)
 * /:tenantCode/* 경로에서 사용되는 공통 라우트
 */
function TenantRoutes() {
    return (
        <TenantLayout>
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="courses" element={<CoursePage />} />
                <Route path="courses/:id" element={<CourseDetailPage />} />
                <Route path="apply-course" element={<CreateCourseApplicationPage />} />
                <Route path="my-applications" element={<MyCourseApplicationsPage />} />
                <Route path="my-enrollments" element={<MyEnrollmentsPage />} />
                <Route path="my-profile" element={<MyProfilePage />} />
                <Route path="operator/dashboard" element={<OperatorDashboardPage />} />
                <Route path="operator/terms" element={<CourseTermManagementPage />} />
                <Route path="operator/assignments" element={<OperatorAssignmentsPage />} />
                <Route path="ts/terms" element={<CourseTermManagementPage />} />
                <Route path="ts/terms/:id" element={<CourseTermDetailPage />} />
                <Route path="ts/assignments" element={<InstructorAssignmentManagementPage />} />
                <Route path="ts/iis" element={<InstructorInformationSystemPage />} />
                <Route path="enrollment/sis" element={<StudentInformationSystemPage />} />
                <Route path="my-learning" element={<MyLearningPage />} />
                <Route path="my-assigned-courses" element={<MyAssignedCoursesPage />} />
                <Route path="tenant-admin/dashboard" element={<TenantAdminDashboardPage />} />
                <Route path="tenant-admin/branding" element={<BrandingSettingsPage />} />
                <Route path="tenant-admin/layout" element={<LayoutSettingsPage />} />
                <Route path="tenant-admin/operators" element={<OperatorManagementPage />} />
                <Route path="tenant-admin/notices" element={<TenantNoticeManagementPage />} />
            </Routes>
        </TenantLayout>
    );
}

/**
 * 앱 라우팅 구조
 *
 * URL 구조:
 * - 기본 라우트 (테넌트 코드 없음):
 *   - / : 메인 랜딩 페이지 (테넌트 신청 안내)
 *   - /apply-tenant : 테넌트 신청 페이지
 *   - /super-admin/* : 슈퍼 관리자 페이지
 *
 * - 테넌트 라우트 (회사별):
 *   - /:tenantCode/ : 회사별 홈페이지
 *   - /:tenantCode/login : 회사별 로그인
 *   - /:tenantCode/courses : 회사별 강의 목록
 *   - 등...
 */
function AppRoutes() {
    return (
        <Routes>
            {/* ===== 기본 라우트 (테넌트 코드 없음) ===== */}

            {/* 메인 랜딩 페이지 */}
            <Route path="/" element={<DefaultLayout><HomePage /></DefaultLayout>} />

            {/* 기본 인증 페이지 (테넌트 없음) */}
            <Route path="/login" element={<DefaultLayout><LoginPage /></DefaultLayout>} />
            <Route path="/signup" element={<DefaultLayout><SignupPage /></DefaultLayout>} />
            <Route path="/forgot-password" element={<DefaultLayout><ForgotPasswordPage /></DefaultLayout>} />
            <Route path="/reset-password/:token" element={<DefaultLayout><ResetPasswordPage /></DefaultLayout>} />

            {/* 비회원 테넌트 신청 */}
            <Route path="/apply-tenant" element={<DefaultLayout><ApplyTenantPage /></DefaultLayout>} />

            {/* SUPER_ADMIN 전용 페이지 */}
            <Route path="/super-admin/dashboard" element={<DefaultLayout><SuperAdminDashboardPage /></DefaultLayout>} />
            <Route path="/super-admin/tenants" element={<DefaultLayout><TenantManagementPage /></DefaultLayout>} />
            <Route path="/super-admin/create-tenant-admin" element={<DefaultLayout><CreateTenantAdminPage /></DefaultLayout>} />
            <Route path="/super-admin/applications" element={<DefaultLayout><TenantApplicationManagementPage /></DefaultLayout>} />
            <Route path="/super-admin/notices" element={<DefaultLayout><NoticeManagementPage /></DefaultLayout>} />

            {/* ===== 테넌트 라우트 (/:tenantCode/*) ===== */}
            <Route path="/:tenantCode/*" element={<TenantRoutes />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TenantProvider>
                    <NoticeProvider>
                        <AppRoutes />
                    </NoticeProvider>
                </TenantProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
