# 학습 플랫폼 프론트엔드

## 기술 스택

- React 19.2
- TypeScript 5.9
- Vite 7.2
- React Router DOM 7.9
- Axios 1.13

## 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
├── api/           # API 클라이언트 및 엔드포인트
├── contexts/      # React Context (전역 상태)
├── pages/         # 페이지 컴포넌트
└── types/         # TypeScript 타입 정의
```

## 주요 기능

### 인증 (Authentication)

- 회원가입 (이메일, 비밀번호, 이름)
- 로그인 (이메일, 비밀번호)
- JWT 토큰 기반 인증
- 자동 로그인 유지 (localStorage)
- 401 에러 자동 처리 및 로그인 페이지 리다이렉션

### 라우팅

- `/` - 홈 페이지 (로그인 상태에 따라 다른 화면)
- `/login` - 로그인 페이지
- `/signup` - 회원가입 페이지

## 코딩 컨벤션

프로젝트의 코딩 컨벤션은 `/conventions/frontend.md`를 참고하세요.

### 주요 규칙

- TypeScript type import: `import type { ... }`
- React Hooks 사용
- 함수형 컴포넌트
- Context API를 통한 전역 상태 관리
