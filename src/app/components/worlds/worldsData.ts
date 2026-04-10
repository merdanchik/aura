import svcMusic      from '../../../assets/yandex-music.png';
import svcKino       from '../../../assets/kinopoisk.png';
import svcBooks      from '../../../assets/yandex-books.png';
import svcMarket     from '../../../assets/yandex-market.png';
import svcTravel     from '../../../assets/yandex-travel.png';
import svcYMaps      from '../../../assets/yandex-maps.png';
import svcAfisha     from '../../../assets/yandex-afisha.png';
import svcSpotify    from '../../../assets/spotify.png';
import svcLastfm     from '../../../assets/lastfm.png';
import svcNetflix    from '../../../assets/netflix.png';
import svcImdb       from '../../../assets/imdb.png';
import svcWildberries from '../../../assets/wildberries.png';
import svcOzon       from '../../../assets/ozon.png';
import svcAviasales  from '../../../assets/aviasales.png';
import svcBooking    from '../../../assets/booking.png';
import svcAirbnb     from '../../../assets/airbnb.png';

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
      { iconSrc: svcAfisha,    name: 'Яндекс Афиша',  facts: '8 спортивных событий за месяц, 3 напоминания', meaning: 'Активное отслеживание расписания', accent: '#5AC8F5' },
      { initials: 'F1',        name: 'Formula 1',      facts: '6 гонок просмотрено полностью, 2 в записи',    meaning: 'Глубокий интерес к сезону',       accent: '#FF3B30' },
      { initials: 'NBA',       name: 'NBA',             facts: '12 матчей, фокус на плей-офф',                 meaning: 'Устойчивый интерес к командному спорту', accent: '#FF9F0A' },
    ],
    insights: [
      { icon: '🏎️', category: 'ПАТТЕРН · F1',      text: 'Смотрит гонки в прямом эфире — без записи',    accent: '#FF3B30', contextId: 'ins-sports-f1'    },
      { icon: '🏀', category: 'ОТКРЫТИЕ · NBA',     text: 'Плей-офф привлекает в 3× больше обычного',     accent: '#FF9F0A', contextId: 'ins-sports-nba'   },
      { icon: '📊', category: 'ПАТТЕРН · СПОРТ',    text: 'Читает аналитику после каждой гонки',           accent: '#5AC8F5', contextId: 'ins-sports-stats' },
      { icon: '🕙', category: 'ПРИВЫЧКА · СПОРТ',   text: 'Смотрит спорт после 22:00 в будни',             accent: '#BF5AF2', contextId: 'ins-sports-time'  },
      { icon: '🎽', category: 'ИНТЕРЕС · СПОРТ',    text: 'Теннис в топ-5 по просмотрам этого сезона',     accent: '#30D158', contextId: 'ins-sports-tennis'},
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
      { iconSrc: svcMusic,   name: 'Яндекс Музыка', facts: '3 возврата к альбому, сессии 50+ минут, 7 лайков', meaning: 'Высокая вовлечённость и осознанный выбор', accent: '#BF5AF2' },
      { iconSrc: svcSpotify, name: 'Spotify',        facts: '22 прослушивания, 4 новых артиста',                 meaning: 'Расширение горизонта через другой алгоритм', accent: '#1DB954' },
      { iconSrc: svcLastfm,  name: 'Last.fm',        facts: '180 scrobbles за месяц, топ: электроника',          meaning: 'Точный след вкуса за последний год',         accent: '#D51007' },
    ],
    insights: [
      { icon: '🎵', category: 'ВКУС · МУЗЫКА',      text: 'Электроника в 2× чаще по пятницам после 22:00', accent: '#E03366', contextId: 'ins-music'     },
      { icon: '🔁', category: 'ПРИВЫЧКА · МУЗЫКА',  text: 'Возвращается к одному альбому 3+ раз подряд',   accent: '#BF5AF2', contextId: 'ins-music-2'   },
      { icon: '🌙', category: 'ПАТТЕРН · ВРЕМЯ',    text: 'Пик прослушивания — с 23:00 до 01:00',          accent: '#5E5CE6', contextId: 'ins-music-3'   },
      { icon: '🎸', category: 'ОТКРЫТИЕ · ЖАНР',   text: 'Пост-рок вырос на 40% за последний месяц',      accent: '#FF9F0A', contextId: 'ins-music-4'   },
      { icon: '📻', category: 'ПАТТЕРН · ФОРМАТ',  text: 'Предпочитает альбомы целиком, не плейлисты',    accent: '#30D158', contextId: 'ins-music-5'   },
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
      { iconSrc: svcKino,    name: 'Кинопоиск', facts: '27 фильмов в вишлисте, 3 досмотра до конца, 2 брошено', meaning: 'Интерес копится, но конверсия рваная', accent: '#FF9F0A' },
      { iconSrc: svcNetflix, name: 'Netflix',    facts: '2 сериала начато, 1 досмотрен до конца',                meaning: 'Дублирует просмотр на другой платформе', accent: '#E50914' },
      { iconSrc: svcImdb,    name: 'IMDb',       facts: '34 фильма проверено, 8 рецензий прочитано',             meaning: 'Research перед просмотром обязателен',   accent: '#F5C518' },
    ],
    insights: [
      { icon: '🎬', category: 'ОТКРЫТИЕ · КИНОПОИСК', text: 'Аниме расширило профиль знания',               accent: '#FF6600', contextId: 'ins-kinopoisk'  },
      { icon: '📋', category: 'ПАТТЕРН · СПИСОК',     text: 'Добавляет в вишлист в 4× больше, чем смотрит', accent: '#FF9F0A', contextId: 'ins-cinema-2'   },
      { icon: '🕐', category: 'ПРИВЫЧКА · ВРЕМЯ',     text: 'Смотрит кино после 22:00 в выходные',           accent: '#BF5AF2', contextId: 'ins-cinema-3'   },
      { icon: '🎭', category: 'ВКУС · ЖАНР',          text: 'Исторические драмы — 72% всего просмотра',      accent: '#FF3B30', contextId: 'ins-cinema-4'   },
      { icon: '⏸️', category: 'ПАТТЕРН · ПОВЕДЕНИЕ', text: 'Бросает сериалы после 2-го эпизода',            accent: '#636366', contextId: 'ins-cinema-5'   },
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
      { iconSrc: svcMarket,      name: 'Яндекс Маркет', facts: '8 возвратов к товару, 12 сравнений, 3 в корзине', meaning: 'Глубокий research перед транзакцией', accent: '#FF6633'  },
      { iconSrc: svcWildberries, name: 'Wildberries',    facts: '5 заказов за месяц, средний чек 2 800 ₽',         meaning: 'Параллельная площадка для сравнения',  accent: '#CB11AB'  },
      { iconSrc: svcOzon,        name: 'Ozon',           facts: '3 заказа, 2 возврата — ищет лучшее качество',     meaning: 'Высокие требования к товару',          accent: '#005BFF'  },
    ],
    insights: [
      { icon: '🛍️', category: 'ПРИВЫЧКА · МАРКЕТ',   text: 'Чаще покупает по воскресеньям',                 accent: '#FFCC00', contextId: 'ins-market'    },
      { icon: '💳', category: 'ПАТТЕРН · СПЛИТ',     text: 'Платит вовремя — доверие растёт',               accent: '#30D158', contextId: 'ins-split'     },
      { icon: '🔄', category: 'ПОВЕДЕНИЕ · ВОЗВРАТ', text: 'Возвращается к одному товару в среднем 8 раз',  accent: '#FF6633', contextId: 'ins-shopping-3' },
      { icon: '🎯', category: 'ПАТТЕРН · INTENT',    text: 'От первого поиска до покупки — 4 дня',          accent: '#5AC8F5', contextId: 'ins-shopping-4' },
      { icon: '📦', category: 'ПРИВЫЧКА · ДОСТАВКА', text: 'Выбирает доставку на следующий день в 90%',     accent: '#FF9F0A', contextId: 'ins-shopping-5' },
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
      { iconSrc: svcTravel,    name: 'Яндекс Путешествия', facts: '4 проверки билетов, 3 отеля в избранном', meaning: 'Сборка логистики и дат',              accent: '#00C7BE' },
      { iconSrc: svcYMaps,     name: 'Яндекс Карты',       facts: '7 сохранённых мест в новом городе',       meaning: 'Проработка деталей на месте',         accent: '#FF9F0A' },
      { iconSrc: svcAviasales, name: 'Авиасейлс',           facts: '6 поисков маршрута, 2 сохранённых рейса', meaning: 'Активный поиск лучшей цены на билеты', accent: '#00C7BE' },
      { iconSrc: svcBooking,   name: 'Booking',             facts: '5 отелей в избранном, 1 забронирован',    meaning: 'Подбор жилья в финальной стадии',     accent: '#003580' },
      { iconSrc: svcAirbnb,    name: 'Airbnb',              facts: '3 варианта сохранено, фокус на апартаменты', meaning: 'Альтернатива отелю для длинных поездок', accent: '#FF5A5F' },
    ],
    insights: [
      { icon: '✈️', category: 'ПАТТЕРН · ПУТЕШЕСТВИЯ', text: 'Проверяет билеты поздно вечером',          accent: '#00C7BE', contextId: 'ins-travel'   },
      { icon: '🗺️', category: 'ОТКРЫТИЕ · КАРТЫ',      text: 'Сохраняет места до поездки в 3× активнее', accent: '#FF9F0A', contextId: 'ins-travel-2' },
      { icon: '🏨', category: 'ПРИВЫЧКА · БРОНЬ',       text: 'Бронирует отели за 2–3 недели до вылета',  accent: '#003580', contextId: 'ins-travel-3' },
      { icon: '🌍', category: 'ПАТТЕРН · НАПРАВЛЕНИЕ',  text: 'Европа занимает 80% всех поисков',         accent: '#5E5CE6', contextId: 'ins-travel-4' },
      { icon: '🎒', category: 'ПОВЕДЕНИЕ · СТИЛЬ',      text: 'Предпочитает апартаменты длинным поездкам', accent: '#FF5A5F', contextId: 'ins-travel-5' },
    ],
  },

};
