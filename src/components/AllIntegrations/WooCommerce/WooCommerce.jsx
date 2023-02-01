import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import WooCommerceAuthorization from './WooCommerceAuthorization'
import { handleInput } from './WooCommerceCommonFunc'
import WooCommerceIntegLayout from './WooCommerceIntegLayout'

export default function WooCommerce({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [wcConf, setWcConf] = useState({
    name: 'WooCommerce Integration',
    type: 'WooCommerce',
    field_map: [{ formField: '', wcField: '' }],
    upload_field_map: [{ formField: '', wcField: '' }],
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (wcConf.workspace !== '' && wcConf.table !== '' && wcConf.field_map.length > 0) {
      setStep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <WooCommerceAuthorization
        formID={formID}
        wcConf={wcConf}
        setWcConf={setWcConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <WooCommerceIntegLayout
          wcConf={wcConf}
          setWcConf={setWcConf}
          formFields={formFields}
          handleInput={(e) => handleInput(e, wcConf, setWcConf, setisLoading, setSnackbar)}
          isLoading={isLoading}
          setisLoading={setisLoading}
        />

        <button
          onClick={nextPage}
          disabled={wcConf.workspace === '' || wcConf.table === '' || wcConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, wcConf, history)}
      />
    </div>
  )
}
