import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type ServiceId = 'music' | 'kinopoisk' | 'books' | 'market' | 'split' | 'taxi' | 'pay' | 'scooters' | 'food' | 'afisha' | 'travel';

export interface Action {
  id: string;
  title: string;
  description: string;
  knowledgeBoost?: number;
  trustBoost?: number;
  completed: boolean;
  type: 'knowledge' | 'trust';
}

export interface ServiceData {
  id: ServiceId;
  name: string;
  color: string;
  knowledgeScore: number;
  trustScore: number | null;
  actions: Action[];
}

export interface AuraTheme {
  score: number;           // 0-100 overall
  roundness: number;       // 0-1 how round the flower is
  primary: string;         // main accent
  primaryLight: string;    // lighter accent
  primarySoft: string;     // very light bg tint
  bg: string;              // page background
  gradient: [string, string];
  flowerLayers: string[];  // colors for each flower layer
}

// Color stops for score interpolation
function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function computeTheme(score: number, trustScore?: number): AuraTheme {
  // Background color is driven by trust score
  const trust = trustScore ?? score;

  const stops = [
    { s: 0,   primary: '#9333EA', light: '#C084FC', soft: '#FAF5FF', bg: '#FFF0F0', g1: '#7C3AED', g2: '#A855F7', layers: ['#9333EA', '#A855F7', '#C084FC', '#DDD6FE'] },
    { s: 25,  primary: '#6366F1', light: '#A5B4FC', soft: '#EEF2FF', bg: '#FFF5F0', g1: '#6366F1', g2: '#818CF8', layers: ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'] },
    { s: 50,  primary: '#0EA5E9', light: '#7DD3FC', soft: '#F0F9FF', bg: '#FFFCF0', g1: '#0284C7', g2: '#38BDF8', layers: ['#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD'] },
    { s: 75,  primary: '#10B981', light: '#6EE7B7', soft: '#ECFDF5', bg: '#F0FFF5', g1: '#059669', g2: '#34D399', layers: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] },
    { s: 100, primary: '#22C55E', light: '#86EFAC', soft: '#F0FDF4', bg: '#EDFCF2', g1: '#16A34A', g2: '#4ADE80', layers: ['#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0'] },
  ];

  // Use trust for bg interpolation
  const bgStops = [
    { s: 0,   bg: '#FEF0F0' },  // soft red
    { s: 30,  bg: '#FFF5EC' },  // soft orange
    { s: 60,  bg: '#FEFFF0' },  // soft yellow
    { s: 80,  bg: '#F0FFF5' },  // soft green
    { s: 100, bg: '#ECFDF5' },  // green
  ];

  const clamped = Math.max(0, Math.min(100, score));
  const trustClamped = Math.max(0, Math.min(100, trust));

  let lower = stops[0], upper = stops[1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].s && clamped <= stops[i + 1].s) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  // Interpolate bg based on trust
  let bgLower = bgStops[0], bgUpper = bgStops[1];
  for (let i = 0; i < bgStops.length - 1; i++) {
    if (trustClamped >= bgStops[i].s && trustClamped <= bgStops[i + 1].s) {
      bgLower = bgStops[i];
      bgUpper = bgStops[i + 1];
      break;
    }
  }
  const bgT = bgUpper.s === bgLower.s ? 0 : (trustClamped - bgLower.s) / (bgUpper.s - bgLower.s);

  const t = upper.s === lower.s ? 0 : (clamped - lower.s) / (upper.s - lower.s);
  const roundness = clamped / 100;

  return {
    score: clamped,
    roundness,
    primary: lerpColor(lower.primary, upper.primary, t),
    primaryLight: lerpColor(lower.light, upper.light, t),
    primarySoft: lerpColor(lower.soft, upper.soft, t),
    bg: lerpColor(bgLower.bg, bgUpper.bg, bgT),
    gradient: [lerpColor(lower.g1, upper.g1, t), lerpColor(lower.g2, upper.g2, t)],
    flowerLayers: lower.layers.map((c, i) => lerpColor(c, upper.layers[i], t)),
  };
}

interface AuraContextType {
  services: Record<ServiceId, ServiceData>;
  globalTrustScore: number;
  globalKnowledgeScore: number;
  overallScore: number;
  theme: AuraTheme;
  performAction: (serviceId: ServiceId, actionId: string) => void;
  undoAction: (serviceId: ServiceId, actionId: string) => void;
  triggerEvent: (type: 'overdue' | 'recovery') => void;
  getServiceTheme: (id: ServiceId) => AuraTheme;
}

const initialServices: Record<ServiceId, ServiceData> = {
  music: {
    id: 'music',
    name: 'Яндекс Музыка',
    color: '#E03366',
    knowledgeScore: 10,
    trustScore: null,
    actions: [
      { id: 'm1', title: 'Оцените 5 треков', description: 'Поможет Моей Волне стать точнее', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'm2', title: 'Добавьте 3 плейлиста', description: 'Расскажите о вашем вкусе', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'm3', title: 'Подпишитесь на 5 исполнителей', description: 'Для персональных новинок', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'm4', title: 'Послушайте Мою Волну 30 мин', description: 'Алгоритм подстроится под вас', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'm5', title: 'Поставьте дизлайк 5 трекам', description: 'Мы не будем их рекомендовать', knowledgeBoost: 10, completed: false, type: 'knowledge' },
      { id: 'm6', title: 'Выберите любимые жанры', description: 'Для точных рекомендаций', knowledgeBoost: 20, completed: false, type: 'knowledge' },
    ]
  },
  kinopoisk: {
    id: 'kinopoisk',
    name: 'Кинопоиск',
    color: '#FF6600',
    knowledgeScore: 5,
    trustScore: null,
    actions: [
      { id: 'k1', title: 'Оцените 10 фильмов', description: 'Чтобы улучшить рекомендации', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'k2', title: 'Выберите любимые жанры', description: 'Для более точной подборки', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'k3', title: 'Добавьте 5 фильмов в «Буду смотреть»', description: 'Подскажем похожие', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'k4', title: 'Оцените 5 сериалов', description: 'Рекомендации станут лучше', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'k5', title: 'Напишите рецензию', description: 'Мы поймём, что вам важно', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'k6', title: 'Укажите любимых актёров', description: 'Для персональной подборки', knowledgeBoost: 20, completed: false, type: 'knowledge' },
    ]
  },
  books: {
    id: 'books',
    name: 'Яндекс Книги',
    color: '#0077FF',
    knowledgeScore: 5,
    trustScore: null,
    actions: [
      { id: 'b1', title: 'Отметьте прочитанные книги', description: 'Узнаем, что вам нравится', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'b2', title: 'Выберите любимые жанры', description: 'Для точных рекомендаций', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'b3', title: 'Оцените 5 книг', description: 'Настроим подборку', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'b4', title: 'Добавьте книги в избранное', description: 'Подскажем похожие', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'b5', title: 'Подпишитесь на полку куратора', description: 'Откроем новые авторы', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'b6', title: 'Укажите любимых авторов', description: 'Персонализируем ленту', knowledgeBoost: 20, completed: false, type: 'knowledge' },
    ]
  },
  market: {
    id: 'market',
    name: 'Яндекс Маркет',
    color: '#FFCC00',
    knowledgeScore: 5,
    trustScore: 15,
    actions: [
      { id: 'mk1', title: 'Заполните профиль покупок', description: 'Лучшие скидки для вас', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'mk2', title: 'Добавьте 3 товара в избранное', description: 'Подберём похожие', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'mk3', title: 'Напишите отзыв о товаре', description: 'Повысит ваше доверие', knowledgeBoost: 5, trustBoost: 15, completed: false, type: 'trust' },
      { id: 'mk4', title: 'Укажите размеры одежды', description: 'Для точных подборок', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'mk5', title: 'Оцените 5 прошлых покупок', description: 'Улучшим рекомендации', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'mk6', title: 'Подтвердите получение заказов', description: 'Повышает рейтинг доверия', trustBoost: 20, completed: false, type: 'trust' },
      { id: 'mk7', title: 'Подключите карту лояльности', description: 'Больше баллов и кэшбэка', knowledgeBoost: 10, trustBoost: 15, completed: false, type: 'trust' },
      { id: 'mk8', title: 'Выберите любимые категории', description: 'Для персональной витрины', knowledgeBoost: 20, completed: false, type: 'knowledge' },
    ]
  },
  split: {
    id: 'split',
    name: 'Сплит (Фин. сервисы)',
    color: '#00C853',
    knowledgeScore: 10,
    trustScore: 15,
    actions: [
      { id: 's1', title: 'Подтвердите личность', description: 'Базовый шаг для доверия', trustBoost: 15, completed: false, type: 'trust' },
      { id: 's2', title: 'Привяжите банковскую карту', description: 'Для автоплатежей', trustBoost: 15, completed: false, type: 'trust' },
      { id: 's3', title: 'Совершите первую покупку в Сплит', description: 'Начните кредитную историю', knowledgeBoost: 15, trustBoost: 10, completed: false, type: 'trust' },
      { id: 's4', title: 'Оплатите рассрочку вовремя', description: 'Повышает рейтинг доверия', trustBoost: 15, completed: false, type: 'trust' },
      { id: 's5', title: 'Подключите автоплатёж', description: 'Никаких просрочек', trustBoost: 15, completed: false, type: 'trust' },
      { id: 's6', title: 'Заполните финансовый профиль', description: 'Увеличим лимит', knowledgeBoost: 20, trustBoost: 15, completed: false, type: 'trust' },
    ]
  },
  taxi: {
    id: 'taxi',
    name: 'Яндекс Такси',
    color: '#FFCC00',
    knowledgeScore: 5,
    trustScore: 10,
    actions: [
      { id: 'tx1', title: 'Подтвердите личность', description: 'Повысит рейтинг пассажира', trustBoost: 20, completed: false, type: 'trust' },
      { id: 'tx2', title: 'Подключите автооплату', description: 'Без задержек после поездки', trustBoost: 15, completed: false, type: 'trust' },
      { id: 'tx3', title: 'Оцените последнюю поездку', description: 'Помогает водителям и алгоритму', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'tx4', title: 'Добавьте домашний и рабочий адрес', description: 'Для быстрого заказа', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'tx5', title: 'Выберите класс авто по умолчанию', description: 'Персонализируем предложения', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'tx6', title: 'Не отменяйте заказы', description: 'Рейтинг пассажира растёт', trustBoost: 20, completed: false, type: 'trust' },
    ]
  },
  pay: {
    id: 'pay',
    name: 'Яндекс Пэй',
    color: '#8C3FED',
    knowledgeScore: 5,
    trustScore: 5,
    actions: [
      { id: 'py1', title: 'Привяжите карту', description: 'Необходимо для оплат', trustBoost: 20, completed: false, type: 'trust' },
      { id: 'py2', title: 'Подтвердите личность', description: 'Повысит лимит платежей', trustBoost: 20, completed: false, type: 'trust' },
      { id: 'py3', title: 'Включите Face ID для оплаты', description: 'Безопасно и быстро', trustBoost: 15, completed: false, type: 'trust' },
      { id: 'py4', title: 'Совершите первый платёж', description: 'Начните формировать историю', knowledgeBoost: 15, trustBoost: 15, completed: false, type: 'trust' },
      { id: 'py5', title: 'Подключите автоплатёж за подписки', description: 'Без просрочек и прерываний', trustBoost: 15, completed: false, type: 'trust' },
      { id: 'py6', title: 'Укажите предпочтительный способ оплаты', description: 'Персонализируем интерфейс', knowledgeBoost: 20, completed: false, type: 'knowledge' },
    ]
  },
  scooters: {
    id: 'scooters',
    name: 'Самокаты',
    color: '#00BCD4',
    knowledgeScore: 5,
    trustScore: 5,
    actions: [
      { id: 'sc1', title: 'Пройдите тест по ПДД для самокатов', description: 'Подтверждает безопасную езду', trustBoost: 25, completed: false, type: 'trust' },
      { id: 'sc2', title: 'Верните самокат в зону парковки', description: 'Сохраняет рейтинг пользователя', trustBoost: 20, completed: false, type: 'trust' },
      { id: 'sc3', title: 'Сфотографируйте парковку после аренды', description: 'Повышает доверие к вам', trustBoost: 15, completed: false, type: 'trust' },
      { id: 'sc4', title: 'Подтвердите возраст', description: 'Обязательно для аренды', trustBoost: 20, completed: false, type: 'trust' },
      { id: 'sc5', title: 'Укажите любимые маршруты', description: 'Подскажем ближайшие самокаты', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'sc6', title: 'Подключите автооплату', description: 'Удобнее завершать поездки', trustBoost: 15, completed: false, type: 'trust' },
    ]
  },
  food: {
    id: 'food',
    name: 'Яндекс Еда',
    color: '#F7591E',
    knowledgeScore: 5,
    trustScore: null,
    actions: [
      { id: 'fd1', title: 'Отметьте любимые кухни', description: 'Лучшие рестораны для вас', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'fd2', title: 'Укажите диетические предпочтения', description: 'Вегетарианское, без глютена и т.д.', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'fd3', title: 'Оцените 5 блюд', description: 'Точнее подбираем меню', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'fd4', title: 'Добавьте адрес доставки', description: 'Для быстрого оформления', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'fd5', title: 'Оставьте отзыв о ресторане', description: 'Улучшим рекомендации', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'fd6', title: 'Добавьте ресторан в избранное', description: 'Быстрый доступ к любимым', knowledgeBoost: 10, completed: false, type: 'knowledge' },
    ]
  },
  afisha: {
    id: 'afisha',
    name: 'Яндекс Афиша',
    color: '#E91E63',
    knowledgeScore: 5,
    trustScore: null,
    actions: [
      { id: 'af1', title: 'Выберите интересные категории', description: 'Концерты, театры, выставки', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'af2', title: 'Добавьте мероприятие в избранное', description: 'Напомним за день', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'af3', title: 'Оцените посещённое мероприятие', description: 'Подберём похожие', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'af4', title: 'Укажите любимых исполнителей', description: 'Оповестим о концертах', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'af5', title: 'Подпишитесь на афишу города', description: 'Лучшее каждую неделю', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'af6', title: 'Укажите любимые площадки', description: 'Для точных подборок рядом', knowledgeBoost: 10, completed: false, type: 'knowledge' },
    ]
  },
  travel: {
    id: 'travel',
    name: 'Яндекс Путешествия',
    color: '#2196F3',
    knowledgeScore: 5,
    trustScore: null,
    actions: [
      { id: 'tr1', title: 'Добавьте паспортные данные', description: 'Для быстрого бронирования', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'tr2', title: 'Укажите предпочтения перелётов', description: 'Место у окна или прохода', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'tr3', title: 'Оцените отель после поездки', description: 'Подберём лучшее в следующий раз', knowledgeBoost: 15, completed: false, type: 'knowledge' },
      { id: 'tr4', title: 'Добавьте программу лояльности авиакомпании', description: 'Копите мили', knowledgeBoost: 20, completed: false, type: 'knowledge' },
      { id: 'tr5', title: 'Укажите предпочтения питания', description: 'Халяль, вегетарианское и т.д.', knowledgeBoost: 10, completed: false, type: 'knowledge' },
      { id: 'tr6', title: 'Задайте бюджет путешествий', description: 'Персонализируем подборки', knowledgeBoost: 15, completed: false, type: 'knowledge' },
    ]
  },
};

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export const AuraProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Record<ServiceId, ServiceData>>(initialServices);
  
  const trustServices = Object.values(services).filter(s => s.trustScore !== null);
  const globalTrustScore = trustServices.length > 0
    ? trustServices.reduce((acc, s) => acc + (s.trustScore || 0), 0) / trustServices.length
    : 0;

  const allServices = Object.values(services);
  const globalKnowledgeScore = allServices.reduce((acc, s) => acc + s.knowledgeScore, 0) / allServices.length;

  const overallScore = (globalKnowledgeScore + globalTrustScore) / 2;

  const theme = useMemo(() => computeTheme(overallScore, globalTrustScore), [overallScore, globalTrustScore]);

  const getServiceTheme = (id: ServiceId): AuraTheme => {
    const s = services[id];
    const sScore = s.trustScore !== null
      ? (s.knowledgeScore + s.trustScore) / 2
      : s.knowledgeScore;
    return computeTheme(sScore, s.trustScore);
  };

  const performAction = (serviceId: ServiceId, actionId: string) => {
    setServices(prev => {
      const srv = prev[serviceId];
      const actionIndex = srv.actions.findIndex(a => a.id === actionId);
      if (actionIndex === -1 || srv.actions[actionIndex].completed) return prev;

      const action = srv.actions[actionIndex];
      const newActions = [...srv.actions];
      newActions[actionIndex] = { ...action, completed: true };

      return {
        ...prev,
        [serviceId]: {
          ...srv,
          knowledgeScore: Math.min(100, srv.knowledgeScore + (action.knowledgeBoost || 0)),
          trustScore: srv.trustScore !== null ? Math.min(100, srv.trustScore + (action.trustBoost || 0)) : null,
          actions: newActions
        }
      };
    });
  };

  const undoAction = (serviceId: ServiceId, actionId: string) => {
    setServices(prev => {
      const srv = prev[serviceId];
      const actionIndex = srv.actions.findIndex(a => a.id === actionId);
      if (actionIndex === -1 || !srv.actions[actionIndex].completed) return prev;

      const action = srv.actions[actionIndex];
      const newActions = [...srv.actions];
      newActions[actionIndex] = { ...action, completed: false };

      return {
        ...prev,
        [serviceId]: {
          ...srv,
          knowledgeScore: Math.max(0, srv.knowledgeScore - (action.knowledgeBoost || 0)),
          trustScore: srv.trustScore !== null ? Math.max(0, srv.trustScore - (action.trustBoost || 0)) : null,
          actions: newActions,
        }
      };
    });
  };

  const triggerEvent = (type: 'overdue' | 'recovery') => {
    if (type === 'overdue') {
      setServices(prev => ({
        ...prev,
        split: {
          ...prev.split,
          trustScore: Math.max(0, (prev.split.trustScore || 100) - 60)
        }
      }));
    } else if (type === 'recovery') {
      setServices(prev => ({
        ...prev,
        split: {
          ...prev.split,
          trustScore: Math.min(100, (prev.split.trustScore || 0) + 30)
        }
      }));
    }
  };

  return (
    <AuraContext.Provider value={{ services, globalTrustScore, globalKnowledgeScore, overallScore, theme, performAction, undoAction, triggerEvent, getServiceTheme }}>
      {children}
    </AuraContext.Provider>
  );
};

export const useAura = () => {
  const context = useContext(AuraContext);
  if (!context) throw new Error("useAura must be used within AuraProvider");
  return context;
};