import produce from 'immer'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $bits } from '../GlobalStates'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import { setGrantTokenResponse } from './AllIntegrations/IntegrationHelpers/IntegrationHelpers'
import LoaderSm from './Loaders/LoaderSm'
import CopyText from './Utilities/CopyText'
import SnackMsg from './Utilities/SnackMsg'

export default function GCLID() {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [gclidConf, setGclidConf] = useState({
    name: 'Gclid',
    type: 'Google',
    clientId: process.env.NODE_ENV === 'development' ? '937096431638-4g5cmja77mlr790bun03l002qnj7n02c.apps.googleusercontent.com' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '1S9kl49CQJ9ainPhhLTwZUUU' : '',
    clientCustomerId: process.env.NODE_ENV === 'development' ? '' : '',
  })
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState({ clientId: '', clientSecret: '', clientCustomerId: '' })
  const [isAuthorized, setisAuthorized] = useState(false)

  useEffect(() => {
    window.opener && setGrantTokenResponse('gclid')
  }, [])

  useEffect(() => {
    bitsFetch({}, 'bitform_google_adword_config').then((res) => {
      if (res !== undefined && res.success) {
        if (res.data?.[0]?.integration_details) {
          setGclidConf(JSON.parse(res.data[0].integration_details))
        }
      }
    })
  }, [])

  const handleAuthorize = () => {
    if (!gclidConf.clientId) {
      setError({ clientId: !gclidConf.clientId ? __('Client ID cann\'t be empty', 'bitform') : '' })
      return
    }
    if (!gclidConf.clientSecret) {
      setError({ clientSecret: !gclidConf.clientSecret ? __('Secret key cann\'t be empty', 'bitform') : '' })
      return
    }
    if (!gclidConf.clientCustomerId) {
      setError({ clientCustomerId: !gclidConf.clientCustomerId ? __('Customer ID key cann\'t be empty', 'bitform') : '' })
      return
    }
    setisLoading(true)
    const apiEndpoint = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent('https://www.googleapis.com/auth/adwords')}&access_type=offline&prompt=consent&response_type=code&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.googleRedirectURL)}&client_id=${gclidConf.clientId}`
    const authWindow = window.open(apiEndpoint, '', 'width=400,height=609,toolbar=off')
    const popupURLCheckTimer = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(popupURLCheckTimer)
        let grantTokenResponse = {}
        let isauthRedirectLocation = false
        const gclidInfo = localStorage.getItem('__bitforms_gclid')
        if (gclidInfo) {
          isauthRedirectLocation = true
          grantTokenResponse = JSON.parse(gclidInfo)
          localStorage.removeItem('__bitforms_gclid')
        }
        if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
          const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
          setSnackbar({ show: true, msg: `${__('Authorization failed', 'bitform')} ${errorCause}. ${__('please try again', 'bitform')}` })
          setisLoading(false)
        } else {
          const newConf = produce(gclidConf, draft => {
            // eslint-disable-next-line no-param-reassign
            draft.accountServer = grantTokenResponse['accounts-server']
          })
          tokenHelper('google', grantTokenResponse, newConf, setGclidConf)
        }
      }
    }, 500)
  }

  const tokenHelper = (ajaxInteg, grantToken, confTmp, setConf) => {
    const tokenRequestParams = { ...grantToken }
    tokenRequestParams.clientId = confTmp.clientId
    tokenRequestParams.clientSecret = confTmp.clientSecret
    tokenRequestParams.clientCustomerId = confTmp.clientCustomerId
    tokenRequestParams.redirectURI = `${encodeURIComponent(bits.googleRedirectURL)}`
    bitsFetch(tokenRequestParams, `bitforms_${ajaxInteg}_generate_token`)
      .then(result => result)
      .then(result => {
        if (result && result.success) {
          const newConf = { ...confTmp }
          newConf.tokenDetails = result.data
          setConf(newConf)
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Authorized Successfully', 'bitform') })
        } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
          setSnackbar({ show: true, msg: `${__('Authorization failed Cause:', 'bitform')}${result.data.data || result.data}. ${__('please try again', 'bitform')}` })
        } else {
          setSnackbar({ show: true, msg: __('Authorization failed. please try again', 'bitform') })
        }
        setisLoading(false)
      })
  }
  const saveGoogleConfig = e => {
    bitsFetch(gclidConf, 'bitforms_save_google_refresh_token')
      .then(result => result)
      .then(result => {
        if (result && result.success) {
          setSnackbar({ show: true, msg: __('save Successfully', 'bitform') })
        } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
          setSnackbar({ show: true, msg: `${__('save failed Cause:', 'bitform')}${result.data.data || result.data}. ${__('please try again', 'bitform')}` })
        } else {
          setSnackbar({ show: true, msg: __('save failed. please try again', 'bitform') })
        }
        setisLoading(false)
      })
  }
  const handleInput = (typ, val) => {
    const tmpData = { ...gclidConf }
    tmpData[typ] = val
    setGclidConf(tmpData)
  }

  return (
    <div className="btcd-captcha w-5">
      <div className="pos-rel">
        {!isPro && (
          <div className="pro-blur flx" style={{ height: '99%', left: -15, width: '104%' }}>
            <div className="pro">
              {__('Available On', 'bitform')}
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Premium', 'bitform')}
                </span>
              </a>
            </div>
          </div>
        )}
        <SnackMsg snack={snack} setSnackbar={setSnackbar} />

        <h2>{__('Google Ads', 'bitform')}</h2>
        <br />
        <div className="btcd-hr" />

        <div className="mt-2">
          <label htmlFor="client_id">
            <b>{__('Client ID', 'bitform')}</b>
            <input id="clientId" name="clientId" onChange={(e) => handleInput(e.target.name, e.target.value)} value={gclidConf.clientId} className="btcd-paper-inp mt-1" placeholder="Client ID" type="text" />
          </label>
          <div style={{ color: 'red' }}>{error.clientId}</div>
        </div>
        <div className="mt-2">
          <label htmlFor="client_secret">
            <b>{__('Client Secret', 'bitform')}</b>
            <input id="clientSecret" name="clientSecret" onChange={(e) => handleInput(e.target.name, e.target.value)} value={gclidConf.clientSecret} className="btcd-paper-inp mt-1" placeholder="Client Secret" type="text" />
          </label>
          <div style={{ color: 'red' }}>{error.clientSecret}</div>
        </div>

        <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bitform')}</b></div>
        <CopyText value={`${bits.googleRedirectURL}`} className="field-key-cpy w-12 ml-0" />

        <div className="mt-2">
          <small className="d-blk mt-2">
            {__('To get Client ID and SECRET , Please Visit Google API Console', 'bitform')}
            {' '}
            <a className="btcd-link" href="https://console.developers.google.com/apis/credentials" target="_blank" rel="noreferrer">{__('Google API Console', 'bitform')}</a>
          </small>
        </div>

        <div className="mt-4">
          <label htmlFor="clientCustomerId">
            <b>{__('Customer Id (non manager account)', 'bitform')}</b>
            <input id="clientCustomerId" name="clientCustomerId" onChange={(e) => handleInput(e.target.name, e.target.value)} value={gclidConf.clientCustomerId} className="btcd-paper-inp mt-1" placeholder="client Customer Id" type="text" />
          </label>
          <div style={{ color: 'red' }}>{error.clientCustomerId}</div>
        </div>

        <div className="mt-2">
          <small className="d-blk mt-2">
            {__('To get Customer ID , Please Visit', 'bitform')}
            {' '}
            <a className="btcd-link" href="https://ads.google.com/home/tools/manager-accounts/" target="_blank" rel="noreferrer">{__('Google Ads Manager Account', 'bitform')}</a>
          </small>
        </div>

        <button onClick={handleAuthorize} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized}>
          {isAuthorized ? __('Authorized ✔', 'bitform') : __('Authorize', 'bitform')}
          {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
        </button>
        <br />
        {isAuthorized && (
          <button onClick={e => saveGoogleConfig(e)} className="btn f-right btcd-btn-lg blue sh-sm flx" type="button" disabled={!isAuthorized}>
            Save
          </button>
        )}

      </div>
    </div>
  )
}
