// =============================================================================
// 🔐 auth.js - 카카오 로그인 및 세션 관리 모듈
// 루나가 대표님의 보안을 철통같이 지킵니다! 💖
// =============================================================================

import { launchBrowser, getPage } from './browser.js';

const TISTORY_LOGIN_URL = 'https://www.tistory.com/auth/login';
const KAKAO_LOGIN_SELECTOR = 'a.btn_login.link_kakao_id';

/**
 * 현재 티스토리에 로그인된 상태인지 확인합니다.
 * @param {import('playwright').Page} page 
 * @returns {boolean}
 */
export async function isLoggedIn(page) {
    try {
        await page.goto('https://www.tistory.com/manage', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
        });

        // 관리자 페이지에 접근 가능하면 로그인 상태
        const url = page.url();
        if (url.includes('/manage') && !url.includes('/auth/login')) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

/**
 * 카카오 계정으로 티스토리에 로그인합니다.
 * 
 * 방법 1 (자동): 환경변수에 카카오 ID/PW가 있으면 자동 입력
 * 방법 2 (수동): 없으면 브라우저를 headed 모드로 열어서 사용자가 직접 로그인
 * 
 * @param {object} options
 * @param {string} [options.kakaoId] - 카카오 이메일/전화번호
 * @param {string} [options.kakaoPw] - 카카오 비밀번호
 * @param {boolean} [options.manual=false] - 수동 로그인 모드
 * @returns {object} 로그인 결과
 */
export async function login(options = {}) {
    const { kakaoId, kakaoPw, manual = false } = options;

    // 브라우저 열기 (로그인 시에는 항상 headed 모드)
    const { page } = await launchBrowser(false);

    // 이미 로그인되어 있는지 확인
    const alreadyLoggedIn = await isLoggedIn(page);
    if (alreadyLoggedIn) {
        return {
            success: true,
            message: '이미 로그인된 상태입니다! 세션이 유지되고 있어요.'
        };
    }

    // 티스토리 로그인 페이지로 이동
    await page.goto(TISTORY_LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // 카카오 로그인 버튼 클릭
    try {
        await page.waitForSelector(KAKAO_LOGIN_SELECTOR, { timeout: 10000 });
        await page.click(KAKAO_LOGIN_SELECTOR);
    } catch {
        // 다른 셀렉터 시도
        const kakaoBtn = await page.$('a[href*="kakao"]') || await page.$('button[class*="kakao"]');
        if (kakaoBtn) {
            await kakaoBtn.click();
        } else {
            return {
                success: false,
                message: '카카오 로그인 버튼을 찾을 수 없습니다. 티스토리 UI가 변경되었을 수 있어요.'
            };
        }
    }

    // 카카오 로그인 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    if (manual || (!kakaoId || !kakaoPw)) {
        // 수동 로그인 모드: 사용자가 직접 브라우저에서 로그인
        return {
            success: false,
            waitingForManualLogin: true,
            message: '브라우저 창이 열렸습니다! 대표님, 직접 카카오 로그인을 완료해 주세요. 로그인 후 티스토리 관리자 페이지가 보이면 성공입니다. 그 후 다시 tistory_login을 호출해주세요.'
        };
    }

    // 자동 로그인: 카카오 ID/PW 입력
    try {
        await page.waitForSelector('input[name="loginId"]', { timeout: 10000 });
        await page.fill('input[name="loginId"]', kakaoId);
        await page.fill('input[name="password"]', kakaoPw);
        await page.click('button[type="submit"]');

        // 로그인 처리 대기
        await page.waitForLoadState('networkidle');

        // 2차 인증이나 보안 확인이 나올 수 있음
        await page.waitForTimeout(3000);

        // 로그인 성공 확인
        const loginSuccess = await isLoggedIn(page);
        if (loginSuccess) {
            return {
                success: true,
                message: '카카오 로그인 성공! 세션이 저장되었습니다. 앞으로 자동 로그인됩니다.'
            };
        } else {
            return {
                success: false,
                waitingForManualLogin: true,
                message: '자동 로그인에 실패했습니다 (2차 인증 등). 브라우저에서 직접 로그인을 완료해 주세요.'
            };
        }
    } catch (error) {
        return {
            success: false,
            waitingForManualLogin: true,
            message: `자동 로그인 중 오류 발생: ${error.message}. 브라우저에서 직접 로그인해 주세요.`
        };
    }
}

/**
 * 로그인 상태를 확인하고 결과를 반환합니다.
 */
export async function checkLoginStatus() {
    const { page } = await launchBrowser(true);
    const loggedIn = await isLoggedIn(page);
    return {
        loggedIn,
        message: loggedIn
            ? '티스토리에 로그인된 상태입니다!'
            : '로그인이 필요합니다. tistory_login을 호출해 주세요.'
    };
}
