# 🦄 Yuna's Magic Writing Forest 
**ACA Lincoln Class Yuna's Top Secret Writing Project**

## 🌟 1. Project Overview (프로젝트 개요)
본 프로젝트는 판교에 사는 초등학교 3학년 유나(Yuna)를 위한 맞춤형 로컬 웹페이지 & 오프라인 저널 연계 글쓰기 프로그램입니다. 
유나의 뛰어난 리딩 및 어휘 실력을 바탕으로, 다소 지루해할 수 있는 라이팅을 **'5문장 마법 퀘스트(5-Sentence Magic Quests)'**로 변환하여 자연스럽게 영작 실력과 문단 구성력(Paragraphing)을 키웁니다.

## 🗺️ 2. Yuna's Universe (유나만의 세계관 설정)
웹페이지의 배경과 스토리는 유나의 실제 삶과 상상력을 결합하여 몰입도를 극대화합니다.

* **배경 (Locations):**
    * **Pangyo Magic Town:** 유나가 현재 살고 있는 판교(성남시). 모험의 베이스캠프이자 길고양이 친구들이 있는 곳.
    * **Jeju Memory Island:** 유나가 2년 동안 살았던 제주도. 특별한 마법 동물(귤색 고양이, 바다 유니콘)이 사는 과거의 추억 장소.
    * **ACA Magic Academy:** 유나가 다니는 영어 학원.
        * *Matisse Room (2025):* 유나가 기초 마법(어휘)을 배운 과거의 방.
        * *Lincoln Room (2026):* 현재 유나가 상급 마법(글쓰기 퀘스트)을 수련하는 곳.
* **등장인물 (Characters):**
    * **주인공:** Yuna (마법의 키보드를 가진 소녀)
    * **ACA 절친 크루 (The Magic 5):** Jihyun, Olivia, Ryan, Leo, Jian
    * **제주 절친 (Jeju Best Friend):** Riha (제주도에 살고 있는 유나의 소중한 친구. 편지와 영상통화로 연락)
    * **마법 조력자들:** * 하츄핑, 샤샤핑 (감정 묘사 도우미)
        * 개비캣 친구들 (정보성 글쓰기 도우미)
        * **마이리틀포니 (우정 및 모험 스토리 도우미 - 트와일라잇 스파클, 핑키파이, 레인보우 대쉬 등)**
        * 다양한 길고양이들과 유니콘

## 💻 3. Web UI/UX & Gamification (웹페이지 기능)
* **Map Navigation:** 첫 화면은 판교에서 시작해 ACA Academy, Jeju Island로 이동할 수 있는 귀여운 일러스트 지도. (가끔 하늘에 레인보우 대쉬가 날아감)
* **Lincoln Class Mailbox:** 우체통 아이콘이 반짝이면, 친구들이나 요정, 포니들이 보낸 **'오늘의 5문장 스토리 편지'**가 도착함.
* **Quest Scroll (5문장 마법 스크롤):** * 4개의 완성된 영어 문장(Context)이 먼저 화면에 뜨고, 유나가 소리 내어 읽음.
    * 마지막 5번째 문장에 템플릿 빈칸(____)이 주어지고, 유나가 자신의 생각이나 정답을 타이핑하여 완벽한 하나의 문단(Paragraph)을 완성함.
* **Sticker & Level Up:** * 5문장 퀘스트를 1개 완료할 때마다 티니핑/고양이/**큐티마크(포니)** 스탬프 획득.
    * 일정 스탬프를 모으면 "Matisse 뱃지"에서 "Lincoln 마스터 뱃지"로 레벨업.
* **Print to Journal:** '프린트' 버튼을 누르면 유나가 완성한 5문장 스토리가 예쁜 배경과 함께 출력됨. 오프라인 노트에 스크랩하여 나만의 마법 책 완성.

## 📂 4. Data Management: 템플릿 파일의 역할 및 관계
본 웹페이지는 두 가지 핵심 마크다운(MD) 데이터를 기반으로 구동됩니다. 두 파일은 '핵심 뼈대'와 '확장된 이야기'의 관계를 가집니다.

* **`templates.md` (마법의 뼈대 사전):**
    * **역할:** 미국 초등 2~3학년 필수 작문 패턴 200+개를 1문장 단위로 압축해 둔 **'핵심 구문(Core Syntax) 데이터베이스'**입니다.
    * **특징:** 유나가 배워야 할 필수 전환어, 의견 제시, 감정 묘사 등의 타겟 문장이 유나의 맞춤형 단어(제주도, 티니핑 등)와 결합되어 있습니다.
* **`templates_5sentences.md` (마법의 퀘스트 북):**
    * **역할:** `templates.md`의 1문장 뼈대를 유나가 직접 타이핑하며 놀 수 있도록, 앞부분에 4문장의 배경 스토리를 덧붙여 **'5문장 문단(Paragraph)'으로 확장한 데이터베이스**입니다.
    * **특징:** 유나의 리딩(Reading) 능력을 활용해 문맥(Context)을 파악하게 한 뒤, 마지막 빈칸을 스스로 채우게 하는 실전 퀘스트용 파일입니다.
* **🔗 두 파일 간의 관계 (How they work together):**
    * 웹페이지에서 미션이 출제될 때, **`templates_5sentences.md`**에서 스토리 4줄을 불러와 화면에 보여줍니다. 
    * 이어서 마지막 5번째 문장의 빈칸(____)을 뚫어놓고, 아이가 정답을 입력하면 시스템은 **`templates.md`**에 정의된 원본 1문장과 비교하여 정답/완성 여부를 판별합니다. 
    * 즉, `templates.md`는 **'학습 목표(Goal)'**이고, `templates_5sentences.md`는 그 목표에 도달하기 위한 **'과정(Journey)'**입니다.

## 📅 5. Daily Workflow (하루 15분 마법 루틴)
1. **Read (문맥 파악):** 화면에 나타난 4줄의 짧은 영어 스토리를 읽으며 상황(제주도 모험, 포니빌에서의 우정, ACA 학원 일상 등)을 이해한다.
2. **Think (논리 연결):** 빈칸이 있는 마지막 5번째 문장의 템플릿(예: *Suddenly, ___*)을 보고, 이야기의 흐름에 맞게 무엇을 쓸지 브레인스토밍한다.
3. **Write (타이핑 완수):** 유나의 풍부한 어휘를 사용하여 빈칸을 영어로 타이핑해 5문장 문단을 완성한다.
4. **Reward (성취):** 화면의 요정(개비캣/티니핑/마이리틀포니)이 나타나 화려한 애니메이션(예: 핑키파이의 파티 폭죽 효과)과 함께 스탬프를 찍어주며 유나를 칭찬한다.

---

## 🎨 6. Visual Design System (비주얼 디자인 시스템)

### 6-1. 디자인 컨셉
* **컬러 팔레트:**
    * Primary: 파스텔 핑크 `#FFB6D9`, 라벤더 `#C8A2FF`, 민트 `#A8E6CF`
    * Secondary: 하늘색 `#87CEEB`, 복숭아 `#FFDAB9`, 레몬 `#FFF9C4`
    * Accent: 마법 골드 `#FFD700`, 레인보우 그라디언트
    * 배경: 크림화이트 `#FFF8F0` (눈이 편안한 톤)
* **타이포그래피:**
    * 제목: 둥글고 귀여운 폰트 (Jua, Gaegu 등 Google Fonts 한/영 지원)
    * 본문: 가독성 높은 폰트 (Noto Sans KR / Nunito)
    * 퀘스트 텍스트: 큰 글씨(20px+), 줄간격 넉넉하게 (초등 3학년 가독성 기준)
* **UI 무드:** 동화책 느낌 + 게임 UI. 모든 버튼과 카드에 둥근 모서리(16px+), 부드러운 그림자, 미세한 반짝임 효과.

### 6-2. 페이지별 비주얼 레이아웃
* **메인 지도 (Map Screen):**
    * 판교/제주/ACA/포니빌을 잇는 일러스트 월드맵 (스크롤 가능)
    * 각 장소에 빛나는 마커 + 호버 시 장소 이름 팝업
    * 배경에 구름 흘러가는 CSS 애니메이션 + 가끔 레인보우 대쉬 비행 애니메이션
    * 하단에 유나의 프로필 카드 (이름, 레벨, 스탬프 수)
* **퀘스트 화면 (Quest Screen):**
    * 양피지/마법 두루마리 느낌의 카드 위에 5문장 표시
    * 1-4번 문장: 타자기 효과로 한 줄씩 등장 (0.5초 딜레이)
    * 5번째 문장: 빈칸이 반짝이는 입력 필드로 표시
    * 화면 좌측: 퀘스트 관련 캐릭터 일러스트 (포니/티니핑/고양이)
    * 화면 우측: 힌트 버튼 (별 모양, 클릭 시 핵심 단어 힌트)
* **보상 화면 (Reward Screen):**
    * 전체 화면 축하 애니메이션 (컨페티 + 별가루)
    * 캐릭터가 등장해서 칭찬 대사 표시 (말풍선)
    * 획득한 스탬프가 컬렉션북에 '찰칵' 소리와 함께 추가
    * "Print My Story" 버튼 (프린트 미리보기)
* **컬렉션북 (Sticker Book):**
    * 12개 섹션별 스탬프 그리드 (235개 슬롯)
    * 완료한 퀘스트: 컬러 스탬프 / 미완료: 회색 실루엣
    * 섹션 완료 시 특별 뱃지 언락 애니메이션

---

## ✨ 7. Animation & Effects System (애니메이션 & 이펙트)

### 7-1. 핵심 라이브러리
| 라이브러리 | 용도 | 비고 |
|-----------|------|------|
| **Lottie Web** (`lottie-web`) | 캐릭터 애니메이션, UI 모션 | LottieFiles에서 무료 JSON 애니메이션 활용 |
| **canvas-confetti** | 퀘스트 완료 시 축하 컨페티/폭죽 | 경량, 커스터마이징 가능 |
| **tsParticles** | 별가루, 마법 파티클, 반짝임 효과 | 퀘스트 화면 배경 파티클 |
| **Animate.css** | 문장 등장, 버튼 반응, 페이지 전환 | `fadeInUp`, `bounceIn`, `tada` 등 |
| **GSAP (GreenSock)** | 복잡한 타임라인 애니메이션 | 지도 탐험, 캐릭터 이동 경로 |

### 7-2. 상황별 이펙트 상세
* **퀘스트 시작:**
    * 마법 두루마리가 펼쳐지는 애니메이션 (GSAP timeline)
    * 문장이 한 줄씩 `fadeInUp` + 타자기 효과로 등장
    * 배경에 미세한 별가루 파티클 (tsParticles)
* **타이핑 중:**
    * 입력 필드에 글자를 칠 때마다 미세한 반짝임 (`sparkle` CSS animation)
    * 키보드 소리 효과 (선택적)
    * 일정 글자 이상 입력 시 캐릭터가 응원 표정으로 변경
* **정답 제출 / 퀘스트 완료:**
    * **컨페티 폭발** (canvas-confetti: 색상을 팔레트에 맞춤)
    * 캐릭터 등장 애니메이션 (Lottie):
        - 핑키파이 → 파티 폭죽 + 뛰어다니기
        - 레인보우 대쉬 → 소닉 레인붐 이펙트 (무지개 원형 확산)
        - 하츄핑 → 하트 마법 반짝임
        - 고양이 → 기지개 + 야옹 표정
    * 스탬프가 '퐁' 하고 찍히는 바운스 애니메이션
    * 칭찬 메시지 랜덤 팝업 ("Amazing!", "You're a writing wizard!", "Pony-rific!" 등)
* **레벨업:**
    * 화면 전체에 황금빛 파티클 + 팡파르 사운드
    * 새 뱃지가 빛나면서 등장 (scale + glow animation)
    * 캐릭터들이 줄지어 축하하는 Lottie 시퀀스
* **지도 탐험:**
    * 장소 간 이동 시 카메라 팬 효과 (CSS transform + transition)
    * 레인보우 대쉬가 경로를 따라 비행 (SVG path animation)
    * 각 장소 도착 시 해당 테마 배경음 전환

### 7-3. 마이크로 인터랙션
* 버튼 호버: `scale(1.05)` + 미세한 glow
* 버튼 클릭: `scale(0.95)` → `scale(1.0)` 바운스
* 카드 호버: 3D tilt 효과 (perspective + rotateY)
* 스크롤: 패럴랙스 배경 (구름, 별, 나뭇잎)
* 아이들 상태: 30초 무입력 시 캐릭터가 졸거나 장난치는 idle 애니메이션

---

## 🖼️ 8. Asset Generation & Management (에셋 생성 및 관리)

### 8-1. 캐릭터 일러스트 생성 전략
* **나노바나나 (Nano Banana 2 — Google Gemini 기반):**
    * **핵심 활용:** 캐릭터 일관성 유지(Character Consistency)가 뛰어나므로, 유나 캐릭터의 다양한 포즈/표정/장면을 일관된 스타일로 대량 생성
    * **생성할 에셋:**
        - 유나 캐릭터 시트: 기본 포즈, 기뻐하는 모습, 생각하는 모습, 글 쓰는 모습, 놀란 표정 등 (10종+)
        - The Magic 5 친구 캐릭터 (각 3-5종 포즈)
        - 길고양이 캐릭터 세트 (칼리코, 턱시도, 진저 등 5종)
        - 유니콘/마법동물 일러스트 세트
    * **프롬프트 전략:** "cute chibi Korean girl, 8 years old, pastel anime style, magical sparkle, consistent character" 등의 스타일 프롬프트를 고정하고 포즈/장면만 변경
    * **주의사항:** 마이리틀포니, 티니핑, 개비캣 등 기존 IP 캐릭터는 직접 생성 불가 → 아래 대안 활용

* **기존 IP 캐릭터 (MLP, 티니핑, 개비캣) 처리 전략:**
    * **Option A - 공식 에셋 활용:** 각 IP의 공식 팬키트/프레스킷에서 제공하는 이미지 (개인/교육 용도)
    * **Option B - "영감을 받은" 오리지널 캐릭터:** 나노바나나로 "inspired by" 스타일의 오리지널 마법 캐릭터 생성 (저작권 안전)
        - Rainbow Dash 영감 → "무지개 갈기의 빠른 페가수스" 오리지널
        - Pinkie Pie 영감 → "분홍색 파티 요정 포니" 오리지널
        - 하츄핑 영감 → "하트 날개의 작은 요정" 오리지널
    * **Option C - CSS/SVG 아이콘:** 단순화된 아이콘 스타일로 캐릭터 실루엣 표현
    * **권장:** 교육 목적 개인 사용이므로 Option A + Option B 혼합

### 8-2. 배경 & 환경 에셋
* **나노바나나로 생성할 배경:**
    * Pangyo Magic Town: 판교 아파트 + 공원 + 길고양이가 있는 판타지 풍경
    * Jeju Memory Island: 제주 바다 + 귤밭 + 말이 뛰노는 수채화 풍 배경
    * ACA Academy: 마법 학원 교실 + 복도 + 도서관 내부
    * Ponyville Portal: 판교 공원의 빛나는 포털 + 포니빌 입구
* **계절/시간대 변형:** 각 배경을 봄/여름/가을/겨울 + 낮/해질녘/밤 버전으로 (나노바나나로 스타일 일관성 유지하며 변형)

### 8-3. UI 에셋
| 에셋 종류 | 생성 방법 | 수량 |
|-----------|----------|------|
| 스탬프/스티커 | 나노바나나 (귀여운 아이콘 스타일) | 12종 (섹션별) + 스페셜 5종 |
| 뱃지 | 나노바나나 (메달/방패 스타일) | 레벨별 5종 |
| 버튼 아이콘 | SVG 직접 제작 또는 Lucide Icons | 10종+ |
| 프레임/보더 | CSS + SVG (마법 두루마리, 편지지 등) | 5종 |
| 이모지/리액션 | Lottie 애니메이션 (LottieFiles 무료) | 10종 |

### 8-4. 무료 에셋 보조 소스
* **LottieFiles** (lottiefiles.com): 무료 애니메이션 JSON (축하, 별, 하트, 동물 등)
* **Freepik** (freepik.com): 무료 벡터 일러스트 (판타지, 어린이, 동물)
* **Vecteezy** (vecteezy.com): 무료 캐릭터/배경 벡터
* **DrawKit** (drawkit.com): 깔끔한 일러스트 세트
* **unDraw** (undraw.co): 미니멀 일러스트 (UI 보조용)
* **Google Fonts**: 무료 웹폰트 (Jua, Gaegu, Nunito 등)

---

## 🔊 9. Sound Design (사운드 디자인) ✅ 구현 완료

### 9-1. 사운드 에셋
* **배경 음악 (BGM) — Google MusicFX로 생성, MP3:**
    * `bgm-map.mp3`: 메인 지도 — 마법 오르골 + 피아노
    * `bgm-quest.mp3`: 퀘스트 화면 — 잔잔한 피아노 + 하프 (집중용)
    * `bgm-reward.mp3`: 보상 화면 — 밝은 축하 멜로디
    * `bgm-ponyville.mp3`: 포니빌/제주 — 밝은 팝 멜로디
    * 화면 전환 시 자동 크로스페이드
* **효과음 (SFX) — Web Audio API 합성 (파일 불필요):**
    * 퀘스트 시작: 마법 스케일 상승음
    * 정답 제출: 확인 2음
    * Perfect 정답: C-E-G-C 아르페지오 팡파르 + 스파클
    * Creative 답변: 몽환적 상승 멜로디
    * 스탬프 획득: 퐁! 팝 + 딩
    * 레벨업: 그랜드 팡파르 + 코드 + 별가루
    * 버튼 클릭/네비게이션/뒤로가기/힌트: 각각 고유 효과음
    * 에러: 부드러운 하강음
* **구현:** `js/sound-manager.js` — Web Audio API (SFX 합성) + HTML Audio (BGM 재생)
* **UI:** 🔊 뮤트 버튼 + 볼륨 슬라이더 (상단 바)

---

## 🏗️ 10. Technical Architecture (기술 아키텍처)

### 10-1. 기술 스택
```
Frontend:  HTML5 + CSS3 + Vanilla JavaScript (프레임워크 없이 단순하게)
Styling:   CSS Custom Properties + 자체 애니메이션
Animation: 순수 JS 컨페티 시스템 + CSS 애니메이션 (타자기, 스파클, 바운스)
Audio:     Web Audio API (SFX 합성) + HTML Audio (BGM)
Auth:      Firebase Auth (Google 로그인) + 비밀번호 게이트 (2단계 인증)
Data:      Markdown → JS 임베딩 (빌드 타임) → Firestore (클라우드) + LocalStorage (캐시)
Print:     CSS @media print
Hosting:   GitHub Pages (https://limtaejun.github.io/magic-writing-forest/)
Repo:      GitHub Public (https://github.com/limtaejun/magic-writing-forest)
```

### 10-2. 폴더 구조 (현재 실제 구조)
```
Wirting2026/
├── CLAUDE.md                      # 프로젝트 기획서
├── NANO_BANANA_PROMPT_GUIDE.md    # 이미지 생성 프롬프트 가이드
├── .gitignore                     # Git 제외 파일 설정
├── index.html                     # 메인 엔트리 (2단계 인증 게이트 포함)
├── build-quests.js                # MD→JSON 빌드 스크립트 (Node.js용, 참고용)
├── templates/
│   ├── templates.md               # 핵심 구문 DB (235개)
│   └── templates_5sentences.md    # 5문장 퀘스트 북 (235개)
├── assets/
│   ├── images/
│   │   ├── characters/
│   │   │   └── yuna/              # ✅ 유나 포즈별 (10종 완료)
│   │   ├── backgrounds/
│   │   │   └── jeju/              # ✅ 제주 배경 (3종 완료, JPG 1920x1080 최적화)
│   │   └── (stamps/, badges/, friends/, ponies/ 등 → 추후 생성)
│   └── sounds/
│       └── bgm/                   # ✅ BGM 4종 완료
│           ├── bgm-map.mp3
│           ├── bgm-quest.mp3
│           ├── bgm-reward.mp3
│           └── bgm-ponyville.mp3
├── css/
│   ├── style.css                  # 메인 스타일 + 볼륨 컨트롤
│   ├── animations.css             # 캐릭터/스파클/레벨업 애니메이션
│   ├── quest.css                  # 퀘스트 화면 + 학부모 승인 버튼
│   ├── map.css                    # 지도 화면
│   └── print.css                  # 프린트용 스타일
├── js/
│   ├── app.js                     # 메인 앱 (화면 전환, 이벤트, 보상, 프린트)
│   ├── quest-engine.js            # 퀘스트 렌더링/채점 (3단계 + 학부모 승인)
│   ├── md-parser.js               # 마크다운 파서 (브라우저 런타임)
│   ├── animation-controller.js    # 컨페티/타자기/캐릭터/스파클/레벨업
│   ├── sound-manager.js           # Web Audio SFX + BGM 재생/크로스페이드
│   └── progress-tracker.js        # Firestore 클라우드 + LocalStorage 캐시
├── data/
│   └── quests-data.js             # MD 임베딩 (브라우저에서 직접 파싱)
└── tools/
    └── remove-checkerboard.html   # 이미지 체커보드 배경 제거 도구
```

### 10-3. 인증 & 데이터 흐름
```
[사이트 접속]
    │
    ▼
[1단계: 비밀번호 입력] ──→ "yuna2026" 확인
    │
    ▼
[2단계: Google 로그인] ──→ Firebase Auth
    │
    ▼
[앱 스크립트 동적 로드] ──→ quests-data.js → md-parser → progress-tracker → app.js
    │
    ▼
[Firestore에서 진행 데이터 로드] ──→ LocalStorage 캐시 동기화
    │
    ▼
[메인 지도 표시]

[퀘스트 데이터 흐름]
templates.md ──┐
               ├──→ quests-data.js (MD 임베딩) ──→ md-parser.js (런타임 파싱)
templates_5s.md┘                                        │
                                                        ▼
                                          quest-engine.js (렌더링 + 채점)
                                                        │
                                                        ▼
                                          progress-tracker.js (Firestore + LocalStorage)
```

### 10-4. 정답 판정 로직
* **유연한 매칭 (Flexible Matching):**
    * 대소문자 무시
    * 앞뒤 공백 제거
    * 기본 스펠링 유사도 체크 (Levenshtein distance ≤ 2 → "거의 맞았어!" 피드백)
    * 핵심 키워드 포함 여부 체크 (완전 일치가 아니어도 핵심어 포함 시 통과)
    * 창의적 답변 허용: 유나가 자유롭게 쓴 답도 문법적으로 맞으면 "Great creative answer!" 표시
* **3단계 피드백:**
    1. **Perfect Match:** "Absolutely magical! You nailed it!" + 금별 스탬프 + 최대 컨페티
    2. **Close Match:** "Almost there! Try one more time!" + 힌트 제공 + 격려 애니메이션
    3. **Creative Answer:** "What a creative answer! Here's your star!" + 은별 스탬프

---

## 📱 11. Responsive & Accessibility (반응형 & 접근성)
* **반응형:** 태블릿(iPad) 최적화 우선. 데스크톱/모바일도 지원.
* **글씨 크기:** 최소 18px (초등 3학년 가독성)
* **터치 타겟:** 최소 48x48px (어린이 손가락 크기 고려)
* **키보드 네비게이션:** Tab 키로 모든 UI 요소 접근 가능
* **사운드 토글:** 음소거/볼륨 조절 항상 접근 가능
* **다크모드:** 밤에 학습 시 눈 보호 (선택적)

---

## 🗓️ 12. Development Phases (개발 단계)

### Phase 1: Foundation (기반 구축) ✅ 완료
- [x] 폴더 구조 생성
- [x] MD → JS 임베딩 파서 구현 (`md-parser.js` + `quests-data.js`)
- [x] 기본 HTML/CSS 레이아웃 (메인 지도 + 퀘스트 + 컬렉션북 + 위치별 퀘스트)
- [x] 퀘스트 엔진 핵심 로직 (문장 표시 + 입력 + 3단계 채점 + 학부모 승인)
- [x] LocalStorage 진행 상황 저장
- [x] 4개 장소 모두 클릭 가능 (ACA/판교/제주/포니빌)
- [x] Riha → 제주 친구로 분리 (Magic 5 + Riha)

### Phase 2: Visual Magic (비주얼 마법) ✅ 완료
- [x] 나노바나나로 유나 캐릭터 10종 생성
- [x] 나노바나나로 제주 배경 3종 생성
- [x] 순수 JS 컨페티 보상 이펙트 (Perfect: 멀티버스트, Creative: 라이트 스파클)
- [x] 타자기 효과 + 문장 등장 애니메이션
- [x] 캐릭터 이미지 시스템 (이미지 존재 확인 + 이모지 폴백)
- [x] 스파클 파티클 효과
- [x] 레벨업 오버레이 효과
- [ ] 나머지 캐릭터 에셋 생성 (친구/포니/요정/고양이)
- [ ] 나머지 배경 에셋 생성 (판교/ACA/포니빌)
- [ ] 스탬프/뱃지 이미지 에셋 생성

### Phase 3: Polish & Delight (완성도) ✅ 대부분 완료
- [x] 사운드 시스템 통합 — Web Audio SFX + BGM 4종 (MusicFX 생성)
- [x] 볼륨 슬라이더 + 뮤트 토글 UI
- [x] 프린트 기능 (CSS @media print)
- [x] 레벨업 시스템 (5단계) + 컬렉션북 (판교)
- [x] 제주 배경 테마 (위치별 배경 이미지 전환)
- [ ] idle 애니메이션 + 마이크로 인터랙션

### Phase 3.5: Deployment & Auth (배포 & 인증) ✅ 완료
- [x] GitHub Pages 배포 (Public repo)
- [x] 2단계 인증 게이트 (비밀번호 + Google 로그인)
- [x] Firebase Auth (Google 로그인)
- [x] Firestore 클라우드 진행 데이터 저장
- [x] 로그아웃 기능

### Phase 4: Content & Test (콘텐츠 & 테스트)
- [ ] 235개 퀘스트 전체 테스트
- [ ] 유나 실제 테스트 플레이 → 피드백 반영
- [ ] 난이도/순서 조정
- [ ] 최종 에셋 퀄리티 점검