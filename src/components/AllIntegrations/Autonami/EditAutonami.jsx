/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './AutonamiCommonFunc'
import AutonamiIntegLayout from './AutonamiIntegLayout'

function EditAutonami({ allIntegURL, formFields, integrations, setIntegration }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [autonamiConf, setAutonamiConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(autonamiConf)) {
      setSnackbar({
        show: true,
        msg: 'Please map all required fields to continue.',
      })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, autonamiConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">
          {__('Integration Name:', 'bitform')}
        </b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, autonamiConf, setAutonamiConf)}
          name="name"
          value={autonamiConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bitform')}
        />
      </div>
      <br />
      <br />

      <AutonamiIntegLayout
        formID={formID}
        formFields={formFields}
        autonamiConf={autonamiConf}
        setAutonamiConf={setAutonamiConf}
        isLoading={isLoading}
        step={2}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={autonamiConf.field_map.length < 1}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditAutonami
