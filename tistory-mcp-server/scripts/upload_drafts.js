import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import { marked } from 'marked';
import { createPost } from '../src/tistory.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRAFTS_DIR = path.resolve(__dirname, '../../../posts/tesla_inside_drafts');

async function uploadDrafts() {
    console.log('🚀 테슬라 인사이드 16편 대량 임시저장 업로더 시작...');

    if (!fs.existsSync(DRAFTS_DIR)) {
        console.error('❌ Drafts 폴더를 찾을 수 없습니다:', DRAFTS_DIR);
        process.exit(1);
    }

    const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md')).sort();

    if (files.length === 0) {
        console.log('✅ 업로드할 마크다운 파일이 없습니다.');
        process.exit(0);
    }

    console.log(`총 ${files.length}개의 파일을 업로드합니다.\n`);

    for (const file of files) {
        console.log(`📄 파일 처리 중: ${file}`);
        const filePath = path.join(DRAFTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        try {
            const parsed = fm(content);
            const htmlContent = marked.parse(parsed.body);

            const title = parsed.attributes.title || file.replace('.md', '');
            const category = parsed.attributes.category || '테슬라 뉴스';
            let tags = parsed.attributes.tags || [];
            if (typeof tags === 'string') {
                tags = tags.split(',').map(t => t.trim());
            }

            console.log(`- 제목: ${title}`);
            console.log(`- 카테고리: ${category}`);

            const result = await createPost({
                blogUrl: 'https://tesla-inside-kr.tistory.com',
                title: title,
                content: htmlContent,
                tags: tags,
                category: category,
                publish: false // 임시저장(Draft) 필수!
            });

            if (result.success) {
                console.log(`✅ 성공: ${result.message}`);
                // 성공한 파일은 uploaded 폴더로 이동하여 중복 업로드 방지
                const doneDir = path.join(DRAFTS_DIR, 'uploaded');
                if (!fs.existsSync(doneDir)) fs.mkdirSync(doneDir);
                fs.renameSync(filePath, path.join(doneDir, file));
            } else {
                console.error(`❌ 실패: ${result.message}`);
            }
        } catch (error) {
            console.error(`❌ [${file}] 처리 중 에러 발생:`, error.message);
        }

        // 티스토리 매크로 차단 방지용 안전 대기시간 (10초)
        console.log('⏳ 다음 글 작성을 위해 10초 대기 중...\n');
        await new Promise(r => setTimeout(r, 10000));
    }

    console.log('🎉 모든 임시저장 작업이 안전하게 완료되었습니다!');
    process.exit(0);
}

uploadDrafts();
