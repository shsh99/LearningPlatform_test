import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

// 통계 카드 컴포넌트
interface StatCardProps {
    title: string;
    value: string;
    unit: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
    bgColor: string;
}

const StatCard = ({ title, value, unit, change, isPositive, icon, bgColor }: StatCardProps) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{title}</span>
            <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
                {icon}
            </div>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500">{unit}</span>
        </div>
        <div className={`mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {change} 지난주 대비
        </div>
    </div>
);

// 추천 코스 카드 컴포넌트
interface CourseCardProps {
    title: string;
    level: string;
    duration: string;
    students: string;
    image: string;
}

const CourseCard = ({ title, level, duration, students, image }: CourseCardProps) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
        <div className={`h-32 ${image} flex items-center justify-center`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-[#6600FF]/10 text-[#6600FF] rounded-full font-medium">{level}</span>
                <span>{duration}</span>
                <span>•</span>
                <span>{students}명 수강중</span>
            </div>
        </div>
    </div>
);

// 최근 학습 아이템 컴포넌트
interface ActivityItemProps {
    date: string;
    title: string;
    topic: string;
    duration: string;
}

const ActivityItem = ({ date, title, topic, duration }: ActivityItemProps) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <div className="w-12 h-12 bg-[#6600FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#6600FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        </div>
        <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 mb-1">{date}</div>
            <div className="font-medium text-gray-900 truncate">{title}</div>
            <div className="text-sm text-gray-500">{topic}</div>
        </div>
        <div className="text-sm text-gray-500 flex-shrink-0">{duration}</div>
    </div>
);

export function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // 로그인하지 않은 사용자용 랜딩 페이지
    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-b from-white via-[#6600FF]/5 to-white">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                    성장을 위한 학습의 시작
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6600FF] to-[#8833FF] mt-2">
                                        EduPlatform
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                    전문가가 운영하는 고품질 강의로 당신의 미래를 설계하세요
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-4 bg-gradient-to-r from-[#6600FF] to-[#8833FF] text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
                                    >
                                        시작하기
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="px-8 py-4 bg-white text-[#6600FF] border-2 border-[#6600FF] rounded-xl hover:bg-[#6600FF]/5 transition-all font-semibold text-lg"
                                    >
                                        회원가입
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 배경 장식 */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-[#6600FF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                            <div className="absolute top-40 right-10 w-72 h-72 bg-[#8833FF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="w-12 h-12 bg-[#6600FF]/10 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-[#6600FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">다양한 강의</h3>
                                <p className="text-gray-600">전문가가 제공하는 고품질 강의를 만나보세요</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="w-12 h-12 bg-[#8833FF]/10 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-[#8833FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    // 로그인한 사용자용 대시보드
    const userName = user?.name || '사용자';
    const streakDays = 3; // 실제로는 API에서 가져올 데이터
    const weeklyGoal = 40;
    const weeklyProgress = 32.5;
    const progressPercentage = Math.round((weeklyProgress / weeklyGoal) * 100);

    // 주간 학습 차트 데이터 (실제로는 API에서 가져올 데이터)
    const weeklyData = [
        { day: '월', hours: 4.5 },
        { day: '화', hours: 5.2 },
        { day: '수', hours: 3.8 },
        { day: '목', hours: 6.0 },
        { day: '금', hours: 5.5 },
        { day: '토', hours: 4.0 },
        { day: '일', hours: 3.5 },
    ];
    const maxHours = Math.max(...weeklyData.map(d => d.hours));

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 인사말 섹션 */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                반가워요, {userName}님! 👋
                            </h1>
                            <p className="text-gray-500 mt-1">
                                <span className="inline-flex items-center gap-1">
                                    🔥 <span className="text-[#6600FF] font-medium">{streakDays}일</span> 연속 학습 중
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <Link
                                to="/ranking"
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                                랭킹 보기
                            </Link>
                            <Link
                                to="/my-enrollments"
                                className="px-4 py-2 bg-[#6600FF] text-white rounded-xl hover:bg-[#5500DD] transition-colors font-medium text-sm"
                            >
                                학습 기록
                            </Link>
                        </div>
                    </div>

                    {/* 통계 카드 그리드 */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="이번 주 학습"
                            value="32.5"
                            unit="시간"
                            change="+12%"
                            isPositive={true}
                            bgColor="bg-[#6600FF]/10"
                            icon={<svg className="w-5 h-5 text-[#6600FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                        <StatCard
                            title="해결한 문제"
                            value="124"
                            unit="문제"
                            change="+5%"
                            isPositive={true}
                            bgColor="bg-green-100"
                            icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                        <StatCard
                            title="평균 집중도"
                            value="85"
                            unit="%"
                            change="+2%"
                            isPositive={true}
                            bgColor="bg-amber-100"
                            icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                        <StatCard
                            title="연속 학습"
                            value={String(streakDays)}
                            unit="일"
                            change="+1일"
                            isPositive={true}
                            bgColor="bg-red-100"
                            icon={<svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* 학습 요약 차트 */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">학습 요약</h2>
                                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6600FF]/20">
                                    <option>이번 주</option>
                                    <option>지난 주</option>
                                    <option>이번 달</option>
                                </select>
                            </div>
                            <div className="flex items-end justify-between h-48 gap-2">
                                {weeklyData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                                            <div
                                                className="absolute bottom-0 w-full bg-gradient-to-t from-[#6600FF] to-[#8833FF] rounded-t-lg transition-all duration-500"
                                                style={{ height: `${(data.hours / maxHours) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{data.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 주간 목표 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">주간 목표</h2>
                            <div className="flex flex-col items-center">
                                <div className="relative w-36 h-36 mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="72"
                                            cy="72"
                                            r="64"
                                            fill="none"
                                            stroke="#E5E7EB"
                                            strokeWidth="12"
                                        />
                                        <circle
                                            cx="72"
                                            cy="72"
                                            r="64"
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            strokeDasharray={`${progressPercentage * 4.02} 402`}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6600FF" />
                                                <stop offset="100%" stopColor="#8833FF" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-gray-900">{progressPercentage}%</span>
                                        <span className="text-xs text-gray-500">달성</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        <span className="font-semibold text-[#6600FF]">{weeklyProgress}</span>
                                        <span className="text-gray-400"> / {weeklyGoal}시간</span>
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">목표까지 {weeklyGoal - weeklyProgress}시간 남음</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 추천 코스 */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">추천 코스</h2>
                            <Link to="/courses" className="text-sm text-[#6600FF] hover:text-[#5500DD] font-medium">
                                전체 보기 →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CourseCard
                                title="React 마스터 클래스"
                                level="초급"
                                duration="8주"
                                students="1,240"
                                image="bg-gradient-to-br from-blue-500 to-cyan-400"
                            />
                            <CourseCard
                                title="CS 지식 정복하기"
                                level="중급"
                                duration="4주"
                                students="850"
                                image="bg-gradient-to-br from-[#6600FF] to-[#8833FF]"
                            />
                            <CourseCard
                                title="알고리즘 완전 정복"
                                level="고급"
                                duration="12주"
                                students="620"
                                image="bg-gradient-to-br from-green-500 to-emerald-400"
                            />
                        </div>
                    </div>

                    {/* 최근 학습 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">최근 학습</h2>
                            <Link to="/my-enrollments" className="text-sm text-[#6600FF] hover:text-[#5500DD] font-medium">
                                전체 보기 →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            <ActivityItem
                                date="오늘"
                                title="React 마스터 클래스"
                                topic="Chapter 5: Hooks 심화"
                                duration="2시간 30분"
                            />
                            <ActivityItem
                                date="어제"
                                title="CS 지식 정복하기"
                                topic="자료구조: 트리와 그래프"
                                duration="1시간 45분"
                            />
                            <ActivityItem
                                date="2일 전"
                                title="알고리즘 완전 정복"
                                topic="동적 프로그래밍 기초"
                                duration="3시간"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
