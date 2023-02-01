import { useContext, useState } from 'react'

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { useRecoilValue } from 'recoil'
import { __ } from '../Utils/i18nwrap'
import { AppSettings } from '../Utils/AppSettingsContext'
import CopyText from './Utilities/CopyText'
import bitsFetch from '../Utils/bitsFetch'
import SnackMsg from './Utilities/SnackMsg'
import LoaderSm from './Loaders/LoaderSm'
import { $bits } from '../GlobalStates'

export default function Captcha() {
  const { reCaptchaV2, setreCaptchaV2, reCaptchaV3, setreCaptchaV3 } = useContext(AppSettings)
  const bits = useRecoilValue($bits)
  const [snack, setsnack] = useState({ show: false })
  const [loading, setLoading] = useState(false)

  const saveCaptcha = version => {
    setLoading(true)
    const reCaptcha = version === 'v2' ? reCaptchaV2 : reCaptchaV3
    bitsFetch({ version, reCaptcha }, 'bitforms_save_grecaptcha')
      .then(res => {
        if (res !== undefined && res.success) {
          if (res.data && res.data.id) {
            if (version === 'v2') {
              setreCaptchaV2({ ...reCaptchaV2, id: res.data.id })
            } else if (version === 'v3') {
              setreCaptchaV3({ ...reCaptchaV3, id: res.data.id })
            }
          }
          setsnack({ ...{ show: true, msg: __('Captcha Settings Updated', 'bitform') } })
        }
        setLoading(false)
      })
      .catch(_ => setLoading(false))
  }

  const onInput = (e, version) => {
    if (version === 'v2') {
      reCaptchaV2[e.target.name] = e.target.value
      setreCaptchaV2({ ...reCaptchaV2 })
    } else if (version === 'v3') {
      reCaptchaV3[e.target.name] = e.target.value
      setreCaptchaV3({ ...reCaptchaV3 })
    }
  }

  return (
    <div className="btcd-captcha">
      <SnackMsg snack={snack} setSnackbar={setsnack} />
      <Tabs
        selectedTabClassName="s-t-l-active"
      >
        <TabList className="flx m-0 mt-2">
          {['v3', 'v2'].map(ver => (
            <Tab className="btcd-s-tab-link">
              <b>{__(`reCaptcha ${ver}`, 'bitform')}</b>
            </Tab>
          ))}
        </TabList>
        <div className="btcd-hr" />
        {['v3', 'v2'].map(ver => (
          <TabPanel key={ver}>
            <h2>{__(`Google reCAPTCHA ${ver}`, 'bitform')}</h2>
            <small>
              {__('reCAPTCHA is a free service that protects your website from spam and abuse.', 'bitform')}
              <a className="btcd-link" href={`https://developers.google.com/recaptcha/docs/${ver === 'v3' ? 'v3' : 'display'}`} target="_blank" rel="noopener noreferrer">
                &nbsp;
                {__('Learn More', 'bitform')}
              </a>
            </small>
            <br />

            <div className="mt-3">{__('Domain URL:', 'bitform')}</div>
            <CopyText value={bits.siteURL} className="field-key-cpy ml-0" />
            <div className="mt-2">
              <label htmlFor="captcha-key">
                {__('Site Key', 'bitform')}
                <input id="captcha-key" onChange={e => onInput(e, ver)} name="siteKey" className="btcd-paper-inp mt-1" value={(ver === 'v3' ? reCaptchaV3 : reCaptchaV2).siteKey} placeholder="Site Key" type="text" />
              </label>
            </div>
            <div className="mt-2">
              <label htmlFor="captcha-secret">
                {__('Secret Key', 'bitform')}
                <input id="captcha-secret" onChange={e => onInput(e, ver)} name="secretKey" className="btcd-paper-inp mt-1" value={(ver === 'v3' ? reCaptchaV3 : reCaptchaV2).secretKey} placeholder="Secret Key" type="text" />
              </label>
            </div>
            <div className="mt-2">
              <p>
                {__('To get Site Key and SECRET , Please Visit', 'bitform')}
                &nbsp;
                <a className="btcd-link" href="https://www.google.com/recaptcha/admin/" target="_blank" rel="noreferrer">{__('Google reCAPTCHA Admin', 'bitform')}</a>
              </p>
            </div>
            <button onClick={() => saveCaptcha(ver)} type="button" className="btn btn-md f-right blue" disabled={loading}>
              {__('Save', 'bitform')}
              {loading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
            </button>
          </TabPanel>
        ))}
      </Tabs>

    </div>
  )
}
