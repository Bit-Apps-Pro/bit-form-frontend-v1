import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import TutorialLink from '../../Utilities/TutorialLink'
import { handleAuthorize } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshTeams } from './ZohoWorkDriveCommonFunc'

export default function ZohoWorkDriveAuthorization({ formID, workDriveConf, setWorkDriveConf, step, setstep, isLoading, setisLoading, setSnackbar, redirectLocation, isInfo }) {
  const bits = useRecoilValue($bits)
  const { siteURL } = bits
  const [isAuthorized, setisAuthorized] = useState(false)
  const scopes = 'WorkDrive.team.READ,WorkDrive.workspace.READ,WorkDrive.workspace.CREATE,WorkDrive.workspace.UPDATE,WorkDrive.files.READ,WorkDrive.files.CREATE'
  const [error, setError] = useState({ dataCenter: '', clientId: '', clientSecret: '' })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
    refreshTeams(formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...workDriveConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setWorkDriveConf(newConf)
  }

  return (
    <>
      <TutorialLink
        title={tutorialLinks.zohoWorkDrive.title}
        youTubeLink={tutorialLinks.zohoWorkDrive.link}
      />
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && `${100}%` } }}>
        <div className="mt-3"><b>{__('Integration Name:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={workDriveConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} disabled={isInfo} />

        <div className="mt-3"><b>{__('Data Center:', 'bitform')}</b></div>
        <select onChange={handleInput} name="dataCenter" value={workDriveConf.dataCenter} className="btcd-paper-inp w-6 mt-1" disabled={isInfo}>
          <option value="">{__('--Select a data center--', 'bitform')}</option>
          <option value="com">zoho.com</option>
          <option value="eu">zoho.eu</option>
          <option value="com.cn">zoho.com.cn</option>
          <option value="in">zoho.in</option>
          <option value="com.au">zoho.com.au</option>
        </select>
        <div style={{ color: 'red' }}>{error.dataCenter}</div>

        <div className="mt-3"><b>{__('Homepage URL:', 'bitform')}</b></div>
        <CopyText value={siteURL} className="field-key-cpy w-6 ml-0" readOnly={isInfo} />

        <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bitform')}</b></div>
        <CopyText value={redirectLocation || `${bits.zohoRedirectURL}`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} />

        <small className="d-blk mt-5">
          {__('To get Client ID and SECRET , Please Visit', 'bitform')}
          {' '}
          <a className="btcd-link" href={`https://api-console.zoho.${workDriveConf?.dataCenter || 'com'}/`} target="_blank" rel="noreferrer">{__('Zoho API Console', 'bitform')}</a>
        </small>

        <div className="mt-3"><b>{__('Client id:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientId" value={workDriveConf.clientId} type="text" placeholder={__('Client id...', 'bitform')} disabled={isInfo} />
        <div style={{ color: 'red' }}>{error.clientId}</div>

        <div className="mt-3"><b>{__('Client secret:', 'bitform')}</b></div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientSecret" value={workDriveConf.clientSecret} type="text" placeholder={__('Client secret...', 'bitform')} disabled={isInfo} />
        <div style={{ color: 'red' }}>{error.clientSecret}</div>

        {!isInfo && (
          <>
            <button onClick={() => handleAuthorize('zohoWorkDrive', 'zworkdrive', scopes, workDriveConf, setWorkDriveConf, setError, setisAuthorized, setisLoading, setSnackbar)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized}>
              {isAuthorized ? __('Authorized ✔', 'bitform') : __('Authorize', 'bitform')}
              {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
            </button>
            <br />
            <button onClick={nextPage} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
              {__('Next', 'bitform')}
              <BackIcn className="ml-1 rev-icn" />
            </button>
          </>
        )}
      </div>
    </>
  )
}
