---
name: tesla_news_crawler
description: 테슬라 관련 뉴스를 네이버+구글에서 자동 크롤링하고, HTML 다이제스트를 생성하며, 이메일로 발송하는 스킬
---

# 🔍 Tesla News Crawler 스킬

## 개요
테슬라 인사이드 블로그 운영을 위해, 테슬라 관련 최신 뉴스를 **네이버 뉴스**와 **구글 뉴스**에서 자동으로 수집하여 HTML 다이제스트 및 JSON 원본 데이터를 생성하는 스킬입니다.

## 폴더 구조
```
D:\Antigravity_Home\Tesla_Inside\news_crawler\
├── fetch_tesla_news.py        ← 메인 크롤링 엔진 (네이버 + 구글)
├── send_tesla_digest.py       ← Gmail API 이메일 발송
├── run_tesla_digest.bat       ← 원클릭 실행 배치 파일
├── requirements.txt           ← Python 의존성
├── token.json                 ← Gmail API 토큰 (수동 배치 필요)
└── digests/                   ← 일자별 다이제스트 저장 폴더
    ├── tesla_digest_2026-03-07.html
    └── tesla_digest_2026-03-07.json
```

## 크롤링 키워드

### 한국어 (네이버 뉴스)
- 테슬라, 사이버트럭, 모델3 하이랜드, 모델Y 주니퍼
- 테슬라 FSD, 일론 머스크, 테슬라 자율주행
- 테슬라 보조금, 옵티머스 로봇, 기가팩토리

### 영어 (구글 뉴스)
- Tesla, Cybertruck, Tesla FSD, Elon Musk Tesla
- Tesla Model Y Juniper, Tesla Optimus robot, Tesla earnings

## 사용 방법

### 1. 수동 실행
```bash
cd D:\Antigravity_Home\Tesla_Inside\news_crawler
python fetch_tesla_news.py
```

### 2. 크롤링 + 이메일 발송 (배치 파일)
```bash
run_tesla_digest.bat
```

### 3. Windows 작업 스케줄러로 자동화 (일일/주간)
- `run_tesla_digest.bat`를 Windows 작업 스케줄러에 등록
- 권장: 매일 오전 6시 또는 매주 월요일 오전 6시

### 4. 에이전트에서 호출
```
"테슬라 최신 뉴스를 크롤링해 줘"
→ python fetch_tesla_news.py 실행
→ digests/ 폴더에 HTML + JSON 저장
→ 수집된 뉴스 데이터를 기반으로 블로그 포스팅 소재 추천
```

## 출력물

### HTML 다이제스트 (`tesla_digest_YYYY-MM-DD.html`)
- 네이버 뉴스 (국내)와 구글 뉴스 (글로벌) 섹션으로 구분
- 기사 제목, 원본 링크, 출처, 키워드 태그, 요약 포함
- 이메일로 바로 전송 가능한 반응형 HTML 포맷

### JSON 원본 데이터 (`tesla_digest_YYYY-MM-DD.json`)
- 수집된 모든 기사의 구조화된 원본 데이터
- AI 분석, 트렌드 추적, 블로그 소재 자동 추천에 활용 가능

## Gmail 토큰 설정
USFK 뉴스에서 사용하던 `token.json`을 이 폴더로 복사하면 바로 이메일 발송이 가능합니다.
```bash
copy D:\Antigravity_Home\USFK_News\USFK_News_Portable\token.json D:\Antigravity_Home\Tesla_Inside\news_crawler\
```

## 향후 확장 계획
1. **AI 소재 추천**: 수집된 JSON 데이터를 분석하여 블로그 포스팅 주제 자동 추천
2. **트렌드 대시보드**: 주간/월간 키워드 트렌드 시각화
3. **자동 포스팅 연동**: 크롤링 → AI 작성 → 티스토리 자동 발행 파이프라인 구축
