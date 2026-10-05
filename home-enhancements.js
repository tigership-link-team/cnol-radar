// Homepage feedback input. A rating only becomes a public review after submission and consent.
const labels = {
  ko:{example:'예시 데이터 · 성과 추적 화면',agentExample:'예시 데이터 · 에이전트 제안',demoExample:'예시 데이터 · 기능 둘러보기',rate:'사용해 보셨나요? 별점을 남겨 주세요.',rateEmpty:'아직 공개된 이용 후기가 없어요.',selected:n=>`${n}점을 선택했어요. 후기 보내기로 사용 경험을 들려주세요.`,star:n=>`${n}점`},
  en:{example:'Example data · Performance tracking',agentExample:'Example data · Agent suggestions',demoExample:'Example data · Product walkthrough',rate:'Tried it? Leave your rating.',rateEmpty:'No public user reviews yet.',selected:n=>`${n} stars selected. Share your experience with Send review.`,star:n=>`${n} stars`},
  ja:{example:'サンプルデータ · 成果トラッキング',agentExample:'サンプルデータ · エージェント提案',demoExample:'サンプルデータ · 機能紹介',rate:'ご利用後の評価をお聞かせください。',rateEmpty:'公開された利用者レビューはまだありません。',selected:n=>`${n}つ星を選択しました。レビュー送信から感想をお寄せください。`,star:n=>`${n}つ星`}
};
let rating=0;
Object.assign(labels.ko,{ecoTitle:'채널 운영에서 음원·광고까지',ecoLead:'실제 채널을 운영하는 팀의 수집·분석 경험을, 크리에이터의 다음 소재와 연결합니다.',preparing:'연동 준비',ecoMusic:'소재에 맞는 음원, 후크 구간과 사용 조건을 확인하는 협업 흐름을 준비합니다.',ecoAd:'내 채널의 소재와 시청자에 맞는 광고·브랜드 협업 흐름을 준비합니다.',ecoPpl:'영상 기획에서 제품 노출과 광고 표시까지, 제작 단계의 협업 흐름을 준비합니다.',flowMusic:'소재 선택 → 음원 검토 → 사용 조건 확인 → 협업 요청',flowAd:'채널·소재 정리 → 브랜드 적합성 검토 → 캠페인 협의',flowPpl:'기획안 → 제품·노출 방식 협의 → 조건 확인 → 제작',ecoNote:'외부 서비스의 계정·음원·광고·정산 연결은 아직 활성화하지 않았습니다.'});
Object.assign(labels.en,{ecoTitle:'From channel operations to music and brands',ecoLead:'Built on a team’s experience operating real channels, collecting references and analyzing content.',preparing:'Connection in preparation',ecoMusic:'A workflow for finding suitable music, reviewing hooks and confirming usage conditions.',ecoAd:'A workflow for brand campaigns that fit your channel, topics and audience.',ecoPpl:'A production workflow from product placement planning to advertising disclosure.',flowMusic:'Select topic → Review music → Confirm conditions → Request collaboration',flowAd:'Channel and topic brief → Brand fit review → Campaign discussion',flowPpl:'Concept → Placement discussion → Confirm conditions → Production',ecoNote:'External account, music, advertising and settlement connections have not been activated.'});
Object.assign(labels.ja,{ecoTitle:'チャンネル運営から音源・広告まで',ecoLead:'実際のチャンネルを運営するチームの収集・分析経験を、次のネタにつなげます。',preparing:'連携準備中',ecoMusic:'ネタに合う音源、フック区間と利用条件を確認する協業フローを準備します。',ecoAd:'チャンネル・ネタ・視聴者に合うブランド協業フローを準備します。',ecoPpl:'企画から商品露出と広告表示まで、制作段階の協業フローを準備します。',flowMusic:'ネタ選択 → 音源検討 → 利用条件確認 → 協業依頼',flowAd:'チャンネル・企画整理 → ブランド適合性 → キャンペーン協議',flowPpl:'企画 → 露出方法の協議 → 条件確認 → 制作',ecoNote:'外部サービスのアカウント・音源・広告・精算連携はまだ有効化していません。'});
Object.assign(labels.ko,{agentPurpose:'CNOL RADAR · 다수 채널 운영자를 위한 소재 AI 비서',observedChannelsText:'확인한 실제 공개 레퍼런스 영상',viewDashboard:'대시보드 보기',multiHeading:'운영 채널과 레퍼런스, 48시간을 한 화면에',multiLead:'내 채널과 레퍼런스를 추가할수록 하나의 대시보드로 모입니다. 전체 흐름과 채널별 48시간 조회수를 보고, AI 비서와 다음에 만들 소재를 찾으세요.',demoHeading:'실제 영상으로 먼저 둘러보세요',demoLead:'공개 레퍼런스의 쇼츠를 한곳에서 확인하세요. 영상을 누르면 이 페이지 안에서 재생됩니다.',caseHeading:'실제 채널과 영상으로 확인하세요',caseLead:'실제 공개 영상으로 소재와 조회수를 비교합니다.'});
Object.assign(labels.en,{agentPurpose:'CNOL RADAR · YOUR AI IDEA ASSISTANT FOR MULTIPLE CHANNELS',observedChannelsText:'Verified public reference videos',viewDashboard:'VIEW DASHBOARD',multiHeading:'Your channels and references. 48 hours, one view.',multiLead:'Bring the channels you operate and your references into one dashboard. Track their combined and individual 48-hour trends, and find your next idea with your AI assistant.',demoHeading:'Explore real videos first',demoLead:'Browse Shorts from public references. Click a video to play it on this page.',caseHeading:'See real channels and videos',caseLead:'Compare topics and view counts using real public videos.'});
Object.assign(labels.ja,{agentPurpose:'CNOL RADAR · 複数チャンネル運営者のためのネタAIアシスタント',observedChannelsText:'確認済みの実際の公開リファレンス動画',viewDashboard:'ダッシュボードを見る',multiHeading:'運営チャンネルとリファレンス、48時間をひとつの画面に',multiLead:'運営チャンネルとリファレンスを追加するほど、ひとつのダッシュボードに集まります。全体とチャンネル別の48時間の動きを見ながら、AIアシスタントと次のネタを見つけましょう。',demoHeading:'実際の動画で体験してください',demoLead:'公開リファレンスのショート動画を一覧で確認。クリックするとこのページ内で再生されます。',caseHeading:'実際のチャンネルと動画で確認',caseLead:'実際の公開動画でネタと再生数を比較します。'});
function apply(){
  const copy=labels[document.documentElement.lang]||labels.ko;
  document.querySelectorAll('[data-home-label]').forEach(el=>{const text=copy[el.dataset.homeLabel];if(typeof text==='string')el.textContent=text;});
  document.querySelectorAll('[data-rating]').forEach(button=>{
    const n=Number(button.dataset.rating);
    button.textContent=n<=rating?'★':'☆';
    button.setAttribute('aria-pressed',String(n===rating));
    button.setAttribute('aria-label',copy.star(n));
  });
  if(rating){document.querySelector('[data-rating-status]').textContent=copy.selected(rating);}
  const link=document.querySelector('[data-review-link]');
  if(link){const query=new URLSearchParams({subject:`CNOL RADAR${rating?` · ${rating}/5`:''}`,body:rating?`CNOL RADAR: ${rating}/5\n\n`:''});link.href=`mailto:support@whrcompany.com?${query}`;}
}
document.querySelector('.review-rating')?.addEventListener('click',event=>{
  const button=event.target.closest('[data-rating]');if(!button)return;rating=Number(button.dataset.rating);apply();
});
new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
apply();
