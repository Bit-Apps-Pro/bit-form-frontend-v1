import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'
import { refreshGetUpdates } from './TelegramCommonFunc'

export default function TelegramAuthorization({ formID, telegramConf, setTelegramConf, step, setstep, setSnackbar, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', bot_api_key: '', apiError: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuthorize = () => {
    const newConf = { ...telegramConf }

    if (!newConf.name || !newConf.bot_api_key) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty', 'bitform') : '',
        bot_api_key: !newConf.bot_api_key ? __('API Key cann\'t be empty', 'bitform') : '',
      })
      return
    }
    setIsLoading('auth')
    const requestParams = { bot_api_key: newConf.bot_api_key }
    bitsFetch(requestParams, 'bitforms_telegram_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Authorized Successfully', 'bitfrom') })
        } else {
          setisAuthorized(false)
          setError({ apiError: result?.data.description })
          setSnackbar({ show: true, msg: __('Authorized Filled', 'bitfrom') })
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...telegramConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setTelegramConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    refreshGetUpdates(telegramConf, setTelegramConf, setIsLoading, setSnackbar)
    setstep(2)
  }

  return (
    <>
      <TutorialLink
        title={tutorialLinks.telegram.title}
        youTubeLink={tutorialLinks.telegram.link}
      />
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && `${100}%` } }}>
        <div className="mt-3"><b>{__('Integration Name:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={telegramConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} disabled={isInfo} />
        <div style={{ color: 'red', fontSize: '15px', marginTop: '5px' }}>{error.name}</div>
        <div className="mt-3"><b>{__('Bot API Key:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="bot_api_key" value={telegramConf.bot_api_key} type="text" placeholder={__('Integration Name...', 'bitform')} disabled={isInfo} />
        <div style={{ color: 'red', fontSize: '15px', marginTop: '5px' }}>{error.bot_api_key}</div>
        {isLoading === 'auth' && (
          <div className="flx mt-5">
            <LoaderSm size={25} clr="#022217" className="mr-2" />
            Checking API Key!!!
          </div>
        )}

        {(showAuthMsg && !isAuthorized && !isLoading) && (
          <div className="flx mt-5" style={{ color: 'red' }}>
            <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
              &times;
            </span>
            {error.apiError}
          </div>
        )}
        {!isInfo && (
          <>
            <button onClick={handleAuthorize} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized}>
              {isAuthorized ? __('Authorized ✔', 'bitform') : __('Authorize', 'bitform')}
              {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
            </button>
            <br />
            <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
              {__('Next', 'bitform')}
              <BackIcn className="ml-1 rev-icn" />
            </button>
          </>
        )}
      </div>
    </>
  )
}
