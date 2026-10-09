/**
 * Sentry для страницы подписки. Импортируется первым в main.tsx.
 * DSN публичный по природе (виден в бандле), задаётся в .env.production.
 * Без VITE_SENTRY_DSN (dev-сборка) ничего не делает.
 */
import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
    Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        // Страница открывается по личной ссылке подписки: IP и куки в Sentry не отправляем.
        sendDefaultPii: false
    })
}
