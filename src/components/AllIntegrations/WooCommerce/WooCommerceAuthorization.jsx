import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'

export default function WooCommerceAuthorization({ formID, wcConf, setWcConf, step, setStep, setSnackbar }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [showAuthMsg, setShowAuthMsg] = useState(false)

  const authorizeHandler = () => {
    setisLoading('auth')
    bitsFetch({}, 'bitforms_wc_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Connected with WooCommerce Successfully', 'bitform') })
        }
        setisLoading(false)
        setShowAuthMsg(true)
      })
  }

  const handleInput = e => {
    const newConf = deepCopy(wcConf)
    newConf[e.target.name] = e.target.value
    setWcConf(newConf)
  }

  return (
    <>
      <TutorialLink
        title={tutorialLinks.wooCommerce.title}
        youTubeLink={tutorialLinks.wooCommerce.link}
      />
      <div
        className="btcd-stp-page"
        style={{
          width: step === 1 && 900,
          height: step === 1 && `${100}%`,
        }}
      >
        <div className="mt-3">
          <b>{__('Integration Name:', 'bitform')}</b>
        </div>
        <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={wcConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />

        {isLoading === 'auth' && (
          <div className="flx mt-5">
            <LoaderSm size={25} clr="#022217" className="mr-2" />
            Checking if WooCommerce is active!!!
          </div>
        )}

        {(showAuthMsg && !isAuthorized && !isLoading) && (
          <div className="flx mt-5" style={{ color: 'red' }}>
            <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
              &times;
            </span>
            WooCommerce plugin must be activated to integrate with Bit Form.
          </div>
        )}

        {!isAuthorized && (
          <button onClick={authorizeHandler} className="btn btcd-btn-lg green sh-sm flx mt-5" type="button">
            {__('Connect', 'bitform')}
          </button>
        )}

        {isAuthorized && (
          <>
            <button onClick={() => setStep(2)} className="btn btcd-btn-lg green sh-sm flx mt-5" type="button" disabled={!isAuthorized}>
              {__('Next', 'bitform')}
              <BackIcn className="ml-1 rev-icn" />
            </button>
          </>
        )}
      </div>
    </>
  )
}
