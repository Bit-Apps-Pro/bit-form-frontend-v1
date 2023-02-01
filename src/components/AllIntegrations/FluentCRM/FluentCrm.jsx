import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import FluentCrmAuthorization from './FluentCrmAuthorization'
import { checkMappedFields, refreshCrmList } from './FluentCrmCommonFunc'
import FluentCrmIntegLayout from './FluentCrmIntegLayout'

export default function FluentCrm({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [fluentCrmConf, setFluentCrmConf] = useState({
    name: 'Fluent CRM API',
    type: 'Fluent CRM',
    field_map: [
      { formField: '', fluentCRMField: '' },
    ],
    actions: {},
  })

  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(fluentCrmConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!fluentCrmConf.list_id) {
        setSnackbar({ show: true, msg: 'Please select list to continue.' })
        return
      }
      if (fluentCrmConf.name !== '' && fluentCrmConf.field_map.length > 0) {
        setStep(val)
      }
    } else {
      setStep(val)
      if (val === 2 && fluentCrmConf.name) {
        refreshCrmList(formID, fluentCrmConf, setFluentCrmConf, setisLoading, setSnackbar)
      }
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <FluentCrmAuthorization
        formID={formID}
        fluentCrmConf={fluentCrmConf}
        setFluentCrmConf={setFluentCrmConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%`, minHeight: step === 2 && `${200}px` }}>
        <FluentCrmIntegLayout
          formID={formID}
          formFields={formFields}
          fluentCrmConf={fluentCrmConf}
          setFluentCrmConf={setFluentCrmConf}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />
        <br />
        <br />
        <br />
        <button
          onClick={() => nextPage(3)}
          disabled={!fluentCrmConf.list_id || fluentCrmConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, fluentCrmConf, history)}
      />
    </div>
  )
}
