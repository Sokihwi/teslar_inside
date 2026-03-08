import { createPost } from './src/tistory.js';
import process from 'process';

async function test() {
    console.log("Starting direct post script...");

    const contentHTML = `
<p>어제 퇴근 후 거실에서 넷플릭스를 보는데, 영화 &lt;아이언맨&gt;이 방영 중이었다. 화려한 수트를 입고 하늘을 나는 토니 스타크를 보며, 스크린 밖 현실 세계에서 그와 가장 닮은 한 남자를 떠올렸다. 실제로 로버트 다우니 주니어가 토니 스타크 역할을 연구할 때 롤모델로 삼았다는 남자, 바로 일론 머스크다.</p>

<p>나 역시 공군 장교 시절, 좁은 관사에서 컵라면으로 끼니를 때우며 야간근무를 서던 때가 있었다. 지금은 비행장 활주로 포장을 점검하는 평범한 50대 토목 엔지니어가 되었지만, 불가능해 보이는 꿈을 향해 달려가는 이 괴짜 거인의 발자취를 쫓다 보면 묘한 전율이 일어날 때가 있다.</p>

<p>우리가 흔히 '지구 최고 부자' 혹은 '입이 가벼운 CEO'로만 아는 일론 머스크, 그의 삶을 엔지니어의 시각으로 분해해 보면 어처구니없을 정도로 흥미로운 팩트들이 튀어나온다.</p>

<blockquote style="background:#f9f9f9; padding: 10px; border-left: 5px solid #ccc;">[이미지 생성 프롬프트 1 - 도입부]<br>A cinematic, hyper-realistic close-up portrait of Elon Musk in a dimly lit, futuristic garage. He is staring thoughtfully at a glowing, high-tech holographic blueprint of a rocket and an electric car. The lighting is dramatic with cool blue and warm orange tones, resembling a scene from Iron Man. 8k resolution, photorealistic.</blockquote>

<p><b>1. 하루 1,300원으로 버텼던 생존 실험 (극단적 한계 테스트)</b><br>
대학 시절, 머스크는 본인이 과연 가난 속에서도 살아남아 창업을 할 수 있을지 시험해 보기 위해 일종의 '극단적 생존 실험'을 했다. 한 달 식비를 단 30달러(하루 1달러 수준)로 제한하고, 마트에서 대량으로 산 핫도그와 오렌지 콤보 식단으로만 버틴 것이다.</p>

<p>가난해서가 아니었다. '내가 굶어 죽지만 않을 수 있다면, 어떤 리스크든 감당할 수 있겠다'는 그만의 제1원리 사고(First Principles Thinking)였다. 나 역시 현장에서 설계 오류가 났을 때 모든 조건을 바닥부터 다시 뜯어보는 강박이 있지만, 자신의 위장과 생명을 담보로 멘탈 테스트를 하는 이 무식한 공학도를 어찌 평범하게 볼 수 있을까.</p>

<p><b>2. 스탠퍼드 물리학 박사 과정을 이틀 만에 때려치우다</b><br>
1995년, 인터넷 브로드밴드 시대의 태동을 직감한 그는 펜실베이니아 대학 졸업 후 합격했던 명문 스탠퍼드 대학교의 응용물리학 박사 과정을 단 이틀 만에 자퇴해 버린다. 그리고 동생 코인(Kimbal)과 함께 인터넷 회사(Zip2)를 차렸다.</p>

<p>"방향이 맞다면 속도는 중요하지 않다"고 흔히들 위로하지만, 머스크는 <b>"방향이 맞다면 속도가 전부다"</b>라고 다그치는 듯하다. 며칠 전, 다이소에서 세면대 뚫는 도구를 고를 때 '액체형을 살까, 도구형을 살까' 10분이나 고민하다 둘 다 사버렸던 나의 지독한 결정장애를 돌아보면, 인생의 거대한 변곡점 앞에서 단 이틀 만에 학교를 걷어찰 수 있는 그의 압도적인 야전성(野性)이 그저 놀랍기만 하다.</p>

<blockquote style="background:#f9f9f9; padding: 10px; border-left: 5px solid #ccc;">[이미지 생성 프롬프트 2 - 본문 중간]<br>A vintage-style, hyper-detailed photograph of a young, messy college student desk in the 1990s. On the desk, there is an old thick computer monitor displaying lines of code, surrounded by cheap hot dogs and peeled oranges. A crumpled Stanford University acceptance letter is tossed near the keyboard. Cinematic lighting, nostalgic atmosphere.</blockquote>

<p><b>3. 실패와 강박이 만든 '기록'의 화신</b><br>
머스크는 12살 때 직접 독학으로 코딩을 배워 '블래스타(Blastar)'라는 비디오 게임을 만들고 500달러에 팔았던 떡잎부터 다른 천재다. 하지만 그의 진짜 스펙은 천재성이 아니라 '집요한 기록과 몰입'이다. 모델3 생산 지옥(Production Hell) 시절, 그는 아예 테슬라 공장 바닥과 책상 밑에 침낭을 깔고 자며 24시간 라인을 지켰다. 향수 알레르기가 있어 흔한 스킨조차 뿌리지 않는 이 남자는, 오직 쇳가루와 기계 기름 냄새 속에서만 안도감을 느끼는 듯하다.</p>

<p>테슬라와 스페이스X의 수많은 실패들은 결코 덮어지지 않는다. 공중에서 터져버린 엄청난 액수의 로켓 잔해들은 모두 철저한 '데이터'로 기록되어 다음 설계에 반영된다. 매일 아침 4시 30분에 일어나 이렇게 끄적끄적 글을 남기는 나의 작은 '기록의 힘'이, 언젠가 그의 로켓처럼 대기권을 뚫고 나갈 폭발력의 씨앗이 되진 않을까.</p>

<p>글을 쓰다 보니 어느새 창밖으로 시퍼런 동이 트고 있다. 오늘 아침도 변함없이 푸시업 60개로 가볍게 땀을 내고, 나지막이 외쳐본다. "나 자신을 칭찬해~"</p>

<p>내가 설계한 아주 작은 도로 위를 달리는 수 편집</p>
    `;

    try {
        const result = await createPost({
            blogUrl: 'https://teslar-pi-phone-inside.tistory.com',
            title: '핫도그와 오렌지로 버틴 억만장자, 일론 머스크의 소름 돋는 3가지 팩트',
            content: contentHTML.trim(),
            tags: ["테슬라인사이드", "일론머스크", "퍼스트프린시플", "머스크일화", "동기부여"],
            publish: false
        });
        console.log("Result:", result);
    } catch (error) {
        console.error("Fatal Error:", error);
    }

    process.exit(0);
}

test();
