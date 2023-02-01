/* eslint-disable no-param-reassign */

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './HubspotCommonFunc'
import HubspotIntegLayout from './HubspotIntegLayout'

function EditHubspot({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()
  const [hubspotConf, setHubspotConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(hubspotConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bitform') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, hubspotConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, hubspotConf, setHubspotConf)} name="name" value={hubspotConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />

      <HubspotIntegLayout
        formFields={formFields}
        handleInput={(e) => handleInput(e, hubspotConf, setHubspotConf, setIsLoading, setSnackbar)}
        hubspotConf={hubspotConf}
        setHubspotConf={setHubspotConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={hubspotConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditHubspot
