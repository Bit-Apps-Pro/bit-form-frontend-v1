/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import HubspotAuthorization from './HubspotAuthorization'
import HubspotIntegLayout from './HubspotIntegLayout'
import { checkMappedFields, handleInput } from './HubspotCommonFunc'

function Hubspot({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const contactFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'firstname', label: 'First Name', required: false },
    { key: 'lastname', label: 'Last Name', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'jobtitle', label: 'Job Title', required: false },
  ]
  const dealFields = [
    { key: 'dealname', label: 'Deal Name', required: true },
    { key: 'amount', label: 'Amount', required: false },
    { key: 'closedate', label: 'Close Date', required: false },
  ]
  const ticketFields = [
    { key: 'subject', label: 'Ticket Name', required: true },
    { key: 'content', label: 'Ticket description', required: false },
  ]

  const [hubspotConf, setHubspotConf] = useState({
    name: 'Hubspot',
    type: 'Hubspot',
    api_key: process.env.NODE_ENV === 'development' ? '355115bb-4601-4a54-a974-d66d98103426' : '',
    field_map: [
      { formField: '', hubspotField: '' },
    ],
    actions: {},
    contactFields,
    dealFields,
    ticketFields,
  })

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, hubspotConf, history)
  }
  const nextPage = (pageNo) => {
    if (!checkMappedFields(hubspotConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    hubspotConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}

      <HubspotAuthorization
        hubspotConf={hubspotConf}
        setHubspotConf={setHubspotConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <HubspotIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, hubspotConf, setHubspotConf, setIsLoading, setSnackbar)}
          hubspotConf={hubspotConf}
          setHubspotConf={setHubspotConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!hubspotConf?.actionName}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
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

export default Hubspot
