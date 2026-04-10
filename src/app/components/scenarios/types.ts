export interface Scenario {
  id: string;
  label: string;
  color: string;
  chatContextId: string; // maps to existing CONTEXT_CHATS key
}

export const SCENARIOS: Scenario[] = [
  { id: 'music',    label: 'Музыка',      color: '#BF5AF2', chatContextId: 'jazz'   },
  { id: 'cinema',   label: 'Кино',        color: '#FF9F0A', chatContextId: 'cinema' },
  { id: 'shopping', label: 'Шопинг',      color: '#FF6633', chatContextId: 'ramen'  },
  { id: 'travel',   label: 'Путешествия', color: '#00C7BE', chatContextId: 'baikal' },
];

export const FAR_SCENARIOS = [
  { label: 'Здоровье', color: '#30D158' },
  { label: 'Еда',      color: '#FF9500' },
  { label: 'Книги',    color: '#5E5CE6' },
  { label: 'Работа',   color: '#636366' },
];
