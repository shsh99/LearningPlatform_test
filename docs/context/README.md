# Context 문서 가이드

> 도메인별 상세 컨텍스트 문서 안내
> **CLAUDE.md에서 부족할 때 참조**

---

## 문서 목록 및 용도

| 문서 | 용도 | 줄 수 | 언제 참조? |
|------|------|:----:|-----------|
| [architecture.md](./architecture.md) | 프로젝트 구조, 모듈 관계 | ~240 | 전체 구조 파악 필요시 |
| [database.md](./database.md) | DB 스키마, ERD, 테이블 설계 | ~155 | Entity 작성, 쿼리 작성시 |
| [api.md](./api.md) | API 명세, 엔드포인트 | ~325 | API 개발, 연동시 |
| [pages.md](./pages.md) | 페이지별 기능, 화면 구성 | ~275 | 프론트엔드 개발시 |
| [design.md](./design.md) | 디자인 시스템, Figma MCP | ~200 | UI 구현, 스타일링시 |
| [infrastructure.md](./infrastructure.md) | AWS, Docker, 배포 환경 | ~230 | 인프라 설정, 배포시 |
| [troubleshooting.md](./troubleshooting.md) | 문제 해결 가이드 | ~290 | 에러 발생시 |
| [glossary.md](./glossary.md) | 용어 사전 | ~180 | 용어 이해 필요시 |

---

## 읽기 순서 (권장)

### 프로젝트 처음 이해할 때
```
1. architecture.md  → 전체 구조 파악
2. database.md      → 데이터 모델 이해
3. api.md           → API 엔드포인트 파악
```

### Backend 작업시
```
1. database.md      → 테이블/관계 확인
2. api.md           → 엔드포인트 명세
3. troubleshooting.md → 문제 발생시
```

### Frontend 작업시
```
1. pages.md         → 페이지별 요구사항
2. design.md        → 디자인 토큰/컴포넌트
3. api.md           → 연동할 API 확인
```

### 배포/인프라 작업시
```
1. infrastructure.md → 환경 구성
2. troubleshooting.md → 문제 해결
```

---

## 관련 문서

- 상위: [CLAUDE.md](../../CLAUDE.md) - AI 작업 가이드
- 컨벤션: [conventions/](../../conventions/) - 코딩 컨벤션
- 템플릿: [templates/](../../templates/) - 작업 템플릿

---

> **원칙**: 필요한 문서만 선택적으로 읽기
