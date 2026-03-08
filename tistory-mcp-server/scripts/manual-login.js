#!/usr/bin/env node
// =============================================================================
// 🔑 manual-login.js - 대표님이 직접 로그인하시는 스크립트
// 이 스크립트를 실행하면 브라우저가 열리고, 카카오 로그인을 하시면 됩니다.
// 로그인 후 세션이 auth-data/ 폴더에 저장되어 이후 자동 로그인됩니다.
// =============================================================================

import { launchBrowser, closeBrowser } from '../src/browser.js';
import { isLoggedIn } from '../src/auth.js';

async function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('🔐 티스토리 수동 로그인 도우미');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('브라우저가 열립니다. 카카오 계정으로 로그인해 주세요.');
    console.log('로그인 후 세션이 자동 저장됩니다.');
    console.log('');

    // headed 모드(눈에 보이는 브라우저)로 실행
    const { page } = await launchBrowser(false);

    // 먼저 이미 로그인되어 있는지 확인
    const alreadyLoggedIn = await isLoggedIn(page);
    if (alreadyLoggedIn) {
        console.log('✅ 이미 로그인된 상태입니다! 세션이 유효해요.');
        console.log('');
        console.log('브라우저를 종료합니다...');
        await closeBrowser();
        return;
    }

    // 티스토리 로그인 페이지로 이동
    await page.goto('https://www.tistory.com/auth/login', {
        waitUntil: 'networkidle',
        timeout: 30000
    });

    console.log('📌 브라우저에서 카카오 로그인을 완료해 주세요!');
    console.log('   로그인이 완료되면 자동으로 감지됩니다.');
    console.log('');

    // 로그인 완료를 기다림 (최대 5분)
    const maxWait = 5 * 60 * 1000; // 5분
    const checkInterval = 3000; // 3초마다 확인
    let elapsed = 0;

    while (elapsed < maxWait) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        elapsed += checkInterval;

        try {
            const loggedIn = await isLoggedIn(page);
            if (loggedIn) {
                console.log('');
                console.log('🎉 로그인 성공! 세션이 auth-data/ 폴더에 저장되었습니다.');
                console.log('   이제 MCP 서버를 통해 자동으로 로그인됩니다!');
                console.log('');
                await closeBrowser();
                return;
            }
        } catch {
            // 페이지가 이동 중이면 무시
        }

        // 진행 표시
        const remaining = Math.ceil((maxWait - elapsed) / 1000);
        process.stdout.write(`\r⏳ 로그인 대기 중... (남은 시간: ${remaining}초)  `);
    }

    console.log('');
    console.log('⏰ 시간이 초과되었습니다. 다시 실행해 주세요.');
    await closeBrowser();
}

main().catch((error) => {
    console.error('오류:', error.message);
    process.exit(1);
});
