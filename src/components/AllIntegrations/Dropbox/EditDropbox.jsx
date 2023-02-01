/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './DropboxCommonFunc'
import DropboxIntegLayout from './DropboxIntegLayout'

function EditDropbox({ allIntegURL, formFields, integrations, setIntegration }) {
  const history = useHistory()
  const { id, formID } = useParams()
  const [dropboxConf, setDropboxConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, dropboxConf, history, id, 1)
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
          onChange={(e) => handleInput(e, dropboxConf, setDropboxConf)}
          name="name"
          value={dropboxConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bitform')}
        />
      </div>
      <br />
      <br />

      <DropboxIntegLayout
        formID={formID}
        formFields={formFields}
        dropboxConf={dropboxConf}
        setDropboxConf={setDropboxConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={dropboxConf.field_map.length < 1}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditDropbox
