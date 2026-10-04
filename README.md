# CNOL RADAR

숏폼 크리에이터를 위한 알고리즘 레이더 · 에이전트 · 레퍼런스 수집기. (에이치알컴퍼니 / TIGERSHEEP GROUP)

빌드 과정 없는 정적 사이트예요. GitHub에 올리면 Vercel이 그대로 배포하고, 데이터와 로그인은 Supabase(`cnol-radar`)가 맡아요.

- 사이트: https://cnol-radar.vercel.app
- 저장소: `tigership-link-team/cnol-radar` (비공개) — `main`에 커밋하면 Vercel(miami127-prog's projects · `cnol-radar`)이 자동 배포

## 페이지

| 주소 | 파일 | 내용 |
|---|---|---|
| `/` | `index.html` · `landing.js` | 소개 페이지 — 48시간 막대·28일 차트 데모, 에이전트, 기능, 요금, FAQ, 질문 남기기 |
| `/login` | `login.html` · `login.js` | 카카오 · Google · 이메일 링크 로그인 (네이버는 준비 중 안내) |
| `/app` | `app.html` · `app.js` | 크리에이터 화면 — 레이더 홈, 브리핑, 내 채널, 레퍼런스, 소재 보드, 음원·광고, 설정 |
| `/admin` | `admin.html` · `admin.js` | 관리자 콘솔 — 개요(KPI·가입 추이·예상 매출), 회원(요금제 변경), 협업 요청, 문의 |
| `/privacy` · `/terms` | `privacy.html` · `terms.html` · `legal.js` | 개인정보처리방침 · 이용약관 (한·영·일, **초안**) |

공통: `styles.css`(머티리얼 스타일), `common.js`(Supabase 연결·언어·알림), `i18n.js`(한·영·일 문구), `supabase.js`(supabase-js 2.117.2 고정 번들), 아이콘·로고 PNG, `manifest.webmanifest`, `vercel.json`(깔끔한 주소 + 보안 헤더), `404.html`, `robots.txt`.

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

## 다음 단계 (지금은 데모 데이터)

- **유튜브 채널 연결**: 가입용과 별도인 Google OAuth 클라이언트(`youtube.readonly`, `yt-analytics.readonly`, 수익은 `yt-analytics-monetary.readonly`) + 토큰 교환·저장 Edge Function(리프레시 토큰은 서버에만). 민감 범위라 **Google 앱 인증**(도메인 확인, 개인정보처리방침, 시연 영상)을 받기 전에는 테스트 사용자 100명까지만 써요. 채널은 반드시 그 채널의 구글 계정으로 하나씩 연결.
- **48시간 조회수**: `pg_cron` + Edge Function이 공개 조회수(`videos.list`, 1회 1유닛)를 주기적으로 측정해 자체 지표로 저장. 일별·월별은 YouTube Analytics API(48~72시간 지연).
- **틱톡·인스타그램**: 공식 API(또는 정식 라이선스 데이터)만 사용. 그 전까지는 링크 저장·분류만.
- **결제**: 국내 원화는 토스페이먼츠 등 PG, 해외 달러는 Paddle 같은 MoR. 결제가 붙으면 `admin_set_plan` 대신 결제 웹훅이 요금제를 바꾸게 해요.
- **크놀뮤직 · 크놀AD 연동**: 지금은 요청만 `partner_requests`에 쌓여요(연동은 보류).

## 확인이 필요한 것

- 약관·개인정보처리방침은 **초안**이에요. 보호책임자 이름, 사업자 정보, 문의 메일(`support@whrcompany.com`은 임시)을 채우고 법무 검토 후 “초안” 표시를 지우세요.
- 소개 페이지의 실적 숫자 자리는 실제 수치로 바꿔야 해요.
- 외부 스크립트를 새로 붙이면 `vercel.json`의 Content-Security-Policy도 함께 고쳐야 해요.

## 수정과 배포

GitHub에서 파일을 고치고 커밋하면 Vercel이 자동으로 다시 배포해요. 빌드 명령은 없고, 프레임워크는 “Other”, 출력 폴더는 저장소 루트예요.
