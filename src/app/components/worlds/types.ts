export interface World {
  id: string;
  label: string;
  color: string;
  chatContextId: string;
}

export const WORLDS: World[] = [
  { id: 'content',  label: 'Контент',     color: '#5AC8F5', chatContextId: 'cinema' },
  { id: 'music',    label: 'Музыка',      color: '#BF5AF2', chatContextId: 'jazz'   },
  { id: 'cinema',   label: 'Кино',        color: '#FF9F0A', chatContextId: 'cinema' },
  { id: 'shopping', label: 'Шопинг',      color: '#FF6633', chatContextId: 'ramen'  },
  { id: 'travel',   label: 'Путешествия', color: '#00C7BE', chatContextId: 'baikal' },
];

export const FAR_WORLDS = [
  { label: 'Здоровье', color: '#30D158' },
  { label: 'Еда',      color: '#FF9500' },
  { label: 'Книги',    color: '#5E5CE6' },
  { label: 'Работа',   color: '#636366' },
];
