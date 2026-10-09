import './instrument'

import * as Sentry from '@sentry/react'
import ReactDOM from 'react-dom/client'

import { App } from './app'

const root = ReactDOM.createRoot(document.getElementById('root')!, {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler()
})
root.render(<App />)
