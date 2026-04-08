import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ServiceId, useAura } from '../context/AuraContext';
import { motion } from 'motion/react';
import wolfImg from '../../assets/wolf.png';

const ACTION_STARTERS: Record<string, string> = {
  // Music
  m1: 'какие треки цепляют тебя прямо сейчас, саша?',
  m2: 'расскажи, какие плейлисты слушаешь чаще всего?',
  m3: 'кого из исполнителей слушаешь постоянно?',
  m4: 'давай послушаем что-нибудь вместе — включи Мою Волну на полчасика?',
  m5: 'есть треки, которые раздражают? отмечай — не буду их ставить',
  m6: 'какая музыка тебя заряжает — рок, джаз, хип-хоп?',
  // Kinopoisk
  k1: 'расскажи, какие фильмы тебя впечатлили в последнее время?',
  k2: 'ты больше по триллерам или мелодрамам, саша?',
  k3: 'что давно хотел посмотреть, но всё руки не доходят?',
  k4: 'какой сериал недавно затянул тебя с головой?',
  k5: 'поделись — что думаешь о последнем просмотренном фильме?',
  k6: 'кто из актёров нравится — за кем следишь?',
  // Books
  b1: 'что из прочитанного запомнилось больше всего?',
  b2: 'больше любишь фантастику или нон-фикшн, саша?',
  b3: 'оцени книги, которые уже читал — так пойму твой вкус',
  b4: 'есть книги, к которым хочется вернуться?',
  b5: 'хочешь, подберу тебе куратора с похожим вкусом?',
  b6: 'кто из авторов пишет так, что не оторваться?',
  // Market
  mk1: 'расскажи немного о себе — чтобы скидки попадали точно в цель',
  mk2: 'что присматриваешь, но пока не купил?',
  mk3: 'как тебе последняя покупка — всё понравилось?',
  mk4: 'какой у тебя размер одежды, саша — помогу с подборкой',
  mk5: 'как твои прошлые заказы — всё дошло в порядке?',
  mk6: 'заказы получил? подтверди — это важно для нас',
  mk7: 'хочешь копить баллы с каждой покупки?',
  mk8: 'что покупаешь чаще всего — электроника, одежда, продукты?',
  // Split
  s1: 'давай я тебя получше узнаю — займёт буквально минуту',
  s2: 'привяжи карту, чтобы оплаты проходили автоматически',
  s3: 'попробуй купить что-нибудь в рассрочку — это проще, чем кажется',
  s4: 'не забудь про платёж — давай напомню, когда будет нужно?',
  s5: 'подключи автоплатёж, чтобы больше не думать о датах',
  s6: 'расскажи немного о своих финансах — увеличу лимит',
  // Taxi
  tx1: 'давай убедимся, что это ты — займёт секунду',
  tx2: 'подключи автооплату — после поездки всё пройдёт само',
  tx3: 'как последняя поездка, саша — всё прошло хорошо?',
  tx4: 'куда чаще всего едешь — домой или на работу?',
  tx5: 'какой класс авто предпочитаешь — комфорт или эконом?',
  tx6: 'кстати, заказы лучше не отменять — рейтинг пассажира растёт',
  // Pay
  py1: 'добавь карту — и оплата станет в один тап',
  py2: 'давай подтвердим твою личность — это повысит лимит платежей',
  py3: 'включи Face ID — оплата будет мгновенной и безопасной',
  py4: 'попробуй оплатить что-нибудь — первый раз всегда самый интересный',
  py5: 'хочешь, чтобы подписки списывались сами? подключи автоплатёж',
  py6: 'как тебе удобнее платить — картой, счётом или кешбэком?',
  // Scooters
  sc1: 'пройди небольшой тест — убедимся, что едешь безопасно',
  sc2: 'не забудь вернуть самокат в зону — это важно для всех',
  sc3: 'сфоткай самокат на парковке — займёт секунду и плюс к рейтингу',
  sc4: 'нужно подтвердить возраст — без этого не выдам самокат :)',
  sc5: 'куда чаще катаешься, саша — в парк, на работу?',
  sc6: 'подключи автооплату — завершать поездку станет проще',
  // Food
  fd1: 'что любишь больше — суши, пиццу или что-то домашнее?',
  fd2: 'есть что-то, что не ешь? скажи — не буду предлагать',
  fd3: 'как тебе последние заказы, саша — было вкусно?',
  fd4: 'куда чаще доставлять — домой или в офис?',
  fd5: 'расскажи про ресторан, где заказывал — понравилось?',
  fd6: 'есть место, куда хочется заказывать снова и снова?',
  // Afisha
  af1: 'что привлекает больше — концерты, театры или выставки?',
  af2: 'присмотрел что-нибудь интересное на ближайшие выходные?',
  af3: 'как прошло мероприятие — стоило идти?',
  af4: 'кого из исполнителей хочешь увидеть живьём, саша?',
  af5: 'хочешь получать лучшее из афиши каждую неделю?',
  af6: 'есть места в городе, куда ходишь с удовольствием?',
  // Travel
  tr1: 'добавь паспорт — буду бронировать билеты в один клик',
  tr2: 'где любишь сидеть в самолёте — у окна или у прохода?',
  tr3: 'как отель в прошлой поездке — всё понравилось?',
  tr4: 'летаешь с какой-то авиакомпанией часто? добавь программу лояльности',
  tr5: 'есть пищевые ограничения в дороге — халяль, вегетарианское?',
  tr6: 'на путешествия обычно сколько закладываешь, саша — расскажи, подберу варианты',
};

// ── Fake iOS keyboard ──────────────────────────────────────────
const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['⇧','z','x','c','v','b','n','m','⌫'],
];

const FakeKeyboard: React.FC<{ onAnyTap: () => void }> = ({ onAnyTap }) => (
  <div
    onClick={onAnyTap}
    style={{ backgroundColor: '#1A1A1C', paddingBottom: 20, userSelect: 'none', flexShrink: 0 }}
  >
    {/* Top thin separator */}
    <div style={{ height: 1, backgroundColor: '#3A3A3C', marginBottom: 8 }} />

    {/* Letter rows */}
    {ROWS.map((row, ri) => (
      <div
        key={ri}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 10,
          paddingLeft: ri === 1 ? 20 : ri === 2 ? 0 : 0,
          paddingRight: ri === 1 ? 20 : ri === 2 ? 0 : 0,
        }}
      >
        {row.map(key => {
          const isSpecial = key === '⇧' || key === '⌫';
          return (
            <div
              key={key}
              style={{
                width: isSpecial ? 44 : key === '⇧' && ri === 2 ? 44 : 32,
                flex: isSpecial ? '0 0 44px' : '1',
                maxWidth: isSpecial ? 44 : ri === 0 ? 36 : ri === 1 ? 38 : 36,
                height: 44,
                backgroundColor: isSpecial ? '#5A5A5C' : '#3A3A3C',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: isSpecial ? 18 : 17,
                fontWeight: 400,
                boxShadow: '0 2px 0 #000',
              }}
            >
              {key}
            </div>
          );
        })}
      </div>
    ))}

    {/* Bottom row: ABC | space | return */}
    <div style={{ display: 'flex', gap: 6, paddingLeft: 4, paddingRight: 4, marginBottom: 4 }}>
      <div style={{ width: 44, height: 44, flexShrink: 0, backgroundColor: '#5A5A5C', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, boxShadow: '0 2px 0 #000' }}>
        ABC
      </div>
      <div style={{ flex: 1, height: 44, backgroundColor: '#3A3A3C', borderRadius: 6, boxShadow: '0 2px 0 #000' }} />
      <div style={{ width: 92, flexShrink: 0, height: 44, backgroundColor: '#007AFF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, fontWeight: 500, boxShadow: '0 2px 0 #003d80' }}>
        return
      </div>
    </div>

    {/* Emoji / mic bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 12, paddingRight: 12, paddingTop: 6 }}>
      <span style={{ fontSize: 24 }}>🙂</span>
      <span style={{ fontSize: 20 }}>🎤</span>
    </div>
  </div>
);

// ── Chat screen ────────────────────────────────────────────────
export const ChatScreen = () => {
  const { id, actionId } = useParams<{ id: string; actionId: string }>();
  const { services, performAction } = useAura();
  const navigate = useNavigate();

  const service = services[id as ServiceId];
  const rawStarter = ACTION_STARTERS[actionId!] ?? 'привет, саша!\nты как?';

  // Format message: if >25 chars, try to split on punctuation / natural break
  const messageText = rawStarter;

  const handleComplete = () => {
    performAction(id as ServiceId, actionId!);
    navigate(-1);
  };

  const handleBack = () => navigate(-1);

  if (!service) return null;

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
      {/* ── Top nav ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px' }}>
        {/* "до этого" pill */}
        <button
          onClick={handleBack}
          style={{
            backgroundColor: '#2C2C2E',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 14px',
            borderRadius: 20,
            border: 'none',
          }}
        >
          до этого
        </button>

        {/* × circle */}
        <button
          onClick={handleBack}
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
            fontSize: 18,
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, paddingBottom: 16, overflowY: 'hidden' }}>
        {/* Creature */}
        <motion.img
          src={wolfImg}
          alt=""
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 200, height: 200, objectFit: 'contain', flexShrink: 0 }}
        />

        {/* Status badge */}
        <div style={{
          marginTop: 8,
          backgroundColor: '#2C2C2E',
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: 500,
          padding: '4px 12px',
          borderRadius: 20,
          letterSpacing: 0.1,
        }}>
          радуется
        </div>

        {/* Message */}
        <p style={{
          marginTop: 20,
          fontSize: 30,
          fontWeight: 700,
          color: '#A8FF3E',
          textAlign: 'center',
          lineHeight: 1.25,
          padding: '0 24px',
        }}>
          {messageText}
        </p>

        {/* Input area */}
        <div style={{ marginTop: 'auto', width: '100%', padding: '0 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ color: '#007AFF', fontSize: 20, fontWeight: 300, lineHeight: 1 }}
            >
              |
            </motion.span>
            <span style={{ color: '#636366', fontSize: 17 }}>сказать что-то</span>
          </div>
        </div>
      </div>

      {/* ── Fake keyboard ── */}
      <FakeKeyboard onAnyTap={handleComplete} />
    </motion.div>
  );
};
