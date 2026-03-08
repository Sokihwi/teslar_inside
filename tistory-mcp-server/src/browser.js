// =============================================================================
// 📦 browser.js - Playwright 브라우저 관리 모듈
// 코다리 부장이 정성껏 조립한 브라우저 엔진입니다! 🐟
// =============================================================================

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 브라우저 세션 데이터 저장 경로
const AUTH_DATA_DIR = path.join(__dirname, '..', 'auth-data');

let browser = null;
let context = null;
let page = null;

/**
 * Playwright 브라우저를 persistent context로 실행합니다.
 * persistent context를 사용하면 세션(쿠키, 로그인 상태)이 auth-data/ 에 유지됩니다.
 */
export async function launchBrowser(headless = false) {
    if (context && page) {
        // 이미 열려있으면 재사용
        try {
            await page.evaluate(() => true);
            return { context, page };
        } catch {
            // 기존 페이지가 닫혔으면 새로 생성
        }
    }

    // persistent context로 브라우저 실행 (세션 유지)
    context = await chromium.launchPersistentContext(AUTH_DATA_DIR, {
        headless,
        viewport: { width: 1280, height: 800 },
        locale: 'ko-KR',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
        ],
    });

    // 기존 페이지가 있으면 사용, 없으면 새로 생성
    page = context.pages()[0] || await context.newPage();

    return { context, page };
}

/**
 * 브라우저를 안전하게 종료합니다.
 */
export async function closeBrowser() {
    if (context) {
        await context.close();
        context = null;
        page = null;
    }
}

/**
 * 현재 활성 페이지를 반환합니다.
 */
export function getPage() {
    return page;
}

/**
 * 현재 활성 context를 반환합니다.
 */
export function getContext() {
    return context;
}
