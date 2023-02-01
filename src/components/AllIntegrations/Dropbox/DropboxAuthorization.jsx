/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'
import { getAllDropboxFolders, handleAuthorize } from './DropboxCommonFunc'

export default function DropboxAuthorization({ formID, dropboxConf, setDropboxConf, step, setStep, isLoading, setIsLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ apiKey: '', apiSecret: '' })

  const nextPage = () => {
    getAllDropboxFolders(formID, dropboxConf, setDropboxConf, setIsLoading)
    setStep(2)
    document.querySelector('.btcd-s-wrp').scrollTop = 0
  }

  const handleInput = e => {
    const newConf = { ...dropboxConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setDropboxConf(newConf)
  }

  const getAccessCode = () => {
    if (!dropboxConf.apiKey || !dropboxConf.apiSecret) {
      toast.error(__('Please enter API key and API secret', 'bitform'))
      return
    }
    window.open(`https://www.dropbox.com/oauth2/authorize?client_id=${dropboxConf.apiKey}&token_access_type=offline&response_type=code`, '_blank')
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && `${100}%` } }}>
       <TutorialLink
        title={tutorialLinks.dropbox.title}
        youTubeLink={tutorialLinks.dropbox.link}
      />
      <div className="mt-3"><b>{__('Integration Name:', 'bitform')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={dropboxConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} disabled={isInfo} />

      <small className="d-blk mt-3">
        {__('To Get Api Key & Secret, Please Visit', 'bitform')}
        &nbsp;
        <a className="btcd-link" rel="noreferrer" target="_blank" href="https://www.dropbox.com/developers/apps/create?_tk=pilot_lp&_ad=ctabtn1&_camp=create">{__('Dropbox API Console', 'bitform')}</a>
      </small>

      <div className="mt-3"><b>{__('Dropbox Api Key:', 'bitform')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="apiKey" value={dropboxConf.apiKey} type="text" placeholder={__('Api Key...', 'bitform')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.apiKey}</div>

      <div className="mt-3"><b>{__('Dropbox Api Secret:', 'bitform')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="apiSecret" value={dropboxConf.apiSecret} type="text" placeholder={__('Api Secret...', 'bitform')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.apiSecret}</div>

      <small className="d-blk mt-3">
        {__('To Get Access Code, Please Visit', 'bitform')}
        &nbsp;
        <span className="btcd-link" style={{ cursor: 'pointer' }} onClick={getAccessCode} aria-hidden="true">{__('Dropbox Access Code', 'bitform')}</span>
      </small>

      <div className="mt-3"><b>{__('Dropbox Access Code:', 'bitform')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="accessCode" value={dropboxConf.accessCode} type="text" placeholder={__('Access Code...', 'bitform')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.accessCode}</div>

      {!isInfo && (
        <>
          <button onClick={() => handleAuthorize(dropboxConf, setDropboxConf, setIsAuthorized, setIsLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized}>
            {isAuthorized ? __('Authorized ✔', 'bitform') : __('Authorize', 'bitform')}
            {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bitform')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </>
      )}
    </div>
  )
}
