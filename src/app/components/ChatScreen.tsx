import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ServiceId, useAura } from '../context/AuraContext';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';

import iconMusic from "figma:asset/52729efb5574f608701f92848e1b348745677960.png";
import iconKinopoisk from "figma:asset/b39f941bc25c3069b2f4719e19fdc535f4a56625.png";
import iconBooks from "figma:asset/94e2bb438930a86c21d001934a49869c8425f73a.png";
import iconMarket from "figma:asset/873668dc7d9e7bd9c16444667bc68a762e2b3499.png";
import iconSplit from "figma:asset/1f449fc2f45163f28ee9045765bf74d1029f8916.png";
import iconTaxi from "../../assets/taxi.png";
import iconPay from "../../assets/pay.png";
import iconScooters from "../../assets/scooters.png";
import iconFood from "../../assets/food.png";
import iconAfisha from "../../assets/afisha.png";
import iconTravel from "../../assets/travel.png";

const serviceIconMap: Record<string, string> = {
  music: iconBooks,
  kinopoisk: iconKinopoisk,
  books: iconMusic,
  market: iconMarket,
  split: iconSplit,
  taxi: iconTaxi,
  pay: iconPay,
  scooters: iconScooters,
  food: iconFood,
  afisha: iconAfisha,
  travel: iconTravel,
};

const ACTION_STARTERS: Record<string, string> = {
  // Music
  m1: 'миш, какие треки цепляют тебя прямо сейчас?',
  m2: 'расскажи, какие плейлисты слушаешь чаще всего?',
  m3: 'кого из исполнителей слушаешь постоянно?',
  m4: 'давай послушаем что-нибудь вместе — включи Мою Волну на полчасика?',
  m5: 'есть треки, которые раздражают? отмечай — не буду их ставить',
  m6: 'какая музыка тебя заряжает — рок, джаз, хип-хоп?',
  // Kinopoisk
  k1: 'расскажи, какие фильмы тебя впечатлили в последнее время?',
  k2: 'ты больше по триллерам или мелодрамам?',
  k3: 'что давно хотел посмотреть, но всё руки не доходят?',
  k4: 'какой сериал недавно затянул тебя с головой?',
  k5: 'поделись — что думаешь о последнем просмотренном фильме?',
  k6: 'кто из актёров нравится — за кем следишь?',
  // Books
  b1: 'что из прочитанного запомнилось больше всего?',
  b2: 'больше любишь фантастику или нон-фикшн?',
  b3: 'оцени книги, которые уже читал — так пойму твой вкус',
  b4: 'есть книги, к которым хочется вернуться?',
  b5: 'хочешь, подберу тебе куратора с похожим вкусом?',
  b6: 'кто из авторов пишет так, что не оторваться?',
  // Market
  mk1: 'расскажи немного о себе — чтобы скидки попадали точно в цель',
  mk2: 'что присматриваешь, но пока не купил?',
  mk3: 'как тебе последняя покупка — всё понравилось?',
  mk4: 'какой у тебя размер одежды — помогу с подборкой',
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
  tx3: 'как последняя поездка — всё прошло хорошо?',
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
  sc5: 'куда чаще катаешься — в парк, на работу?',
  sc6: 'подключи автооплату — завершать поездку станет проще',
  // Food
  fd1: 'что любишь больше — суши, пиццу или что-то домашнее?',
  fd2: 'есть что-то, что не ешь? скажи — не буду предлагать',
  fd3: 'как тебе последние заказы — было вкусно?',
  fd4: 'куда чаще доставлять — домой или в офис?',
  fd5: 'расскажи про ресторан, где заказывал — понравилось?',
  fd6: 'есть место, куда хочется заказывать снова и снова?',
  // Afisha
  af1: 'что привлекает больше — концерты, театры или выставки?',
  af2: 'присмотрел что-нибудь интересное на ближайшие выходные?',
  af3: 'как прошло мероприятие — стоило идти?',
  af4: 'кого из исполнителей хочешь увидеть живьём?',
  af5: 'хочешь получать лучшее из афиши каждую неделю?',
  af6: 'есть места в городе, куда ходишь с удовольствием?',
  // Travel
  tr1: 'добавь паспорт — буду бронировать билеты в один клик',
  tr2: 'где любишь сидеть в самолёте — у окна или у прохода?',
  tr3: 'как отель в прошлой поездке — всё понравилось?',
  tr4: 'летаешь с какой-то авиакомпанией часто? добавь программу лояльности',
  tr5: 'есть пищевые ограничения в дороге — халяль, вегетарианское?',
  tr6: 'на путешествия обычно сколько закладываешь — расскажи, подберу варианты',
};

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
}

export const ChatScreen = () => {
  const { id, actionId } = useParams<{ id: string; actionId: string }>();
  const { services, performAction, getServiceTheme } = useAura();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const service = services[id as ServiceId];
  const starterMessage = ACTION_STARTERS[actionId!] ?? 'привет миш! ты как?';
  const sTheme = service ? getServiceTheme(service.id) : { primary: '#5E5CE6' };

  useEffect(() => {
    setMessages([{ id: 0, from: 'bot', text: starterMessage }]);
  }, [starterMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || done) return;
    const text = inputText.trim();
    setInputText('');
    setDone(true);
    setMessages(prev => [...prev, { id: prev.length, from: 'user', text }]);

    // Complete the action after a short delay, then go back
    setTimeout(() => {
      performAction(id as ServiceId, actionId!);
      navigate(-1);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!service) return null;

  const icon = serviceIconMap[service.id];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col"
      style={{ minHeight: 'calc(100vh - 65px)' }}
    >
      {/* Service info bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="relative">
          <img
            src={icon}
            alt={service.name}
            className="w-10 h-10 rounded-[12px] object-cover"
          />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black"
            style={{ backgroundColor: '#30D158' }}
          />
        </div>
        <div>
          <p className="text-[15px] text-white" style={{ fontWeight: 600 }}>{service.name}</p>
          <p className="text-[12px] text-[#30D158]" style={{ fontWeight: 500 }}>онлайн</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[0.5px] mx-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* Messages */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto" style={{ paddingBottom: 80 }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className={`flex items-end gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.from === 'bot' && (
                <img
                  src={icon}
                  alt=""
                  className="w-7 h-7 rounded-[8px] object-cover flex-shrink-0 mb-0.5"
                />
              )}
              <div
                className="max-w-[75%] px-4 py-2.5 rounded-[18px] text-[15px] leading-snug"
                style={
                  msg.from === 'bot'
                    ? {
                        backgroundColor: '#1C1C1E',
                        color: '#FFFFFF',
                        borderBottomLeftRadius: 4,
                      }
                    : {
                        backgroundColor: sTheme.primary,
                        color: '#FFFFFF',
                        borderBottomRightRadius: 4,
                      }
                }
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 pt-3"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-4"
          style={{ backgroundColor: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="сообщение..."
            disabled={done}
            className="flex-1 bg-transparent text-white text-[15px] py-3 outline-none placeholder-[#636366]"
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || done}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              backgroundColor: inputText.trim() && !done ? sTheme.primary : '#3A3A3C',
            }}
          >
            <Send className="w-3.5 h-3.5 text-white" strokeWidth={2} style={{ marginLeft: 2 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
