/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import BackIcn from '../../../Icons/BackIcn'
import { getAllRecipient, handleAuthorize } from './RapidmailCommonFunc'

export default function RapidmailAuthorization({ rapidmailConf,
  setRapidmailConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ username: '', password: '' })

  console.log('rapidmailConf', rapidmailConf)

  const nextPage = () => {
    !rapidmailConf?.default
            && getAllRecipient(
              rapidmailConf,
              setRapidmailConf,
              setIsLoading,
              setSnackbar,
            )
    setstep(2)
    document.querySelector('.btcd-s-wrp').scrollTop = 0
  }
  const handleInput = (e) => {
    const newConf = { ...rapidmailConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setRapidmailConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && `${100}%` },
      }}
    >
      <div className="mt-3">
        <b>{__('Integration Name:', 'bitform')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={rapidmailConf?.name}
        type="text"
        placeholder={__('Integration Name...', 'bitform')}
        disabled={isInfo}
      />

      <small className="d-blk mt-5">
        {__('To get Username and Password , Please Visit', 'bitform')}
        {' '}
        <a
          className="btcd-link"
          href="https://my.rapidmail.com/api/v3/userlist.html#/"
          target="_blank"
          rel="noreferrer"
        >
          {__('Create API User', 'bitform')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('User Name:', 'bitform')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="username"
        value={rapidmailConf?.username}
        type="text"
        placeholder={__('User name...', 'bitform')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.username}</div>

      <div className="mt-3">
        <b>{__('Password:', 'bitform')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="password"
        value={rapidmailConf?.password}
        type="text"
        placeholder={__('Password...', 'bitform')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.password}</div>

      {!isInfo && (
        <div>
          <button
            onClick={() => handleAuthorize(
              rapidmailConf,
              setRapidmailConf,
              setError,
              setisAuthorized,
              setIsLoading,
              setSnackbar,
            )}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}
          >
            {isAuthorized
              ? __('Authorized ✔', 'bitform')
              : __('Authorize', 'bitform')}
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
            {__('Next', 'bitform')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </div>
      )}
    </div>
  )
}
