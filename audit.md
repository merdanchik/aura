# State-of-the-Prototype Report — Aura
*Аудит текущего состояния. Без изменений кода.*
*Дата: 2026-04-10*

---

## 1. Project Snapshot

| | |
|---|---|
| **Tech stack** | React 18 + TypeScript, Vite 6.3.5, Tailwind 4, Framer Motion 12, React Router 7, Radix UI |
| **Entry point** | `/src/main.tsx` → `App.tsx` → `AuraProvider` + `RouterProvider` |
| **Default route** | `/` → redirect → `/scenarios` (OverviewCanvas) |
| **State** | React Context (AuraContext) + local `useState` per screen. Нет persistence. |
| **Data** | Полностью моковые, статические, захардкоженные в JS |
| **Деплой** | GitHub Pages SPA, base `/aura/`, есть 404-redirect script |
| **Telegram** | SDK подключён (`@telegram-apps/sdk`), `telegram.ts` bridge есть, но SDK в UI **не используется** |

---

## 2. File Structure Overview

```
/src
├── main.tsx                          # createRoot → App
├── assets/                           # Все иконки, аватар, SVG слои сердца
│   ├── avatar.jpg
│   ├── heart.svg + heart-layer-{1-6}.svg
│   ├── node-*.jpg                    # Люди/места для interest nodes (Launcher)
│   └── {hash}.png × 5               # Иконки сервисов (music, kinopoisk, market, books, split)
├── styles/
│   ├── index.css                     # Импортирует всё
│   ├── theme.css                     # CSS-переменные: oklch + light/dark mode
│   ├── tailwind.css                  # Tailwind directives
│   └── fonts.css
└── app/
    ├── App.tsx                       # Router + Shell + AuraProvider
    ├── telegram.ts                   # Telegram WebApp bridge
    ├── context/
    │   └── AuraContext.tsx           # Единственный global store
    └── components/
        ├── Dashboard.tsx             # Home screen (Heart + сервисы + табы)
        ├── LauncherScreen.tsx        # Legacy v1 (ноды + периоды)
        ├── ServiceDetail.tsx         # Детальный экран сервиса
        ├── ChatScreen.tsx            # Chat + Wolf + FakeKeyboard
        ├── AuraRings.tsx             # SVG-кольца (full + mini)
        ├── figma/
        │   └── ImageWithFallback.tsx
        ├── scenarios/
        │   ├── types.ts              # SCENARIOS[], FAR_SCENARIOS[]
        │   ├── OverviewCanvas.tsx    # Главный экран прототипа (события + аватар)
        │   ├── ScenarioDetail.tsx    # Роутер + swipe wrapper для world detail
        │   ├── WorldWidgets.tsx      # Bottom sheet: 5 world cards
        │   ├── ContentWorldDetail.tsx  # Единственный со state machine (active/cooling/quiet)
        │   ├── MusicWorldDetail.tsx
        │   ├── CinemaWorldDetail.tsx
        │   ├── ShoppingWorldDetail.tsx
        │   └── TravelWorldDetail.tsx
        └── ui/                       # ~60 Radix UI primitives (почти не кастомизированы)
```

---

## 3. Current IA / User Flow

**Стартовый экран:** `/scenarios` → `OverviewCanvas`

```
OverviewCanvas (стартовый экран)
│
├─ TAP event orb (6 штук, полярное расположение)
│    └─→ ChatScreen  (/chat/{chatContextId})
│         └─ Любой тап по FakeKeyboard → закрыть (navigate(-1))
│
├─ TAP центральный аватар
│    └─→ WorldWidgets (bottom sheet, 5 worlds)
│         └─ TAP world card
│              └─→ ScenarioDetail (/scenarios/{id})
│
└─ Тихий переход на /app (Dashboard)
     [Нет явного CTA — пользователь должен знать об этом роуте]

ScenarioDetail (/scenarios/:id)
│
├─ SWIPE LEFT/RIGHT → соседний world
├─ BACK button → OverviewCanvas
└─ Каждый world detail рендерит свой компонент

Dashboard (/app)  [Отдельная ветка, не связана с scenarios визуально]
│
├─ HeartAura (центр экрана)
├─ ServiceGrid (2×3, 6 сервисов)
│    └─ TAP service → ServiceDetail (/app/service/:id)
│         └─ TAP action → ChatScreen (/app/service/:id/chat/:actionId)
│              └─ Тап FakeKeyboard → performAction() + navigate(-1)
│
├─ Tabs: Services | Friends | Partners | Know
│    ├─ Services: полный список сервисов + scores
│    ├─ Friends: ID card + interest tags + privacy toggles
│    ├─ Partners: access request flow (Lamoda, Иви, М.Видео)
│    └─ Know: swipeable cards (10 штук)
│
└─ Header dropdown (аватар) → "Strong Aura" toggle → все scores → 99

/legacy → LauncherScreen  [Только через прямой URL или ссылку снизу OverviewCanvas]
│
├─ Period selector (10 месяцев, Jul'24 → Apr'25)
├─ Canvas с interest nodes (physics layout, period-weighted)
└─ Memory cards + Insight cards
     └─ TAP → ChatScreen (/chat/{contextId})
```

**Два фактически несвязанных flow:**
- `/scenarios` — event-first, worlds-centric (текущий default)
- `/app` — service-first, metrics-centric (полный продуктовый прототип)

Переход между ними **не встроен в UX** — нет навигационного бара, нет кросс-ссылок.

---

## 4. Screen-by-Screen Breakdown

### OverviewCanvas (`scenarios/OverviewCanvas.tsx`)
- Центральный аватар (статичный `avatar.jpg`)
- 6 event orbs (полярное расположение по `angleDeg`), каждый: label + sub (сервис) + цвет + вес
- 4 "far ambient signals" (дальше, меньше, пульсируют) — декоративные, не кликабельны
- SVG-арки от центра к каждому orb
- Хинт внизу: "нажми на аватар → миры"
- Ссылка `/legacy` внизу справа (v1)
- **Нет**: freshness индикаторов, временных меток, world summary без перехода

### ScenarioDetail (`scenarios/ScenarioDetail.tsx`)
- Wrapper, роутит на нужный WorldDetail по `id`
- Swipe left/right (touch events) переключает между соседними worlds из `SCENARIOS`
- Back button → navigate(-1)
- Сам не рендерит контент — только контейнер

### ContentWorldDetail (`scenarios/ContentWorldDetail.tsx`) — *самый развитый*
- Единственный с **state machine**: `active | cooling | quiet`
- Переключатель состояний виден в UI (3 кнопки), но это demo-only, не вычисляется из данных
- Каждое состояние: статус-dot + headline + body + domain bars (Музыка/Кино/Книги с fill 0–1) + experiences + signals
- Секция "Источники": иконки сервисов + конкретные факты ("127 прослушиваний за 2 недели")
- **Это самый близкий к целевой концепции экран** — уже есть hero, state, sources с contribution

### MusicWorldDetail / CinemaWorldDetail / ShoppingWorldDetail / TravelWorldDetail
- Схожая структура с ContentWorldDetail, но **только одно состояние (de facto active)**
- Domain bars, experiences, sources — всё статично
- Нет переключателя состояний
- Технически повторяют pattern ContentWorldDetail без state machine

### Dashboard (`Dashboard.tsx`)
- HeartAura: 6 PNG-слоёв сердца, анимированные Framer Motion, hue-rotate при "Strong Aura"
- Scores отображены (knowledgeScore, trustScore) но только в ServiceDetail, не на Home
- Tab "Services": список всех 11 сервисов с AuraRingsMini (36px), scores и clickable
- Tab "Friends": ID card с кольцами + аватар + interest tags + privacy toggles (локальный state)
- Tab "Partners": full access request flow (3 партнёра, statuses: pending/granted/denied)
- Tab "Know": 10 swipeable карточек (drag gesture, spring physics, с tilt)
- **Нет event-first структуры** — Home показывает heart, но не события дня

### ServiceDetail (`ServiceDetail.tsx`)
- Hero: gradient background из service.color, AuraRings (200px), иконка сервиса, статус-текст
- Список actions: clickable, animated, с boost preview (knowledgeBoost / trustBoost)
- Completed actions серые, некликабельны
- Status text: функция `getStatusText(score)` — 5 порогов, строковый маппинг
- **Проблема**: статус основан на score, а не на temporal логике

### ChatScreen (`ChatScreen.tsx`)
- Wolf creature (SVG/PNG, animated float)
- Gradient bubble с текстом сообщения (цвет из сервиса или context)
- Blinking cursor + placeholder
- FakeKeyboard: iOS layout, любой тап → `handleComplete()` → `performAction()` + navigate(-1)
- ACTION_STARTERS: 66 entries (по одной на каждый action всех сервисов)
- CONTEXT_CHATS: ~50 entries (memories, insights, incident, experiences из Launcher)

### LauncherScreen (`LauncherScreen.tsx`)
- Period selector (горизонтальный scroll, 10 месяцев)
- Canvas-based nodes (physics-based layout через custom layout algorithm, не canvas API)
- Nodes меняют размер/видимость по выбранному периоду (`periodWeight`)
- Memory cards (3) + Insight cards (3) — статичные
- `_sessionPeriodIndex` — сессионная переменная (не React state, module-level)
- Технически богатый экран, но **не входит в основной flow**

### WorldWidgets (`scenarios/WorldWidgets.tsx`)
- Bottom sheet (spring animation, backdrop)
- 5 world cards: label + sub + status badge + insight + 3 stats
- Клик на карточку → navigate к ScenarioDetail
- Status badge: цвет + текст ("активен сейчас", "в потоке")

---

## 5. Code Architecture

### Routing (App.tsx)
```
/               → redirect /scenarios
/legacy         → LauncherScreen
/scenarios      → OverviewCanvas
/scenarios/:id  → ScenarioDetail
/app            → Shell > Dashboard
/app/service/:id → Shell > ServiceDetail
/app/service/:id/chat/:actionId → Shell > ChatScreen
/chat/:contextId → Shell > ChatScreen  [без Shell header]
```
Shell — layout wrapper (sticky header + `<Outlet>`). Header показывается не на всех роутах.

### State Management
**AuraContext** — единственный global store:
- `services: Record<ServiceId, ServiceData>` — 11 сервисов со scores и actions
- `globalTrustScore`, `globalKnowledgeScore`, `overallScore` — computed averages
- `theme: AuraTheme` — computed из overallScore (5-stop interpolation + lerp)
- `strongAura: boolean` — demo toggle (все scores → 99)
- `performAction(serviceId, actionId)` — мутирует scores, флипает `completed`
- `undoAction` — обратная операция (есть в контексте, но нигде не вызывается в UI)
- `triggerEvent(type)` — есть в типах, но **не реализована**
- `getServiceTheme(id)` — per-service theme (используется в ServiceDetail)

Весь остальной state — локальный `useState` внутри компонентов.

### Theme Computation
```
overallScore → themeStops[0..4] → lerp → AuraTheme
trustScore   → bgStops[0..4]   → lerp → bg color
```
5 хардкоженных stops: 0%, 25%, 50%, 75%, 100%. Каждый stop: `primary`, `light`, `soft`, `bg`, `g1`, `g2`, `flowerLayers[4]`. Функция `lerpColor()` — linear RGB interpolation.

### Styling
- Inline styles: доминируют в domain-компонентах (Dashboard, OverviewCanvas, WorldDetails)
- Tailwind: только утилитарные классы (padding, margin, flex, grid)
- CSS-переменные (theme.css): базовые цвета + dark mode (не используются интенсивно в domain UI)
- Radix UI (`/ui/`): ~60 файлов примитивов, кастомизация минимальна

### Icons
```tsx
const serviceIconMap: Record<ServiceId, string> = {
  music: iconBooks,     // ← БАГ: music получает иконку books
  books: iconMusic,     // ← БАГ: books получает иконку music
  market: iconMarket,
  kinopoisk: iconKino,
  split: iconSplit,
};
// afisha, taxi, pay, scooters, food, travel — иконок нет
```

---

## 6. Data Model / Mock Data

### ServiceData (AuraContext.tsx)
```ts
interface ServiceData {
  id: ServiceId;               // 'music' | 'kinopoisk' | ... (11 штук)
  name: string;                // "Яндекс Музыка"
  color: string;               // "#E03366"
  knowledgeScore: number;      // 0-100
  trustScore: number | null;   // 0-100 или null (у music = null)
  actions: Action[];
}

interface Action {
  id: string;                  // 'm1', 'm2', ..., 'tr6'
  title: string;
  description: string;
  knowledgeBoost?: number;
  trustBoost?: number;
  completed: boolean;
  type: 'knowledge' | 'trust';
}
```

**Нет полей:**
- `timestamp` / `lastActivity` / `updatedAt`
- `status` / `state` (active/cooling/quiet)
- `period` / `decay`
- `freshness`
- `sources[]`

Все freshness-related сущности захардкожены **отдельно** в WorldDetail-компонентах, никак не связаны с ServiceData в AuraContext.

### EventOrb (OverviewCanvas.tsx)
```ts
interface EventOrb {
  id: string;
  label: string;
  sub: string;          // Название сервиса (текст, не ссылка на ServiceData)
  img: string | null;
  color: string;
  chatContextId: string;
  angleDeg: number;
  weight: number;
}
```
Events не связаны с ServiceData — `sub` это просто строка "Яндекс Музыка", не `ServiceId`.

### WorldWidget (WorldWidgets.tsx)
```ts
interface WorldWidget {
  id: string;
  label: string;
  sub: string;
  color: string;
  status: string;       // "активен сейчас" — хардкод
  statusColor: string;
  insight: string;      // Хардкод, не вычисляется
  stats: string[];      // ["127 прослушиваний", ...] — хардкод
}
```

### InterestNode (LauncherScreen.tsx)
```ts
interface InterestNode {
  id: string;
  label: string;
  type: 'text' | 'blob' | 'symbol';
  weight: number;              // Base weight 0-1
  color: string;
  image?: string;
  periods: string[];           // ['2024-07', '*', ...]
  periodWeight?: Record<string, number>;  // ← единственный temporal data
}
```
**`periodWeight`** — единственное место в проекте, где есть временная динамика данных. Это бесценный паттерн для freshness.

### ContentWorldDetail States
```ts
type WorldState = 'active' | 'cooling' | 'quiet';

const STATE_DATA: Record<WorldState, StateData> = {
  active:  { status, hero, experiences, signals },
  cooling: { ... },
  quiet:   { ... },
};
```
Это прямой прообраз freshness language, но данные статичны и переключаются вручную.

### Что захардкожено в JSX vs вынесено в data objects

| Элемент | Data object | JSX |
|---|---|---|
| Services (11) | ✓ AuraContext | |
| Actions (66) | ✓ AuraContext | |
| Action starter messages (66) | ✓ `ACTION_STARTERS` | |
| Context messages (~50) | ✓ `CONTEXT_CHATS` | |
| Events (6) | ✓ `EVENTS[]` | |
| Worlds (5) | ✓ `WORLDS[]` | |
| Scenarios (5) | ✓ `SCENARIOS[]` | |
| Know cards (10) | ✓ `KNOW_CARDS[]` | |
| Interest nodes (40+) | ✓ `NODES[]` | |
| Domain bars (per world) | | ✓ Inline в компоненте |
| Experiences (per world) | | ✓ Inline в компоненте |
| Sources (per world) | | ✓ Inline в компоненте |
| Status text thresholds | | ✓ `getStatusText()` switch |
| World state data (active/cooling/quiet) | ✓ `STATE_DATA` | |

Архитектура неоднородная: верхний уровень (services, events) — data objects; детали world (experiences, sources, bars) — локальные массивы внутри компонентов.

### Все сущности в проекте

**Services (11):** `music, kinopoisk, books, market, split, taxi, pay, scooters, food, afisha, travel`

**Actions (66 total):** ids `m1–m6`, `k1–k6`, `b1–b6`, `mk1–mk6`, `sp1–sp5`, `tx1–tx5`, `py1–py5`, `sc1–sc5`, `fd1–fd6`, `af1–af5`, `tr1–tr6`

**Events (6):** `kind-of-blue, nils-frahm, the-bear, tbilisi, air-max, karamazov`

**Worlds (5):** `content, music, cinema, shopping, travel`

**Scenarios (5):** `content, music, cinema, shopping, travel`

**Far scenarios (4, декоративные):** `Здоровье, Еда, Книги, Работа`

**Interest nodes (40+):** `jazz, tokyo, stoicism, night-drives, architecture, cinema, radiohead, books, coffee, sushi, baikal, wimbledon, moon-safari, euro2024, vinyl, ramen, wabi-sabi, brodsky, sunrise-run, garage, istanbul, ...`

**Context chats (~50):** memories (`mem-kinopoisk`, `mem-music`, ...), insights (`ins-music`, `ins-kinopoisk`, ...), incidents (`incident-scooters`), experiences (`jazz`, `tokyo`, `baikal`, ...)

---

## 7. Visual System Status

### Сильные стороны
- **HeartAura** — по-настоящему красивый центральный артефакт. 6 PNG-слоёв, hue-rotate, pulse animation. Ощущение живого, эмоционального объекта.
- **AuraRings** — чистый SVG, анимация stroke-dashoffset, dual-ring concept (knowledge outer, trust inner) хорошо считывается.
- **Theme interpolation** — плавная смена цвета под score, включая background. Тонко, premium.
- **OverviewCanvas** — орбиты вокруг аватара, арки, ambient signals — хорошая метафора "аура вокруг человека".
- **ContentWorldDetail** — полноценный world detail с hero, bars, experiences, sources, freshness states. Ближе всего к целевому Apple Fitness-style экрану.
- **FakeKeyboard** — убедительная iOS-имитация, создаёт ощущение живого диалога.
- **WorldWidgets bottom sheet** — spring animation, backdrop, handle bar — feels native.
- **Know cards** — swipe + spring + tilt — отличный тактильный паттерн.

### Где интерфейс ближе к Apple Fitness
- ContentWorldDetail: hero state + domain bars + contribution language ("что это даёт")
- ServiceDetail: кольца + status + конкретные actions
- WorldWidgets: компактные cards со status badge и одной строкой insight

### Где ещё нет
- **Dashboard Home** не event-first: показывает heart + service grid, а не "что происходит сейчас"
- **OverviewCanvas** — визуально красив, но нет freshness indication на самих orbs (у Apple Watch осложнения всегда несут state)
- **Sources** в большинстве world details не как contribution layer, а как просто логотипы
- **Status language** непоследовательна: в ContentWorldDetail "активен сейчас", в Dashboard — score numbers, в ServiceDetail — "прогресс заморожен"
- **Декоративность**: Wolf creature в ChatScreen, ambient far signals в OverviewCanvas — работают на атмосферу, но не несут информацию

### Service icons
Только 5 из 11 сервисов имеют иконки (и две из них перепутаны). Остальные 6 рендерятся без иконки или с initials.

---

## 8. Gaps vs Target Architecture

Целевое направление: Home event-first → tap avatar → world widgets → world detail (hero/state + "Что это даёт" + Sources) → sources как service + concrete contribution → единый freshness language (активно/остывает/тихо) → сервисы как source layer, не центр.

### Что уже есть и можно переиспользовать

| Элемент | Где | Статус |
|---|---|---|
| Freshness states (active/cooling/quiet) | `ContentWorldDetail.tsx` | ✓ Реализован полностью, но только для Content |
| World detail structure (hero + bars + experiences + sources) | Все 5 `*WorldDetail.tsx` | ✓ Есть, данные статичны |
| Sources как service + contribution | `ContentWorldDetail.tsx` (частично другие) | ✓ Паттерн есть, непоследователен |
| WorldWidgets bottom sheet от аватара | `WorldWidgets.tsx` + `OverviewCanvas.tsx` | ✓ Flow аватар → worlds уже работает |
| Event orbs на Home | `OverviewCanvas.tsx` | ✓ 6 event orbs, нет freshness |
| Status badge (dot + label) | `WorldWidgets.tsx`, `ContentWorldDetail.tsx` | ✓ Визуально готов |
| Period-weighted temporal data | `LauncherScreen.tsx` nodes | ✓ Паттерн есть, изолирован в legacy |
| Service icons | `serviceIconMap` в нескольких местах | ✓ Есть (частично), два перепутаны |
| `performAction` + score mutation | `AuraContext.tsx` | ✓ Работает |

### Что есть, но в неправильной роли

| Элемент | Текущая роль | Нужная роль |
|---|---|---|
| Services (11 entities) | Центр Dashboard, главный CTA | Source layer в world details |
| Dashboard Home | Service grid + heart | Event feed / что происходит сейчас |
| HeartAura | Центр Dashboard | Может остаться, но не как primary navigation |
| Score numbers (knowledge/trust) | Hero в ServiceDetail | Вспомогательные, не primary |
| OverviewCanvas event orbs | Просто кликабельные объекты → chat | Event tiles с freshness → world detail |
| ActionList в ServiceDetail | Список задач для пользователя | Contribution signals (что сервис уже знает) |

### Чего вообще нет

| Элемент | Нужно для цели |
|---|---|
| `timestamp` / `lastActivity` в ServiceData | Основа freshness вычислений |
| Computed freshness state из данных | Сейчас только хардкод в ContentWorldDetail |
| Единый freshness vocabulary в одном месте | Разброс по компонентам |
| "Что это даёт" секция в world details | Нет явной value-prop секции |
| Navigation bar (scenarios ↔ app) | Два flow не связаны |
| Sources с `serviceId` ссылкой | Sources — просто текст/иконка, нет связи с ServiceData |
| Freshness indication на event orbs | На orbs нет статуса |

### Что можно перестроить малой кровью

1. **ContentWorldDetail → шаблон для остальных world details.** Просто перенести `STATE_DATA` pattern + state switcher в Music/Cinema/Shopping/Travel. Компоненты однотипны.
2. **Event orbs → добавить status badge.** В `EVENTS[]` добавить `freshness: 'active' | 'cooling' | 'quiet'`, в `OverviewCanvas.tsx` добавить dot.
3. **WorldWidgets → freshness badge** по `statusColor` уже есть, просто нужна реальная логика подачи.
4. **serviceIconMap** — исправить swap (2 строки).
5. **"Что это даёт" секция** — добавить в существующие WorldDetail компоненты как новую секцию, не меняя структуру.

---

## 9. Reusable Parts

| Компонент / Data | Можно переиспользовать как | Файл |
|---|---|---|
| `ContentWorldDetail` STATE_DATA pattern | Шаблон для freshness в всех worlds | `scenarios/ContentWorldDetail.tsx` |
| `WorldWidgets` | Работает, нужна только data-driven подача | `scenarios/WorldWidgets.tsx` |
| `AuraRings` / `AuraRingsMini` | Везде где нужен score visualizer | `AuraRings.tsx` |
| STATUS_BADGE pattern (dot + label + glow) | Freshness indicator | `ContentWorldDetail.tsx` |
| `SCENARIOS[]` + `ScenarioDetail` swipe | Готовый world navigation | `types.ts` + `ScenarioDetail.tsx` |
| `EVENTS[]` + orb layout | Event feed (нужно только обогатить) | `OverviewCanvas.tsx` |
| `action.knowledgeBoost/trustBoost` | Contribution signal (уже есть поля) | `AuraContext.tsx` |
| `periodWeight` pattern | Temporal decay/freshness formula | `LauncherScreen.tsx` (изолировано) |
| `CONTEXT_CHATS` / `ACTION_STARTERS` | Богатый контентный слой для чатов | `ChatScreen.tsx` |
| `lerpColor()` + themeStops | Score-to-color system | `AuraContext.tsx` |

---

## 10. Risky Parts

| Файл / Компонент | Почему опасно | Что может сломаться |
|---|---|---|
| `AuraContext.tsx` → `computeTheme()` | Score interpolation, 5-stop lerp — хрупко | Весь цветовой theme сайта |
| `Dashboard.tsx` → HeartAura | 6 PNG слоёв + hue-rotate + 6 keyframes | Главный визуальный артефакт |
| `LauncherScreen.tsx` | `_sessionPeriodIndex` — module-level var, не React state | Глобальный side effect |
| `serviceIconMap` | Два значения перепутаны | Визуальная регрессия везде где иконки |
| `AuraRings.tsx` | SVG stroke-dashoffset animation, радиус вычисляется из size prop | Layout breaks при нестандартном size |
| `ScenarioDetail.tsx` | Touch events для swipe — ручная реализация, не Framer | Конфликты с браузерными gestures |
| `ChatScreen.tsx` → `CONTEXT_CHATS` + `ACTION_STARTERS` | 66 + 50 захардкоженных records | При переименовании actions/contexts — расходится |
| `vite.config.ts` → `figmaAssets()` plugin | Нестандартный Vite plugin, resolves `figma:asset/*` | Всё упадёт если plugin не загружен |
| `Shell` header логика | Условные checks на pathname для показа/скрытия header | Хрупко при добавлении новых роутов |

---

## 11. Recommended Starting Points for Next Iteration

### 10 важнейших наблюдений

1. **ContentWorldDetail — самый готовый экран к целевой концепции.** Есть hero, state machine (active/cooling/quiet), domain bars, sources с contribution. Остальные 4 world details нужно привести к тому же формату.

2. **Два отдельных flow (`/scenarios` и `/app`) не связаны никакой навигацией.** Пользователь в demo не знает, что `/app` существует. Это не архитектурный долг — это просто незаконченность.

3. **Freshness vocabulary уже есть в data** (WorldWidgets.statusColor, ContentWorldDetail states), но не вычисляется — везде хардкод. Нет ни одного поля `timestamp` или `lastActivity` в ServiceData.

4. **Services сейчас — это главные экраны, а не source layer.** В целевой модели сервисы должны появляться только как "откуда эти данные", а не как навигационные точки.

5. **Event orbs в OverviewCanvas — событийная метафора работает**, но сами orbs не несут freshness-state. Нет ни dot, ни relative time, ни decay indication.

6. **`serviceIconMap` содержит баг**: music и books иконки перепутаны местами.

7. **`periodWeight` в Launcher — единственная реальная temporal data в проекте.** Паттерн (entity + weight per period) — прямой прообраз freshness decay модели.

8. **`undoAction` и `triggerEvent`** есть в AuraContext, но нигде не вызываются.

9. **World details содержат sources как inline массивы** — не связаны с `ServiceData` в AuraContext. Sources и services — параллельные, несвязанные структуры.

10. **Know cards (tab "Know" в Dashboard)** — визуально сильный паттерн для "что Аура про тебя знает". Никак не подключён к остальной системе.

### 8 ограничений обязательно учитывать

1. **Не ломать HeartAura** — это эмоциональный core прототипа, хрупкая анимационная система.
2. **AuraContext — единственный store**: любые новые сущности (freshness, timestamps) нужно добавлять сюда, а не создавать второй контекст.
3. **`figma:asset/` imports** — нельзя переносить assets без обновления vite plugin mapping.
4. **Telegram bridge** — любые изменения в routing или navigation must not break back-button logic.
5. **`_sessionPeriodIndex` в LauncherScreen** — module-level var, не React state. Если Launcher будет использоваться, это нужно отдельно учитывать.
6. **ScenarioDetail swipe** — ручные touch events, конфликтует с Framer Motion gestures на том же элементе.
7. **`CONTEXT_CHATS` keys** должны совпадать с `chatContextId` в EVENTS и SCENARIOS — любые переименования ломают chat routing.
8. **CSS-переменные в theme.css** почти не используются в domain компонентах — весь цвет передаётся через inline styles. Нельзя рассчитывать на theme.css как систему.

### Конкретные файлы для начала следующего pass

**Начинать здесь (малый риск, высокий impact):**
- `src/app/components/scenarios/ContentWorldDetail.tsx` — шаблон для других worlds, добавить "Что это даёт" секцию
- `src/app/components/scenarios/WorldWidgets.tsx` — сделать data-driven freshness status
- `src/app/components/scenarios/OverviewCanvas.tsx` → `EVENTS[]` — добавить поле `freshness`
- `src/app/context/AuraContext.tsx` → `ServiceData` — добавить `lastActivity: string | null`
- `src/app/components/scenarios/types.ts` — единственный файл с SCENARIOS[], чистый, безопасный

**Затем (средний риск):**
- `src/app/components/scenarios/MusicWorldDetail.tsx` и остальные — привести к формату ContentWorldDetail
- Любой файл где есть `serviceIconMap` — исправить icon swap (2 строки)
- `src/app/App.tsx` — добавить tab bar / navigation между `/scenarios` и `/app`

**Не трогать без явной необходимости:**
- `src/app/components/AuraRings.tsx`
- `src/app/context/AuraContext.tsx` → `computeTheme()` / `lerpColor()`
- `src/app/components/Dashboard.tsx` → HeartAura блок
- `vite.config.ts`
- `src/app/telegram.ts`
