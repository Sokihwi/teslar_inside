"""
=============================================================================
🔍 fetch_tesla_news.py - 테슬라 뉴스 자동 크롤링 엔진
네이버 뉴스 + 구글 뉴스를 동시에 크롤링하여 HTML 다이제스트 생성
=============================================================================
"""

import requests
from bs4 import BeautifulSoup
import datetime
import time
import os
import json

# ============================================================================
# 🔑 키워드 설정 (필요에 따라 추가/수정)
# ============================================================================
KEYWORDS_KR = [
    "테슬라",
    "사이버트럭",
    "모델3 하이랜드",
    "모델Y 주니퍼",
    "테슬라 FSD",
    "일론 머스크",
    "테슬라 자율주행",
    "테슬라 보조금",
    "옵티머스 로봇",
    "기가팩토리"
]

KEYWORDS_EN = [
    "Tesla",
    "Cybertruck",
    "Tesla FSD",
    "Elon Musk Tesla",
    "Tesla Model Y Juniper",
    "Tesla Optimus robot",
    "Tesla earnings"
]

# 출력 파일 경로
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "digests")
os.makedirs(OUTPUT_DIR, exist_ok=True)

TODAY = datetime.date.today().strftime('%Y-%m-%d')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, f"tesla_digest_{TODAY}.html")
OUTPUT_JSON = os.path.join(OUTPUT_DIR, f"tesla_digest_{TODAY}.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}

# ============================================================================
# 📰 네이버 뉴스 크롤링
# ============================================================================
def fetch_naver_news(keyword, period="1"):
    """
    네이버 뉴스 API를 통해 뉴스 검색
    period: "1" = 1주일, "4" = 1개월, "0" = 전체
    """
    print(f"  [네이버] Searching: {keyword}")
    url = "https://s.search.naver.com/p/newssearch/3/api/tab/more"

    params = {
        "query": keyword,
        "sort": "1",     # 0: 관련도, 1: 최신순
        "pd": period,    # 1: 1주일
        "start": "1",
        "ssc": "tab.news.all"
    }

    try:
        response = requests.get(url, params=params, headers=HEADERS, timeout=10)
        response.raise_for_status()
        data = response.json()

        articles = []
        html_content = ""

        if 'collection' in data:
            for item in data['collection']:
                if 'html' in item:
                    html_content += item['html']

        if not html_content:
            return []

        soup = BeautifulSoup(html_content, 'html.parser')
        title_elements = soup.select(".sds-comps-text-type-headline1")

        for title_el in title_elements:
            link_tag = title_el.find_parent('a')
            if not link_tag:
                continue

            title = title_el.get_text().strip()
            link = link_tag['href']

            container = link_tag.find_parent('div')
            desc_el = container.select_one(".sds-comps-text-type-body1") if container else None
            description = desc_el.get_text().strip() if desc_el else ""

            articles.append({
                "title": title,
                "link": link,
                "description": description,
                "source": "네이버 뉴스",
                "keyword": keyword,
                "lang": "ko"
            })

        return articles

    except Exception as e:
        print(f"    ⚠ Error: {e}")
        return []

# ============================================================================
# 🌐 구글 뉴스 크롤링
# ============================================================================
def fetch_google_news(keyword, lang="en"):
    """
    Google News RSS를 통해 뉴스 검색
    lang: "en" for English, "ko" for Korean
    """
    print(f"  [구글] Searching: {keyword} (lang={lang})")

    hl = "ko" if lang == "ko" else "en"
    gl = "KR" if lang == "ko" else "US"
    ceid = f"{gl}:{hl}"

    url = f"https://news.google.com/rss/search?q={requests.utils.quote(keyword)}+when:7d&hl={hl}&gl={gl}&ceid={ceid}"

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'xml')
        items = soup.find_all('item')

        articles = []
        for item in items[:10]:  # 키워드당 최대 10개
            title = item.title.text if item.title else ""
            link = item.link.text if item.link else ""
            pub_date = item.pubDate.text if item.pubDate else ""
            source_el = item.source
            source = source_el.text if source_el else "Google News"
            description = item.description.text if item.description else ""

            # HTML 태그 제거
            if description:
                description = BeautifulSoup(description, 'html.parser').get_text().strip()

            articles.append({
                "title": title,
                "link": link,
                "description": description[:200],
                "source": f"Google News ({source})",
                "keyword": keyword,
                "lang": lang,
                "pub_date": pub_date
            })

        return articles

    except Exception as e:
        print(f"    ⚠ Error: {e}")
        return []

# ============================================================================
# 📊 HTML 리포트 생성
# ============================================================================
def generate_html(naver_articles, google_articles):
    css = """
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        h1 { color: #e82127; border-bottom: 3px solid #e82127; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; border-left: 4px solid #e82127; padding-left: 10px; }
        .stats { background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stats span { margin-right: 20px; font-weight: bold; }
        .article { margin-bottom: 15px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .article h3 { margin-top: 0; margin-bottom: 5px; font-size: 1.05em; }
        .article h3 a { text-decoration: none; color: #2c3e50; }
        .article h3 a:hover { color: #e82127; text-decoration: underline; }
        .meta { font-size: 0.85em; color: #777; margin-bottom: 8px; }
        .summary { color: #555; font-size: 0.92em; }
        .keyword-tag { background-color: #fce4e4; color: #e82127; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; margin-left: 8px; font-weight: bold; }
        .source-tag { background-color: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; }
        .footer { margin-top: 40px; font-size: 0.8em; color: #999; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; }
    </style>
    """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Tesla Inside - News Digest ({TODAY})</title>
        {css}
    </head>
    <body>
        <h1>🚗 Tesla Inside - News Digest</h1>
        <div class="stats">
            <span>📅 Date: {TODAY}</span>
            <span>📰 네이버: {len(naver_articles)}건</span>
            <span>🌐 구글: {len(google_articles)}건</span>
            <span>📊 총: {len(naver_articles) + len(google_articles)}건</span>
        </div>
    """

    # 네이버 뉴스 섹션
    if naver_articles:
        html += "<h2>🇰🇷 네이버 뉴스 (국내)</h2>"
        for article in naver_articles:
            html += f"""
            <div class="article">
                <h3><a href="{article['link']}" target="_blank">{article['title']}</a></h3>
                <div class="meta">
                    <span class="source-tag">{article['source']}</span>
                    <span class="keyword-tag">#{article['keyword']}</span>
                </div>
                <div class="summary">{article['description']}</div>
            </div>
            """

    # 구글 뉴스 섹션
    if google_articles:
        html += "<h2>🌐 Google News (글로벌)</h2>"
        for article in google_articles:
            html += f"""
            <div class="article">
                <h3><a href="{article['link']}" target="_blank">{article['title']}</a></h3>
                <div class="meta">
                    <span class="source-tag">{article['source']}</span>
                    <span class="keyword-tag">#{article['keyword']}</span>
                </div>
                <div class="summary">{article['description']}</div>
            </div>
            """

    html += f"""
        <div class="footer">
            ⚡ Generated by Tesla Inside Antigravity Agent | {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        </div>
    </body>
    </html>
    """

    return html

# ============================================================================
# 🚀 메인 실행
# ============================================================================
def main():
    print("=" * 60)
    print(f"🚗 Tesla Inside - News Crawler Starting... ({TODAY})")
    print("=" * 60)

    # 1) 네이버 뉴스 크롤링 (한국어 키워드)
    print("\n📰 [Phase 1] 네이버 뉴스 크롤링...")
    naver_articles = []
    seen_links = set()

    for keyword in KEYWORDS_KR:
        results = fetch_naver_news(keyword)
        for article in results:
            if article['link'] not in seen_links:
                seen_links.add(article['link'])
                naver_articles.append(article)
        time.sleep(1)

    print(f"  ✅ 네이버: {len(naver_articles)}건 수집")

    # 2) 구글 뉴스 크롤링 (영어 키워드)
    print("\n🌐 [Phase 2] 구글 뉴스 크롤링...")
    google_articles = []

    for keyword in KEYWORDS_EN:
        results = fetch_google_news(keyword, lang="en")
        for article in results:
            if article['link'] not in seen_links:
                seen_links.add(article['link'])
                google_articles.append(article)
        time.sleep(1)

    print(f"  ✅ 구글: {len(google_articles)}건 수집")

    # 3) HTML 리포트 생성
    print(f"\n📊 [Phase 3] 리포트 생성 중...")
    html_content = generate_html(naver_articles, google_articles)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)

    # 4) JSON 원본 데이터 저장 (향후 AI 분석용)
    all_articles = naver_articles + google_articles
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"✅ 완료! 총 {len(all_articles)}건 수집")
    print(f"📄 HTML: {OUTPUT_FILE}")
    print(f"📦 JSON: {OUTPUT_JSON}")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()
