# Architecture Decision Records (ADR)

> 📋 프로젝트의 중요한 아키텍처 결정을 기록합니다.

## ADR이란?

ADR(Architecture Decision Record)은 프로젝트에서 내린 중요한 아키텍처 결정을 문서화한 것입니다.
"왜 이렇게 만들었는가?"에 대한 답을 기록하여 미래의 개발자(또는 AI)가 맥락을 이해할 수 있게 합니다.

## 언제 ADR을 작성하는가?

- 프레임워크/라이브러리 선택
- 아키텍처 패턴 결정
- 데이터베이스 설계 결정
- API 설계 방식 결정
- 보안 관련 결정
- 성능 최적화 방식 결정

## ADR 목록

| 번호 | 제목 | 상태 | 날짜 |
|------|------|------|------|
| [000](./000-template.md) | ADR 템플릿 | ACCEPTED | - |

## ADR 상태

- **PROPOSED**: 제안됨, 리뷰 대기 중
- **ACCEPTED**: 승인됨, 적용 중
- **DEPRECATED**: 더 이상 유효하지 않음
- **SUPERSEDED**: 다른 ADR로 대체됨

## 새 ADR 작성하기

1. `000-template.md`를 복사
2. 파일명: `NNN-결정-제목.md` (예: `001-jwt-authentication.md`)
3. 템플릿 내용 작성
4. README의 목록에 추가
5. PR 생성 및 리뷰

## 참고

- [ADR GitHub Organization](https://adr.github.io/)
- [맥도날드화 원칙 - 결정 근거 기록](https://yozm.wishket.com/magazine/detail/3457/)
