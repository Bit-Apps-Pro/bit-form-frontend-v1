/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './ZohoSignCommonFunc'
import ZohoSignIntegLayout from './ZohoSignIntegLayout'

function EditZohoRecruit({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [signConf, setSignConf] = useState({ ...integrations[id] })
  const [snack, setSnackbar] = useState({ show: false })
  const [actionMdl, setActionMdl] = useState({ show: false })

  const saveConfig = () => {
    if (signConf.actions?.update && signConf.actions?.update.criteria === '' && actionMdl.show !== 'criteria') {
      setActionMdl({ show: 'criteria' })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, signConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, signConf, setSignConf)} name="name" value={signConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <ZohoSignIntegLayout
        formID={formID}
        formFields={formFields}
        signConf={signConf}
        setSignConf={setSignConf}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={signConf.template === ''}
      />
      <br />
    </div>
  )
}

export default EditZohoRecruit
