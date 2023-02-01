/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoDeskCommonFunc'
import ZohoDeskIntegLayout from './ZohoDeskIntegLayout'

function EditZohoRecruit({ formFields, setIntegration, integrations, allIntegURL }) {
  const { id, formID } = useParams()
  const history = useHistory()
  const [deskConf, setDeskConf] = useState({ ...integrations[id] })
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(deskConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bitform') })
      return
    }

    if (!deskConf.actions?.ticket_owner) {
      setSnackbar({ show: true, msg: __('Please select a ticket owner', 'bitform') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, deskConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, deskConf, setDeskConf)} name="name" value={deskConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <ZohoDeskIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, deskConf, setDeskConf, formID, setisLoading, setSnackbar)}
        deskConf={deskConf}
        setDeskConf={setDeskConf}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={deskConf.department === '' || deskConf.table === '' || deskConf.field_map.length < 1}
      />
    </div>
  )
}

export default EditZohoRecruit
