# 레이아웃 설정 기능 통합 가이드

## 완료된 작업

### Backend
- ✅ TenantBranding 엔티티에 `layoutConfig` 필드 추가
- ✅ TenantBrandingResponse/UpdateTenantBrandingRequest DTO 업데이트
- ✅ TenantServiceImpl에서 layoutConfig 저장 로직 추가

### Frontend
- ✅ `src/types/layout.ts` - 레이아웃 설정 타입 정의
- ✅ `src/hooks/useLayout.ts` - 레이아웃 설정 Hook
- ✅ `src/components/common/DraggableList.tsx` - 드래그 앤 드롭 리스트 컴포넌트
- ✅ `src/components/branding/LayoutConfigEditor.tsx` - 레이아웃 설정 에디터

## BrandingSettingsPage 통합 방법

`src/pages/tenant-admin/BrandingSettingsPage.tsx` 파일을 다음과 같이 수정하세요:

### 1. 상태 추가

```typescript
// 기존 탭 상태에 'layout' 추가
type TabType = 'theme' | 'colors' | 'files' | 'labels' | 'layout';
const [activeTab, setActiveTab] = useState<TabType>('theme');
```

### 2. LayoutConfigEditor 렌더링

```typescript
{activeTab === 'layout' && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <LayoutConfigEditor
      layoutConfigJson={brandingForm.layoutConfig || null}
      onChange={(newLayoutConfig) => {
        setBrandingForm((prev) => ({
          ...prev,
          layoutConfig: newLayoutConfig,
        }));
      }}
    />
  </div>
)}
```

### 3. 탭 버튼 추가

```typescript
<button
  onClick={() => setActiveTab('layout')}
  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
    activeTab === 'layout'
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50'
  }`}
>
  레이아웃 설정
</button>
```

## 사용 방법

### 관리자 페이지에서
1. 브랜딩 설정 페이지 접속
2. "레이아웃 설정" 탭 클릭
3. 대시보드 위젯, 배너, 메뉴 탭에서 설정 관리
4. 항목을 드래그하여 순서 변경
5. 체크박스로 항목 ON/OFF
6. 저장 버튼 클릭

### 코드에서 사용
```typescript
import { useLayout } from '../hooks/useLayout';

function MyComponent() {
  const { layoutConfig, dashboardWidgets, bannerItems, menuItems, isComponentEnabled } = useLayout();

  // 대시보드 위젯 렌더링 (활성화되고 정렬된 상태)
  return (
    <div>
      {dashboardWidgets.map(widget => (
        <Widget key={widget.id} config={widget} />
      ))}
    </div>
  );
}
```

## 기능 목록

- ✅ 대시보드 위젯 ON/OFF 및 순서 조정
- ✅ 배너 ON/OFF, 위치(상단/하단), 순서 조정
- ✅ 메뉴 항목 ON/OFF 및 순서 조정
- ✅ 드래그 앤 드롭으로 직관적인 순서 변경
- ✅ 실시간 미리보기 (활성/비활성 상태 표시)
- ✅ 초기화 버튼 (기본 설정으로 복원)

## 권한
- SUPER_ADMIN, TENANT_ADMIN, ADMIN 역할만 접근 가능
- TenantController의 브랜딩 API에 이미 적용되어 있음
