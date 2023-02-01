import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoMailAuthorization from './ZohoMailAuthorization'
import ZohoMailIntegLayout from './ZohoMailIntegLayout'

function ZohoMail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [mailConf, setMailConf] = useState({
    name: 'Zoho Mail API',
    type: 'Zoho Mail',
    clientId: process.env.NODE_ENV === 'development' ? '1000.3NJI1INPTI67F97ZTP6HXSBWAKJ8MG' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '6c358da44a5c32f9c1ec7a1d2fa4439ba4f0c89832' : '',
    actions: {},
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoMail')
  }, [])

  const nextPage = val => {
    setstep(val)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoMailAuthorization
        formID={formID}
        mailConf={mailConf}
        setMailConf={setMailConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <ZohoMailIntegLayout
          formFields={formFields}
          mailConf={mailConf}
          setMailConf={setMailConf}
        />
        <button
          onClick={() => nextPage(3)}
          // disabled={mailConf.workspace === '' || mailConf.table === '' || mailConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, mailConf, history)}
      />
    </div>
  )
}

export default ZohoMail
