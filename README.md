# CNOL RADAR

여러 채널을 운영하는 사람을 위한 소재 AI 비서 — 운영 채널과 레퍼런스를 한 화면에 모아 48시간 흐름을 보고, 채널마다 다음에 만들 소재를 찾아요. 해외·일본 채널은 레퍼런스를 찾는 수집 대상이에요. (에이치알컴퍼니 / TIGERSHEEP GROUP)

빌드 과정 없는 정적 사이트예요. GitHub에 올리면 Vercel이 그대로 배포하고, 데이터와 로그인은 Supabase(`cnol-radar`)가 맡아요.

- 사이트: https://cnol-radar.vercel.app
- 저장소: `tigership-link-team/cnol-radar` — `main`에 커밋하면 Vercel(miami127-prog's projects · `cnol-radar`)이 자동 배포
  - 저장소는 **공개**예요(2026-10-05 전환). Vercel 팀은 비공개 저장소면 팀원(Vercel 계정이 연결된 GitHub 계정)이 만든 커밋만 배포해서, 공개로 두지 않으면 shortmoa7-cmyk 커밋이 막혀요.
  - 코드에는 공개용 키만 있어요. 유튜브 API 키·서비스 키는 Supabase 비밀값에만 있어요.

## 페이지

| 주소 | 파일 | 내용 |
|---|---|---|
| `/` | `index.html` · `landing.css` · `landing.js` · `home-discovery.js` · `home-discovery.css` · `home-media.css` · `home-motion.js` · `home-enhancements.js` | 소개 페이지(v10, 같은 내용은 한 번만) — 첫 화면(AI로 만든 인물 이미지 · 운영 채널 48시간 미니 카드) → 채널 여러 개 48시간 한 화면(회사 채널 3곳 + 가상 아이콘 연결 그림, 48시간 합계를 아주 크게, 합산↔채널별) → 이게 다 돼요 11가지(전체 도구 24개는 펼치기) → 핵심 기능 5개(새 대시보드 실제 화면 · 예시 데이터) → 공개 영상 둘러보기(공식 API로 매일 새로 받은 값, 검색·형식·지역 필터) → 음원·광고 → 누구를 위한 → 비교 → 요금(출시 예정 가격 4개) → 사용 신청(이메일 → `inquiries`) → 질문 10개 |
| `/preview` | `preview.html` · `preview.css` · `preview.js` | 공개 읽기 전용 미리보기 — 운영 채널 51개의 YouTube 스튜디오 스냅샷(`home-data.json`, 확인 시각 표시) 합산·채널별 48시간/60분, 공개 레퍼런스·소재 탐색은 `radar_public`(공식 API 값). 허락받은 회사 채널 3곳만 실제 이름·로고, 나머지는 익명 |
| `/login` | `login.html` · `login.js` · `auth.css` | **아이디·비밀번호 로그인**(아이디 `minsu` → 내부 이메일 `minsu@cnol-radar.vercel.app`, 이메일로도 돼요), 1회용 관리자 설정 링크(`/login#setup=코드`)로 비밀번호 정하기, 비밀번호 잊음 안내, **사용 신청**(이메일 + 회사·채널 → `inquiries` → 관리자가 초대 링크를 보내요). v12 새 디자인(남색 소개 칸 + 흰 카드) |
| `/join` | `join.html` · `join.js` · `auth.css` | **v12 초대 가입** — `/join#code=…` 링크를 열면 워크스페이스 이름 · 역할 · 기한을 보여 주고, 아이디 · 비밀번호(쉬운 비밀번호 · 아이디 포함 거절) · 약관 동의로 바로 가입(메일 인증 없음). 이미 로그인했으면 그 계정으로 바로 참여. 비밀번호 다시 정하기 링크도 같은 화면. 코드는 주소창에서 바로 지우고 이 탭에서만 기억해요 |
| `/app` | `app.html` · `app.js` · `agent.js` · `radar-plus.js` · `radar-team.js` · `dash.css` | **로그인한 팀원만 열려요** (로그인 안 했으면 `/login`으로, 워크스페이스가 없으면 안내) — **v12 (`radar-team.js`)**: 설정 › **팀 · 요금제**(워크스페이스 이름 · 요금제 사용량 5가지 · 팀원 역할 바꾸기 · 내보내기 · 비밀번호 링크 · 초대 링크 만들기/복사/취소 · 요금제별 한도표 · 요금제 바꾸기 신청), 사이드바 **워크스페이스 바꾸기**, 보기 전용 표시, 오른쪽 아래 **RADAR에게 묻기**(지켜보는 데이터로 바로 답하고, 서버에 AI 키가 있으면 AI가 이 워크스페이스 데이터만 보고 답해요). 메뉴: 에이전트 · 한눈에(48시간 합산 · **지금 뜨는 중** · 영상 랭킹) · 레퍼런스(맞춤 레퍼런스 · 채널 목록 · **채널 비교**) · 소재 · 도구 · 설정(계정·비밀번호·로그아웃). **v11 (`radar-plus.js`)**: 같은 시간 대비 속도(막 터지기 시작한 영상을 몇 시간 만에) · 채널 표 열 정렬·상태 배지·비교 고르기 · 채널 상세 '조회수 크는 모양' · 소재 보드(끌어 옮기기 · 올릴 날 · 올린 영상 잇기 → 성과) · 설정(최근 7일 할당량 차트 · 자동 수집 상태 · 브라우저 알림 · 단축키) · 어디서나 찾기(⌘K/Ctrl+K · `/`, 초성 검색) · G 다음 글자로 화면 이동 · 도구 최근 기록 · 에이전트에게 '지금 뜨는 영상'·'A랑 B 비교'·'48시간 조회수' 같은 말. 크놀뮤직식 사이드 메뉴 + 유튜브 스튜디오식 차트(지표 탭·평소 범위 회색 띠·오른쪽 눈금·흰 툴팁). 대시보드(에이전트 브리핑·이거 해볼래?·실시간 48시간·지난 28일 개요(조회수·구독자·새 영상)·채널 순위·잘된 쇼츠·추천 소재·알림), 소재 추천, **이거 해볼래?**(채널 데이터로 고른 실험 제안 + 해본 결과 비교), 알고리즘 분석(시간대·요일·길이·제목 유형·월별), 쇼츠 랭킹, 에이전트 알림, 채널 수집(+추천 채널 찾기), 채널 목록·채널 상세, 소재 보드, 음원·광고, 설정·상태 |
| `/admin` | `admin.html` · `admin.js` · `admin.css` | 관리자 콘솔(v12 새 디자인) — 개요(KPI·가입 추이·워크스페이스 요금제 기준 예상 매출), **워크스페이스**(새 워크스페이스 + 대표 초대 링크 · 요금제 바꾸기 신청 승인/보류 · 전체 목록에서 요금제 바꾸기 · 대표 링크 다시 만들기), 회원(들어간 워크스페이스 · 역할), 협업 요청, 문의(→ **워크스페이스 만들고 초대 링크** · 메일로 보내기), 운영 준비 |
| `/privacy` · `/terms` | `privacy.html` · `terms.html` · `legal.js` | 개인정보처리방침 · 이용약관 (한·영·일, **초안**) |

공통: `styles.css`(약관 · 404에서만 써요), `auth.css`(로그인 · 초대), `admin.css`(관리자 콘솔), `dash.css`(대시보드 — v10부터 `/preview`와 같은 디자인: 남색 사이드바 · 밝은 회색 바탕 · 흰 카드 · 파란 강조 · 48시간 합계 크게), `landing.css`(소개 페이지), `common.js`(Supabase 연결·언어·알림), `i18n.js`(한·영·일 문구, 마지막 `LANDING10` 블록이 최신), `supabase.js`(supabase-js 2.117.2 고정 번들), `img/`(AI 인물 이미지 `ai-*.webp` · 대시보드 화면 `app-*-{ko,en,ja}.jpg`), 아이콘·로고 PNG, `manifest.webmanifest`, `vercel.json`(깔끔한 주소 + 보안 헤더), `404.html`, `robots.txt`.

## Supabase

- 프로젝트: `cnol-radar` (`gbgcoxjnjlrzbwclevul`, 서울 리전)
- 화면 코드에는 **공개용 키(publishable)만** 들어 있어요. 데이터는 행 단위 보안(RLS)으로 회원 본인 것만 보이고, 관리자 데이터는 `is_admin()` 검사를 통과해야 내려와요. **서비스 키는 절대 저장소에 넣지 마세요.**
- 테이블: `profiles`, `channels`, `reference_channels`, `collected_items`, `ideas`, `agent_settings`, `partner_requests`, `inquiries`, 수집용 `radar_*`(v11: `radar_video_ages` 영상마다 정해진 나이의 조회수 · `radar_curves` 채널·형식·나이별 평소 조회수 25/50/75% · `radar_ideas.due_on`·`result_video_id`), 서버만 읽는 `radar_config`(cron 비밀키 · 1회용 관리자 설정 코드 · 선택: `showcase_videos`), 누구나 읽기만 되는 `radar_public`(key `showcase` = 소개 페이지 공개 영상, 서버가 공식 API로 하루 한 번 새로 써요)
- **잠금(2026-10-06)**: `radar_*` 표와 함수는 로그인한 사람만 읽어요. 로그인 안 한 사람(anon)은 권한이 없어요. 쓰기는 Edge Function(서비스 키)만 해요.
- **둘러보기 모드 (v13, 개발 중)**: `radar_config`에 `preview_ws`(워크스페이스 id · `expires_at`)가 있으면 로그인 없이 `/app`이 그 워크스페이스로 열려요. 읽기는 RLS(`radar_preview_ws()` · `radar_preview_channel_ids()` · anon 읽기 규칙), 쓰기는 Edge Function이 정해진 동작만(보기 · 채널 추가(한 번에 10개) · 새로 고침 · 소재 찾기 · 소재 보드) 받고 IP마다 10분에 40번까지예요. 채널 삭제 · 팀 · 초대 · 관리자 · AI · 폰 알림은 로그인해야 해요. 팀원 · 초대 · 계정 · 설정은 anon이 못 읽어요. 닫기: `update radar_config set expires_at = now() where key = 'preview_ws'` (1분 안에 닫혀요).
- **팀 · 워크스페이스 (v12, 2026-10-06)**: 회사(워크스페이스)마다 데이터를 나누고, 유튜브 데이터(채널 · 영상 · 조회수)는 한 번만 모아 함께 써요.
  - 표: `radar_workspaces`(요금제) · `radar_members`(owner 대표 · editor 편집 · viewer 보기 전용) · `radar_invites`(초대 · 비밀번호 링크, 1회용, 서버만 읽어요) · `radar_follows`(워크스페이스가 지켜보는 채널 + 역할 · 분류 · 메모) · `radar_found`(워크스페이스마다 찾은 채널, 예전 `radar_discoveries` 대신) · `radar_plan_requests`(요금제 신청). `radar_ideas` · `radar_alerts` · `radar_runs`에는 `workspace_id`, `profiles.current_ws`(지금 워크스페이스)
  - 읽기: 뷰 `radar_wchannels` · `radar_wvideos` · `radar_wstats` · `radar_wchstats` · `radar_walerts`가 `radar_ws()`(지금 워크스페이스)만 보여 주고, 읽기 함수가 이 뷰를 써요. 표에도 '내 워크스페이스' RLS(`radar_my_ws_ids()` · `radar_my_channel_ids()`)
  - 함수: `radar_me()`(나 · 워크스페이스들 · 한도) · `radar_use_ws(p_ws)`(바꾸기) · `radar_team()`(팀 화면) · `radar_plan_limits(plan)` · 서버 전용 `radar_ws_overview` · `radar_ws_videos` · `radar_ws_context`(AI용)
  - 요금제 한도(`radar_plan_limits` = 서버 `PLAN_LIMITS`): 무료 내 채널 1 · 레퍼런스 10 · 자리 1 · 하루 검색 3 · AI 20 / 솔로 1·30·1·8·60 / 플러스 5·100·1·15·150 / 팀 10·200·3·25·300 / 에이전시 30·500·10·40·600 / 엔터프라이즈 100·1000·50·95·2000. 서비스 전체 채널 상한 200개는 따로
  - 마이그레이션: `../cnol-radar-server/migrations/v12_teams.sql` · `v12_teams_v9.sql`
- 함수: `is_admin()`, `admin_stats()`, `admin_set_plan(target, new_plan)`, 가입 시 프로필을 만드는 `handle_new_user()` 트리거
- `channels`는 회원이 직접 추가할 수 없어요(구글 OAuth를 마친 서버만 추가). 협업 요청 상태는 관리자만 바꿀 수 있어요.

### 배포 후 꼭 할 일

1. **Authentication → URL Configuration** — ✅ 완료
   - Site URL: `https://cnol-radar.vercel.app`
   - Redirect URLs: `https://cnol-radar.vercel.app/**`
   - 도메인을 새로 붙이면 여기에도 같이 추가하세요.
2. **관리자 계정** — 아이디 `hrcompany`. 비밀번호는 1회용 설정 링크(`/login#setup=코드`, 7일 유효·한 번만)로 본인이 정해요(8자 이상, 쉬운 비밀번호 거절). 링크를 다시 만들려면 SQL 편집기에서:
   ```sql
   insert into public.radar_config (key, value, expires_at)
   values ('admin_setup_code', translate(rtrim(encode(extensions.gen_random_bytes(32), 'base64'), '='), '+/', '-_'), now() + interval '7 days')
   on conflict (key) do update set value = excluded.value, expires_at = excluded.expires_at
   returning 'https://cnol-radar.vercel.app/login#setup=' || value;
   ```
   같은 링크로 비밀번호를 다시 정할 수도 있어요(계정이 있으면 비밀번호만 바꿔요). 로그인한 뒤에는 설정 → 비밀번호 바꾸기.
3. **로그인 공급자** (Authentication → Sign In / Providers)
   - **카카오**: Kakao Developers에서 앱 생성 → REST API 키(Client ID)·Client Secret 입력, Redirect URI `https://gbgcoxjnjlrzbwclevul.supabase.co/auth/v1/callback`. 이메일 동의항목은 비즈앱 전환(사업자 정보)이 필요해요.
   - **Google(가입용)**: Google Cloud에서 웹 OAuth 클라이언트 생성, 승인된 리디렉션 URI는 위와 같은 callback 주소. 가입에는 `email`·`profile`만 써서 별도 심사가 필요 없어요.
   - **네이버**: Supabase 기본 공급자에는 없어요. Sign In / Providers의 **Custom Providers**(OAuth 직접 등록)나 Edge Function으로 붙일 수 있어요(지금은 “곧 열려요” 안내).
   - 공급자를 켜기 전에는 로그인 버튼이 “준비 중” 안내만 띄워요(`/auth/v1/settings`로 확인).
   - **이메일 링크**: 기본 메일 발송은 시간당 발송량이 아주 적어요. 출시 전 커스텀 SMTP를 연결하세요.

## 수집 엔진 (지금 실제로 돌아가요)

- **Edge Function `radar`** (`../cnol-radar-server/functions/radar/index.ts`) — 유튜브 키(`YOUTUBE_API_KEY`)는 Supabase 비밀값에만 있어요. 화면은 이 함수로만 쓰기를 하고, 읽기는 `radar_*` 함수(관리자 RLS)로 해요.
  - **누가 부를 수 있나 (v9)**: 로그인 토큰 → 들어간 워크스페이스와 역할(`body.ws` → `current_ws` → 처음 들어간 곳). 보기 전용은 `status` · `ask` · `alerts_read` · `leave`만, 대표만 `invite_create` · `invite_revoke` · `member_role` · `member_remove` · `member_reset` · `ws_rename` · `plan_request`, 서비스 관리자(`profiles.role = 'admin'`)만 `ws_list` · `ws_plan` · `ws_create` · `ws_invite` · `invite_drop` · `request_set`. 자동 수집(`x-radar-cron` 헤더 = `radar_config.cron_secret`)은 `refresh` · `daily` · `showcase`만. 로그인 없이는 `admin_setup` · `invite_peek` · `join`(링크 코드가 열쇠)만.
  - **초대 · 가입**: `invite_create`(7일 · 1회 · 256비트 코드) → `/join#code=` → `join`(아이디 · 비밀번호로 계정을 만들고 바로 멤버, 또는 `as_me`로 지금 계정 참여 · 자리 한도 확인). 비밀번호 링크 `member_reset`(하루 · 1회): 대표는 자기 회사에만 있는 편집 · 보기 팀원만, 그 밖은 서비스 관리자만.
  - **AI 대화** `ask`: 비밀값 `ANTHROPIC_API_KEY`가 있으면 Claude API(기본 모델 `claude-sonnet-5-5`, `radar_config` key `ai_model`로 바꿔요)에 이 워크스페이스 데이터 요약만 넘겨 답해요. 영상 제목 · 메모 속 지시는 따르지 않게 막았어요. 키가 없으면 `NO_AI` → 화면이 데이터로 직접 답해요. 요금제마다 하루 질문 수 제한.
  - `add`(채널 링크·@핸들·쇼츠 링크 → 최근 쇼츠 50개 + 롱폼 20개 수집), `refresh`, `match`(내 채널 소재 DNA → 맞춤 레퍼런스), `topic`(소재 검색·기회 점수, 12시간 캐시), `comments`(댓글 속 요청), `discover`, `daily`(아침 브리핑 + 맞춤 레퍼런스 자동 발굴), `set`·`remove`·`idea`(add · move · delete · v8: edit(제목·메모·올릴 날) · link(올린 영상 잇기))·`alerts_read`·`status`, `showcase`(소개 페이지 공개 영상을 공식 API로 새로 받아 `radar_public`에 저장 · cron도 가능), `admin_setup`
- **자동 일정** (`pg_cron` + `pg_net`, 헤더에 cron 비밀키): 매시 5분 전체 새로고침 + 이슈 확인, 매일 08:30(KST) 브리핑
- **수집 방식 (v7)**: 채널마다 하루 한 번만 '전체 확인'(쇼츠 50 · 롱폼 20 · 최근 60일 영상, 약 5포인트), 나머지 시간엔 '가볍게 확인'(최신 업로드 목록 1포인트 + 모든 채널의 7일 안 영상 조회수를 50개씩 묶어 한 번에). 실측: 전체 5포인트 · 가볍게 3포인트(채널 1개 기준, 채널이 많을수록 채널당 1포인트대). 7일 안 영상은 매시간 스냅샷, 그보다 오래된 영상은 하루 한 번 + 지난 수집 뒤 100회 넘게 오른 건 그때마다.
- **모든 채널 합산**: `radar_by_channel(48, 28)`이 채널별 48시간·일별 조회수를 주고, 대시보드가 채널별로 쌓아 보여줘요(색은 채널을 추가한 순서로 고정, 9개부터는 '그 외 채널').
- **읽기 함수**: `radar_overview`, `radar_shorts`, `radar_channel_list`(v11: 직전 48시간 · 터진 비율 · 72시간 터진 영상 수 · 30일 업로드), `radar_channel`, `radar_by_channel`(채널별 48시간·일별), `radar_trend`(하루마다 조회수·구독자 순증·새 영상 — 지표 탭), `radar_curve`(성장 곡선 + 채널 평소 띠 + 속도), `radar_videos_list`(v11: `pace`), `radar_feed`(지금 뜨는 중: 새 영상 + 속도 + 나이별 점 + 채널 평소 띠), `radar_curve_set`(채널 비교용 평소 곡선)
- **속도 엔진 (v11)**: `radar_build_curves()`가 매시간(`radar_detect_alerts` 시작할 때) 영상마다 1·2·3·4·6·8·12·18·24·36·48·72·96·120·168시간째 조회수를 스냅샷 두 개 사이로 이어서 한 번만 계산(올린 지 6시간 안에 처음 본 영상만)하고, 사흘~30일 전에 올린 영상이 3개 이상이면 채널·형식·나이별 가운데 50%를 `radar_curves`에 둬요. `radar_pace_of()` = 지금 조회수 ÷ 같은 나이의 평소 가운데 값(곡선 범위 밖은 계산 안 함).
- **이거 해볼래?**: 내 쇼츠(부족하면 같은 분야 레퍼런스)로 올리는 시간·요일·길이·제목 유형·소재·키워드·업로드 주기·공백·다시 뜨는 쇼츠를 계산해 제안해요. ‘해볼게’ = 소재 보드에 담고 이 브라우저에 실험 기록 → 그 뒤 올린 쇼츠의 평소 대비를 그 전 4주와 비교.
- **이슈 감지** `radar_detect_alerts()`: **막 터지기 시작한 영상**(v11: 올린 지 48시간 안 · 같은 나이 평소의 3배 이상 · 위쪽 25%의 2배 이상 · 1천 회 이상), 레퍼런스·내 쇼츠 터짐(평소의 3배·1만 회 이상, 같은 영상은 한 번만), 업로드 공백(3일), 영상 사라짐, 연령 제한, 지역 차단, 48시간 급상승·급락(±30%, 4일치 이상 쌓인 뒤)
- **한도·할당량 (2026-09-15 유튜브 기준)**: `search.list`는 따로 하루 100번(한 번에 1) — 서버는 95번까지 쓰고 6번은 아침 자동 맞춤 찾기 몫으로 남겨요(`QUOTA_SEARCH`). 나머지 API는 하루 1만 포인트 중 9천까지(`QUOTA_BUDGET`). 둘 다 **태평양 시간 자정**(한국 오후 4~5시)에 다시 채워져요. 채널 상한 200개. `radar_runs.units`·`searches`로 따로 세요.
- **보관 (유튜브 API 정책 III.E.4)**: 공개 데이터·통계는 30일까지만 — 매일 04시(KST) 자동 정리: 조회수 스냅샷·채널 통계·찾은 채널·알림·나이별 조회수(`radar_video_ages`) 30일, 30일 넘게 다시 확인 못 한 영상 정보 삭제, 검색 캐시 3일, 하루 넘게 안 고쳐진 평소 곡선(`radar_curves`) 삭제. 감사를 통과하면 `KEEP_DAYS`를 늘려요.
- **계산값 표시**: 48시간 조회수 · 평소 대비 · 같은 시간 대비 속도 · 점수 · 예측은 우리가 계산한 값이라 대시보드 아래에 "YouTube 지표가 아님" 안내를 늘 보여 줘요.
- **폰 · PC 알림 (v13 · 서버 v10)**: 설정 › 알림에서 기기마다 켜요(서비스 워커 `/sw.js` + 웹 푸시). 서버가 매시간 수집 뒤 새 알림(`radar_alerts.pushed_at`이 빈 것, 3시간 안)을, 아침 8시 30분엔 오늘의 보고를 보내요. 내용은 RFC 8291(aes128gcm)로 잠가 받는 기기만 풀고, 보내는 쪽은 VAPID(RFC 8292) 서명 — 키는 처음 쓸 때 서버가 만들어 `radar_config.vapid`(서버만 읽음)에 둬요. 사람마다 받을 알림(`profiles.notify`: 내 채널 · 레퍼런스 · 아침 보고 · 밤 11시~아침 8시 조용히), 한 번에 최대 3개(넘치면 2개 + '더 있어요'), 기기는 10대까지 · 404/410이면 바로, 5번 연속 실패하면 · 120일 안 쓰면 지워요. 아이폰은 홈 화면에 앱으로 설치해야 와요(`manifest.webmanifest`).
- **워크스페이스마다 따로 (v12)**: 채널 넣기는 요금제 한도(내 채널 · 레퍼런스) 안에서, 다른 회사가 2시간 안에 모은 채널은 다시 모으지 않아요. 채널 빼기는 그 워크스페이스에서만 — 아무도 안 지켜보게 되면 모은 데이터도 지워요. 검색(맞춤 · 넓게 · 소재 검색)은 서비스 하루 몫 + 요금제 하루 몫(`PLAN_SEARCH`). 아침 브리핑 · 맞춤 찾기도 워크스페이스마다(요금제가 높은 곳부터, 검색 6번 안에서).

## 다음 단계

- **유튜브 API 감사 · 할당량 늘리기 (무료, 공개 전에 꼭)**: 파생 지표(48시간 조회수 등)와 통계 장기 보관은 감사를 통과한 개발자만 할 수 있어요(정책 III.L, 2026-06-01부터). https://support.google.com/youtube/contact/yt_api_form 에서 'Analytics & Reporting' 용도로 신청 — 답변 초안은 `유튜브-API-감사-신청-초안.md`. 승인되면 통계를 36개월까지 둘 수 있고, 할당량도 늘려 요금제의 레퍼런스 개수를 지킬 수 있어요.

- **회원 레퍼런스 → TIGERSHEEP HUB 축적**: 회원이 추가한 공개 채널 URL·영상 레퍼런스·소재 분류를 공통 카탈로그에 모으고, 허브의 소재 조사 데이터로 전달하는 것이 제품 목표예요. 회원별 운영 화면과 내부 공통 수집 카탈로그를 구분해 구현해야 해요. 외부 허브 동기화는 아직 활성화하지 않았어요.
- **미리보기 데이터**: `home-data.json.realtime`은 2026-10-06 03:52:34 KST의 실제 운영 51채널 스냅샷이에요(채널 이름은 익명). 소개 페이지의 연결 그림 인물은 AI로 만든 이미지예요.

- **유튜브 채널 연결**: 가입용과 별도인 Google OAuth 클라이언트(`youtube.readonly`, `yt-analytics.readonly`, 수익은 `yt-analytics-monetary.readonly`) + 토큰 교환·저장 Edge Function(리프레시 토큰은 서버에만). 민감 범위라 **Google 앱 인증**(도메인 확인, 개인정보처리방침, 시연 영상)을 받기 전에는 테스트 사용자 100명까지만 써요. 채널은 반드시 그 채널의 구글 계정으로 하나씩 연결.
- **AI 대화 켜기**: Supabase → Edge Functions → Secrets에 `ANTHROPIC_API_KEY`를 넣으면 'RADAR에게 묻기'가 AI로 답해요(넣기 전에는 데이터로 직접 답해요).
- **카드 결제**: 지금은 '요금제 바꾸기 신청' → 관리자 콘솔에서 승인. 토스페이먼츠(원화) · Paddle(달러) 계약 뒤 결제 웹훅이 `radar_workspaces.plan`을 바꾸게 붙여요.
- **유튜브 분석(비공개 지표)**: 채널 주인이 구글로 연결하면 시청 지속률·트래픽 소스·일별/월별 확정치(YouTube Analytics API, 48~72시간 지연)를 붙여요.
- **유튜브 API 정책 심사**: 파생 지표(48시간 수치)·장기 보관을 하려면 정식 공개 전에 YouTube API 서비스 감사(Compliance Audit)와 할당량 증설을 받아야 해요.
- **틱톡·인스타그램**: 공식 API(또는 정식 라이선스 데이터)만 사용. 그 전까지는 링크 저장·분류만.
- **결제**: 국내 원화는 토스페이먼츠 등 PG, 해외 달러는 Paddle 같은 MoR. 결제가 붙으면 관리자 승인 대신 결제 웹훅이 워크스페이스 요금제를 바꾸게 해요.
- **크놀뮤직 · 크놀AD 연동**: 지금은 요청만 `partner_requests`에 쌓여요(연동은 보류).

## 확인이 필요한 것

- 약관·개인정보처리방침은 **초안**이에요. 보호책임자 이름, 사업자 정보, 문의 메일(`support@whrcompany.com`은 임시)을 채우고 법무 검토 후 “초안” 표시를 지우세요.
- 소개 페이지의 실적 숫자 자리는 실제 수치로 바꿔야 해요.
- 외부 스크립트를 새로 붙이면 `vercel.json`의 Content-Security-Policy도 함께 고쳐야 해요.

## 수정과 배포

GitHub에서 파일을 고치고 커밋하면 Vercel이 자동으로 다시 배포해요. 빌드 명령은 없고, 프레임워크는 “Other”, 출력 폴더는 저장소 루트예요.
