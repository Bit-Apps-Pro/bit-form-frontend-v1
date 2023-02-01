/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import handleInput from './ZohoMailCommonFunc'
import ZohoMailIntegLayout from './ZohoMailIntegLayout'

function EditZohoRecruit({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id } = useParams()

  const [mailConf, setMailConf] = useState({ ...integrations[id] })
  const [snack, setSnackbar] = useState({ show: false })
  const [actionMdl, setActionMdl] = useState({ show: false })

  const saveConfig = () => {
    if (mailConf.actions?.update && mailConf.actions?.update.criteria === '' && actionMdl.show !== 'criteria') {
      setActionMdl({ show: 'criteria' })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, mailConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, mailConf, setMailConf)} name="name" value={mailConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <ZohoMailIntegLayout
        formFields={formFields}
        mailConf={mailConf}
        setMailConf={setMailConf}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
      // disabled={mailConf.workspace === '' || mailConf.table === '' || mailConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditZohoRecruit
