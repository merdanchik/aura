import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ServiceId, useAura } from '../context/AuraContext';
import { motion } from 'motion/react';
import wolfImg from '../../assets/wolf.png';

const ACTION_STARTERS: Record<string, string> = {
  m1: 'какие треки цепляют тебя прямо сейчас, саша?',
  m2: 'расскажи, какие плейлисты слушаешь чаще всего?',
  m3: 'кого из исполнителей слушаешь постоянно?',
  m4: 'включи Мою Волну на полчасика — послушаем вместе?',
  m5: 'есть треки, которые раздражают? отмечай — не буду их ставить',
  m6: 'какая музыка тебя заряжает — рок, джаз, хип-хоп?',
  k1: 'расскажи, какие фильмы тебя впечатлили в последнее время?',
  k2: 'ты больше по триллерам или мелодрамам, саша?',
  k3: 'что давно хотел посмотреть, но всё руки не доходят?',
  k4: 'какой сериал недавно затянул тебя с головой?',
  k5: 'поделись — что думаешь о последнем просмотренном фильме?',
  k6: 'кто из актёров нравится — за кем следишь?',
  b1: 'что из прочитанного запомнилось больше всего?',
  b2: 'больше любишь фантастику или нон-фикшн, саша?',
  b3: 'оцени книги, которые уже читал — так пойму твой вкус',
  b4: 'есть книги, к которым хочется вернуться?',
  b5: 'хочешь, подберу тебе куратора с похожим вкусом?',
  b6: 'кто из авторов пишет так, что не оторваться?',
  mk1: 'расскажи немного о себе — чтобы скидки попадали точно в цель',
  mk2: 'что присматриваешь, но пока не купил?',
  mk3: 'как тебе последняя покупка — всё понравилось?',
  mk4: 'какой у тебя размер одежды, саша — помогу с подборкой',
  mk5: 'как твои прошлые заказы — всё дошло в порядке?',
  mk6: 'заказы получил? подтверди — это важно для нас',
  mk7: 'хочешь копить баллы с каждой покупки?',
  mk8: 'что покупаешь чаще всего — электроника, одежда, продукты?',
  s1: 'давай я тебя получше узнаю — займёт буквально минуту',
  s2: 'привяжи карту, чтобы оплаты проходили автоматически',
  s3: 'попробуй купить что-нибудь в рассрочку — это проще, чем кажется',
  s4: 'не забудь про платёж — давай напомню, когда будет нужно?',
  s5: 'подключи автоплатёж, чтобы больше не думать о датах',
  s6: 'расскажи немного о своих финансах — увеличу лимит',
  tx1: 'давай убедимся, что это ты — займёт секунду',
  tx2: 'подключи автооплату — после поездки всё пройдёт само',
  tx3: 'как последняя поездка, саша — всё прошло хорошо?',
  tx4: 'куда чаще всего едешь — домой или на работу?',
  tx5: 'какой класс авто предпочитаешь — комфорт или эконом?',
  tx6: 'кстати, заказы лучше не отменять — рейтинг пассажира растёт',
  py1: 'добавь карту — и оплата станет в один тап',
  py2: 'давай подтвердим твою личность — это повысит лимит платежей',
  py3: 'включи Face ID — оплата будет мгновенной и безопасной',
  py4: 'попробуй оплатить что-нибудь — первый раз всегда самый интересный',
  py5: 'хочешь, чтобы подписки списывались сами? подключи автоплатёж',
  py6: 'как тебе удобнее платить — картой, счётом или кешбэком?',
  sc1: 'пройди небольшой тест — убедимся, что едешь безопасно',
  sc2: 'не забудь вернуть самокат в зону — это важно для всех',
  sc3: 'сфоткай самокат на парковке — займёт секунду и плюс к рейтингу',
  sc4: 'нужно подтвердить возраст — без этого не выдам самокат :)',
  sc5: 'куда чаще катаешься, саша — в парк, на работу?',
  sc6: 'подключи автооплату — завершать поездку станет проще',
  fd1: 'что любишь больше — суши, пиццу или что-то домашнее?',
  fd2: 'есть что-то, что не ешь? скажи — не буду предлагать',
  fd3: 'как тебе последние заказы, саша — было вкусно?',
  fd4: 'куда чаще доставлять — домой или в офис?',
  fd5: 'расскажи про ресторан, где заказывал — понравилось?',
  fd6: 'есть место, куда хочется заказывать снова и снова?',
  af1: 'что привлекает больше — концерты, театры или выставки?',
  af2: 'присмотрел что-нибудь интересное на ближайшие выходные?',
  af3: 'как прошло мероприятие — стоило идти?',
  af4: 'кого из исполнителей хочешь увидеть живьём, саша?',
  af5: 'хочешь получать лучшее из афиши каждую неделю?',
  af6: 'есть места в городе, куда ходишь с удовольствием?',
  tr1: 'добавь паспорт — буду бронировать билеты в один клик',
  tr2: 'где любишь сидеть в самолёте — у окна или у прохода?',
  tr3: 'как отель в прошлой поездке — всё понравилось?',
  tr4: 'летаешь с какой-то авиакомпанией часто? добавь программу лояльности',
  tr5: 'есть пищевые ограничения в дороге — халяль, вегетарианское?',
  tr6: 'на путешествия обычно сколько закладываешь — расскажи, подберу варианты',
};

// Context chats (memories / insights) — no performAction needed
interface ContextChat { message: string; color: string }
const CONTEXT_CHATS: Record<string, ContextChat> = {
  // ── Launcher experience nodes ─────────────────────────────────────────────
  'jazz':         { color: '#BF5AF2', message: 'Kind of Blue. Запускаешь — и комната меняется.\nMiles Davis записал это за два дня. Ты слушаешь уже третий месяц.' },
  'tokyo':        { color: '#FF6633', message: 'Shinjuku в 23:00. Три этажа баров в одном переулке.\nДождь, но никто не уходит.' },
  'stoicism':     { color: '#5E5CE6', message: 'Марк Аврелий писал это для себя — не собирался публиковать.\nДве тысячи лет спустя ты читаешь в метро.' },
  'night-drives': { color: '#34C759', message: 'МКАД в три ночи. Почти пусто. Подкаст уже кончился.\nЕдешь в тишине. Это тоже хорошо.' },
  'architecture': { color: '#0A84FF', message: 'Клуб Русакова, 1929. Мельников строил так, будто знал, что архитектура умрёт вместе с ним.\nОна не умерла.' },
  'cinema':       { color: '#FF9F0A', message: 'Зеркало, Тарковский. Смотришь — не понимаешь.\nЧерез неделю понимаешь. Через год смотришь снова.' },
  'music-blob':   { color: '#FF375F', message: 'OK Computer. Creep. Paranoid Android.\nТри альбома — и они звучат иначе каждый год.' },
  'travel-blob':  { color: '#FF9F0A', message: 'Осака не притворяется. Токио — фасад. Осака — кухня.\nГромкая, жирная, честная.' },
  'tech-blob':    { color: '#0A84FF', message: 'Vision Pro. Надеваешь — мир раздваивается.\nСнимаешь — мир уже немного другой. $3499.' },
  'basketball':   { color: '#FF9500', message: 'Йокич получил мяч спиной к кольцу.\nОбернулся. Три секунды. Бросил. Попал. Как всегда.' },
  'f1':           { color: '#FF3B30', message: 'Монако, 26 мая 2024. Леклер — местный, гонялся здесь с детства.\nПервая победа на домашней трассе. Папа плакал на трибуне.' },
  'books':        { color: '#30D158', message: 'Герман Гессе. 1922. Сиддхартха уходит от отца искать себя.\nНаходит реку. Реку слушает.' },
  'coffee':       { color: '#C4945A', message: '6:00. Город ещё не проснулся. Ты уже у машины.\nЭспрессо — чтобы было не так тихо.' },
  'sushi':        { color: '#FF6633', message: 'Sukiyabashi Jiro. Очередь месяцами. Суши подают один за другим. Молча.\nДевяносто лет мастеру. Он до сих пор за стойкой.' },
  'baikal':       { color: '#00C7BE', message: 'Байкал в июле. Вода — четыре градуса. Заходишь всё равно.\nБерег каменистый. Горизонт без конца.' },
  'wimbledon':    { color: '#34C759', message: 'Центральный корт. Земляника со сливками.\nТишина перед подачей. Потом — аплодисменты.' },
  'moon-safari':  { color: '#FF9F0A', message: 'Air, Moon Safari. 1998. Французы сделали альбом про космос и летние вечера.\nДо сих пор работает.' },
  'euro2024':     { color: '#0A84FF', message: 'Финал. Испания — Англия, 2:1.\n86-я минута. Ояр Сабал. Свисток. Испания — чемпион Европы.' },
  'vinyl':        { color: '#BF5AF2', message: 'Blue Note 1568 — каталожный номер.\nArt Blakey & The Jazz Messengers, 1960. Нашёл в маленьком баре. Взял домой.' },
  'ramen':        { color: '#FF6633', message: 'Ichiran. Сидишь один в деревянной кабинке. Занавеска.\nНикаких разговоров. Только рамен.' },
  'wabi-sabi':    { color: '#C4945A', message: 'Wabi-sabi. Японская эстетика несовершенства.\nТреснувший стакан красивее нового. Почти веришь.' },
  'brodsky':      { color: '#5E5CE6', message: '«Ни страны, ни погоста не хочу выбирать».\nБродский написал это в двадцать два. Ты перечитываешь в тридцать.' },
  'sunrise-run':  { color: '#34C759', message: '5:45. Темно. Пробежка по набережной.\nНикто не видит — это только твоё.' },
  'garage':       { color: '#FF9F0A', message: 'Гараж. Парк Горького. Выставка о чём-то тяжёлом.\nВыходишь — и Москва кажется другой.' },
  'f1-2025':      { color: '#3A86FF', message: 'Мельбурн, март. Первая гонка года.\nФерстапен — с поула. Сзади никого. Ты понимаешь, что этот сезон будет таким же.' },
  'istanbul':     { color: '#FF6633', message: 'Стамбул. Паром через Босфор — двадцать минут, три лиры.\nАзия и Европа. Смотришь на оба берега одновременно.' },
  'nabokov':      { color: '#5E5CE6', message: 'Набоков. «Дар». Главный герой пишет книгу внутри книги.\nЧиташь — и не сразу понимаешь, где граница.' },
  'nick-cave':    { color: '#FF375F', message: 'Nick Cave & The Bad Seeds. «Push the Sky Away».\nОн поёт тихо. Это страшнее, чем если бы кричал.' },
  'bach-goldberg':{ color: '#BF5AF2', message: 'Гольдберг-вариации. Гульд записал их дважды — в 1955 и в 1981.\nВ 1981 он мурлыкал под запись. Слышно на всей дорожке.' },
  'rome':         { color: '#FF9F0A', message: 'Рим, ноябрь. Туристов мало. Трастевере почти пустой.\nКофе у Сан-Каллисто. Ты единственный иностранец за стойкой.' },
  'new-year':     { color: '#FF375F', message: '31 декабря. Последний час.\nВсё, что не сделал в этом году, уже не сделаешь.' },
  'ice-swim':     { color: '#00C7BE', message: 'Крещение. −10°. Прорубь в Серебряном Бору.\nТри секунды — и всё лишнее уходит.' },
  'severance':    { color: '#0A84FF', message: 'Severance. Работа — это работа. Жизнь — это жизнь.\nПервые два эпизода — и ты уже не уверен, что это плохая идея.' },
  'aus-open':     { color: '#34C759', message: 'Australian Open. Январь, Мельбурн — плюс сорок на корте.\nЛучший теннис года — потому что никто не ждал.' },
  'nils-frahm':   { color: '#BF5AF2', message: 'Nils Frahm. «Says». Фортепиано и синтезатор.\nНачинается тихо. Ты понимаешь, что прошло двадцать минут, только когда заканчивается.' },
  'kandinsky':    { color: '#FF9F0A', message: 'Кандинский. Он называл цвета нотами.\nСиний — труба. Жёлтый — фанфара. Смотришь — и почти слышишь.' },

  // ── Legacy context chats ───────────────────────────────────────────────────
  'mem-kinopoisk':   { color: '#2A6ECC', message: 'Неделя, когда ты не спал.\n\nСемь фильмов за семь ночей. Самый длинный — «Братья Блюз», 2 ч 13 мин.' },
  'mem-music':       { color: '#8C3FED', message: 'Один трек на repeat.\n\nNils Frahm — Says. 41 раз за месяц. Почти всегда после полуночи.' },
  'mem-food':        { color: '#C47A20', message: 'Дождливые пятницы.\n\nТри пятницы подряд — один и тот же заказ из «Мареа». Всегда около девяти вечера.' },
  'mem-blackfriday': { color: '#B86010', message: 'Шесть книг про Рим.\n\nВсё началось с «SPQR» Мэри Бирд. Последняя пришла вчера.' },
  'mem-taxi':        { color: '#1A5FCC', message: 'Утро понедельника.\n\nВ 9:14 — всегда один адрес. Льва Толстого, 16.' },
  'mem-electronic':  { color: '#CC3010', message: 'Фильм, к которому ты вернулся.\n\n«Трудности перевода» — третий раз за год. Всегда один, всегда поздно.' },
  'mem-travel':      { color: '#C47A10', message: 'Девять завтраков на двоих.\n\nСырники и два капучино. Всегда по субботам, до десяти утра.' },
  'mem-books':       { color: '#0077FF', message: 'осенний марафон — что из книг понравилось больше?' },
  'ins-music':      { message: 'электроника в пятницу вечером — это твоя традиция?',  color: '#E03366' },
  'ins-kinopoisk':  { message: 'аниме тебя удивило? что посмотрел в итоге?',          color: '#FF6600' },
  'ins-market':     { message: 'воскресные покупки — что обычно берёшь?',             color: '#FFCC00' },
  'ins-split':      { message: 'с оплатами всё окей, саша?',                          color: '#00C853' },
  'ins-books':          { message: 'утренний нон-фикшн — что читаешь сейчас?',     color: '#0077FF' },
  'incident-scooters':  { message: 'я сейчас разберусь, не переживай',              color: '#FF3B30' },
};

// Lighten a hex color by mixing with white
function lightenHex(hex: string, t = 0.45): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) + (255 - ((n >> 16) & 0xff)) * t));
  const g = Math.min(255, Math.round(((n >> 8) & 0xff) + (255 - ((n >> 8) & 0xff)) * t));
  const b = Math.min(255, Math.round((n & 0xff) + (255 - (n & 0xff)) * t));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// ── Standard-style iOS keyboard ───────────────────────────────
const KEY_H = 42;
const KEY_R = 6;
const KEY_GAP = 6;
const KB_PX = 6; // horizontal padding

const KEY: React.CSSProperties = {
  height: KEY_H,
  borderRadius: KEY_R,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 0 rgba(0,0,0,0.55)',
  userSelect: 'none',
  fontSize: 16,
  color: '#fff',
  flexShrink: 0,
};

const ROW1 = ['q','w','e','r','t','y','u','i','o','p'];
const ROW2 = ['a','s','d','f','g','h','j','k','l'];
const ROW3_MID = ['z','x','c','v','b','n','m'];

const FakeKeyboard: React.FC<{ onAnyTap: () => void }> = ({ onAnyTap }) => (
  <div
    onClick={onAnyTap}
    style={{ backgroundColor: '#1B1B1D', paddingTop: 8, paddingBottom: 4, flexShrink: 0 }}
  >
    {/* Row 1 — 10 equal keys */}
    <div style={{ display: 'flex', gap: KEY_GAP, paddingLeft: KB_PX, paddingRight: KB_PX, marginBottom: KEY_GAP }}>
      {ROW1.map(k => (
        <div key={k} style={{ ...KEY, flex: 1, backgroundColor: '#3A3A3C', fontWeight: 400 }}>{k}</div>
      ))}
    </div>

    {/* Row 2 — 9 keys, inset each side */}
    <div style={{ display: 'flex', gap: KEY_GAP, paddingLeft: 22, paddingRight: 22, marginBottom: KEY_GAP }}>
      {ROW2.map(k => (
        <div key={k} style={{ ...KEY, flex: 1, backgroundColor: '#3A3A3C', fontWeight: 400 }}>{k}</div>
      ))}
    </div>

    {/* Row 3 — shift + 7 letters + backspace */}
    <div style={{ display: 'flex', gap: KEY_GAP, paddingLeft: KB_PX, paddingRight: KB_PX, marginBottom: KEY_GAP }}>
      {/* Shift */}
      <div style={{ ...KEY, width: 44, backgroundColor: '#5A5A5C', fontSize: 17 }}>⇧</div>
      <div style={{ flex: 1 }} />
      {/* 7 letter keys */}
      {ROW3_MID.map(k => (
        <div key={k} style={{ ...KEY, flex: 1, backgroundColor: '#3A3A3C', fontWeight: 400 }}>{k}</div>
      ))}
      <div style={{ flex: 1 }} />
      {/* Backspace */}
      <div style={{ ...KEY, width: 44, backgroundColor: '#5A5A5C', fontSize: 17 }}>⌫</div>
    </div>

    {/* Row 4 — ABC | space | return↵ */}
    <div style={{ display: 'flex', gap: KEY_GAP, paddingLeft: KB_PX, paddingRight: KB_PX, marginBottom: 6 }}>
      <div style={{ ...KEY, width: 44, backgroundColor: '#5A5A5C', fontSize: 13, fontWeight: 500 }}>ABC</div>
      <div style={{ ...KEY, flex: 1, backgroundColor: '#3A3A3C' }} />
      <div style={{ ...KEY, width: 92, backgroundColor: '#007AFF', fontSize: 22, fontWeight: 300 }}>↵</div>
    </div>

    {/* Emoji / mic bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 14, paddingRight: 14, paddingTop: 4, paddingBottom: 10 }}>
      <span style={{ fontSize: 22 }}>🙂</span>
      <div style={{ width: 30, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <rect x="4" y="0" width="8" height="14" rx="4" fill="#8E8E93"/>
          <path d="M1 11c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <line x1="8" y1="18" x2="8" y2="21" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  </div>
);

// ── Chat screen ────────────────────────────────────────────────
export const ChatScreen = () => {
  const { id, actionId, contextId } = useParams<{ id?: string; actionId?: string; contextId?: string }>();
  const { services, performAction } = useAura();
  const navigate = useNavigate();

  // Context mode (memory / insight) vs service-action mode
  const ctx = contextId ? CONTEXT_CHATS[contextId] : null;

  const service = id ? services[id as ServiceId] : null;
  const messageText = ctx?.message ?? ACTION_STARTERS[actionId!] ?? 'привет, саша!';

  const handleComplete = () => {
    if (id && actionId) performAction(id as ServiceId, actionId);
    navigate(-1);
  };

  const c1 = ctx?.color ?? service?.color ?? '#5E5CE6';
  const c2 = lightenHex(c1, 0.5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Top nav — only × ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 8px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#2C2C2E',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', paddingTop: 12 }}>
        {/* Creature */}
        <motion.img
          src={wolfImg}
          alt=""
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 190, height: 190, objectFit: 'contain', flexShrink: 0 }}
        />

        {/* Gradient message */}
        <p style={{
          marginTop: 16,
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1.4,
          textAlign: 'center',
          padding: '0 28px',
          whiteSpace: 'pre-line',
          background: `linear-gradient(150deg, ${c1} 0%, ${c2} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {messageText}
        </p>

        {/* Centered cursor + placeholder */}
        <div style={{ marginTop: 'auto', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: '#007AFF', fontSize: 22, lineHeight: 1, marginRight: 1 }}
          >
            |
          </motion.span>
          <span style={{ color: '#636366', fontSize: 17 }}>сказать что-то</span>
        </div>
      </div>

      {/* ── Keyboard ── */}
      <FakeKeyboard onAnyTap={handleComplete} />
    </motion.div>
  );
};
