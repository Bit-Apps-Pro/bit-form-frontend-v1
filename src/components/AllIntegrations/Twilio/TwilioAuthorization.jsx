/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { handleAuthorize } from './TwilioCommonFunc'

export default function TwilioAuthorization({ twilioConf,
  setTwilioConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ username: '', password: '' })

  const nextPage = () => {
    setstep(2)
    document.querySelector('.btcd-s-wrp').scrollTop = 0
  }
  const handleInput = (e) => {
    const newConf = { ...twilioConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setTwilioConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && 'auto' },
      }}
    >
      <div className="mt-3">
        <b>{__('Integration Name:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={twilioConf.name}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('Account SID:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="sid"
        value={twilioConf.sid}
        type="text"
        placeholder={__('Account SID...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.sid}</div>

      <small className="d-blk mt-5">
        {__(
          'To get Account SID and Auth Token , Please Visit',
        )}
        {' '}
        <a
          className="btcd-link"
          href="https://console.twilio.com/"
          target="_blank"
          rel="noreferrer"
        >
          {__('Twilio Console')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('Auth Token:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="token"
        value={twilioConf.token}
        type="text"
        placeholder={__('Auth Token...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.token}</div>

      <div className="mt-3">
        <b>{__('From:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="from_num"
        value={twilioConf.from_num}
        type="text"
        placeholder={__('Phone Number...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.from_num}</div>

      {!isInfo && (
        <div>
          <button
            onClick={() => handleAuthorize(twilioConf, setTwilioConf, setError, setisAuthorized, setIsLoading, setSnackbar)}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}
          >
            {isAuthorized
              ? __('Authorized ✔')
              : __('Authorize')}
            {isLoading && (
              <LoaderSm
                size="20"
                clr="#022217"
                className="ml-2"
              />
            )}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={!isAuthorized}
          >
            {__('Next')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </div>
      )}
    </div>
  )
}
