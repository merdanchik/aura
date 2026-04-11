# Aura

## ЕДИНСТВЕННАЯ АКТИВНАЯ ВЕТКА — `main`

**Всегда работай в `main`. Никогда не создавай новые ветки. Никогда не переключайся на другие ветки.**

Все остальные ветки (`archive/*`) — только история. Не коммитить, не мёрджить.

```bash
git checkout main && git pull origin main
# работай здесь
git push origin main
```

---

## Запуск

```bash
npm i
npm run dev
```

## Деплой

Пуш в `main` → GitHub Actions деплоит автоматически на GitHub Pages.
