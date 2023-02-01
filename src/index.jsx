/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
// import 'react-app-polyfill/ie11'
// import 'react-app-polyfill/stable'

import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import AppSettingsProvider from './Utils/AppSettingsContext'
import Loader from './components/Loaders/Loader'
// import 'core-js/stable'
// import 'regenerator-runtime/runtime';

const App = lazy(() => import('./App'))

if (typeof bits !== 'undefined' && bits.assetsURL !== undefined) {
  // eslint-disable-next-line camelcase
  // __webpack_public_path__ = `${bits.assetsURL}/js/`
}
if (typeof bits !== 'undefined' && bits.baseURL && `${window.location.pathname + window.location.search}#` !== bits.baseURL) {
  bits.baseURL = `${window.location.pathname + window.location.search}#`
}
if (window.location.hash === '') {
  window.location = `${window.location.href}#/`
}
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${__webpack_public_path__}service-worker.js`).then(registration => {
      // eslint-disable-next-line no-console
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      // eslint-disable-next-line no-console
      console.log('SW registration failed: ', registrationError)
    })
  })
} else {
  // eslint-disable-next-line no-console
  console.log('no sw')
}

ReactDOM.render(
  <RecoilRoot>
    <AppSettingsProvider>
      <Suspense fallback={<Loader className="g-c" style={{ height: '90vh' }} />}>
        <App />
      </Suspense>
    </AppSettingsProvider>
  </RecoilRoot>, document.getElementById('btcd-app'),
)

// serviceWorker.register();
