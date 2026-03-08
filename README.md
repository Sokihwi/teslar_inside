# 🚗 Tesla Inside - 프로젝트 구조 가이드

## 📁 폴더 구조
```
D:\Antigravity_Home\Tesla_Inside\
│
├── 📁 tesla_insider/              ← 에이전트 스킬 (핵심 설정)
│   ├── SKILL.md                   ← 스킬 정의 파일
│   ├── steve_davinci_persona.md   ← AI 글쓰기 페르소나 프롬프트
│   └── tesla_inside_1year_plan.md ← 1년 포스팅 로드맵 (112개 주제)
│
├── 📁 posts/                      ← 블로그 초안 저장소
│   ├── 01_2026_subsidy_guide.md
│   ├── 02_modely_juniper_vs_old.md
│   └── ... (총 16개 초안)
│
├── 📁 news_crawler/               ← 뉴스 자동 크롤러 🆕
│   ├── SKILL.md                   ← 크롤러 스킬 가이드
│   ├── fetch_tesla_news.py        ← 네이버 + 구글 뉴스 크롤링 엔진
│   ├── send_tesla_digest.py       ← Gmail API 이메일 발송
│   ├── run_tesla_digest.bat       ← 원클릭 실행 배치 파일
│   ├── requirements.txt           ← Python 의존성
│   ├── token.json                 ← Gmail 토큰 (USFK에서 복사 필요)
│   └── digests/                   ← 일자별 다이제스트 (자동 생성)
│       ├── tesla_digest_YYYY-MM-DD.html
│       └── tesla_digest_YYYY-MM-DD.json
│
├── 📁 tistory-mcp-server/        ← 티스토리 자동 발행 서버
│   ├── src/
│   │   ├── auth.js                ← 카카오 로그인 모듈
│   │   ├── browser.js             ← Playwright 브라우저 관리
│   │   └── tistory.js             ← 글쓰기/조회 자동화
│   ├── auth-data/                 ← 로그인 세션 데이터
│   ├── .env                       ← 블로그 URL 설정
│   └── index.js                   ← MCP 서버 엔트리
│
└── fetch_tesla_news.py            ← (구버전, 삭제 가능)
```

## 🔄 운영 워크플로우

### 일일/주간 뉴스 수집
1. `news_crawler/run_tesla_digest.bat` 실행 (또는 작업 스케줄러)
2. 네이버 + 구글에서 테슬라 관련 뉴스 자동 크롤링
3. `digests/` 폴더에 HTML + JSON 저장
4. 이메일로 다이제스트 자동 발송

### 블로그 포스팅
1. 수집된 뉴스 데이터 기반으로 주제 선정
2. `steve_davinci_persona.md` 페르소나로 글 작성
3. 이미지 생성 프롬프트 3장 + 해시태그 5개 포함
4. 티스토리 MCP 서버로 자동 발행

### 목표
- **Phase 1 (1~2개월):** 주 3회 발행 → 구글 애드센스 승인
- **Phase 2 (3~12개월):** 주 2회 발행 → 트래픽 확보 & 수익화
