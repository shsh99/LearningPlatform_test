import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateTenantBranding, updateTenantLabels } from '../../api/tenant';
import type { UpdateTenantBrandingRequest, UpdateTenantLabelsRequest } from '../../types/tenant';
import { DEFAULT_BRANDING, DEFAULT_LABELS } from '../../types/tenant';
import { Navbar } from '../../components/Navbar';

// 프리셋 테마 정의
interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: string[]; // 미리보기용 색상 4개
  branding: UpdateTenantBrandingRequest;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cosmos',
    name: 'Cosmos',
    description: '메가존 스타일의 프리미엄 다크 테마',
    colors: ['#000000', '#191919', '#70F2A0', '#6778FF'],
    branding: {
      primaryColor: '#70F2A0',
      secondaryColor: '#9CA3AF',
      accentColor: '#6778FF',
      headerBgColor: '#000000',
      headerTextColor: '#FFFFFF',
      sidebarBgColor: '#191919',
      sidebarTextColor: '#A1A1AA',
      sidebarActiveColor: '#2A2A2A',
      sidebarActiveTextColor: '#70F2A0',
      buttonPrimaryBgColor: '#000000',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#2A2A2A',
      buttonSecondaryTextColor: '#E5E5E5',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: '시원한 바다를 담은 청량한 테마',
    colors: ['#0EA5E9', '#06B6D4', '#F0F9FF', '#ECFEFF'],
    branding: {
      primaryColor: '#0EA5E9',
      secondaryColor: '#64748B',
      accentColor: '#06B6D4',
      headerBgColor: '#FFFFFF',
      headerTextColor: '#0C4A6E',
      sidebarBgColor: '#F0F9FF',
      sidebarTextColor: '#475569',
      sidebarActiveColor: '#E0F2FE',
      sidebarActiveTextColor: '#0284C7',
      buttonPrimaryBgColor: '#0EA5E9',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#F1F5F9',
      buttonSecondaryTextColor: '#475569',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: '자연의 편안함을 담은 그린 테마',
    colors: ['#059669', '#10B981', '#ECFDF5', '#D1FAE5'],
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#6B7280',
      accentColor: '#10B981',
      headerBgColor: '#FFFFFF',
      headerTextColor: '#064E3B',
      sidebarBgColor: '#ECFDF5',
      sidebarTextColor: '#374151',
      sidebarActiveColor: '#D1FAE5',
      sidebarActiveTextColor: '#047857',
      buttonPrimaryBgColor: '#059669',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#F3F4F6',
      buttonSecondaryTextColor: '#374151',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: '따뜻한 노을빛의 웜톤 테마',
    colors: ['#F97316', '#FB923C', '#FFF7ED', '#FFEDD5'],
    branding: {
      primaryColor: '#F97316',
      secondaryColor: '#78716C',
      accentColor: '#FB923C',
      headerBgColor: '#FFFFFF',
      headerTextColor: '#7C2D12',
      sidebarBgColor: '#FFF7ED',
      sidebarTextColor: '#57534E',
      sidebarActiveColor: '#FFEDD5',
      sidebarActiveTextColor: '#EA580C',
      buttonPrimaryBgColor: '#F97316',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#F5F5F4',
      buttonSecondaryTextColor: '#44403C',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    description: '부드러운 라벤더 빛 우아한 테마',
    colors: ['#9333EA', '#A855F7', '#FAF5FF', '#F3E8FF'],
    branding: {
      primaryColor: '#9333EA',
      secondaryColor: '#6B7280',
      accentColor: '#A855F7',
      headerBgColor: '#FFFFFF',
      headerTextColor: '#581C87',
      sidebarBgColor: '#FAF5FF',
      sidebarTextColor: '#4B5563',
      sidebarActiveColor: '#F3E8FF',
      sidebarActiveTextColor: '#7C3AED',
      buttonPrimaryBgColor: '#9333EA',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#F9FAFB',
      buttonSecondaryTextColor: '#374151',
    },
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    description: '로맨틱한 로즈 컬러 테마',
    colors: ['#E11D48', '#FB7185', '#FFF1F2', '#FFE4E6'],
    branding: {
      primaryColor: '#E11D48',
      secondaryColor: '#71717A',
      accentColor: '#FB7185',
      headerBgColor: '#FFFFFF',
      headerTextColor: '#881337',
      sidebarBgColor: '#FFF1F2',
      sidebarTextColor: '#52525B',
      sidebarActiveColor: '#FFE4E6',
      sidebarActiveTextColor: '#BE123C',
      buttonPrimaryBgColor: '#E11D48',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#FAFAFA',
      buttonSecondaryTextColor: '#3F3F46',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    description: '깊은 밤하늘의 네이비 테마',
    colors: ['#1E3A8A', '#3B82F6', '#EFF6FF', '#DBEAFE'],
    branding: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#6B7280',
      accentColor: '#3B82F6',
      headerBgColor: '#1E3A8A',
      headerTextColor: '#F8FAFC',
      sidebarBgColor: '#F8FAFC',
      sidebarTextColor: '#475569',
      sidebarActiveColor: '#DBEAFE',
      sidebarActiveTextColor: '#1E40AF',
      buttonPrimaryBgColor: '#1E3A8A',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#F1F5F9',
      buttonSecondaryTextColor: '#334155',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Gray',
    description: '미니멀한 모노톤 테마',
    colors: ['#18181B', '#3F3F46', '#FAFAFA', '#F4F4F5'],
    branding: {
      primaryColor: '#18181B',
      secondaryColor: '#71717A',
      accentColor: '#3F3F46',
      headerBgColor: '#FAFAFA',
      headerTextColor: '#18181B',
      sidebarBgColor: '#F4F4F5',
      sidebarTextColor: '#52525B',
      sidebarActiveColor: '#E4E4E7',
      sidebarActiveTextColor: '#18181B',
      buttonPrimaryBgColor: '#18181B',
      buttonPrimaryTextColor: '#FFFFFF',
      buttonSecondaryBgColor: '#E4E4E7',
      buttonSecondaryTextColor: '#27272A',
    },
  },
];

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({ label, value, onChange }: ColorInputProps) => (
  <div className="flex items-center gap-3">
    <label className="w-40 text-sm text-gray-600">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        placeholder="#000000"
      />
    </div>
  </div>
);

interface LabelInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LabelInput = ({ label, value, onChange, placeholder }: LabelInputProps) => (
  <div className="flex items-center gap-3">
    <label className="w-40 text-sm text-gray-600">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
      placeholder={placeholder}
    />
  </div>
);

// 미리보기 컴포넌트
interface PreviewProps {
  branding: UpdateTenantBrandingRequest;
  labels: UpdateTenantLabelsRequest;
}

type PreviewTab = 'dashboard' | 'courses' | 'login' | 'form';

const Preview = ({ branding, labels }: PreviewProps) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('dashboard');

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'courses', label: '강의 목록' },
    { id: 'login', label: '로그인' },
    { id: 'form', label: '폼/입력' },
  ];

  // 공통 헤더
  const PreviewHeader = () => (
    <div
      className="p-3 flex items-center justify-between border-b"
      style={{
        backgroundColor: branding.headerBgColor || '#FFFFFF',
        color: branding.headerTextColor || '#111827',
        borderColor: (branding.secondaryColor || '#6B7280') + '30',
      }}
    >
      <div className="flex items-center gap-2">
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt="Logo" className="h-6 w-auto" />
        ) : (
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: branding.primaryColor || '#3B82F6' }}
          >
            L
          </div>
        )}
        <span className="font-semibold text-sm">{labels.platformName || 'Learning Platform'}</span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span>{labels.courseLabel || '강의'}</span>
        <span>{labels.dashboardLabel || '대시보드'}</span>
        <div
          className="px-2 py-1 rounded text-xs"
          style={{
            backgroundColor: branding.buttonPrimaryBgColor || '#3B82F6',
            color: branding.buttonPrimaryTextColor || '#FFFFFF',
          }}
        >
          로그아웃
        </div>
      </div>
    </div>
  );

  // 공통 사이드바
  const PreviewSidebar = ({ active }: { active: string }) => (
    <div
      className="w-36 p-2 space-y-1 text-xs"
      style={{
        backgroundColor: branding.sidebarBgColor || '#F9FAFB',
        color: branding.sidebarTextColor || '#374151',
      }}
    >
      {[
        { key: 'dashboard', label: labels.dashboardLabel || '대시보드' },
        { key: 'courses', label: `${labels.courseLabel || '강의'} 목록` },
        { key: 'terms', label: `${labels.termLabel || '차수'} 관리` },
        { key: 'students', label: `${labels.studentLabel || '수강생'}` },
        { key: 'instructors', label: `${labels.instructorLabel || '강사'}` },
      ].map((item) => (
        <div
          key={item.key}
          className="px-2 py-1.5 rounded text-xs"
          style={
            item.key === active
              ? {
                  backgroundColor: branding.sidebarActiveColor || '#EFF6FF',
                  color: branding.sidebarActiveTextColor || '#3B82F6',
                }
              : {}
          }
        >
          {item.label}
        </div>
      ))}
    </div>
  );

  // 대시보드 미리보기
  const DashboardPreview = () => (
    <div className="flex flex-1">
      <PreviewSidebar active="dashboard" />
      <div className="flex-1 p-4 bg-gray-50">
        <h4 className="text-sm font-semibold mb-3" style={{ color: branding.primaryColor || '#3B82F6' }}>
          {labels.dashboardLabel || '대시보드'}
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white p-2 rounded shadow-sm border">
            <div className="text-xs text-gray-500">{labels.courseLabel || '강의'} 수</div>
            <div className="text-lg font-bold" style={{ color: branding.primaryColor || '#3B82F6' }}>
              24
            </div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border">
            <div className="text-xs text-gray-500">{labels.studentLabel || '수강생'} 수</div>
            <div className="text-lg font-bold" style={{ color: branding.accentColor || '#8B5CF6' }}>
              156
            </div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border">
            <div className="text-xs text-gray-500">{labels.termLabel || '차수'} 수</div>
            <div className="text-lg font-bold" style={{ color: branding.primaryColor || '#3B82F6' }}>
              8
            </div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border">
            <div className="text-xs text-gray-500">{labels.instructorLabel || '강사'} 수</div>
            <div className="text-lg font-bold" style={{ color: branding.accentColor || '#8B5CF6' }}>
              12
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{
              backgroundColor: branding.buttonPrimaryBgColor || '#3B82F6',
              color: branding.buttonPrimaryTextColor || '#FFFFFF',
            }}
          >
            {labels.courseLabel || '강의'} 추가
          </button>
          <button
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{
              backgroundColor: branding.buttonSecondaryBgColor || '#F3F4F6',
              color: branding.buttonSecondaryTextColor || '#374151',
            }}
          >
            내보내기
          </button>
        </div>
      </div>
    </div>
  );

  // 강의 목록 미리보기
  const CoursesPreview = () => (
    <div className="flex flex-1">
      <PreviewSidebar active="courses" />
      <div className="flex-1 p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold" style={{ color: branding.primaryColor || '#3B82F6' }}>
            {labels.courseLabel || '강의'} 목록
          </h4>
          <button
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: branding.buttonPrimaryBgColor || '#3B82F6',
              color: branding.buttonPrimaryTextColor || '#FFFFFF',
            }}
          >
            + 새 {labels.courseLabel || '강의'}
          </button>
        </div>
        <div className="space-y-2">
          {['React 기초', 'Spring Boot 심화', 'DevOps 입문'].map((course, i) => (
            <div key={i} className="bg-white p-2 rounded shadow-sm border flex justify-between items-center">
              <div>
                <div className="text-xs font-medium">{course}</div>
                <div className="text-xs text-gray-500">
                  {labels.termLabel || '차수'}: {i + 1}개 | {labels.studentLabel || '수강생'}: {(i + 1) * 15}명
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: branding.buttonSecondaryBgColor || '#F3F4F6',
                    color: branding.buttonSecondaryTextColor || '#374151',
                  }}
                >
                  수정
                </button>
                <button
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: branding.accentColor || '#8B5CF6',
                    color: '#FFFFFF',
                  }}
                >
                  상세
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 로그인 미리보기
  const LoginPreview = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs">
        <div className="text-center mb-4">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="Logo" className="h-10 mx-auto mb-2" />
          ) : (
            <div
              className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: branding.primaryColor || '#3B82F6' }}
            >
              L
            </div>
          )}
          <h3 className="font-semibold" style={{ color: branding.primaryColor || '#3B82F6' }}>
            {labels.platformName || 'Learning Platform'}
          </h3>
          <p className="text-xs text-gray-500">로그인하여 시작하세요</p>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="이메일"
            className="w-full px-3 py-2 border rounded text-xs"
            style={{ borderColor: branding.secondaryColor || '#6B7280' }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-3 py-2 border rounded text-xs"
            style={{ borderColor: branding.secondaryColor || '#6B7280' }}
          />
          <button
            className="w-full py-2 rounded text-xs font-medium"
            style={{
              backgroundColor: branding.buttonPrimaryBgColor || '#3B82F6',
              color: branding.buttonPrimaryTextColor || '#FFFFFF',
            }}
          >
            로그인
          </button>
          <button
            className="w-full py-2 rounded text-xs font-medium"
            style={{
              backgroundColor: branding.buttonSecondaryBgColor || '#F3F4F6',
              color: branding.buttonSecondaryTextColor || '#374151',
            }}
          >
            회원가입
          </button>
        </div>
        <div className="mt-3 text-center">
          <a href="#" className="text-xs" style={{ color: branding.primaryColor || '#3B82F6' }}>
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );

  // 폼 미리보기
  const FormPreview = () => (
    <div className="flex flex-1">
      <PreviewSidebar active="courses" />
      <div className="flex-1 p-4 bg-gray-50">
        <h4 className="text-sm font-semibold mb-3" style={{ color: branding.primaryColor || '#3B82F6' }}>
          {labels.courseLabel || '강의'} {labels.applicationLabel || '신청'}
        </h4>
        <div className="bg-white p-4 rounded shadow-sm border space-y-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">{labels.courseLabel || '강의'} 이름</label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border rounded text-xs"
              placeholder={`${labels.courseLabel || '강의'} 이름을 입력하세요`}
              style={{ borderColor: branding.secondaryColor || '#6B7280' }}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">설명</label>
            <textarea
              className="w-full px-2 py-1.5 border rounded text-xs"
              rows={2}
              placeholder="설명을 입력하세요"
              style={{ borderColor: branding.secondaryColor || '#6B7280' }}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">최대 {labels.studentLabel || '수강생'} 수</label>
            <input
              type="number"
              className="w-full px-2 py-1.5 border rounded text-xs"
              placeholder="30"
              style={{ borderColor: branding.secondaryColor || '#6B7280' }}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 py-2 rounded text-xs font-medium"
              style={{
                backgroundColor: branding.buttonPrimaryBgColor || '#3B82F6',
                color: branding.buttonPrimaryTextColor || '#FFFFFF',
              }}
            >
              {labels.applicationLabel || '신청'}하기
            </button>
            <button
              className="flex-1 py-2 rounded text-xs font-medium"
              style={{
                backgroundColor: branding.buttonSecondaryBgColor || '#F3F4F6',
                color: branding.buttonSecondaryTextColor || '#374151',
              }}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">실시간 미리보기</h3>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={
                activeTab === tab.id
                  ? { backgroundColor: branding.primaryColor || '#3B82F6' }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 flex flex-col">
        {activeTab !== 'login' && <PreviewHeader />}
        {activeTab === 'dashboard' && <DashboardPreview />}
        {activeTab === 'courses' && <CoursesPreview />}
        {activeTab === 'login' && <LoginPreview />}
        {activeTab === 'form' && <FormPreview />}
      </div>
    </div>
  );
};

export const BrandingSettingsPage = () => {
  const { branding, labels, refreshTenant } = useTenant();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 권한 체크: SUPER_ADMIN, ADMIN, TENANT_ADMIN만 접근 가능
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN' && user?.role !== 'TENANT_ADMIN') {
      alert('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // 브랜딩 상태
  const [brandingForm, setBrandingForm] = useState<UpdateTenantBrandingRequest>({});
  // 라벨 상태
  const [labelsForm, setLabelsForm] = useState<UpdateTenantLabelsRequest>({});
  // 선택된 테마 ID
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setBrandingForm({
      logoUrl: branding.logoUrl || '',
      faviconUrl: branding.faviconUrl || '',
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      accentColor: branding.accentColor,
      headerBgColor: branding.headerBgColor,
      headerTextColor: branding.headerTextColor,
      sidebarBgColor: branding.sidebarBgColor,
      sidebarTextColor: branding.sidebarTextColor,
      sidebarActiveColor: branding.sidebarActiveColor,
      sidebarActiveTextColor: branding.sidebarActiveTextColor,
      buttonPrimaryBgColor: branding.buttonPrimaryBgColor,
      buttonPrimaryTextColor: branding.buttonPrimaryTextColor,
      buttonSecondaryBgColor: branding.buttonSecondaryBgColor,
      buttonSecondaryTextColor: branding.buttonSecondaryTextColor,
      backgroundColor: branding.backgroundColor || '',
      fontFamily: branding.fontFamily,
    });
  }, [branding]);

  useEffect(() => {
    setLabelsForm({
      platformName: labels.platformName,
      courseLabel: labels.courseLabel,
      termLabel: labels.termLabel,
      studentLabel: labels.studentLabel,
      instructorLabel: labels.instructorLabel,
      enrollmentLabel: labels.enrollmentLabel,
      applicationLabel: labels.applicationLabel,
      dashboardLabel: labels.dashboardLabel,
    });
  }, [labels]);

  const handleBrandingChange = (key: keyof UpdateTenantBrandingRequest, value: string) => {
    setBrandingForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLabelsChange = (key: keyof UpdateTenantLabelsRequest, value: string) => {
    setLabelsForm((prev) => ({ ...prev, [key]: value }));
  };

  // 브랜딩 기본값으로 초기화
  const handleResetBranding = () => {
    if (!confirm('브랜딩 설정을 기본값으로 초기화하시겠습니까?')) return;
    setBrandingForm({
      logoUrl: '',
      faviconUrl: '',
      primaryColor: DEFAULT_BRANDING.primaryColor,
      secondaryColor: DEFAULT_BRANDING.secondaryColor,
      accentColor: DEFAULT_BRANDING.accentColor,
      headerBgColor: DEFAULT_BRANDING.headerBgColor,
      headerTextColor: DEFAULT_BRANDING.headerTextColor,
      sidebarBgColor: DEFAULT_BRANDING.sidebarBgColor,
      sidebarTextColor: DEFAULT_BRANDING.sidebarTextColor,
      sidebarActiveColor: DEFAULT_BRANDING.sidebarActiveColor,
      sidebarActiveTextColor: DEFAULT_BRANDING.sidebarActiveTextColor,
      buttonPrimaryBgColor: DEFAULT_BRANDING.buttonPrimaryBgColor,
      buttonPrimaryTextColor: DEFAULT_BRANDING.buttonPrimaryTextColor,
      buttonSecondaryBgColor: DEFAULT_BRANDING.buttonSecondaryBgColor,
      buttonSecondaryTextColor: DEFAULT_BRANDING.buttonSecondaryTextColor,
      backgroundColor: DEFAULT_BRANDING.backgroundColor,
      fontFamily: DEFAULT_BRANDING.fontFamily,
    });
  };

  // 라벨 기본값으로 초기화
  const handleResetLabels = () => {
    if (!confirm('라벨 설정을 기본값으로 초기화하시겠습니까?')) return;
    setLabelsForm({
      platformName: DEFAULT_LABELS.platformName,
      courseLabel: DEFAULT_LABELS.courseLabel,
      termLabel: DEFAULT_LABELS.termLabel,
      studentLabel: DEFAULT_LABELS.studentLabel,
      instructorLabel: DEFAULT_LABELS.instructorLabel,
      enrollmentLabel: DEFAULT_LABELS.enrollmentLabel,
      applicationLabel: DEFAULT_LABELS.applicationLabel,
      dashboardLabel: DEFAULT_LABELS.dashboardLabel,
    });
  };

  // 테마 적용 (폼에만 반영, 저장은 별도)
  const handleApplyTheme = (theme: ThemePreset) => {
    setBrandingForm((prev) => ({
      ...prev,
      ...theme.branding,
    }));
    setSelectedTheme(theme.id);
  };

  // 테마 적용 및 저장
  const handleApplyAndSaveTheme = async (theme: ThemePreset) => {
    // tenantId가 0이면 기본값 1 사용 (단일 테넌트 환경)
    const tenantId = branding.tenantId || 1;
    if (!tenantId) {
      setMessage({ type: 'error', text: '테넌트 정보를 찾을 수 없습니다. 다시 로그인해주세요.' });
      return;
    }
    try {
      setIsSaving(true);
      const newBranding = {
        ...brandingForm,
        ...theme.branding,
      };
      setBrandingForm(newBranding);
      setSelectedTheme(theme.id);
      await updateTenantBranding(tenantId, newBranding);
      await refreshTenant();
      setMessage({ type: 'success', text: `'${theme.name}' 테마가 적용되었습니다.` });
    } catch (error) {
      console.error('Failed to apply theme:', error);
      setMessage({ type: 'error', text: '테마 적용에 실패했습니다.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveBranding = async () => {
    // tenantId가 0이면 기본값 1 사용 (단일 테넌트 환경)
    const tenantId = branding.tenantId || 1;
    if (!tenantId) {
      setMessage({ type: 'error', text: '테넌트 정보를 찾을 수 없습니다. 다시 로그인해주세요.' });
      return;
    }
    try {
      setIsSaving(true);
      await updateTenantBranding(tenantId, brandingForm);
      await refreshTenant();
      setMessage({ type: 'success', text: '브랜딩 설정이 저장되었습니다.' });
    } catch (error) {
      console.error('Failed to save branding:', error);
      setMessage({ type: 'error', text: '브랜딩 설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveLabels = async () => {
    // tenantId가 0이면 기본값 1 사용 (단일 테넌트 환경)
    const tenantId = labels.tenantId || 1;
    if (!tenantId) {
      setMessage({ type: 'error', text: '테넌트 정보를 찾을 수 없습니다. 다시 로그인해주세요.' });
      return;
    }
    try {
      setIsSaving(true);
      await updateTenantLabels(tenantId, labelsForm);
      await refreshTenant();
      setMessage({ type: 'success', text: '라벨 설정이 저장되었습니다.' });
    } catch (error) {
      console.error('Failed to save labels:', error);
      setMessage({ type: 'error', text: '라벨 설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // 권한이 없으면 렌더링하지 않음
  if (!isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN' && user?.role !== 'TENANT_ADMIN')) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              뒤로 가기
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">브랜딩 설정</h1>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 설정 폼 */}
            <div className="space-y-6">
              {/* 로고 및 기본 설정 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">로고 및 기본 설정</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="w-40 text-sm text-gray-600">로고 URL</label>
                    <input
                      type="text"
                      value={brandingForm.logoUrl || ''}
                      onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-40 text-sm text-gray-600">파비콘 URL</label>
                    <input
                      type="text"
                      value={brandingForm.faviconUrl || ''}
                      onChange={(e) => handleBrandingChange('faviconUrl', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-40 text-sm text-gray-600">폰트</label>
                    <input
                      type="text"
                      value={brandingForm.fontFamily || ''}
                      onChange={(e) => handleBrandingChange('fontFamily', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Pretendard, -apple-system, sans-serif"
                    />
                  </div>
                </div>
              </div>

              {/* 기본 색상 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 색상</h2>
                <div className="space-y-4">
                  <ColorInput
                    label="메인 색상"
                    value={brandingForm.primaryColor || '#3B82F6'}
                    onChange={(v) => handleBrandingChange('primaryColor', v)}
                  />
                  <ColorInput
                    label="보조 색상"
                    value={brandingForm.secondaryColor || '#6B7280'}
                    onChange={(v) => handleBrandingChange('secondaryColor', v)}
                  />
                  <ColorInput
                    label="강조 색상"
                    value={brandingForm.accentColor || '#8B5CF6'}
                    onChange={(v) => handleBrandingChange('accentColor', v)}
                  />
                </div>
              </div>

              {/* 헤더 색상 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">헤더 색상</h2>
                <div className="space-y-4">
                  <ColorInput
                    label="배경 색상"
                    value={brandingForm.headerBgColor || '#FFFFFF'}
                    onChange={(v) => handleBrandingChange('headerBgColor', v)}
                  />
                  <ColorInput
                    label="텍스트 색상"
                    value={brandingForm.headerTextColor || '#111827'}
                    onChange={(v) => handleBrandingChange('headerTextColor', v)}
                  />
                </div>
              </div>

              {/* 사이드바 색상 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">사이드바 색상</h2>
                <div className="space-y-4">
                  <ColorInput
                    label="배경 색상"
                    value={brandingForm.sidebarBgColor || '#F9FAFB'}
                    onChange={(v) => handleBrandingChange('sidebarBgColor', v)}
                  />
                  <ColorInput
                    label="텍스트 색상"
                    value={brandingForm.sidebarTextColor || '#374151'}
                    onChange={(v) => handleBrandingChange('sidebarTextColor', v)}
                  />
                  <ColorInput
                    label="활성 메뉴 배경"
                    value={brandingForm.sidebarActiveColor || '#EFF6FF'}
                    onChange={(v) => handleBrandingChange('sidebarActiveColor', v)}
                  />
                  <ColorInput
                    label="활성 메뉴 텍스트"
                    value={brandingForm.sidebarActiveTextColor || '#3B82F6'}
                    onChange={(v) => handleBrandingChange('sidebarActiveTextColor', v)}
                  />
                </div>
              </div>

              {/* 버튼 색상 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">버튼 색상</h2>
                <div className="space-y-4">
                  <ColorInput
                    label="Primary 배경"
                    value={brandingForm.buttonPrimaryBgColor || '#3B82F6'}
                    onChange={(v) => handleBrandingChange('buttonPrimaryBgColor', v)}
                  />
                  <ColorInput
                    label="Primary 텍스트"
                    value={brandingForm.buttonPrimaryTextColor || '#FFFFFF'}
                    onChange={(v) => handleBrandingChange('buttonPrimaryTextColor', v)}
                  />
                  <ColorInput
                    label="Secondary 배경"
                    value={brandingForm.buttonSecondaryBgColor || '#F3F4F6'}
                    onChange={(v) => handleBrandingChange('buttonSecondaryBgColor', v)}
                  />
                  <ColorInput
                    label="Secondary 텍스트"
                    value={brandingForm.buttonSecondaryTextColor || '#374151'}
                    onChange={(v) => handleBrandingChange('buttonSecondaryTextColor', v)}
                  />
                </div>
              </div>

              {/* 배경색 설정 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">배경 색상</h2>
                <p className="text-sm text-gray-500 mb-4">
                  페이지 배경색을 직접 지정할 수 있습니다. 빈 값으로 두면 테마 프리셋에 따라 자동으로 적용됩니다.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <ColorInput
                      label="배경 색상 (선택사항)"
                      value={brandingForm.backgroundColor || ''}
                      onChange={(v) => handleBrandingChange('backgroundColor', v)}
                    />
                    <p className="text-xs text-gray-500">
                      💡 빈 값으로 두면 선택한 테마의 기본 배경이 자동 적용됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleResetBranding}
                  disabled={isSaving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  기본값으로 초기화
                </button>
                <button
                  onClick={handleSaveBranding}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '브랜딩 저장'}
                </button>
              </div>

              {/* 라벨 설정 */}
              <h2 className="text-2xl font-bold text-gray-900 mt-8">라벨 설정</h2>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">플랫폼 이름 및 메뉴 라벨</h2>
                <p className="text-sm text-gray-500 mb-4">
                  각 항목의 라벨을 커스터마이징할 수 있습니다. 예: 강의 → 교육과정, 수강생 → 크루
                </p>
                <div className="space-y-4">
                  <LabelInput
                    label="플랫폼 이름"
                    value={labelsForm.platformName || ''}
                    onChange={(v) => handleLabelsChange('platformName', v)}
                    placeholder="Learning Platform"
                  />
                  <LabelInput
                    label="강의 라벨"
                    value={labelsForm.courseLabel || ''}
                    onChange={(v) => handleLabelsChange('courseLabel', v)}
                    placeholder="강의"
                  />
                  <LabelInput
                    label="차수 라벨"
                    value={labelsForm.termLabel || ''}
                    onChange={(v) => handleLabelsChange('termLabel', v)}
                    placeholder="차수"
                  />
                  <LabelInput
                    label="수강생 라벨"
                    value={labelsForm.studentLabel || ''}
                    onChange={(v) => handleLabelsChange('studentLabel', v)}
                    placeholder="수강생"
                  />
                  <LabelInput
                    label="강사 라벨"
                    value={labelsForm.instructorLabel || ''}
                    onChange={(v) => handleLabelsChange('instructorLabel', v)}
                    placeholder="강사"
                  />
                  <LabelInput
                    label="수강신청 라벨"
                    value={labelsForm.enrollmentLabel || ''}
                    onChange={(v) => handleLabelsChange('enrollmentLabel', v)}
                    placeholder="수강신청"
                  />
                  <LabelInput
                    label="신청 라벨"
                    value={labelsForm.applicationLabel || ''}
                    onChange={(v) => handleLabelsChange('applicationLabel', v)}
                    placeholder="신청"
                  />
                  <LabelInput
                    label="대시보드 라벨"
                    value={labelsForm.dashboardLabel || ''}
                    onChange={(v) => handleLabelsChange('dashboardLabel', v)}
                    placeholder="대시보드"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleResetLabels}
                  disabled={isSaving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  기본값으로 초기화
                </button>
                <button
                  onClick={handleSaveLabels}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '라벨 저장'}
                </button>
              </div>
            </div>

            {/* 오른쪽: 테마 선택 + 미리보기 (sticky) */}
            <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
              {/* 테마 프리셋 선택 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">테마 프리셋</h3>
                <p className="text-sm text-gray-500 mb-4">원하는 테마를 선택하여 바로 적용하세요</p>
                <div className="grid grid-cols-2 gap-3">
                  {THEME_PRESETS.map((theme) => (
                    <div
                      key={theme.id}
                      className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedTheme === theme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleApplyTheme(theme)}
                    >
                      {/* 색상 미리보기 */}
                      <div className="flex gap-1 mb-2">
                        {theme.colors.map((color, i) => (
                          <div
                            key={i}
                            className="flex-1 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{theme.description}</div>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedTheme && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        const theme = THEME_PRESETS.find((t) => t.id === selectedTheme);
                        if (theme) handleApplyAndSaveTheme(theme);
                      }}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? '적용 중...' : '테마 적용 및 저장'}
                    </button>
                    <button
                      onClick={() => setSelectedTheme(null)}
                      className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>

              {/* 미리보기 */}
              <Preview branding={brandingForm} labels={labelsForm} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandingSettingsPage;
