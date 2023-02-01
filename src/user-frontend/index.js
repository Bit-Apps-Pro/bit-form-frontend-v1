/* eslint-disable no-undef */
/* import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable' */
import ReactDOM from 'react-dom'
import Bitforms from './Bitforms'
// import 'regenerator-runtime/runtime';
// eslint-disable-next-line no-underscore-dangle
/* if (!window._babelPolyfill) {
  // eslint-disable-next-line global-require
  require('babel-polyfill')
} */

export default function BitformsRenderer(contentID) {
  const formID = contentID.split('_')[1]
  window.bitFormsFront = window[contentID]
  bitFormsFront.appID = `bitforms_${formID}`
  bitFormsFront.contentID = contentID
  const params = bitFormsFront
  const renderApp = () => {
    const ajaxURL = new URL(bitFormsFront.ajaxURL)
    if (ajaxURL.protocol !== window.location.protocol) {
      ajaxURL.protocol = window.location.protocol
      bitFormsFront.ajaxURL = ajaxURL
    }
    // eslint-disable-next-line react/jsx-filename-extension
    ReactDOM.hydrate(<Bitforms
      buttons={params.buttons}
      data={params.fields}
      layout={params.layout}
      file={params.file}
      gRecaptchaSiteKey={params.gRecaptchaSiteKey}
      gRecaptchaVersion={params.gRecaptchaVersion}
      fieldToCheck={params.fieldToCheck}
      fieldToChange={params.fieldToChange}
      conditional={params.conditional}
      fieldsKey={params.fieldsKey}
      contentID={params.contentID}
      appID={params.appID}
      nonce={params.nonce}
      formID={params.formId}
      GCLID={params.GCLID && getGclid}
    />, document.getElementById(params.contentID))
  }

  const getGclid = () => {
    let gID = ''
    if (document.referrer) {
      const idExists = RegExp('[?&]gclid=([^&]*)').exec(document.referrer)
      if (idExists) {
        // eslint-disable-next-line prefer-destructuring
        gID = idExists[1]
      }
    }
    if (gID === '' && window.location.search) {
      const idExists = RegExp('[?&]gclid=([^&]*)').exec(window.location.search)
      if (idExists) {
        // eslint-disable-next-line prefer-destructuring
        gID = idExists[1]
      }
    } else {
      let cookies = document.cookie
      let gclidStartIdx = cookies.indexOf(' gclid=')
      if (gclidStartIdx === -1) {
        gclidStartIdx = cookies.indexOf('gclid=')
      }
      if (gclidStartIdx === -1) {
        cookies = null
      } else {
        gclidStartIdx = cookies.indexOf('=', gclidStartIdx) + 1
        let gclidEndIdx = cookies.indexOf(';', gclidStartIdx)
        if (gclidEndIdx === -1) {
          gclidEndIdx = cookies.length
        }
        cookies = unescape(cookies.substring(gclidStartIdx, gclidEndIdx))
      }
      gID = cookies
    }
    return gID
  }

  const app = document.getElementById(params.contentID)
  if (!app) {
    const appConatinerObserver = new MutationObserver(() => {
      const container = document.getElementById(params.contentID)
      if (container) {
        renderApp()
      }
    })
    if (window.top !== window.self) {
      appConatinerObserver.observe(document.body, { childList: true, subtree: true })
    }
  } else {
    renderApp()
  }

  if (params.GCLID) {
    document.addEventListener('DOMContentLoaded', (event) => {
      const bitGclid = getGclid()
      if (typeof bitGclid === 'string' && bitGclid.length > 0) {
        const gclidElms = document.getElementsByName('GCLID')
        gclidElms.forEach(element => {
          // eslint-disable-next-line no-param-reassign
          element.value = bitGclid
        })
      }
    })
  }
}
