/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './OneDriveCommonFunc'
import OneDriveIntegLayout from './OneDriveIntegLayout'

function EditOneDrive({ allIntegURL, formFields, integrations, setIntegration }) {
  const history = useHistory()
  const { id, formID } = useParams()
  const [oneDriveConf, setOneDriveConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, oneDriveConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-150 d-in-b mr-2">
          {__('Integration Name:', 'bitform')}
        </b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, oneDriveConf, setOneDriveConf)}
          name="name"
          value={oneDriveConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bitform')}
        />
      </div>
      <br />
      <br />

      <OneDriveIntegLayout
        formID={formID}
        formFields={formFields}
        oneDriveConf={oneDriveConf}
        setOneDriveConf={setOneDriveConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!oneDriveConf.actions.attachments || !oneDriveConf.folder}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditOneDrive
