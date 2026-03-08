#!/usr/bin/env node
// =============================================================================
// 🚀 index.js - 티스토리 MCP 서버 메인 엔트리포인트
// ASK Steve Korea의 코다리 부장이 자랑스럽게 제작했습니다! 🐟
// =============================================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { login, checkLoginStatus } from './src/auth.js';
import { createPost, listPosts, getBlogInfo } from './src/tistory.js';
import { closeBrowser } from './src/browser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.join(__dirname, '.env') });

const BLOG_URL = process.env.TISTORY_BLOG_URL || 'https://teslar-pi-phone-inside.tistory.com';

// =============================================================================
// MCP 서버 생성
// =============================================================================
const server = new Server(
    {
        name: 'tistory-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// =============================================================================
// Tool 목록 정의
// =============================================================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'tistory_login',
                description: '카카오 계정으로 티스토리에 로그인합니다. 최초 1회는 브라우저에서 수동 로그인이 필요하며, 이후에는 세션이 자동 유지됩니다.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        kakao_id: {
                            type: 'string',
                            description: '(선택) 카카오 이메일 또는 전화번호. 비어있으면 수동 로그인 모드.',
                        },
                        kakao_pw: {
                            type: 'string',
                            description: '(선택) 카카오 비밀번호. 비어있으면 수동 로그인 모드.',
                        },
                    },
                    required: [],
                },
            },
            {
                name: 'tistory_create_post',
                description: '티스토리 블로그에 새 글을 작성합니다. HTML 형식의 본문을 지원합니다.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: '글 제목',
                        },
                        content: {
                            type: 'string',
                            description: '글 본문 (HTML 형식 지원)',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: '(선택) 태그 목록. 예: ["테슬라", "FSD", "자율주행"]',
                        },
                        category: {
                            type: 'string',
                            description: '(선택) 카테고리 이름',
                        },
                        publish: {
                            type: 'boolean',
                            description: '(선택) true면 즉시 발행, false면 임시저장. 기본값: false',
                        },
                        blog_url: {
                            type: 'string',
                            description: '(선택) 블로그 URL. 기본값은 환경변수의 TISTORY_BLOG_URL',
                        },
                    },
                    required: ['title', 'content'],
                },
            },
            {
                name: 'tistory_list_posts',
                description: '티스토리 블로그의 최근 글 목록을 조회합니다.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: '(선택) 조회할 글 수. 기본값: 10',
                        },
                        blog_url: {
                            type: 'string',
                            description: '(선택) 블로그 URL. 기본값은 환경변수의 TISTORY_BLOG_URL',
                        },
                    },
                    required: [],
                },
            },
            {
                name: 'tistory_get_blog_info',
                description: '티스토리 블로그의 기본 정보(제목, 설명, 카테고리 등)를 조회합니다.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        blog_url: {
                            type: 'string',
                            description: '(선택) 블로그 URL. 기본값은 환경변수의 TISTORY_BLOG_URL',
                        },
                    },
                    required: [],
                },
            },
        ],
    };
});

// =============================================================================
// Tool 실행 핸들러
// =============================================================================
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'tistory_login': {
                const result = await login({
                    kakaoId: args?.kakao_id || process.env.KAKAO_ID,
                    kakaoPw: args?.kakao_pw || process.env.KAKAO_PW,
                    manual: !args?.kakao_id && !process.env.KAKAO_ID,
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }

            case 'tistory_create_post': {
                const result = await createPost({
                    blogUrl: args?.blog_url || BLOG_URL,
                    title: args.title,
                    content: args.content,
                    tags: args?.tags || [],
                    category: args?.category || '',
                    publish: args?.publish || false,
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }

            case 'tistory_list_posts': {
                const result = await listPosts(
                    args?.blog_url || BLOG_URL,
                    args?.count || 10
                );
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }

            case 'tistory_get_blog_info': {
                const result = await getBlogInfo(args?.blog_url || BLOG_URL);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }

            default:
                return {
                    content: [{ type: 'text', text: `알 수 없는 도구: ${name}` }],
                    isError: true,
                };
        }
    } catch (error) {
        return {
            content: [{ type: 'text', text: `오류 발생: ${error.message}` }],
            isError: true,
        };
    }
});

// =============================================================================
// 서버 시작
// =============================================================================
async function main() {
    const transport = new StdioServerTransport();

    // 종료 시 브라우저 정리
    process.on('SIGINT', async () => {
        await closeBrowser();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await closeBrowser();
        process.exit(0);
    });

    await server.connect(transport);
    console.error('🚀 티스토리 MCP 서버가 시작되었습니다!'); // stderr로 출력 (MCP 규약상)
}

main().catch((error) => {
    console.error('서버 시작 실패:', error);
    process.exit(1);
});
