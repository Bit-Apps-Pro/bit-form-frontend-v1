import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'
import { refreshLists } from './SendinBlueCommonFunc'

export default function SendinBlueAuthorization({ formID, sendinBlueConf, setSendinBlueConf, step, setstep, setSnackbar, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_key: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuthorize = () => {
    const newConf = { ...sendinBlueConf }
    if (!newConf.name || !newConf.api_key) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty', 'bitform') : '',
        api_key: !newConf.api_key ? __('API Key cann\'t be empty', 'bitform') : '',
      })
      return
    }
    setIsLoading('auth')
    const data = { api_key: newConf.api_key }
    bitsFetch(data, 'bitforms_sblue_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Authorized Successfully', 'bitfrom') })
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...sendinBlueConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setSendinBlueConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
    refreshLists(sendinBlueConf, setSendinBlueConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <TutorialLink
        title={tutorialLinks.sendinblue.title}
        youTubeLink={tutorialLinks.sendinblue.link}
      />
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && `${100}%` } }}>
        <div className="mt-3"><b>{__('Integration Name:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={sendinBlueConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} disabled={isInfo} />
        <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>
        <div className="mt-3"><b>{__('API Key:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={sendinBlueConf.api_key} type="text" placeholder={__('Integration Name...', 'bitform')} disabled={isInfo} />
        <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>
        <small className="d-blk mt-5">
          {__('To get API , Please Visit', 'bitform')}
          {' '}
          <a className="btcd-link" href="https://account.sendinblue.com/advanced/api" target="_blank" rel="noreferrer">{__('SendinBlue API Console', 'bitform')}</a>
        </small>
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
            Sorry, API key is invalid
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
