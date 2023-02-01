import { useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { __ } from '../../Utils/i18nwrap'
import bitsFetch from '../../Utils/bitsFetch'
import LoaderSm from '../Loaders/LoaderSm'
import CheckBox from '../Utilities/CheckBox'

export default function SMTPConfigForm({ mail, settab, setMail, status, smtpStatus }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isShowing, setIsShowing] = useState(true)
  const [isAuthentic, setIsAuthentic] = useState(true)

  useEffect(() => {
    setIsShowing(Number(status) === 1)
    setIsAuthentic(Number(mail.smtp_auth) === 1)
  }, [status, mail.smtp_auth])

  const formRef = useRef(null)
  const handleSubmit = (e) => {
    const formmail = new FormData(formRef.current)
    e.preventDefault()
    setIsLoading(true)
    const prom = bitsFetch(formmail,
      'bitforms_mail_config')
      .then((res) => {
        if (res !== undefined && res.success) {
          setIsLoading(false)
        }
      })
    toast.promise(prom, {
      success: __('SMTP config saved successfully.', 'bitform'),
      loading: __('Saving...', 'bitform'),
      error: __('Something went wrong, Try again.', 'bitform'),
    })
  }
  const handleInput = (typ, val, isNumber) => {
    const tmpMail = { ...mail }
    if (isNumber) {
      tmpMail[typ] = Number(val)
    } else {
      tmpMail[typ] = val
    }
    if (typ === 'smtp_auth' && val === '1') {
      setIsAuthentic(true)
    } else if (typ === 'smtp_auth' && val === '0') {
      setIsAuthentic(false)
    }
    if (typ === 'encryption' && val === 'tls') {
      tmpMail.port = '587'
    } else if (typ === 'encryption' && val === 'ssl') {
      tmpMail.port = '465'
    } else if (typ === 'encryption' && val === 'none') {
      tmpMail.port = '25'
    }

    setMail(tmpMail)
  }

  const handleStatus = (e) => {
    const val = Number(e.target.value)
    smtpStatus(val)
    if (val === 1) {
      setIsShowing(true)
    } else {
      setIsShowing(false)
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <form
      method="POST"
      onSubmit={handleSubmit}
      ref={formRef}
      onKeyDown={e => {
        e.key === 'Enter'
          && e.target.tagName !== 'TEXTAREA'
          && e.preventDefault()
      }}
    >
      <small className="d-blk mt-3">
        <a className="btcd-link" href="https://docs.form.bitapps.pro/wpbitform-form-settings#smtp-configuration" target="_blank" rel="noreferrer">{__('Learn more about SMTP configuration', 'bitform')}</a>
      </small>
      <div className="mt-2">
        <label htmlFor="status">
          <b>{__('Enable SMTP', 'bitform')}</b>
          <CheckBox radio name="status" onChange={e => handleStatus(e)} checked={status === 1} title={<small className="txt-dp"><b>Yes</b></small>} value="1" />
          <CheckBox radio name="status" onChange={e => handleStatus(e)} checked={status !== 1} title={<small className="txt-dp"><b>No</b></small>} value="0" />
        </label>
      </div>

      {isShowing && (
        <div>
          <div className="mt-2">
            <label htmlFor="form_email_address">
              <b>{__('From Email Address', 'bitform')}</b>
              <input id="form_email_address" onChange={(e) => handleInput(e.target.name, e.target.value)} name="form_email_address" className="btcd-paper-inp mt-1" value={mail.form_email_address} placeholder="From Email Address" type="email" required />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="from_name">
              <b>{__('From Name', 'bitform')}</b>
              <input id="form_name" onChange={(e) => handleInput(e.target.name, e.target.value)} value={mail.form_name} name="form_name" className="btcd-paper-inp mt-1" placeholder="From Name" type="text" required />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="re_email_address">
              <b>{__('Reply-To Email Address', 'bitform')}</b>
              <input id="re_email_address" onChange={(e) => handleInput(e.target.name, e.target.value)} value={mail.re_email_address} name="re_email_address" className="btcd-paper-inp mt-1" placeholder="Reply-To Email Address" type="email" />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="smtp_host">
              <b>{__('SMTP Host', 'bitform')}</b>
              <input id="smtp_host" value={mail.smtp_host} onChange={(e) => handleInput(e.target.name, e.target.value)} name="smtp_host" className="btcd-paper-inp mt-1" placeholder="SMTP Host" type="text" required />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="encryption">
              <b>{__('Type of Encryption', 'bitform')}</b>
              <CheckBox radio name="encryption" id="encryption" onChange={e => handleInput(e.target.name, e.target.value)} checked={mail.encryption === 'none' || mail.encryption !== 'tls' || mail.encryption !== 'ssl'} title={<small className="txt-dp"><b>NONE</b></small>} value="none" />
              <CheckBox radio name="encryption" id="encryption" onChange={e => handleInput(e.target.name, e.target.value)} checked={mail.encryption === 'tls'} title={<small className="txt-dp"><b>TLS</b></small>} value="tls" />
              <CheckBox radio name="encryption" id="encryption" onChange={e => handleInput(e.target.name, e.target.value)} checked={mail.encryption === 'ssl'} title={<small className="txt-dp"><b>SSL</b></small>} value="ssl" />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="encryption">
              <b>{__('SMTP Port', 'bitform')}</b>
              <input id="port" value={mail.port} onChange={(e) => handleInput(e.target.name, e.target.value)} name="port" className="btcd-paper-inp mt-1" placeholder="SMTP port" type="number" required />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="encryption">
              <b>{__('SMTP Authentication', 'bitform')}</b>
              <CheckBox radio name="smtp_auth" onChange={e => handleInput(e.target.name, e.target.value)} checked={mail.smtp_auth === '1'} title={<small className="txt-dp">Yes</small>} value="1" />
              <CheckBox radio name="smtp_auth" onChange={e => handleInput(e.target.name, e.target.value)} checked={mail.smtp_auth !== '1'} title={<small className="txt-dp">No</small>} value="0" />
            </label>
          </div>
          {isAuthentic && (
            <div>
              <div className="mt-2">
                <label htmlFor="smtp_user_name">
                  <b>{__('SMTP Username', 'bitform')}</b>
                  <input id="smtp_user_name" value={mail.smtp_user_name} onChange={(e) => handleInput(e.target.name, e.target.value)} name="smtp_user_name" className="btcd-paper-inp mt-1" placeholder=" SMTP Username" type="text" required />
                </label>
              </div>
              <div className="mt-2">
                <label htmlFor="smtp_password">
                  <b>{__('SMTP Password', 'bitform')}</b>
                  <input id="smtp_password" onChange={(e) => handleInput(e.target.name, e.target.value)} value={mail.smtp_password} name="smtp_password" className="btcd-paper-inp mt-1" placeholder="SMTP Password" type="password" required />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
      <button type="submit" className="btn btcd-btn-lg blue flx" disabled={isLoading}>
        {__('Save Changes', 'bitform')}
        {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
      </button>
    </form>
  )
}
