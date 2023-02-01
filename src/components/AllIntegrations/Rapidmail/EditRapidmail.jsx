/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './RapidmailCommonFunc'
import RapidmailIntegLayout from './RapidmailIntegLayout'

function EditRapidmail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [rapidmailConf, setRapidmailConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(rapidmailConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, rapidmailConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, rapidmailConf, setRapidmailConf)} name="name" value={rapidmailConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <RapidmailIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, rapidmailConf, setRapidmailConf, setIsLoading, setSnackbar)}
        rapidmailConf={rapidmailConf}
        setRapidmailConf={setRapidmailConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={rapidmailConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditRapidmail
