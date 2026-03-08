# 🍌 나노바나나 (Nano Banana 2) 에셋 생성 프롬프트 가이드

> Google Gemini 이미지 생성 기능을 활용하여 **Yuna's Magic Writing Forest** 프로젝트에 필요한 캐릭터, 배경, UI 에셋을 일관된 스타일로 생성하는 가이드입니다.

---

## 📋 목차
1. [스타일 고정 프롬프트](#1-스타일-고정-프롬프트)
2. [캐릭터 일러스트](#2-캐릭터-일러스트)
3. [배경 일러스트](#3-배경-일러스트)
4. [UI 에셋](#4-ui-에셋)
5. [이미지 저장 규칙 & 폴더 안내](#5-이미지-저장-규칙--폴더-안내)
6. [생성 팁 & 워크플로우](#6-생성-팁--워크플로우)

---

## 1. 스타일 고정 프롬프트

모든 프롬프트 **맨 앞에** 아래 스타일 앵커를 붙여서 일관성을 유지합니다.

```
Style: cute chibi kawaii illustration, soft pastel color palette
(pink #FFB6D9, lavender #C8A2FF, mint #A8E6CF, sky blue #87CEEB),
clean vector-like digital art, storybook illustration style,
rounded shapes, gentle shading, white or cream (#FFF8F0) background,
sparkle and star decorations. For characters: large expressive eyes,
small nose, cheerful expressions. Target audience: children age 7-8.
```

> **팁:** 이 블록을 메모장에 저장해두고 매번 복사-붙여넣기 하세요.

---

## 2. 캐릭터 일러스트

### 2-1. 유나 (Yuna) — 주인공 캐릭터 시트

**기본 외형 프롬프트 (첫 번째로 생성!):**
```
[스타일 앵커 붙여넣기]
A cute chibi Korean girl character named Yuna, age 7, with shoulder-length
black hair with a small lavender hair clip shaped like a star. She wears a
pastel pink cardigan over a white t-shirt with a tiny unicorn print, and a
lavender pleated skirt. She has big sparkling brown eyes and rosy cheeks.
She carries a magical glowing keyboard/pencil that shimmers with rainbow light.
Standing pose, gentle smile, waving hello, full body view.
```

**포즈별 변형** — 각각 별도로 생성하되, 동일 세션에서 이어서 요청합니다:

| # | 포즈 | 추가 프롬프트 (기본 외형 뒤에 추가) | 저장 파일명 |
|---|------|----------------------------------|-----------|
| 1 | 기본 서기 | `Standing pose, gentle smile, waving hello, full body view` | `yuna-default.png` |
| 2 | 글쓰기 | `Sitting at a desk, typing on a magical glowing keyboard, focused happy expression, side view` | `yuna-writing.png` |
| 3 | 기뻐하기 | `Jumping with joy, arms raised, eyes closed in happiness, confetti around her, stars and sparkles` | `yuna-happy.png` |
| 4 | 생각하기 | `Thinking pose, finger on chin, looking up with curious expression, small question marks and lightbulbs floating around` | `yuna-thinking.png` |
| 5 | 놀라기 | `Surprised expression, hands on cheeks, mouth open in amazement, sparkle effects around` | `yuna-surprised.png` |
| 6 | 책 읽기 | `Sitting cross-legged, reading a large storybook, dreamy smile, tiny magical creatures peeking from pages` | `yuna-reading.png` |
| 7 | 승리 | `Victory pose, holding a golden star trophy, confident smile, golden sparkles` | `yuna-victory.png` |
| 8 | 고양이와 함께 | `Kneeling down, gently petting a calico cat, both looking happy, heart shapes floating` | `yuna-with-cat.png` |
| 9 | 친구들과 | `Standing with arms linked with two other chibi kids, all smiling, friendship glow` | `yuna-with-friends.png` |
| 10 | 마법사 모드 | `Wearing a small witch hat with star, holding a glowing magic wand/pencil, magical swirls around her` | `yuna-wizard.png` |

> **저장 위치:** `assets/images/characters/yuna/`

---

### 2-2. The Magic 5 + Jeju Friend Riha (친구 캐릭터)

모든 친구에게 **기본 외형 프롬프트 + 스타일 앵커**를 사용하고, 뒤에 `Same art style as Yuna character.`를 추가합니다.

#### Jihyun (지현)
```
[스타일 앵커]. Same art style as Yuna character.
A cute chibi Korean girl, age 7, with long straight hair in twin tails
tied with mint ribbons. She wears glasses with round frames, a mint green
sweater with a small book pin. She loves reading and drawing.
Gentle, kind expression. Full body, standing pose.
```
| 포즈 | 파일명 |
|------|--------|
| 기본 서기 | `jihyun-default.png` |
| 책 읽기 | `jihyun-reading.png` |
| 그림 그리기 | `jihyun-drawing.png` |

#### Olivia (올리비아)
```
[스타일 앵커]. Same art style as Yuna character.
A cute chibi girl, age 7, with curly light brown hair and a pink headband
with a small flower. She wears a peach-colored dress with white collar.
Bright, energetic smile. She loves animals. Full body, standing pose.
```
| 포즈 | 파일명 |
|------|--------|
| 기본 서기 | `olivia-default.png` |
| 동물과 함께 | `olivia-with-animal.png` |
| 웃는 모습 | `olivia-laughing.png` |

#### Ryan (라이언)
```
[스타일 앵커]. Same art style as Yuna character.
A cute chibi Korean boy, age 7, with short messy hair and a blue baseball
cap worn backwards. He wears a sky blue hoodie with a small cat patch.
Adventurous, playful grin. He loves sports and toy cats. Full body, standing pose.
```
| 포즈 | 파일명 |
|------|--------|
| 기본 서기 | `ryan-default.png` |
| 축구 | `ryan-soccer.png` |
| 고양이 장난감 | `ryan-with-toy.png` |

#### Leo (레오)
```
[스타일 앵커]. Same art style as Yuna character.
A cute chibi boy, age 7, with neat short hair and round glasses.
He wears a yellow vest over a white shirt. Bookworm look, thoughtful
expression. He loves reading and telling jokes. Full body, standing pose.
```
| 포즈 | 파일명 |
|------|--------|
| 기본 서기 | `leo-default.png` |
| 웃으며 농담 | `leo-joking.png` |
| 책 들기 | `leo-with-book.png` |

#### Jian (지안)
```
[스타일 앵커]. Same art style as Yuna character.
A cute chibi Korean boy, age 7, with spiky short hair. He wears a green
dinosaur-themed t-shirt. Curious expression, always excited. He loves
dinosaurs and building things. Full body, standing pose.
```
| 포즈 | 파일명 |
|------|--------|
| 기본 서기 | `jian-default.png` |
| 공룡 포즈 | `jian-dinosaur.png` |
| 만들기 | `jian-building.png` |

#### Riha (리하)
```
[스타일 앵커]. Same art style as Yuna character.
A cute chibi girl, age 7, with black hair in a side ponytail with a star clip.
She wears a lavender top with unicorn embroidery. She lives in Jeju Island. Artistic, dreamy expression.
She loves drawing unicorns and singing. Background hint: ocean or tangerine trees. Full body, standing pose.
```
| 포즈 | 파일명 |
|------|--------|
| 기본 서기 | `riha-default.png` |
| 그림 그리기 | `riha-drawing.png` |
| 노래하기 | `riha-singing.png` |

> **저장 위치:** `assets/images/characters/friends/`

---

### 2-3. 오리지널 마법 캐릭터 (IP 회피 — "영감을 받은" 캐릭터)

저작권 안전을 위해 MLP/티니핑/개비캣에서 **영감을 받은 오리지널** 캐릭터를 생성합니다.

#### 포니 캐릭터 (6종)

| 오리지널 이름 | 영감 | 프롬프트 | 파일명 |
|-------------|------|---------|--------|
| **Sparkle Wing** | Twilight Sparkle | `[스타일 앵커] A cute magical unicorn pony with a deep purple body and dark navy mane with a pink streak. Star-shaped mark on flank, small golden tiara. Horn glows with lavender light. Reading a floating book. Friendly, wise expression.` | `sparkle-wing.png` |
| **Party Bloom** | Pinkie Pie | `[스타일 앵커] A cute magical earth pony with a bright pink body and fluffy curly magenta mane. Balloon-shaped mark on flank. Surrounded by colorful confetti and cupcakes. Extremely joyful, bouncing expression.` | `party-bloom.png` |
| **Sky Dash** | Rainbow Dash | `[스타일 앵커] A cute magical pegasus pony with a sky blue body and a rainbow-colored flowing mane. Lightning bolt mark on flank. Flying fast leaving a rainbow trail. Confident, sporty expression.` | `sky-dash.png` |
| **Heart Flutter** | Fluttershy | `[스타일 앵커] A cute magical pegasus pony with a pale yellow body and long flowing pink mane. Butterfly mark on flank. Gently holding a tiny kitten. Shy, sweet expression, surrounded by small flowers.` | `heart-flutter.png` |
| **Diamond Belle** | Rarity | `[스타일 앵커] A cute magical unicorn pony with a white body and elegant purple curly mane. Diamond mark on flank. Horn sparkles with blue magic. Graceful, fashionable expression.` | `diamond-belle.png` |
| **Apple Star** | Applejack | `[스타일 앵커] A cute magical earth pony with an orange body and blonde mane in a braid. Small cowboy hat. Apple mark on flank. Strong, honest, warm smile.` | `apple-star.png` |

> **저장 위치:** `assets/images/characters/ponies/`

#### 티니핑 영감 캐릭터 (2종)

| 이름 | 프롬프트 | 파일명 |
|------|---------|--------|
| **Hearting** | `[스타일 앵커] A tiny cute fairy creature with a round pastel pink body, small white wings shaped like hearts, big sparkly blue eyes. Heart-shaped antenna on head. Floats surrounded by glowing heart particles. Innocent, loving expression.` | `hearting.png` |
| **Twinkle Ping** | `[스타일 앵커] A tiny cute fairy creature with a round lavender body, small sparkly wings, big golden eyes with star-shaped pupils. Crescent moon antenna on head. Surrounded by twinkling stars. Sweet, encouraging expression.` | `twinkle-ping.png` |

> **저장 위치:** `assets/images/characters/teeniepings/`

#### 개비캣 영감 캐릭터 (2종)

| 이름 | 프롬프트 | 파일명 |
|------|---------|--------|
| **Cookie Paws** | `[스타일 앵커] A cute cartoon cat with cream-colored fur decorated with colorful sprinkles pattern. Tiny chef hat, holds a miniature whisk. Frosting-colored ears (pink and blue). Playful, sweet expression.` | `cookie-paws.png` |
| **Pandy Hug** | `[스타일 앵커] A cute cartoon black and white panda cat hybrid, wearing a small purple bow tie. Very fluffy and round body. Giving a big warm hug pose. Cuddly, adorable expression.` | `pandy-hug.png` |

> **저장 위치:** `assets/images/characters/gabby/`

---

### 2-4. 길고양이 세트 (5종)

```
[스타일 앵커]
A set of 5 cute chibi street cats in different coat patterns, sitting together:
1. Calico cat (white, orange, black patches) wearing a tiny pink scarf
2. Tuxedo cat (black and white) with a small bow tie
3. Ginger/orange tabby cat with green eyes, stretching
4. Gray striped tabby cat with a curious tilted head
5. White cat with blue eyes and a small bell collar
All cats have expressive big eyes, fluffy tails, sitting on a stone wall
with small flowers. Pangyo apartment buildings softly visible in the background.
```

> 그룹 이미지 1장 + 개별 이미지 각 1장 생성을 권장합니다.

| 고양이 | 파일명 |
|--------|--------|
| 전체 그룹 | `cats-group.png` |
| 칼리코 | `cat-calico.png` |
| 턱시도 | `cat-tuxedo.png` |
| 진저 | `cat-ginger.png` |
| 회색 줄무늬 | `cat-gray-tabby.png` |
| 흰 고양이 | `cat-white.png` |

> **저장 위치:** `assets/images/characters/cats/`

---

## 3. 배경 일러스트

모든 배경은 **가로형(16:9)** 비율로 생성합니다. 프롬프트에 `Wide landscape format, 16:9 aspect ratio.`를 추가하세요.

### 3-1. Pangyo Magic Town
```
[스타일 앵커] Wide landscape format, 16:9 aspect ratio.
A wide panoramic fantasy illustration of a magical Korean city neighborhood.
Modern apartment buildings with cute pastel-colored facades, rooftop gardens
with tiny flowers. A beautiful park with a large magical tree glowing with
golden light in the center. Street cats playing near benches. Small sparkles
and fireflies floating in the air. Cherry blossom petals gently falling.
A stone walking path with magical rune patterns. Warm golden hour lighting.
```

| 변형 | 추가 프롬프트 | 파일명 |
|------|-------------|--------|
| 봄/낮 (기본) | *(위 프롬프트 그대로)* | `pangyo-spring-day.png` |
| 여름/낮 | `Summer version. Lush green trees, bright sunshine, cicadas and butterflies.` | `pangyo-summer-day.png` |
| 가을/해질녘 | `Autumn version. Orange and red maple leaves, warm sunset sky, cozy atmosphere.` | `pangyo-autumn-sunset.png` |
| 겨울/밤 | `Winter night version. Gentle snow falling, warm streetlights glowing, Christmas decorations.` | `pangyo-winter-night.png` |

> **저장 위치:** `assets/images/backgrounds/pangyo/`

### 3-2. Jeju Memory Island
```
[스타일 앵커] Wide landscape format, 16:9 aspect ratio.
A dreamy watercolor-style fantasy illustration of Jeju Island. Crystal clear
turquoise ocean with gentle waves. Orange tangerine trees full of fruit in
the foreground. Hallasan mountain in the background with clouds. Jeju horses
(small ponies) grazing in a green field with wildflowers. A stone hareubang
statue wearing a tiny flower crown. Dolphins jumping in the distance.
Magical golden sunset sky.
```

| 변형 | 파일명 |
|------|--------|
| 해변/낮 (기본) | `jeju-beach-day.png` |
| 귤밭/해질녘 | `jeju-tangerine-sunset.png` |
| 한라산/아침 | `jeju-hallasan-morning.png` |

> **저장 위치:** `assets/images/backgrounds/jeju/`

### 3-3. ACA Magic Academy
```
[스타일 앵커] Wide landscape format, 16:9 aspect ratio.
Interior of a magical classroom. Wooden desks arranged in a semi-circle.
A large magical chalkboard floating in the air with English words written
in glowing chalk (words: "write", "dream", "magic"). Bookshelves filled
with colorful storybooks, some books floating with sparkle trails.
A window showing a beautiful park outside. Star and moon decorations
hanging from the ceiling. Warm, cozy atmosphere with soft golden lighting.
A sign on the door reads "Lincoln Class".
```

| 변형 | 파일명 |
|------|--------|
| 교실 (기본) | `aca-classroom.png` |
| 도서관 | `aca-library.png` |
| 복도 | `aca-hallway.png` |

> **저장 위치:** `assets/images/backgrounds/aca/`

### 3-4. Ponyville Portal
```
[스타일 앵커] Wide landscape format, 16:9 aspect ratio.
A magical glowing portal in the middle of a beautiful Korean park. The portal
is a large oval ring made of rainbow-colored light and swirling stars. Through
the portal, a glimpse of a colorful fantasy village with thatched-roof cottages
and a candy-colored castle in the distance. Butterflies and sparkles floating
around the portal. Green grass and flowers on the park side. Cherry trees nearby.
The portal emits a soft warm glow.
```

| 변형 | 파일명 |
|------|--------|
| 포탈 (기본) | `ponyville-portal.png` |
| 포니빌 마을 | `ponyville-village.png` |

> **저장 위치:** `assets/images/backgrounds/ponyville/`

---

## 4. UI 에셋

### 4-1. 스탬프/스티커 (섹션별 12종 + 스페셜 5종)

각 섹션마다 1개의 스탬프 아이콘을 생성합니다. 프롬프트 형식:

```
[스타일 앵커]
A cute circular stamp/badge icon, [테마], gold border with tiny stars,
transparent background, clean vector style, centered composition. No text.
```

| # | 섹션 | `[테마]` 대체 | 파일명 |
|---|------|-------------|--------|
| 1 | Opinion Writing | `a small megaphone with a speech bubble` | `stamp-opinion.png` |
| 2 | Informative | `a magnifying glass over an open book` | `stamp-informative.png` |
| 3 | Narrative | `an open storybook with a magical quill pen` | `stamp-narrative.png` |
| 4 | Transition Words | `a chain of connected colorful links` | `stamp-transition.png` |
| 5 | Show Don't Tell | `a painting palette with a paintbrush and color drops` | `stamp-sensory.png` |
| 6 | Letter Writing | `a sealed envelope with a heart wax stamp` | `stamp-letter.png` |
| 7 | How-To | `a numbered checklist with sparkly checkmarks` | `stamp-howto.png` |
| 8 | Compare & Contrast | `a balance scale with two shining stars` | `stamp-compare.png` |
| 9 | Book Report | `a book with a bookmark and a tiny magnifying glass` | `stamp-bookreport.png` |
| 10 | Dialogue | `two colorful speech bubbles facing each other` | `stamp-dialogue.png` |
| 11 | Sentence Power-Ups | `a lightning bolt with an upward arrow, energy sparks` | `stamp-powerup.png` |
| 12 | Emotions | `a heart with rainbow sparkles and tiny stars` | `stamp-emotions.png` |

**스페셜 스탬프:**

| 이름 | 프롬프트 테마 | 파일명 |
|------|-------------|--------|
| 첫 퀘스트 | `a golden key with sparkles, "first quest" feeling` | `stamp-special-first.png` |
| 10개 완료 | `a small trophy cup with number 10 and stars` | `stamp-special-10.png` |
| 50개 완료 | `a silver crown with gems` | `stamp-special-50.png` |
| 100개 완료 | `a golden crown with rainbow gems` | `stamp-special-100.png` |
| 전부 완료 | `a magical crystal orb glowing with all rainbow colors, ultimate achievement` | `stamp-special-complete.png` |

> **저장 위치:** `assets/images/stamps/`

### 4-2. 레벨 뱃지 (5종)

프롬프트 형식:
```
[스타일 앵커]
A beautiful medal/badge, [디자인], shiny metallic effect, ribbon at bottom,
transparent background, centered composition. No text.
```

| 레벨 | `[디자인]` 대체 | 파일명 |
|------|---------------|--------|
| Lv.1 Matisse Beginner | `bronze medal with a small pencil icon, green ribbon` | `badge-lv1-matisse-beginner.png` |
| Lv.2 Matisse Explorer | `silver medal with a compass icon, blue ribbon` | `badge-lv2-matisse-explorer.png` |
| Lv.3 Lincoln Learner | `gold medal with an open book icon, purple ribbon` | `badge-lv3-lincoln-learner.png` |
| Lv.4 Lincoln Writer | `platinum medal with a quill pen icon, pink ribbon` | `badge-lv4-lincoln-writer.png` |
| Lv.5 Lincoln Master | `diamond crystal medal with a crown and star icon, rainbow ribbon, extra sparkle and glow` | `badge-lv5-lincoln-master.png` |

> **저장 위치:** `assets/images/badges/`

---

## 5. 이미지 저장 규칙 & 폴더 안내

### 파일명 규칙
- **모두 소문자** + **하이픈(-)으로 단어 구분** (예: `yuna-happy.png`)
- 공백, 한글, 특수문자 금지
- 포맷: `.png` (투명 배경 필요 시) 또는 `.webp` (파일 크기 최적화)

### 권장 이미지 크기
| 용도 | 권장 크기 | 비고 |
|------|----------|------|
| 캐릭터 (전신) | 512 x 512 px | 정사각형, 투명 배경 |
| 캐릭터 (얼굴/반신) | 256 x 256 px | 퀘스트 화면 조력자용 |
| 배경 | 1920 x 1080 px | 16:9, JPG도 가능 |
| 스탬프/스티커 | 128 x 128 px | 정사각형, 투명 배경 |
| 뱃지 | 200 x 200 px | 정사각형, 투명 배경 |
| UI 아이콘 | 64 x 64 px | 정사각형 |

### 폴더 구조 & 체크리스트

```
assets/images/
├── characters/
│   ├── yuna/                    ← 유나 캐릭터 (10장)
│   │   ├── yuna-default.png         ✅ 기본 서기
│   │   ├── yuna-writing.png         ✅ 글쓰기
│   │   ├── yuna-happy.png           ✅ 기뻐하기
│   │   ├── yuna-thinking.png        ✅ 생각하기
│   │   ├── yuna-surprised.png       ✅ 놀라기
│   │   ├── yuna-reading.png         ✅ 책 읽기
│   │   ├── yuna-victory.png         ✅ 승리
│   │   ├── yuna-with-cat.png        ✅ 고양이와 함께
│   │   ├── yuna-with-friends.png    ✅ 친구들과
│   │   └── yuna-wizard.png          ✅ 마법사 모드
│   │
│   ├── friends/                 ← 친구 캐릭터 (6명 x 3장 = 18장)
│   │   ├── jihyun-default.png
│   │   ├── jihyun-reading.png
│   │   ├── jihyun-drawing.png
│   │   ├── olivia-default.png
│   │   ├── olivia-with-animal.png
│   │   ├── olivia-laughing.png
│   │   ├── ryan-default.png
│   │   ├── ryan-soccer.png
│   │   ├── ryan-with-toy.png
│   │   ├── leo-default.png
│   │   ├── leo-joking.png
│   │   ├── leo-with-book.png
│   │   ├── jian-default.png
│   │   ├── jian-dinosaur.png
│   │   ├── jian-building.png
│   │   ├── riha-default.png
│   │   ├── riha-drawing.png
│   │   └── riha-singing.png
│   │
│   ├── ponies/                  ← 오리지널 포니 (6장)
│   │   ├── sparkle-wing.png
│   │   ├── party-bloom.png
│   │   ├── sky-dash.png
│   │   ├── heart-flutter.png
│   │   ├── diamond-belle.png
│   │   └── apple-star.png
│   │
│   ├── teeniepings/             ← 오리지널 요정 (2장)
│   │   ├── hearting.png
│   │   └── twinkle-ping.png
│   │
│   ├── gabby/                   ← 오리지널 고양이 캐릭터 (2장)
│   │   ├── cookie-paws.png
│   │   └── pandy-hug.png
│   │
│   └── cats/                    ← 길고양이 (6장)
│       ├── cats-group.png
│       ├── cat-calico.png
│       ├── cat-tuxedo.png
│       ├── cat-ginger.png
│       ├── cat-gray-tabby.png
│       └── cat-white.png
│
├── backgrounds/                 ← 배경 (12장)
│   ├── pangyo/
│   │   ├── pangyo-spring-day.png
│   │   ├── pangyo-summer-day.png
│   │   ├── pangyo-autumn-sunset.png
│   │   └── pangyo-winter-night.png
│   ├── jeju/
│   │   ├── jeju-beach-day.png
│   │   ├── jeju-tangerine-sunset.png
│   │   └── jeju-hallasan-morning.png
│   ├── aca/
│   │   ├── aca-classroom.png
│   │   ├── aca-library.png
│   │   └── aca-hallway.png
│   └── ponyville/
│       ├── ponyville-portal.png
│       └── ponyville-village.png
│
├── stamps/                      ← 스탬프 (12 + 5 = 17장)
│   ├── stamp-opinion.png
│   ├── stamp-informative.png
│   ├── stamp-narrative.png
│   ├── stamp-transition.png
│   ├── stamp-sensory.png
│   ├── stamp-letter.png
│   ├── stamp-howto.png
│   ├── stamp-compare.png
│   ├── stamp-bookreport.png
│   ├── stamp-dialogue.png
│   ├── stamp-powerup.png
│   ├── stamp-emotions.png
│   ├── stamp-special-first.png
│   ├── stamp-special-10.png
│   ├── stamp-special-50.png
│   ├── stamp-special-100.png
│   └── stamp-special-complete.png
│
├── badges/                      ← 뱃지 (5장)
│   ├── badge-lv1-matisse-beginner.png
│   ├── badge-lv2-matisse-explorer.png
│   ├── badge-lv3-lincoln-learner.png
│   ├── badge-lv4-lincoln-writer.png
│   └── badge-lv5-lincoln-master.png
│
└── ui/                          ← UI 요소 (필요 시 추가)
    ├── btn-submit.png
    ├── btn-hint.png
    ├── scroll-frame.png
    ├── letter-frame.png
    └── mailbox-icon.png
```

### 이미지 후처리 단계

1. **나노바나나에서 생성** → 원본 다운로드
2. **배경 제거** (캐릭터/스탬프만):
   - [remove.bg](https://www.remove.bg/) 무료 사용
   - 또는 Canva의 배경 제거 기능
3. **크기 조정**:
   - Windows: 그림판 또는 [IrfanView](https://www.irfanview.com/)
   - 온라인: [Squoosh](https://squoosh.app/) (WebP 변환 겸용)
4. **위 체크리스트의 파일명으로 저장**
5. **해당 폴더에 넣기**

---

## 6. 생성 팁 & 워크플로우

### 일관성 유지 비법

1. **한 세션에서 연속 생성** — Gemini가 이전 이미지의 스타일을 기억합니다
2. **첫 이미지가 마음에 들면** → `"Same style as the previous image, but now..."` 로 이어가기
3. **캐릭터 레퍼런스** → 유나 기본 이미지를 먼저 생성하고, 이후 `"Same character as before, now in [new pose]"`
4. **색상 코드 명시** → 매번 핵심 색상 (#FFB6D9, #C8A2FF 등)을 프롬프트에 포함
5. **부정 지시 활용** → `"No dark colors, no scary elements, no realistic style, no text"`

### 권장 생성 순서

| 단계 | 세션 | 생성 내용 | 예상 장수 |
|------|------|----------|----------|
| 1 | 세션 A | 유나 기본 포즈 (스타일 확정) | 1장 |
| 2 | 세션 A | 유나 나머지 포즈 (일관성 활용) | 9장 |
| 3 | 세션 B | 친구 캐릭터 6명 | 18장 |
| 4 | 세션 C | 오리지널 포니 캐릭터 | 6장 |
| 5 | 세션 D | 요정 + 고양이 캐릭터 | 10장 |
| 6 | 세션 E | 배경 4장소 | 12장 |
| 7 | 세션 F | 스탬프 + 뱃지 | 22장 |
| | | **합계** | **약 78장** |

### 재생성이 필요할 때

스타일이 달라졌다면:
```
Please regenerate in the exact same style as [첫 번째 유나 이미지].
Same color palette: pastel pink, lavender, mint, sky blue.
Same line weight and shading style. Same eye size and proportion.
[원래 프롬프트 내용]
```

### 유용한 추가 지시어

| 상황 | 추가 프롬프트 |
|------|-------------|
| 배경 제거 원할 때 | `Transparent background, isolated character, no background elements.` |
| 더 단순하게 | `Simple flat design, minimal details, clean lines.` |
| 더 반짝이게 | `Extra sparkles, glitter effects, magical glow, lens flare stars.` |
| 여러 캐릭터 함께 | `Group illustration, all characters together, consistent size proportions.` |
| 정면 뷰 | `Front-facing view, symmetrical, looking at viewer.` |
| 아이콘 스타일 | `Icon style, centered, circular frame, bold outlines, no background.` |
