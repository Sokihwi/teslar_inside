// =============================================================================
// 📝 tistory.js - 티스토리 블로그 자동화 핵심 모듈
// 모니카와 코다리가 합작한 글쓰기 엔진입니다! ✍️
// =============================================================================

import { launchBrowser } from './browser.js';
import { isLoggedIn } from './auth.js';

/**
 * 티스토리에 새 글을 작성합니다.
 * 
 * @param {object} options
 * @param {string} options.blogUrl - 블로그 주소 (예: https://teslar-pi-phone-inside.tistory.com)
 * @param {string} options.title - 글 제목
 * @param {string} options.content - 글 본문 (HTML 형식)
 * @param {string[]} [options.tags=[]] - 태그 목록
 * @param {string} [options.category=''] - 카테고리 이름
 * @param {boolean} [options.publish=false] - true면 즉시 발행, false면 임시저장
 * @returns {object} 작성 결과
 */
export async function createPost(options) {
    const {
        blogUrl,
        title,
        content,
        tags = [],
        category = '',
        publish = false
    } = options;

    const { page } = await launchBrowser(true);

    // 로그인 확인
    const loggedIn = await isLoggedIn(page);
    if (!loggedIn) {
        return {
            success: false,
            message: '로그인이 필요합니다. 먼저 tistory_login을 호출해 주세요.'
        };
    }

    try {
        // 티스토리 글쓰기 페이지로 이동
        const blogName = new URL(blogUrl).hostname.split('.')[0];
        const writeUrl = `https://www.tistory.com/manage/newpost?blogName=${blogName}`;

        await page.goto(writeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000); // 에디터 완전히 로드될 때까지 대기

        console.log("Checking for popups...");
        // Handle popups if any (e.g. "Draft exists" or announcements)
        const closeBtn = await page.$('.btn_close') || await page.$('button[class*="close"]');
        if (closeBtn) {
            try { await closeBtn.click(); } catch (e) { console.log(e); }
        }
        const confirmBtn = await page.$('.btn_confirm, .btn_ok');
        if (confirmBtn) {
            // Dismiss confirm popups (like load draft -> cancel)
            const cancelBtn = await page.$('.btn_cancel, .btn_close');
            if (cancelBtn) {
                try { await cancelBtn.click(); } catch (e) { console.log(e); }
                await page.waitForTimeout(1000);
            }
        }

        // --- 제목 입력 ---
        const titleSelector = '#post-title-inp';
        try {
            await page.waitForSelector(titleSelector, { timeout: 10000 });
        } catch (error) {
            await page.screenshot({ path: 'tistory_error.png' });
            throw new Error(`제목 셀렉터를 찾을 수 없습니다: ${error.message}`);
        }
        await page.click(titleSelector);
        await page.fill(titleSelector, title);

        // --- HTML 모드로 전환 ---
        // 에디터 모드를 HTML 모드로 변경 (글의 HTML 직접 입력을 위해)
        const htmlModeBtn = await page.$('button[data-mode="html"]')
            || await page.$('.btn_html')
            || await page.$('button:has-text("HTML")');

        if (htmlModeBtn) {
            await htmlModeBtn.click();
            await page.waitForTimeout(1000);

            // HTML 에디터 영역에 내용 입력
            const htmlEditor = await page.$('.CodeMirror');
            if (htmlEditor) {
                await htmlEditor.click();
                // CodeMirror 에디터에 값 설정
                await page.evaluate((htmlContent) => {
                    const cm = document.querySelector('.CodeMirror').CodeMirror;
                    if (cm) {
                        cm.setValue(htmlContent);
                    }
                }, content);
            } else {
                // textarea 기반 HTML 에디터
                const htmlTextarea = await page.$('textarea.html-editor') || await page.$('#html-editor');
                if (htmlTextarea) {
                    await htmlTextarea.fill(content);
                }
            }
        } else {
            // HTML 모드 버튼이 없으면 기본 에디터(WYSIWYG)로 입력 시도
            // iframe 기반 에디터 처리
            const editorFrame = page.frameLocator('#tinymce') || page.frameLocator('.editor-iframe');
            try {
                const body = editorFrame.locator('body');
                await body.click();
                await page.evaluate((htmlContent) => {
                    // WYSIWYG 에디터에 HTML 삽입
                    const editor = document.querySelector('iframe');
                    if (editor && editor.contentDocument) {
                        editor.contentDocument.body.innerHTML = htmlContent;
                    }
                }, content);
            } catch {
                // 최후의 수단: contenteditable div에 직접 입력
                const editableDiv = await page.$('[contenteditable="true"]');
                if (editableDiv) {
                    await editableDiv.click();
                    await page.evaluate((htmlContent) => {
                        const editable = document.querySelector('[contenteditable="true"]');
                        if (editable) editable.innerHTML = htmlContent;
                    }, content);
                }
            }
        }

        // --- 카테고리 설정 ---
        if (category) {
            try {
                const categoryBtn = await page.$('.btn_category') || await page.$('#category-btn');
                if (categoryBtn) {
                    await categoryBtn.click();
                    await page.waitForTimeout(500);

                    // 카테고리 목록에서 선택
                    const categoryItem = await page.$(`text="${category}"`);
                    if (categoryItem) {
                        await categoryItem.click();
                    }
                }
            } catch (error) {
                console.log(`카테고리 설정 실패 (무시): ${error.message}`);
            }
        }

        // --- 태그 입력 ---
        if (tags.length > 0) {
            try {
                const tagInput = await page.$('#tagText')
                    || await page.$('input[placeholder*="태그"]')
                    || await page.$('.tag-input input');

                if (tagInput) {
                    for (const tag of tags) {
                        await tagInput.fill(tag);
                        await page.keyboard.press('Enter');
                        await page.waitForTimeout(300);
                    }
                }
            } catch (error) {
                console.log(`태그 입력 실패 (무시): ${error.message}`);
            }
        }

        // --- 발행 또는 임시저장 ---
        if (publish) {
            // 발행 버튼 클릭
            const publishBtn = await page.$('button:has-text("발행")')
                || await page.$('.btn_publish')
                || await page.$('#publish-layer-btn');

            if (publishBtn) {
                await publishBtn.click();
                await page.waitForTimeout(1000);

                // 공개 발행 확인 버튼
                const confirmBtn = await page.$('button:has-text("발행")')
                    || await page.$('.btn_ok');
                if (confirmBtn) {
                    await confirmBtn.click();
                    await page.waitForTimeout(2000);
                }
            }

            return {
                success: true,
                message: `글이 성공적으로 발행되었습니다! 제목: "${title}"`,
                title,
                published: true,
                blogUrl: `${blogUrl}`
            };
        } else {
            // 임시저장
            const saveBtn = await page.$('button:has-text("저장")')
                || await page.$('.btn_save');
            if (saveBtn) {
                await saveBtn.click();
                await page.waitForTimeout(1000);
            }

            return {
                success: true,
                message: `글이 임시저장되었습니다! 제목: "${title}"`,
                title,
                published: false
            };
        }

    } catch (error) {
        return {
            success: false,
            message: `글 작성 중 오류가 발생했습니다: ${error.message}`
        };
    }
}

/**
 * 티스토리 블로그의 최근 글 목록을 조회합니다.
 * 
 * @param {string} blogUrl - 블로그 주소
 * @param {number} [count=10] - 조회할 글 수
 * @returns {object} 글 목록
 */
export async function listPosts(blogUrl, count = 10) {
    const { page } = await launchBrowser(true);

    const loggedIn = await isLoggedIn(page);
    if (!loggedIn) {
        return { success: false, message: '로그인이 필요합니다.' };
    }

    try {
        const blogName = new URL(blogUrl).hostname.split('.')[0];
        await page.goto(`https://www.tistory.com/manage/posts?blogName=${blogName}`, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        await page.waitForTimeout(2000);

        // 글 목록 스크래핑
        const posts = await page.evaluate((maxCount) => {
            const rows = document.querySelectorAll('.table_post tbody tr, .post-item, .list-item');
            const result = [];

            for (let i = 0; i < Math.min(rows.length, maxCount); i++) {
                const row = rows[i];
                const titleEl = row.querySelector('.title a, .tit_post, .post-title');
                const dateEl = row.querySelector('.date, .txt_date, .post-date');
                const statusEl = row.querySelector('.status, .txt_state');

                if (titleEl) {
                    result.push({
                        title: titleEl.textContent?.trim() || '제목 없음',
                        url: titleEl.href || '',
                        date: dateEl?.textContent?.trim() || '',
                        status: statusEl?.textContent?.trim() || '공개'
                    });
                }
            }
            return result;
        }, count);

        return {
            success: true,
            message: `${posts.length}개의 글을 조회했습니다.`,
            posts,
            totalFound: posts.length
        };

    } catch (error) {
        return {
            success: false,
            message: `글 목록 조회 중 오류: ${error.message}`
        };
    }
}

/**
 * 티스토리 블로그의 기본 정보를 조회합니다.
 * 
 * @param {string} blogUrl - 블로그 주소
 * @returns {object} 블로그 정보
 */
export async function getBlogInfo(blogUrl) {
    const { page } = await launchBrowser(true);

    try {
        // 블로그 메인 페이지에서 정보 수집
        await page.goto(blogUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);

        const blogInfo = await page.evaluate(() => {
            const title = document.querySelector('title')?.textContent?.trim() || '';
            const description = document.querySelector('meta[property="og:description"]')?.content
                || document.querySelector('meta[name="description"]')?.content || '';

            // 카테고리 목록 수집
            const categories = [];
            const categoryElements = document.querySelectorAll('.category a, .list_category a, .tt_category a');
            categoryElements.forEach(el => {
                const name = el.textContent?.trim();
                if (name && !categories.includes(name)) {
                    categories.push(name);
                }
            });

            return { title, description, categories };
        });

        // 관리자 페이지에서 추가 정보 수집
        const loggedIn = await isLoggedIn(page);
        let adminInfo = {};
        if (loggedIn) {
            const blogName = new URL(blogUrl).hostname.split('.')[0];
            await page.goto(`https://www.tistory.com/manage?blogName=${blogName}`, {
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });
            await page.waitForTimeout(2000);

            adminInfo = await page.evaluate(() => {
                const postCount = document.querySelector('.count_post, .num_post')?.textContent?.trim() || '알 수 없음';
                return { postCount };
            });
        }

        return {
            success: true,
            blogUrl,
            title: blogInfo.title,
            description: blogInfo.description,
            categories: blogInfo.categories,
            postCount: adminInfo.postCount || '알 수 없음',
            loggedIn
        };

    } catch (error) {
        return {
            success: false,
            message: `블로그 정보 조회 중 오류: ${error.message}`
        };
    }
}
