import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CoursePage } from './pages/course/CoursePage';
import { CourseDetailPage } from './pages/course/CourseDetailPage';
import { CreateCourseApplicationPage } from './pages/courseapplication/CreateCourseApplicationPage';
import { MyCourseApplicationsPage } from './pages/courseapplication/MyCourseApplicationsPage';
import { MyEnrollmentsPage } from './pages/enrollment/MyEnrollmentsPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { OperatorDashboardPage } from './pages/operator/OperatorDashboardPage';
import { OperatorTermsPage } from './pages/operator/OperatorTermsPage';
import { OperatorAssignmentsPage } from './pages/operator/OperatorAssignmentsPage';
import { CourseTermManagementPage } from './pages/timeschedule/CourseTermManagementPage';
import { InstructorAssignmentManagementPage } from './pages/timeschedule/InstructorAssignmentManagementPage';
import { InstructorInformationSystemPage } from './pages/timeschedule/InstructorInformationSystemPage';
import { StudentInformationSystemPage } from './pages/enrollment/StudentInformationSystemPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/courses" element={<CoursePage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/apply-course" element={<CreateCourseApplicationPage />} />
                    <Route path="/my-applications" element={<MyCourseApplicationsPage />} />
                    <Route path="/my-enrollments" element={<MyEnrollmentsPage />} />
                    <Route path="/my-profile" element={<MyProfilePage />} />
                    <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
                    <Route path="/operator/terms" element={<OperatorTermsPage />} />
                    <Route path="/operator/assignments" element={<OperatorAssignmentsPage />} />
                    <Route path="/ts/terms" element={<CourseTermManagementPage />} />
                    <Route path="/ts/assignments" element={<InstructorAssignmentManagementPage />} />
                    <Route path="/ts/iis" element={<InstructorInformationSystemPage />} />
                    <Route path="/enrollment/sis" element={<StudentInformationSystemPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
