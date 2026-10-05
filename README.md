# CNOL RADAR

숏폼 크리에이터를 위한 알고리즘 레이더 · 에이전트 · 레퍼런스 수집기. (에이치알컴퍼니 / TIGERSHEEP GROUP)

빌드 과정 없는 정적 사이트예요. GitHub에 올리면 Vercel이 그대로 배포하고, 데이터와 로그인은 Supabase(`cnol-radar`)가 맡아요.

- 사이트: https://cnol-radar.vercel.app
- 저장소: `tigership-link-team/cnol-radar` — `main`에 커밋하면 Vercel(miami127-prog's projects · `cnol-radar`)이 자동 배포
  - 저장소는 **공개**예요(2026-10-05 전환). Vercel 팀은 비공개 저장소면 팀원(Vercel 계정이 연결된 GitHub 계정)이 만든 커밋만 배포해서, 공개로 두지 않으면 shortmoa7-cmyk 커밋이 막혀요.
  - 코드에는 공개용 키만 있어요. 유튜브 API 키·서비스 키는 Supabase 비밀값에만 있어요.

## 페이지

| 주소 | 파일 | 내용 |
|---|---|---|
| `/` | `index.html` · `landing.css` · `landing.js` | 소개 페이지(다크 프리미엄) — 히어로(터지는 쇼츠, 먼저 잡는 레이더), 채널 여러 개가 레이더로 모여 합산 48시간 차트가 되는 그림, 실제 대시보드와 같은 데모(채널별/합산 48시간·일별, 범례 강조, 오늘 할 일, 맞춤 추천, 알림 · 예시 데이터), 작동 방식, 기능 카드, 요금, FAQ, 질문 남기기 |
| `/login` | `login.html` · `login.js` | 카카오 · Google · 이메일 링크 로그인 (지금은 어디에서도 링크하지 않아요 — 실험 모드) |
| `/app` | `app.html` · `app.js` · `dash.css` | **실험 모드 대시보드(로그인 없음)** — 크놀뮤직식 사이드 메뉴 + 유튜브 스튜디오식 차트(지표 탭·평소 범위 회색 띠·오른쪽 눈금·흰 툴팁). 대시보드(에이전트 브리핑·이거 해볼래?·실시간 48시간·지난 28일 개요(조회수·구독자·새 영상)·채널 순위·잘된 쇼츠·추천 소재·알림), 소재 추천, **이거 해볼래?**(채널 데이터로 고른 실험 제안 + 해본 결과 비교), 알고리즘 분석(시간대·요일·길이·제목 유형·월별), 쇼츠 랭킹, 에이전트 알림, 채널 수집(+추천 채널 찾기), 채널 목록·채널 상세, 소재 보드, 음원·광고, 설정·상태 |
| `/admin` | `admin.html` · `admin.js` | 관리자 콘솔 — 개요(KPI·가입 추이·예상 매출), 회원(요금제 변경), 협업 요청, 문의 |
| `/privacy` · `/terms` | `privacy.html` · `terms.html` · `legal.js` | 개인정보처리방침 · 이용약관 (한·영·일, **초안**) |

공통: `styles.css`(머티리얼 스타일), `dash.css`(대시보드·데모 공통 — 보라 그라데이션 + 유리 사이드바 + 흰 카드), `landing.css`(소개 페이지 — 깊은 남보라 · 유리 카드 · 부드러운 호버), `common.js`(Supabase 연결·언어·알림), `i18n.js`(한·영·일 문구), `supabase.js`(supabase-js 2.117.2 고정 번들), 아이콘·로고 PNG, `manifest.webmanifest`, `vercel.json`(깔끔한 주소 + 보안 헤더), `404.html`, `robots.txt`.

## Supabase

- 프로젝트: `cnol-radar` (`gbgcoxjnjlrzbwclevul`, 서울 리전)
- 화면 코드에는 **공개용 키(publishable)만** 들어 있어요. 데이터는 행 단위 보안(RLS)으로 회원 본인 것만 보이고, 관리자 데이터는 `is_admin()` 검사를 통과해야 내려와요. **서비스 키는 절대 저장소에 넣지 마세요.**
- 테이블: `profiles`, `channels`, `reference_channels`, `collected_items`, `ideas`, `agent_settings`, `partner_requests`, `inquiries`
- 함수: `is_admin()`, `admin_stats()`, `admin_set_plan(target, new_plan)`, 가입 시 프로필을 만드는 `handle_new_user()` 트리거
- `channels`는 회원이 직접 추가할 수 없어요(구글 OAuth를 마친 서버만 추가). 협업 요청 상태는 관리자만 바꿀 수 있어요.

### 배포 후 꼭 할 일

1. **Authentication → URL Configuration** — ✅ 완료
   - Site URL: `https://cnol-radar.vercel.app`
   - Redirect URLs: `https://cnol-radar.vercel.app/**`
   - 도메인을 새로 붙이면 여기에도 같이 추가하세요.
2. **관리자 지정** — 본인 계정으로 한 번 가입한 뒤 SQL 편집기에서:
   ```sql
   update public.profiles set role = 'admin' where email = '<관리자 이메일>';
   ```
3. **로그인 공급자** (Authentication → Sign In / Providers)
   - **카카오**: Kakao Developers에서 앱 생성 → REST API 키(Client ID)·Client Secret 입력, Redirect URI `https://gbgcoxjnjlrzbwclevul.supabase.co/auth/v1/callback`. 이메일 동의항목은 비즈앱 전환(사업자 정보)이 필요해요.
   - **Google(가입용)**: Google Cloud에서 웹 OAuth 클라이언트 생성, 승인된 리디렉션 URI는 위와 같은 callback 주소. 가입에는 `email`·`profile`만 써서 별도 심사가 필요 없어요.
   - **네이버**: Supabase 기본 공급자에는 없어요. Sign In / Providers의 **Custom Providers**(OAuth 직접 등록)나 Edge Function으로 붙일 수 있어요(지금은 “곧 열려요” 안내).
   - 공급자를 켜기 전에는 로그인 버튼이 “준비 중” 안내만 띄워요(`/auth/v1/settings`로 확인).
   - **이메일 링크**: 기본 메일 발송은 시간당 발송량이 아주 적어요. 출시 전 커스텀 SMTP를 연결하세요.

## 실험 모드 수집 엔진 (지금 실제로 돌아가요)

- **Edge Function `radar`** (`../cnol-radar-server/functions/radar/index.ts`) — 유튜브 키(`YOUTUBE_API_KEY`)는 Supabase 비밀값에만 있어요. 화면은 이 함수로만 쓰기를 하고, 읽기는 `radar_*` 함수(RLS 읽기 전용)로 해요.
  - `add`(채널 링크·@핸들·쇼츠 링크 → 최근 쇼츠 50개 수집), `refresh`, `discover`(키워드로 최근 7일 터진 쇼츠의 채널 찾기, 키워드당 100포인트), `daily`(아침 브리핑 + 추천 채널 자동 발굴), `set`·`remove`·`idea`·`alerts_read`·`status`
- **자동 일정** (`pg_cron` + `pg_net`): 매시 5분 전체 새로고침 + 이슈 확인, 매일 08:30(KST) 브리핑
- **스냅샷**: 올린 지 7일 안 쇼츠는 매번, 그보다 오래된 쇼츠는 하루 한 번 + 지난 수집 뒤 100회 넘게 오른 건 매번 남겨요(큰 채널의 오래된 쇼츠나 다시 뜨는 쇼츠도 48시간 흐름에 잡혀요). 스냅샷은 60일 보관.
- **모든 채널 합산**: `radar_by_channel(48, 28)`이 채널별 48시간·일별 조회수를 주고, 대시보드가 채널별로 쌓아 보여줘요(색은 채널을 추가한 순서로 고정, 9개부터는 '그 외 채널').
- **읽기 함수**: `radar_overview`, `radar_shorts`, `radar_channel_list`, `radar_channel`, `radar_by_channel`(채널별 48시간·일별), `radar_trend`(하루마다 조회수·구독자 순증·새 영상 — 지표 탭), `radar_curve`(쇼츠 성장 곡선 + 같은 채널 또래 쇼츠의 나이별 조회수 — 평소 범위)
- **이거 해볼래?**: 내 쇼츠(부족하면 같은 분야 레퍼런스)로 올리는 시간·요일·길이·제목 유형·소재·키워드·업로드 주기·공백·다시 뜨는 쇼츠를 계산해 제안해요. ‘해볼게’ = 소재 보드에 담고 이 브라우저에 실험 기록 → 그 뒤 올린 쇼츠의 평소 대비를 그 전 4주와 비교.
- **이슈 감지** `radar_detect_alerts()`: 레퍼런스·내 쇼츠 터짐(평소의 3배·1만 회 이상), 업로드 공백(3일), 영상 사라짐, 연령 제한, 지역 차단, 48시간 급상승·급락(±30%, 4일치 이상 쌓인 뒤)
- **한도**: 채널 100개, 유튜브 하루 1만 포인트 중 9천까지. 채널 하나 새로고침에 약 3~4포인트라, 매시간 돌리면 채널 약 90개가 한계예요.
- **주의**: 실험 모드는 로그인 없는 공용 공간이라 링크를 아는 누구나 채널을 넣고 지울 수 있어요. 정식 공개 전에 로그인과 사용자별 분리를 붙이세요.

## 다음 단계

- **유튜브 채널 연결**: 가입용과 별도인 Google OAuth 클라이언트(`youtube.readonly`, `yt-analytics.readonly`, 수익은 `yt-analytics-monetary.readonly`) + 토큰 교환·저장 Edge Function(리프레시 토큰은 서버에만). 민감 범위라 **Google 앱 인증**(도메인 확인, 개인정보처리방침, 시연 영상)을 받기 전에는 테스트 사용자 100명까지만 써요. 채널은 반드시 그 채널의 구글 계정으로 하나씩 연결.
- **로그인 + 사용자별 분리**: 지금의 `radar_*` 테이블에 `owner_id`를 붙이고 RLS를 회원 본인 것만 보이게 바꿔요.
- **유튜브 분석(비공개 지표)**: 채널 주인이 구글로 연결하면 시청 지속률·트래픽 소스·일별/월별 확정치(YouTube Analytics API, 48~72시간 지연)를 붙여요.
- **유튜브 API 정책 심사**: 파생 지표(48시간 수치)·장기 보관을 하려면 정식 공개 전에 YouTube API 서비스 감사(Compliance Audit)와 할당량 증설을 받아야 해요.
- **틱톡·인스타그램**: 공식 API(또는 정식 라이선스 데이터)만 사용. 그 전까지는 링크 저장·분류만.
- **결제**: 국내 원화는 토스페이먼츠 등 PG, 해외 달러는 Paddle 같은 MoR. 결제가 붙으면 `admin_set_plan` 대신 결제 웹훅이 요금제를 바꾸게 해요.
- **크놀뮤직 · 크놀AD 연동**: 지금은 요청만 `partner_requests`에 쌓여요(연동은 보류).

## 확인이 필요한 것

- 약관·개인정보처리방침은 **초안**이에요. 보호책임자 이름, 사업자 정보, 문의 메일(`support@whrcompany.com`은 임시)을 채우고 법무 검토 후 “초안” 표시를 지우세요.
- 소개 페이지의 실적 숫자 자리는 실제 수치로 바꿔야 해요.
- 외부 스크립트를 새로 붙이면 `vercel.json`의 Content-Security-Policy도 함께 고쳐야 해요.

## 수정과 배포

GitHub에서 파일을 고치고 커밋하면 Vercel이 자동으로 다시 배포해요. 빌드 명령은 없고, 프레임워크는 “Other”, 출력 폴더는 저장소 루트예요.
