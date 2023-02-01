/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkAllRequired, handleInput } from './ZohoProjectsCommonFunc'
import ZohoProjectsIntegLayout from './ZohoProjectsIntegLayout'

function EditZohoRecruit({ formFields, setIntegration, integrations, allIntegURL }) {
  const { id, formID } = useParams()
  const history = useHistory()
  const [projectsConf, setProjectsConf] = useState({ ...integrations[id] })
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkAllRequired(projectsConf, setSnackbar)) return

    saveIntegConfig(integrations, setIntegration, allIntegURL, projectsConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-150 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, projectsConf, setProjectsConf)} name="name" value={projectsConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <ZohoProjectsIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, projectsConf, setProjectsConf, formID, setisLoading, setSnackbar)}
        projectsConf={projectsConf}
        setProjectsConf={setProjectsConf}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={projectsConf.portalId === '' || projectsConf.event === ''}
      />
    </div>
  )
}

export default EditZohoRecruit
