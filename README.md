# Subpage-X

Страница подписки VPN для пользователей Tunnel-X. Развертывается как отдельный сервис.

## Архитектура

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│  subpage-x      │  HTTP  │  tunnel-x API   │        │    PostgreSQL   │
│  (React SPA)    │ ──────>│  /api/user/:id  │ ──────>│                 │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

## URL формат

Страница доступна по URL:
- `https://subpage.example.com/{short_uuid}` - short_uuid из пути
- `https://subpage.example.com/?id={short_uuid}` - short_uuid из query параметра

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка
npm run build
```

## Деплой

### Docker

```bash
# Сборка образа
docker build -t subpage-x \
  --build-arg VITE_API_URL=https://your-tunnel-x-api.com \
  .

# Запуск контейнера
docker run -p 80:80 subpage-x
```

### Docker Compose

```bash
# Создать .env файл
cp .env.example .env
# Отредактировать VITE_API_URL

# Запуск
docker-compose up -d
```

## Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|--------|
| `VITE_API_URL` | URL API сервера tunnel-x | `https://api.tunnelx.com` |

## API endpoint

Subpage-x запрашивает данные с API tunnel-x:

```
GET /api/user/{short_uuid}

Response:
{
  "short_uuid": "abc123",
  "crypto_link": "vless://...",
  "language": "ru"
}
```
