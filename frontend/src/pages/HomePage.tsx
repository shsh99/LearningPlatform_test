import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function HomePage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                    성장을 위한 학습의 시작
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
                                        EduPlatform
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                    전문가가 운영하는 고품질 강의로 당신의 미래를 설계하세요
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
                                    >
                                        시작하기
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg"
                                    >
                                        회원가입
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 배경 장식 */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                            <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">다양한 강의</h3>
                                <p className="text-gray-600">전문가가 제공하는 고품질 강의를 만나보세요</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">검증된 강사</h3>
                                <p className="text-gray-600">운영자의 엄격한 심사를 통과한 전문 강사진</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">빠른 성장</h3>
                                <p className="text-gray-600">체계적인 커리큘럼으로 빠르게 성장하세요</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* 추천 강의 섹션 */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-4">지금 시작하세요!</h2>
                        <p className="text-blue-100 text-lg mb-8">다양한 강의를 탐색하고 나만의 학습 여정을 시작하세요</p>
                        <div className="flex gap-4">
                            <Link
                                to="/courses"
                                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:shadow-lg transition-all font-semibold"
                            >
                                강의 탐색하기
                            </Link>
                            <Link
                                to="/apply-course"
                                className="px-6 py-3 bg-blue-500 text-white border-2 border-white rounded-lg hover:bg-blue-400 transition-all font-semibold"
                            >
                                강의 개설 신청
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 빠른 링크 그리드 */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">빠른 이동</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link
                            to="/courses"
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">강의 탐색</h3>
                                    <p className="text-sm text-gray-500">다양한 강의 보기</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/my-enrollments"
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">내 강의</h3>
                                    <p className="text-sm text-gray-500">수강 중인 강의</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/my-applications"
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">신청 현황</h3>
                                    <p className="text-sm text-gray-500">개설 신청 내역</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/apply-course"
                            className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">강의 개설</h3>
                                    <p className="text-sm text-blue-100">새 강의 신청하기</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
