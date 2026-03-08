
import { createPost } from './src/tistory.js';
import process from 'process';

async function post() {
    const contentHTML = `
<div style="font-family: 'Pretendard', sans-serif; line-height: 1.8; color: #333;">

<p style="text-align: center;"><img src="https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=1000&auto=format&fit=crop" alt="Tesla Charging" style="width: 100%; border-radius: 12px; margin-bottom: 30px;" /></p>

<h1 style="color: #E31937; border-bottom: 2px solid #E31937; padding-bottom: 10px; margin-bottom: 25px;">2026 전기차 보조금 완벽 가이드: 테슬라 모델 Y, 3 실수령액은?</h1>

<p>안녕하세요! <strong>테슬라 인사이드</strong>입니다. 😊</p>

<p>매일 새벽 4시 30분, 커피 향 속에 조용히 앉아 떠오르는 수많은 숫자 중 가장 설레는 숫자는 무엇일까요? 아마 테슬라를 꿈꾸는 분들에게는 <strong>'보조금'</strong>이라는 이름의 환급액일 것입니다.</p>

<p>오늘은 기계공학을 전공한 50대 엔지니어의 시각으로, 복잡하기만 한 2026년 전기차 보조금 정책을 엑셀보다 명확하게, 그리고 내 차를 고르는 마음으로 정밀하게 분석해 드리겠습니다.</p>

<hr style="border: 0; height: 1px; background: #eee; margin: 30px 0;" />

<h2 style="border-left: 5px solid #E31937; padding-left: 15px; background: #f9f9f9; padding-top: 10px; padding-bottom: 10px;">🚗 2026년 보조금, 핵심은 '깐깐함'과 '전환'</h2>

<p>결론부터 말씀드리면, 전체 예산은 유지되지만 지급 기준은 훨씬 더 <strong>'기술 중심'</strong>으로 변했습니다. 공학적으로 보면 배터리의 에너지 밀도와 친환경성을 더 따지겠다는 의도죠.</p>

<ul style="list-style-type: none; padding-left: 0;">
  <li style="margin-bottom: 10px;">✅ <strong>보조금 100% 구간 축소:</strong> 차량 가격 <strong>5,400만 원 미만</strong>만 전액 지원 대상입니다.</li>
  <li style="margin-bottom: 10px;">📉 <strong>LFP 배터리 차등:</strong> 모델 3/Y RWD 모델에 들어가는 LFP 배터리는 작년보다 감점이 소폭 늘었습니다.</li>
  <li style="margin-bottom: 10px;">🔥 <strong>(대박 혜택) 전환지원금 신설:</strong> 노후 내연기관차 폐차 후 전기차 구매 시 <strong>무려 100만 원 추가!</strong></li>
</ul>

<div style="background-color: #fff4f5; border: 1px solid #ffccd1; padding: 20px; border-radius: 10px; margin: 25px 0;">
  <p style="margin: 0; font-weight: bold; color: #E31937;">💡 인사이더의 꿀팁 (Pro Tip)</p>
  <p style="margin: 10px 0 0 0;">"본인 명의가 아니더라도 부모님 명의의 오래된 차를 활용해 <strong>공동명의</strong>로 구입하면 전환지원금 100만 원을 챙길 수 있습니다. 이 돈이면 틴팅과 유리막 코팅까지 공짜로 하는 셈이죠!"</p>
</div>

<hr style="border: 0; height: 1px; background: #eee; margin: 30px 0;" />

<h2 style="border-left: 5px solid #E31937; padding-left: 15px; background: #f9f9f9; padding-top: 10px; padding-bottom: 10px;">💰 테슬라 모델별 예상 실구매가 (서울 기준)</h2>

<p>가장 궁금해하실 실제 내 통장에서 나가는 돈을 계산해 보았습니다. (국비+지방비 서울 기준)</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; text-align: center;">
  <thead>
    <tr style="background-color: #333; color: white;">
      <th style="padding: 12px; border: 1px solid #ddd;">테슬라 모델</th>
      <th style="padding: 12px; border: 1px solid #ddd;">정가 (예상)</th>
      <th style="padding: 12px; border: 1px solid #ddd;">보조금 (서울)</th>
      <th style="padding: 12px; border: 1px solid #ddd;">최종 실구매가</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">모델 3 RWD</td>
      <td style="padding: 12px; border: 1px solid #ddd;">5,199만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd;">210만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd; color: #E31937; font-weight: bold;">4,989만 원</td>
    </tr>
    <tr style="background-color: #fefefe;">
      <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">모델 3 롱레인지</td>
      <td style="padding: 12px; border: 1px solid #ddd;">5,999만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd;">380만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd; color: #E31937; font-weight: bold;">5,619만 원</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">모델 Y RWD</td>
      <td style="padding: 12px; border: 1px solid #ddd;">5,299만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd;">195만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd; color: #E31937; font-weight: bold;">5,104만 원</td>
    </tr>
    <tr style="background-color: #fefefe;">
      <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">모델 Y 롱레인지</td>
      <td style="padding: 12px; border: 1px solid #ddd;">6,099만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd;">360만 원</td>
      <td style="padding: 12px; border: 1px solid #ddd; color: #E31937; font-weight: bold;">5,739만 원</td>
    </tr>
  </tbody>
</table>

<p style="font-size: 0.9em; color: #666;">* 모든 수치는 2026년 환경부 고시 예상치를 바탕으로 한 추정치이며, 지자체별로 차이가 있습니다.</p>

<hr style="border: 0; height: 1px; background: #eee; margin: 30px 0;" />

<h2 style="border-left: 5px solid #E31937; padding-left: 15px; background: #f9f9f9; padding-top: 10px; padding-bottom: 10px;">⚙️ 실패 없는 보조금 신청 액션 플랜</h2>

<p>엔지니어가 출장이 잦은 도로 현장에서 활주로를 점검하듯, 여러분도 이 3가지는 완벽하게 점검해야 합니다.</p>

<ol style="line-height: 2;">
  <li><strong>지자체 예산 소진 속도 체크:</strong> 거주하시는 시/군 홈페이지에서 매주 예산 잔량을 확인하세요.</li>
  <li><strong>출고 타이밍과 매칭:</strong> 테슬라는 분기 말(3, 6, 9, 12월)에 차량이 쏟아집니다. 이때 보조금 순번이 밀리지 않게 서류 준비를 끝내야 합니다.</li>
  <li><strong>주소지 유지 필수:</strong> 보조금을 받고 의무 운행 기간(보통 2년) 내에 타 지자체로 이전하거나 판매하면 보조금을 반납해야 할 수 있습니다.</li>
</ol>

<div style="background-color: #fffdee; border: 1px solid #e1dbb5; padding: 20px; border-radius: 10px; margin: 25px 0;">
  <p style="margin: 0; font-weight: bold; color: #856404;">⚠️ 엔지니어의 경고</p>
  <p style="margin: 10px 0 0 0;">"보조금 신청은 '출고 기준'이 아니라 '보조금 대상자 확정' 기준입니다. 계약만 했다고 안심하지 마시고, 어드바이저와 소통하며 서류 접수 시점을 칼같이 맞추세요."</p>
</div>

<hr style="border: 0; height: 1px; background: #eee; margin: 30px 0;" />

<h2 style="text-align: center; color: #E31937;">마치며</h2>

<p>지금까지 2026년 전기차 보조금에 대해 알아보았습니다. 어떠셨나요? 복잡한 수식과 숫자들 속에서 나에게 딱 맞는 '값'을 찾으셨길 바랍니다.</p>

<p>개인적으로는 올해가 테슬라 모델 Y RWD를 <strong>5천만 원 초반대</strong>에 소유할 수 있는 아주 근사한 기회라고 생각합니다. 저 또한 모델 Y를 처음 출고하던 날의 그 정숙함을 잊지 못합니다.</p>

<p><strong>여러분의 거주지는 어디신가요?</strong> 지역에 따라 지방비가 천차만별입니다. 댓글로 사시는 지역을 남겨주시면 제가 직접 각 지자체별 정확한 보조금을 계산해 답변해 드릴게요! 😉</p>

<p>오늘도 테슬라와 함께 더 멀리, 더 안전하게 나아가는 하루 되시길 소망합니다. <strong>나 자신을 칭찬해~!</strong> 🙌</p>

<p style="margin-top: 40px;">#테슬라인사이드 #전기차보조금 #모델Y보조금 #테슬라수익화 #스티브다빈치 #2026전기차</p>

</div>
    `;

    try {
        const result = await createPost({
            blogUrl: 'https://tesla-inside-kr.tistory.com',
            title: '[구매가이드] 2026 전기차 보조금 완벽 분석: 테슬라 모델 Y, 3 실수령액 얼마? 🚗⚡',
            content: contentHTML.trim(),
            tags: ["테슬라보조금", "2026전기차보조금", "모델Y보조금", "전기차전환지원금", "테슬라인사이드"],
            publish: false,
            category: '1. 테슬라 구매 & 보조금'
        });
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

post();
