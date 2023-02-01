/* eslint-disable no-param-reassign */
import { useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './ZohoWorkDriveCommonFunc'
import ZohoWorkDriveIntegLayout from './ZohoWorkDriveIntegLayout'

function EditZohoRecruit({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [workDriveConf, setWorkDriveConf] = useState({ ...integrations[id] })
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, workDriveConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, workDriveConf, setWorkDriveConf)} name="name" value={workDriveConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <ZohoWorkDriveIntegLayout
        formID={formID}
        formFields={formFields}
        workDriveConf={workDriveConf}
        setWorkDriveConf={setWorkDriveConf}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={workDriveConf.team === '' || workDriveConf.folder === ''}
      />
    </div>
  )
}

export default EditZohoRecruit
