/* eslint-disable no-param-reassign */
import { useContext, useState } from 'react'
import DatePicker from 'react-date-picker'
import { Link } from 'react-router-dom'
import TimePicker from 'react-time-picker'
import { useRecoilState, useRecoilValue } from 'recoil'
import { produce } from 'immer'
import { $additionalSettings, $bits, $fields } from '../GlobalStates'
import GoogleAdIcn from '../Icons/GoogleAdIcn'
import HoneypotIcn from '../Icons/HoneypotIcn'
import { AppSettings } from '../Utils/AppSettingsContext'
import { __ } from '../Utils/i18nwrap'
import Accordions from './Utilities/Accordions'
import CheckBox from './Utilities/CheckBox'
import ConfirmModal from './Utilities/ConfirmModal'
import Modal from './Utilities/Modal'
import Cooltip from './Utilities/Cooltip'
import { deepCopy } from '../Utils/Helpers'
import SingleToggle2 from './Utilities/SingleToggle2'
import TrashIcn from '../Icons/TrashIcn'
import LoginIcn from '../Icons/LoginIcn'
import FocusIcn from '../Icons/FocusIcn'
import DBIcn from '../Icons/DBIcn'
import ReCaptchaIcn from '../Icons/ReCaptchaIcn'
import EmptyIcn from '../Icons/EmptyIcn'

export default function SingleFormSettings() {
  const [additionalSetting, setadditional] = useRecoilState($additionalSettings)
  const fields = useRecoilValue($fields)
  const [alertMdl, setAlertMdl] = useState({ show: false, msg: '' })
  const [showCaptchaAdvanced, setShowCaptchaAdvanced] = useState(false)
  const { reCaptchaV3 } = useContext(AppSettings)
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [proModal, setProModal] = useState({ show: false, msg: '' })

  const clsAlertMdl = () => {
    const tmpAlert = { ...alertMdl }
    tmpAlert.show = false
    setAlertMdl(tmpAlert)
  }

  const addMoreBlockIp = () => {
    const additional = deepCopy(additionalSetting)
    if ('blocked_ip' in additional.settings) {
      additional.settings.blocked_ip.push({ ip: '', status: false })
    } else {
      additional.settings.blocked_ip = []
      additional.settings.blocked_ip.push({ ip: '', status: false })
    }
    setadditional(additional)
    // saveForm()
  }

  const addMorePrivateIp = () => {
    const additional = deepCopy(additionalSetting)
    if ('private_ip' in additional.settings) {
      additional.settings.private_ip.push({ ip: '', status: false })
    } else {
      additional.settings.private_ip = []
      additional.settings.private_ip.push({ ip: '', status: false })
    }
    setadditional({ ...additional })
  }

  const delBlkIp = i => {
    const additional = deepCopy(additionalSetting)
    additional.settings.blocked_ip.splice(i, 1)
    setadditional({ ...additional })
  }

  const delPrivateIp = i => {
    const additional = deepCopy(additionalSetting)
    additional.settings.private_ip.splice(i, 1)
    setadditional({ ...additional })
  }

  const setEntryLimit = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.value > 0) {
      additional.settings.entry_limit = e.target.value
      setadditional({ ...additional })
    }
  }

  const setOnePerIp = e => {
    const additionalSettings = deepCopy(additionalSetting)
    if (e.target.checked) {
      additionalSettings.enabled.onePerIp = true
    } else {
      delete additionalSettings.enabled.onePerIp
    }
    additionalSettings.updateForm = 1
    setadditional(additionalSettings)
    // saveForm('addional', additionalSettings)
  }

  const storeSubmission = e => {
    const additionalSettings = deepCopy(additionalSetting)
    if (!isPro) {
      setProModal({ show: true, msg: 'Disable entry storing is in Pro Version!' })
      return
    }
    if (e.target.checked) {
      additionalSettings.enabled.submission = true
    } else {
      delete additionalSettings.enabled.submission
    }
    setadditional(additionalSettings)
  }

  const setCustomMsg = (e, typ) => {
    const additionalSettings = deepCopy(additionalSetting)
    additionalSettings.settings[typ][e.target.name] = e.target.value
    setadditional(additionalSettings)
  }

  const enableReCaptchav3 = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      let msg
      if (!reCaptchaV3 || !reCaptchaV3?.siteKey || !reCaptchaV3?.secretKey) {
        msg = __(
          <p>
            to use ReCaptchaV3, you must set site key and secret from
            &nbsp;
            <Link to="/app-settings/recaptcha">app settings</Link>
          </p>, 'bitform',
        )
        setAlertMdl({ show: true, msg })
        return false
      }

      const captchaFlds = fields ? Object.values(fields).find(fld => fld.typ === 'recaptcha') : undefined

      if (captchaFlds) {
        msg = __(
          <p>
            You can use either ReCaptchaV2 or ReCaptchaV3 in a form. to use ReCaptchaV3 remove the ReCaptchaV2 from the form builder.
          </p>, 'bitform',
        )
        setAlertMdl({ show: true, msg })
        return false
      }

      additional.enabled.recaptchav3 = true
      additional.updateForm = 1
      if (!additional.settings.recaptchav3) {
        additional.settings.recaptchav3 = {
          score: '0.6',
          message: __('ReCaptcha validation failed.', 'bitform'),
        }
      }
    } else {
      delete additional.enabled.recaptchav3
      additional.updateForm = 1
      delete additional.settings.recaptchav3
    }
    setadditional({ ...additional })
  }

  const toggleCaptureGCLID = e => {
    const additional = deepCopy(additionalSetting)
    if (!isPro) {
      setProModal({ show: true, msg: 'Google Ads is in Pro Version!' })
      return false
    }
    if (e.target.checked) {
      additional.enabled.captureGCLID = true
    } else {
      delete additional.enabled.captureGCLID
    }
    additional.updateForm = 1
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const tolggleHoneypot = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.honeypot = true
    } else {
      delete additional.enabled.honeypot
    }
    additional.updateForm = 1
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const handleEntryLimit = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.entry_limit = true
    } else {
      delete additional.enabled.entry_limit
    }
    additional.updateForm = 1
    setadditional({ ...additional })
  }

  const hideReCaptchaBadge = e => {
    const additional = deepCopy(additionalSetting)
    if (!additional.settings.recaptchav3) additional.settings.recaptchav3 = {}
    if (e.target.checked) {
      additional.settings.recaptchav3.hideReCaptcha = true
    } else {
      delete additional.settings.recaptchav3.hideReCaptcha
    }
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const setReCaptchaScore = e => {
    const additional = deepCopy(additionalSetting)
    const { value } = e.target
    if (!additional.settings.recaptchav3) additional.settings.recaptchav3 = {}
    if (value) {
      if (Number(value) < 0) additional.settings.recaptchav3.score = 0
      else if (Number(value) > 1) additional.settings.recaptchav3.score = 1
      else additional.settings.recaptchav3.score = value
    } else {
      delete additional.settings.recaptchav3.score
    }
    setadditional({ ...additional })
  }

  const setReCaptchaLowScoreMessage = e => {
    const additional = deepCopy(additionalSetting)
    const { value } = e.target
    if (!additional.settings.recaptchav3) additional.settings.recaptchav3 = {}
    if (value) {
      additional.settings.recaptchav3.message = value
    } else {
      delete additional.settings.recaptchav3.message
    }
    setadditional({ ...additional })
  }

  const handleIpStatus = (e, i, type) => {
    const additional = deepCopy(additionalSetting)
    if (type === 'private') {
      additional.settings.private_ip[i].status = e.target.checked
      if (e.target.checked) {
        additional.enabled.private_ip = true
      } else if (additional.settings.private_ip.some(itm => itm.status === true)) {
        additional.enabled.private_ip = true
      } else if (!(additional.settings.private_ip.some(itm => itm.status === true))) {
        delete additional.enabled.private_ip
      }
    } else {
      additional.settings.blocked_ip[i].status = e.target.checked
      if (e.target.checked) {
        additional.enabled.blocked_ip = true
      } else if (additional.settings.blocked_ip.some(itm => itm.status === true)) {
        additional.enabled.private_ip = true
      } else if (!(additional.settings.blocked_ip.some(itm => itm.status === true))) {
        delete additional.enabled.blocked_ip
      }
    }
    additional.updateForm = 1
    setadditional({ ...additional })
  }

  const handleIp = (e, i, typ) => {
    const additional = deepCopy(additionalSetting)
    if (typ === 'blocked') {
      additional.settings.blocked_ip[i].ip = e.target.value
    } else {
      additional.settings.private_ip[i].ip = e.target.value
    }
    setadditional({ ...additional })
  }

  const toggleAllIpStatus = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.blocked_ip = true
      for (let i = 0; i < additional.settings.blocked_ip.length; i += 1) {
        additional.settings.blocked_ip[i].status = true
      }
    } else {
      delete additional.enabled.blocked_ip
      for (let i = 0; i < additional.settings.blocked_ip.length; i += 1) {
        additional.settings.blocked_ip[i].status = false
      }
    }
    additional.updateForm = 1
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const toggleAllPvtIpStatus = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.private_ip = true
      for (let i = 0; i < additional.settings.private_ip.length; i += 1) {
        additional.settings.private_ip[i].status = true
      }
    } else {
      delete additional.enabled.private_ip
      for (let i = 0; i < additional.settings.private_ip.length; i += 1) {
        additional.settings.private_ip[i].status = false
      }
    }
    additional.updateForm = 1
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const handleRestrictFrom = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      if (additional.settings.restrict_form === undefined
        || additional.settings.restrict_form.date === undefined
        || additional.settings.restrict_form.time === undefined) {
        additional.settings.restrict_form = { day: ['Everyday'], date: { from: new Date(), to: new Date() }, time: { from: '00:00', to: '23:59' } }
      }
      additional.enabled.restrict_form = true
    } else {
      delete additional.enabled.restrict_form
    }
    additional.updateForm = 1
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const checkAllDayInArr = arr => {
    let flg = false
    for (let i = 0; i < arr.length; i += 1) {
      if (arr.length === 7 && (arr[i] === 'Friday'
        || arr[i] === 'Saturday'
        || arr[i] === 'Sunday'
        || arr[i] === 'Monday'
        || arr[i] === 'Tuesday'
        || arr[i] === 'Wednesday'
        || arr[i] === 'Thursday')) {
        flg = true
      } else {
        flg = false
      }
    }
    return flg
  }

  const handleDate = (val, typ) => {
    const date = new Date(val)
    const y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    const m = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
    const d = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

    setadditional(prvState => produce(prvState, drft => {
      if (typ === 'from') {
        drft.settings.restrict_form.date.from = `${m}-${d}-${y}`
      } else {
        drft.settings.restrict_form.date.to = `${m}-${d}-${y}`
      }
    }))
  }

  const handleTime = (val, typ) => {
    if ('restrict_form' in additionalSetting.settings && 'time' in additionalSetting.settings.restrict_form) {
      setadditional(prvState => produce(prvState, drft => {
        if (typ === 'from') {
          drft.settings.restrict_form.time.from = val
        } else {
          drft.settings.restrict_form.time.to = val
        }
      }))
    }
  }

  const setRestrictForm = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      if ('restrict_form' in additional.settings && 'day' in additional.settings.restrict_form) {
        if (e.target.value === 'Everyday' || checkAllDayInArr(additional.settings.restrict_form.day)) {
          additional.settings.restrict_form.day = ['Everyday']
        } else if (e.target.value === 'Custom') {
          additional.settings.restrict_form.day = ['Custom']
          additional.settings.restrict_form.date = { from: new Date(), to: new Date() }
        } else {
          if (additional.settings.restrict_form.day.indexOf('Custom') > -1) {
            const i = additional.settings.restrict_form.day.indexOf('Custom')
            additional.settings.restrict_form.day.splice(i, 1)
          }
          additional.settings.restrict_form.day.push(e.target.value)
        }
      } else {
        if (!('restrict_form' in additional.settings)) {
          additional.settings.restrict_form = {}
        }
        additional.settings.restrict_form.day = []
        if (e.target.value === 'Everyday' || checkAllDayInArr(additional.settings.restrict_form.day)) {
          additional.settings.restrict_form.day = ['Everyday']
        } else if (e.target.value === 'Custom') {
          additional.settings.restrict_form.day = ['Custom']
        } else {
          if (additional.settings.restrict_form.day.indexOf('Custom') > -1) {
            const i = additional.settings.restrict_form.day.indexOf('Custom')
            additional.settings.restrict_form.day.splice(i, 1)
          }
          additional.settings.restrict_form.day.push(e.target.value)
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (e.target.value === 'Everyday') {
        additional.settings.restrict_form.day = ['Friday']
      } else if (e.target.value === 'Custom') {
        additional.settings.restrict_form.day = ['Everyday']
      } else if (e.target.value !== 'Everyday' && e.target.value !== 'Custom' && additional.settings.restrict_form.day.indexOf('Everyday') > -1) {
        const days = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
        days.splice(days.indexOf(e.target.value), 1)
        additional.settings.restrict_form.day = days
      } else {
        const i = additional.settings.restrict_form.day.indexOf(e.target.value)
        additional.settings.restrict_form.day.splice(i, 1)
      }
    }
    setadditional({ ...additional })
  }

  const checkRestrictFromExist = val => {
    const additional = deepCopy(additionalSetting)
    if ('restrict_form' in additional.settings
      && 'day' in additional.settings.restrict_form
      && additional.settings.restrict_form.day.some(itm => (itm === val))) {
      return true
    }
    if ('restrict_form' in additional.settings
      && 'day' in additional.settings.restrict_form
      && additional.settings.restrict_form.day.some(itm => (itm === val || itm === 'Everyday'))
      && val !== 'Custom'
    ) {
      return true
    }
    return false
  }

  const showToleranceLabel = score => {
    if (score) {
      if (score < 0.45) {
        return 'Low'
      }
      if (score < 0.75) {
        return 'Medium'
      }
      if (score >= 0.75) {
        return 'High'
      }
    }
    return 'Medium'
  }

  const toggleCaptchaAdvanced = () => setShowCaptchaAdvanced(show => !show)

  const setValidateFocusLost = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.validateFocusLost = true
    } else {
      delete additional.enabled.validateFocusLost
    }
    additional.updateForm = 1
    setadditional(additional)
    // saveForm('addional', additional)
  }

  const setAccordingEnable = (e, type, title) => {
    const additional = deepCopy(additionalSetting)
    if (!isPro) {
      setProModal({ show: true, msg: `${title} is in Pro Version!` })
      return true
    }

    let msg = ''
    if (type === 'is_login') msg = 'You must be logged in.'
    else msg = 'Empty form cannot be submitted.'

    if (e.target.checked) {
      if (!additional.settings[type]) {
        additional.settings[type] = { message: __(msg, 'bitform') }
      }
      additional.enabled[type] = true
    } else {
      delete additional.enabled[type]
      delete additional.settings[type]
    }
    setadditional(additional)
  }

  return (
    <div>
      <h2>{__('Settings', 'bitform')}</h2>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div>
            <b>
              <span className="btcd-icn icn-one mr-2" />
              {__('Allow single entry for each IP address', 'bitform')}
            </b>
          </div>
          <SingleToggle2 action={setOnePerIp} checked={'onePerIp' in additionalSetting.enabled} className="flx" />
        </div>
      </div>
      <Accordions
        customTitle={(
          <b>
            <span className="mr-2"><LoginIcn size={20} /></span>
            {__('Require user to be logged in for submit form', 'bitform')}
          </b>
        )}
        toggle
        action={(e) => setAccordingEnable(e, 'is_login', 'User Require Login')}
        checked={additionalSetting?.enabled?.is_login}
        cls="w-6 mt-3"
      >
        <>
          <div className="mb-2 ml-2">
            <b>Error message</b>
            <br />
            <input type="text" placeholder="Error message" name="message" className="btcd-paper-inp w-6 mt-1" onChange={(e) => setCustomMsg(e, 'is_login')} value={additionalSetting.settings?.is_login?.message} />
          </div>
        </>
      </Accordions>
      <Accordions
        customTitle={(
          <b>
            <span className="mr-2">
              <EmptyIcn size="20" />
            </span>
            {__('Disallow empty form submission', 'bitform')}
          </b>
        )}
        cls="w-6 mt-3"
        toggle
        action={(e) => setAccordingEnable(e, 'empty_submission', 'Empty Submission')}
        checked={additionalSetting?.enabled?.empty_submission}
      >
        <>
          <div className="mb-2 ml-2">
            <b>Error message</b>
            <br />
            <input type="text" placeholder="Error message" name="message" className="btcd-paper-inp w-6 mt-1" onChange={(e) => setCustomMsg(e, 'empty_submission')} value={additionalSetting.settings?.empty_submission?.message} />
          </div>
        </>

      </Accordions>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <b>
              <span className="mr-2">
                <FocusIcn size="20" />
              </span>
              {__('Validate form input on focus lost', 'bitform')}
            </b>
          </div>
          <SingleToggle2 action={setValidateFocusLost} checked={'validateFocusLost' in additionalSetting.enabled} className="flx" />
        </div>
      </div>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <DBIcn size="20" />
            </span>
            <b>
              {__('Disable entry storing in WordPress database', 'bitform')}
            </b>
          </div>
          <SingleToggle2 disabled={!isPro} action={storeSubmission} checked={'submission' in additionalSetting.enabled} className="flx" />
        </div>
      </div>
      <Accordions
        customTitle={(
          <b>
            <span className="mr-2">
              <ReCaptchaIcn size="20" />
            </span>
            {__('Enable ReCaptcha V3', 'bitform')}
          </b>
        )}
        cls="w-6 mt-3"
      >
        <div className="flx mb-2 ml-2">
          <SingleToggle2 action={enableReCaptchav3} checked={'recaptchav3' in additionalSetting.enabled} className="flx" />
          {__('Enable / Disable', 'bitform')}
        </div>
        {additionalSetting.enabled.recaptchav3 && (
          <>
            <div className="flx mb-4 ml-2">
              <SingleToggle2 action={hideReCaptchaBadge} checked={additionalSetting.settings?.recaptchav3?.hideReCaptcha} className="flx" />
              {__('Hide ReCaptcha Badge', 'bitform')}
            </div>
            <span
              className="btcd-link cp mb-4 ml-2"
              onClick={toggleCaptchaAdvanced}
              onKeyDown={toggleCaptchaAdvanced}
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
            >
              {__(`${!showCaptchaAdvanced ? 'Show' : 'Hide'} Advanced Settings`, 'bitform')}
            </span>
            {showCaptchaAdvanced && (
              <>
                <div className="mt-3 mb-4 ml-2">
                  <b>Tolerance Level</b>
                  <br />
                  <div className="flx mt-1">
                    <div className="mt-1">
                      <input aria-label="Recaptcha tolerance label range input" type="range" className="btc-range mr-2" min="0.3" max="0.9" step="0.3" onChange={setReCaptchaScore} value={additionalSetting.settings?.recaptchav3?.score} />
                      <p className="m-0">
                        <b>{showToleranceLabel(additionalSetting.settings?.recaptchav3?.score)}</b>
                      </p>
                    </div>
                    <input aria-label="Recaptcha tolerance label input" className="btcd-paper-inp w-1" type="number" min="0" max="1" step="0.1" onChange={setReCaptchaScore} value={additionalSetting.settings?.recaptchav3?.score} />
                  </div>

                </div>
                <div className="mb-2 ml-2">
                  <b>Low Score Message</b>
                  <br />
                  <input type="text" placeholder="Low Score Message" className="btcd-paper-inp w-6 mt-1" onChange={setReCaptchaLowScoreMessage} value={additionalSetting.settings?.recaptchav3?.message} />
                </div>
              </>
            )}
          </>
        )}
      </Accordions>

      <div className="w-6 mt-3">
        <div className={`flx flx-between sh-sm br-10 btcd-setting-opt cooltip-box ${!isPro && 'btcd-inte-pro'}`}>
          <div className="">
            <div className="flx">
              <HoneypotIcn w="20" h="19" />
              <span className="flx ml-2">
                <b>{__('Honeypot trap for bot', 'bitform')}</b>
                <Cooltip width={250} icnSize={17} className="ml-2 d-non">
                  <div className="txt-body">
                    Honeypot protection provides security mechanisms to protect your
                    site from form submission by spam bots. If spam bot activity is detected, form submission is blocked.
                    <br />
                    <a className="mt-1 cooltip-link" target="_blank" href="https://en.wikipedia.org/wiki/Honeypot_(computing)" rel="noreferrer">Learn More</a>
                  </div>
                </Cooltip>
              </span>
            </div>
          </div>
          <div className="flx">
            <SingleToggle2 disabled={!isPro} action={tolggleHoneypot} checked={'honeypot' in additionalSetting.enabled} className="flx" />
          </div>
        </div>
      </div>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="">
            <b>
              <span className="btcd-icn icn-block mr-2" />
              {__('Disable this form after limited entry', 'bitform')}
            </b>
          </div>
          <div className="flx">
            <input onChange={setEntryLimit} value={additionalSetting.settings.entry_limit} disabled={!('entry_limit' in additionalSetting.enabled)} className="btcd-paper-inp mr-2 wdt-200" placeholder="Limit" type="number" min="1" />
            <SingleToggle2 action={handleEntryLimit} checked={'entry_limit' in additionalSetting.enabled} className="flx" />
          </div>
        </div>
      </div>

      <Accordions
        customTitle={(
          <b>
            <span className="btcd-icn icn-date mr-2" />
            {__('Limit Form Submission Period', 'bitform')}
          </b>
        )}
        cls="w-6 mt-3"
      >
        <div className="flx mb-2 ml-2">
          <SingleToggle2 cls="flx" action={handleRestrictFrom} checked={'restrict_form' in additionalSetting.enabled} />
          {__('Enable / Disable', 'bitform')}
        </div>
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Everyday')} value="Everyday" title={__('Every Day', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Friday')} value="Friday" title={__('Friday', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Saturday')} value="Saturday" title={__('Saturday', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Sunday')} value="Sunday" title={__('Sunday', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Monday')} value="Monday" title={__('Monday', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Tuesday')} value="Tuesday" title={__('Tuesday', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Wednesday')} value="Wednesday" title={__('Wednesday', 'bitform')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Thursday')} value="Thursday" title={__('Thursday', 'bitform')} />
        <br />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Custom')} value="Custom" title={__('Custom Date', 'bitform')} />
        {'restrict_form' in additionalSetting.settings && additionalSetting.settings.restrict_form.day.indexOf('Custom') > -1 && (

          <div className="flx">
            <span className="mt-2 ml-2">Date:</span>
            <div className="mr-2 ml-2">
              <div><small>{__('From', 'bitform')}</small></div>
              <DatePicker
                onChange={val => handleDate(val, 'from')}
                value={new Date(additionalSetting?.settings?.restrict_form?.date?.from || null)}
                dayPlaceholder="dd"
                monthPlaceholder="mm"
                yearPlaceholder="year"
                className="btcd-date-pick"
                calendarClassName="btcd-date-pick-cln"
              />
            </div>
            <div>
              <div><small>{__('To', 'bitform')}</small></div>
              <DatePicker
                onChange={val => handleDate(val, 'to')}
                value={new Date(additionalSetting?.settings?.restrict_form?.date?.to || null)}
                dayPlaceholder="dd"
                monthPlaceholder="mm"
                yearPlaceholder="year"
                className="btcd-date-pick"
                calendarClassName="btcd-date-pick-cln"
              />
            </div>
          </div>
        )}

        <div className="flx mt-2">
          <span className="mt-2 ml-2">{__('Time:', 'bitform')}</span>
          <div className="mr-2 ml-2">
            <div><small>{__('From', 'bitform')}</small></div>
            <TimePicker
              onChange={val => handleTime(val, 'from')}
              value={additionalSetting?.settings?.restrict_form?.time?.from || new Date()}
            />
          </div>
          <div>
            <div><small>{__('To', 'bitform')}</small></div>
            <TimePicker
              onChange={val => handleTime(val, 'to')}
              value={additionalSetting?.settings?.restrict_form?.time?.to || new Date()}
              className="btcd-date-pick"
            />
          </div>
        </div>
      </Accordions>

      <Accordions
        customTitle={(
          <b>
            <span className="btcd-icn icn-r-block mr-2" />
            {__('Blocked IP list', 'bitform')}
          </b>
        )}
        cls="w-6 mt-3"
      >
        {'blocked_ip' in additionalSetting.settings && additionalSetting.settings.blocked_ip.length > 0 && (
          <div className="flx mb-2">
            <SingleToggle2 cls="flx" action={toggleAllIpStatus} checked={'blocked_ip' in additionalSetting.enabled} />
            {__('Enable / Disable', 'bitform')}
          </div>
        )}

        {'blocked_ip' in additionalSetting.settings && additionalSetting.settings.blocked_ip.map((itm, i) => (
          <div className="flx mt-1" key={`blk-ip-${i + 11}`}>
            <SingleToggle2 action={(e) => handleIpStatus(e, i)} checked={itm.status} />
            <input type="text" onChange={(e) => handleIp(e, i, 'blocked')} className="btcd-paper-inp" value={itm.ip} placeholder="000.0.0.00" />
            <button onClick={() => delBlkIp(i)} className="icn-btn ml-2" aria-label="delete" type="button"><TrashIcn /></button>
          </div>
        ))}
        <div className="txt-center">
          <button onClick={addMoreBlockIp} className="icn-btn sh-sm mt-1" type="button">+</button>
        </div>
      </Accordions>

      <Accordions
        customTitle={(
          <b>
            <span className="btcd-icn icn-lock mr-2" />
            {__('Allowed IP', 'bitform')}
          </b>
        )}
        cls="w-6 mt-3"
      >
        <div>
          <b>
            {__('Note', 'bitform')}
            :
          </b>
          {' '}
          {__('By enabling this option only listed IP can submit this form.', 'bitform')}
        </div>

        {'private_ip' in additionalSetting.settings && additionalSetting.settings.private_ip.length > 0 && (
          <div className="flx mb-2 mt-3">
            <SingleToggle2 cls="flx" action={toggleAllPvtIpStatus} checked={'private_ip' in additionalSetting.enabled} />
            {__('Enable / Disable', 'bitform')}
          </div>
        )}

        {'private_ip' in additionalSetting.settings && additionalSetting.settings.private_ip.map((itm, i) => (
          <div className="flx mt-1" key={`blk-ip-${i + 11}`}>
            <SingleToggle2 action={(e) => handleIpStatus(e, i, 'private')} checked={itm.status} />
            <input type="text" onChange={(e) => handleIp(e, i, 'private')} className="btcd-paper-inp" value={itm.ip} placeholder="000.0.0.00" />
            <button onClick={() => delPrivateIp(i)} className="icn-btn ml-2" aria-label="delete" type="button"><TrashIcn /></button>
          </div>
        ))}
        <div className="txt-center">
          <button onClick={addMorePrivateIp} className="icn-btn sh-sm mt-1" type="button">+</button>
        </div>
      </Accordions>

      <div className="w-6 mt-3">
        <div className={`flx flx-between sh-sm br-10 btcd-setting-opt ${!isPro && 'btcd-inte-pro'}`}>
          <div className="flx">
            <GoogleAdIcn size={18} />
            <b className="ml-2">{__('Capture Google Ads (Click ID)', 'bitform')}</b>
          </div>
          <SingleToggle2 disabled={!isPro} action={toggleCaptureGCLID} checked={'captureGCLID' in additionalSetting.enabled} className="flx" />
        </div>
      </div>

      {/*  <Accordions
        customTitle={(
          <b>
            <span className="btcd-icn icn-one mr-2" />
            {__('Disable storing form entries', 'bitform')}
          </b>
        )}
        cls="w-6 mt-3"
      >
        <div className="flx mb-2 ml-2">
          <SingleToggle2 action={handleDisableStoreEntry} checked={'disableStoreEntry' in additionalSetting.enabled} className="flx" />
          {__('Enable / Disable', 'bitform')}
        </div>
        {additionalSetting.enabled.disableStoreEntry && (
          <>
            <div className="flx mb-4 ml-2">
              <SingleToggle2 action={hideReCaptchaBadge} checked={additionalSetting.settings?.recaptchav3?.hideReCaptcha} className="flx" />
              {__('Hide ReCaptcha Badge', 'bitform')}
            </div>
            <span
              className="btcd-link cp mb-4 ml-2"
              onClick={toggleCaptchaAdvanced}
              onKeyDown={toggleCaptchaAdvanced}
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
            >
              {__(`${!showCaptchaAdvanced ? 'Show' : 'Hide'} Advanced Settings`, 'bitform')}
            </span>
            {showCaptchaAdvanced && (
              <>
                <div className="mt-3 mb-4 ml-2">
                  <b>Tolerance Level</b>
                  <br />
                  <div className="flx mt-1">
                    <div className="mt-1">
                      <input aria-label="Recaptcha tolerance label range input" type="range" className="btc-range mr-2" min="0.3" max="0.9" step="0.3" onChange={setReCaptchaScore} value={additionalSetting.settings?.recaptchav3?.score} />
                      <p className="m-0">
                        <b>{showToleranceLabel(additionalSetting.settings?.recaptchav3?.score)}</b>
                      </p>
                    </div>
                    <input aria-label="Recaptcha tolerance label input" className="btcd-paper-inp w-1" type="number" min="0" max="1" step="0.1" onChange={setReCaptchaScore} value={additionalSetting.settings?.recaptchav3?.score} />
                  </div>

                </div>
                <div className="mb-2 ml-2">
                  <b>Low Score Message</b>
                  <br />
                  <input type="text" placeholder="Low Score Message" className="btcd-paper-inp w-6 mt-1" onChange={setReCaptchaLowScoreMessage} value={additionalSetting.settings?.recaptchav3?.message} />
                </div>
              </>
            )}
          </>
        )}
      </Accordions>
 */}
      <div>
        <Modal
          sm
          show={proModal.show}
          setModal={() => setProModal({ show: false })}
          title={__('Premium Feature', 'bitform')}
          className="pro-modal"
        >
          <h4 className="txt-center mt-5">
            {proModal.msg}
          </h4>
          <div className="txt-center">
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer"><button className="btn btn-lg blue" type="button">{__('Buy Premium', 'bitform')}</button></a>
          </div>

        </Modal>
      </div>
      <div className="mb-4 mt-4"><br /></div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="red"
        btnTxt="Close"
        show={alertMdl.show}
        close={clsAlertMdl}
        action={clsAlertMdl}
        title="Sorry"
      >
        <div className="txt-center">
          {alertMdl.msg}
        </div>
      </ConfirmModal>
    </div>
  )
}
