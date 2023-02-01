import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoSignAuthorization from './ZohoSignAuthorization'
import { refreshTemplates, setGrantTokenResponse } from './ZohoSignCommonFunc'
import ZohoSignIntegLayout from './ZohoSignIntegLayout'

function ZohoSign({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [signConf, setSignConf] = useState({
    name: 'Zoho Sign API',
    type: 'Zoho Sign',
    clientId: process.env.NODE_ENV === 'development' ? '1000.3NJI1INPTI67F97ZTP6HXSBWAKJ8MG' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '6c358da44a5c32f9c1ec7a1d2fa4439ba4f0c89832' : '',
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoSign')
  }, [])

  const nextPage = val => {
    if (val === 2) {
      if (!signConf?.default?.templates) {
        refreshTemplates(formID, signConf, setSignConf, setisLoading, setSnackbar)
      }
    }
    setstep(val)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoSignAuthorization
        formID={formID}
        signConf={signConf}
        setSignConf={setSignConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      // step={step}
      // confTmp={signConf}
      // handleInput={(e) => handleInput(e, signConf, setSignConf, formID, setisLoading, setSnackbar, true, error, setError)}
      // error={error}
      // setSnackbar={setSnackbar}
      // handleAuthorize={() => handleAuthorize('zohoSign', 'zsign', scopes, signConf, setSignConf, setError, setisAuthorized, setisLoading, setSnackbar)}
      // isLoading={isLoading}
      // isAuthorized={isAuthorized}
      // nextPage={nextPage}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <ZohoSignIntegLayout
          formID={formID}
          formFields={formFields}
          signConf={signConf}
          setSignConf={setSignConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={signConf.template === ''}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bitform')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, signConf, history)}
      />
    </div>
  )
}

export default ZohoSign
