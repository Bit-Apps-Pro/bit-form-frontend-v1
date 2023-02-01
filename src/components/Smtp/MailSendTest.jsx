/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { __ } from '../../Utils/i18nwrap'
import bitsFetch from '../../Utils/bitsFetch'
import LoaderSm from '../Loaders/LoaderSm'

export default function MailSendTest({ settab }) {
  const [isTestLoading, setisTestLoading] = useState(false)
  const formRef = useRef(null)
  const handleSubmit = (e) => {
    const testEmailData = new FormData(formRef.current)
    e.preventDefault()
    setisTestLoading(true)
    const prom = bitsFetch(testEmailData,
      'bitforms_test_email')
      .then((res) => {
        setisTestLoading(false)
        if (res !== undefined && res.success) {
          if (res.data) {
            return __('Email sent successfully.', 'bitform')
          }
          return __(`${res?.data?.errors?.[0]}`, 'bitform')
        }
        return __(`${res?.data?.errors?.[0]}`, 'bitform')
      })
    toast.promise(prom, {
      success: data => data,
      loading: __('Sending...', 'bitform'),
      error: data => data,
    })
  }

  return (
    <div>
      <h2>
        {__('Email Test', 'bitform')}
      </h2>
      <div>
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
          <div className="mt-2 flx">
            <label htmlFor="form_email_address" className="mr-2 wdt-150">
              <b>{__('To:', 'bitform')}</b>
            </label>
            <input id="form_email_address" name="to" className="btcd-paper-inp" placeholder="Email" type="email" required />
          </div>
          <div className="mt-2 flx">
            <label htmlFor="subject" className="mr-2 wdt-150">
              <b>{__('Subject:', 'bitform')}</b>
            </label>
            <input id="subject" name="subject" className="btcd-paper-inp" placeholder="Subject" type="text" required />
          </div>
          <div className="mt-2 flx">
            <label htmlFor="message" className="mr-2 wdt-150">
              <b>{__('Message:', 'bitform')}</b>
            </label>
            <input id="message" name="message" className="btcd-paper-inp" placeholder="Message" type="text" required />
          </div>
          <button type="submit" className="btn f-left btcd-btn-lg blue sh-sm flx" disabled={isTestLoading}>
            {__('Send Test Mail', 'bitform')}
            {isTestLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
          </button>
        </form>
      </div>
    </div>
  )
}
