import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import AcumbamailAuthorization from './AcumbamailAuthorization'
import { handleInput, checkMappedFields } from './AcumbamailCommonFunc'
import AcumbamailIntegLayout from './AcumbamailIntegLayout'

function Acumbamail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Add/Update Subscriber' },
    { key: '2', label: 'Delete Subscriber' },
  ]

  const addSubsCriberFields = [
    { key: 'email', label: 'Email', required: true },
  ]
  const [acumbamailConf, setAcumbamailConf] = useState({
    name: 'Acumbamail',
    type: 'Acumbamail',
    mainAction: '',
    listId: '',
    auth_token: process.env.NODE_ENV === 'development' ? 'sPz60EL4hoaRHJVYFSpV' : '',
    field_map: [
      { formField: '', acumbamailFormField: 'email' },
    ],
    addSubsCriberFields,
    allActions,
    address_field: [],
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(acumbamailConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (acumbamailConf.listId !== '') {
      setstep(3)
    }
  }

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, acumbamailConf, history)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <AcumbamailAuthorization
        formID={formID}
        acumbamailConf={acumbamailConf}
        setAcumbamailConf={setAcumbamailConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <AcumbamailIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar, formID)}
          acumbamailConf={acumbamailConf}
          setAcumbamailConf={setAcumbamailConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!acumbamailConf.mainAction || !checkMappedFields(acumbamailConf)}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bitform')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
      />

    </div>
  )
}

export default Acumbamail
