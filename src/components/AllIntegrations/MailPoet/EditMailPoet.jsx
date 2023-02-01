/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './MailPoetCommonFunc'
import MailPoetIntegLayout from './MailPoetIntegLayout'

function EditMailPoet({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [mailPoetConf, setMailPoetConf] = useState({ ...integrations[id] })
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const saveConfig = () => {
    if (!checkMappedFields(mailPoetConf)) {
      setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
      return
    } saveIntegConfig(integrations, setIntegration, allIntegURL, mailPoetConf, history, id, 1)
  }
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-6" onChange={e => handleInput(e, mailPoetConf, setMailPoetConf)} name="name" value={mailPoetConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <MailPoetIntegLayout
        formID={formID}
        formFields={formFields}
        mailPoetConf={mailPoetConf}
        setMailPoetConf={setMailPoetConf}
        isLoading={isLoading}
        step={2}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
        edit={mailPoetConf.lists}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={mailPoetConf.lists === '' || mailPoetConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditMailPoet
