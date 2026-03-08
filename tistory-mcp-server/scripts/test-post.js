#!/usr/bin/env node
// =============================================================================
// 🧪 test-post.js - 티스토리 테스트 글 발행 스크립트
// =============================================================================

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPost } from '../src/tistory.js';
import { closeBrowser } from '../src/browser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const BLOG_URL = process.env.TISTORY_BLOG_URL || 'https://teslar-pi-phone-inside.tistory.com';

async function main() {
    console.log('🚀 티스토리 테스트 글 발행을 시작합니다...');
    console.log(`📌 블로그 URL: ${BLOG_URL}`);

    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const result = await createPost({
        blogUrl: BLOG_URL,
        title: `[테스트] ASK Steve Korea 첫 글 - ${today}`,
        content: `
<h2>🎉 안녕하세요! ASK Steve Korea 티스토리 블로그입니다</h2>

<p>이 글은 <strong>ASK Steve Korea</strong> 프로젝트의 자동화 시스템을 통해 발행된 <em>첫 번째 테스트 글</em>입니다.</p>

<h3>✅ 무엇을 테스트하고 있나요?</h3>
<ul>
    <li>Playwright 브라우저 자동화를 통한 글 발행</li>
    <li>HTML 본문 작성 기능</li>
    <li>태그 및 카테고리 설정</li>
    <li>자동 발행 워크플로우</li>
</ul>

<h3>📅 발행 일시</h3>
<p>${today}</p>

<blockquote>
    <p>이 글은 자동화 시스템 테스트 목적으로 작성되었습니다. 곧 더 멋진 콘텐츠로 찾아뵙겠습니다! 🚀</p>
</blockquote>

<p><em>Powered by ASK Steve Korea MCP Server</em></p>
        `.trim(),
        tags: ['테스트', 'ASK', '자동발행'],
        publish: true
    });

    console.log('\n📊 발행 결과:');
    console.log(JSON.stringify(result, null, 2));

    await closeBrowser();
    console.log('\n✅ 브라우저를 종료했습니다.');
}

main().catch((error) => {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
});
