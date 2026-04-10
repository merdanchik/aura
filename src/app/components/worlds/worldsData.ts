import svcMusic   from '../../../assets/yandex-music.png';
import svcKino    from '../../../assets/kinopoisk.png';
import svcBooks   from '../../../assets/yandex-books.png';
import svcMarket  from '../../../assets/yandex-market.png';
import svcTravel  from '../../../assets/yandex-travel.png';
import svcYMaps   from '../../../assets/yandex-maps.png';
import svcAfisha  from '../../../assets/yandex-afisha.png';

export interface SourceDef {
  iconSrc?:  string;
  initials?: string;
  name:      string;
  facts:     string;
  meaning:   string;
  accent:    string;
}

export interface InsightDef {
  icon:      string;
  category:  string;
  text:      string;
  accent:    string;
  contextId: string;
}

export interface WorldDetailData {
  color:        string;
  title:        string;
  subtitle:     string;
  statusText:   string;
  heroTitle:    string;
  heroBody:     string;
  heroTemporal: string;
  values:       string[];
  sources:      SourceDef[];
  insights:     InsightDef[];
}

export const WORLD_DATA: Record<string, WorldDetailData> = {

  content: {
    color:        '#5AC8F5',
    title:        'Спорт',
    subtitle:     'Гонки · Баскетбол · Матчи',
    statusText:   'в сезоне',
    heroTitle:    'Формула 1 и NBA в центре',
    heroBody:     'Сезон F1 открылся активно — Мельбурн просмотрен полностью, следующий этап уже в трекере. Баскетбол идёт параллельным потоком с акцентом на плей-офф.',
    heroTemporal: 'Основано на активности за последние 3 недели',
    values: [
      'Позволяет ассистенту предлагать гонки и матчи в нужное время без лишних вопросов',
      'Даёт персонализированную аналитику и статистику по интересующим командам',
      'Открывает точный контекст для разговоров о спорте без объяснений с нуля',
    ],
    sources: [
      { iconSrc: svcAfisha, name: 'Яндекс Афиша',  facts: '8 спортивных событий за месяц, 3 напоминания', meaning: 'Активное отслеживание расписания', accent: '#5AC8F5' },
      { initials: 'F1',    name: 'Formula 1',       facts: '6 гонок просмотрено полностью, 2 в записи',     meaning: 'Глубокий интерес к сезону',       accent: '#FF3B30' },
      { initials: 'NBA',   name: 'NBA',              facts: '12 матчей, фокус на плей-офф',                  meaning: 'Устойчивый интерес к командному спорту', accent: '#FF9F0A' },
    ],
    insights: [
      { icon: '🏎️', category: 'ПАТТЕРН · F1',  text: 'Смотрит гонки в прямом эфире — без записи', accent: '#FF3B30', contextId: 'ins-sports-f1'  },
      { icon: '🏀', category: 'ОТКРЫТИЕ · NBA', text: 'Плей-офф привлекает в 3× больше обычного',   accent: '#FF9F0A', contextId: 'ins-sports-nba' },
    ],
  },

  music: {
    color:        '#BF5AF2',
    title:        'Музыка',
    subtitle:     'Слушает · Открывает · Собирает',
    statusText:   'в потоке',
    heroTitle:    'Глубокое слушание',
    heroBody:     'Музыка сейчас переживается не как фоновый шум, а как осознанный сценарий с длинными сессиями и регулярным возвратом к выбранным альбомам.',
    heroTemporal: 'Основано на активности за последние 2 недели',
    values: [
      'Позволяет стартовать музыкальные сессии с нужным настроением без лишних вопросов',
      'Делает алгоритмы чувствительными к текущей фазе, а не к историческим вкусам',
      'Снижает барьер входа в интерфейсах автомобиля и умного дома',
    ],
    sources: [
      { iconSrc: svcMusic, name: 'Яндекс Музыка', facts: '3 возврата к альбому, сессии 50+ минут, 7 лайков', meaning: 'Высокая вовлечённость и осознанный выбор', accent: '#BF5AF2' },
    ],
    insights: [
      { icon: '🎵', category: 'ВКУС · МУЗЫКА',    text: 'Электроника в 2× чаще по пятницам после 22:00', accent: '#E03366', contextId: 'ins-music'   },
      { icon: '🔁', category: 'ПРИВЫЧКА · МУЗЫКА', text: 'Возвращается к одному альбому 3+ раз подряд',     accent: '#BF5AF2', contextId: 'ins-music-2' },
    ],
  },

  cinema: {
    color:        '#FF9F0A',
    title:        'Кино',
    subtitle:     'Фильмы · Сериалы · Список',
    statusText:   'накапливает',
    heroTitle:    'Список растёт',
    heroBody:     'Сценарий просмотра показывает высокий первичный интерес, но переход в реальное длинное смотрение остаётся нестабильным и часто прерывается.',
    heroTemporal: 'Основано на активности за последний месяц',
    values: [
      'Помогает предлагать короткие форматы или фильмы на один вечер вместо тяжелых сериалов',
      'Улучшает тайминг пушей и напоминаний о недосмотренном',
      'Снижает когнитивную нагрузку при выборе контента на главной странице',
    ],
    sources: [
      { iconSrc: svcKino, name: 'Кинопоиск', facts: '27 фильмов в вишлисте, 3 досмотра до конца, 2 брошено', meaning: 'Интерес копится, но конверсия в просмотр рваная', accent: '#FF9F0A' },
    ],
    insights: [
      { icon: '🎬', category: 'ОТКРЫТИЕ · КИНОПОИСК', text: 'Аниме расширило профиль знания',          accent: '#FF6600', contextId: 'ins-kinopoisk'   },
      { icon: '📋', category: 'ПАТТЕРН · КИНОПОИСК',  text: 'Добавляет в вишлист в 4× больше, чем смотрит', accent: '#FF9F0A', contextId: 'ins-cinema-2' },
    ],
  },

  shopping: {
    color:        '#FF6633',
    title:        'Шопинг',
    subtitle:     'Поиск · Сравнение · Решение',
    statusText:   'наблюдает',
    heroTitle:    'Решение созревает',
    heroBody:     'Пользователь перешёл от случайного поиска к активному выбору. Решение о покупке почти сформировано, но ещё требует сравнения альтернатив.',
    heroTemporal: 'Основано на активности за последние 10 дней',
    values: [
      'Открывает более агрессивный и точный checkout flow без лишних шагов',
      'Позволяет предлагать универсальный Сплит в нужный момент принятия решения',
      'Фокусирует рекомендации на добивке конкретного намерения, а не на холодном поиске',
    ],
    sources: [
      { iconSrc: svcMarket, name: 'Яндекс Маркет', facts: '8 возвратов к товару, 12 сравнений, 3 в корзине', meaning: 'Глубокий research перед финальной транзакцией', accent: '#FF6633' },
    ],
    insights: [
      { icon: '🛍️', category: 'ПРИВЫЧКА · МАРКЕТ', text: 'Чаще покупает по воскресеньям',           accent: '#FFCC00', contextId: 'ins-market'    },
      { icon: '💳', category: 'ПАТТЕРН · СПЛИТ',   text: 'Платит вовремя — доверие растёт',          accent: '#30D158', contextId: 'ins-split'     },
    ],
  },

  travel: {
    color:        '#00C7BE',
    title:        'Путешествия',
    subtitle:     'Маршруты · Места · Логистика',
    statusText:   'планирует',
    heroTitle:    'План становится конкретным',
    heroBody:     'Абстрактный интерес к направлениям перешёл в практическую стадию: началась сверка логистики и выбор конкретных мест для бронирования.',
    heroTemporal: 'Основано на активности за последнюю неделю',
    values: [
      'Позволяет заранее перестроить интерфейс Карт на режим планирования и маршрутов',
      'Даёт возможность ассистенту вовремя предложить комплементарные услуги (трансфер, страховка)',
      'Убирает барьеры при бронировании за счёт предзаполненных данных сильного паспорта',
    ],
    sources: [
      { iconSrc: svcTravel, name: 'Яндекс Путешествия', facts: '4 проверки билетов, 3 отеля в избранном',  meaning: 'Сборка логистики и дат',      accent: '#00C7BE' },
      { iconSrc: svcYMaps,  name: 'Яндекс Карты',       facts: '7 сохранённых мест в новом городе',        meaning: 'Проработка деталей на месте', accent: '#FF9F0A' },
    ],
    insights: [
      { icon: '✈️', category: 'ПАТТЕРН · ПУТЕШЕСТВИЯ', text: 'Проверяет билеты поздно вечером',       accent: '#00C7BE', contextId: 'ins-travel'   },
      { icon: '🗺️', category: 'ОТКРЫТИЕ · КАРТЫ',      text: 'Сохраняет места до поездки в 3× активнее', accent: '#FF9F0A', contextId: 'ins-travel-2' },
    ],
  },

};
