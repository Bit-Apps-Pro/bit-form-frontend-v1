/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import { checkMappedFields, handleInput } from './MailerLiteCommonFunc'
import MailerLiteIntegLayout from './MailerLiteIntegLayout'

function EditMailerLite({  formFields, setIntegration, integrations, allIntegURL  }) {
  const history = useHistory()
  const { id,formID } = useParams()
  const [mailerLiteConf, setMailerLiteConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', auth_token: '' })

  const saveConfig = () => {
    if (!checkMappedFields(mailerLiteConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bitform') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, mailerLiteConf, history, id, 1)
  }
  console.log('mailerLiteConf', mailerLiteConf)

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, mailerLiteConf, setMailerLiteConf)} name="name" value={mailerLiteConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <MailerLiteIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, mailerLiteConf, setMailerLiteConf, setIsLoading, setSnackbar)}
        mailerLiteConf={mailerLiteConf}
        setMailerLiteConf={setMailerLiteConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        isAuthorized={isAuthorized}
        setisAuthorized={setisAuthorized}
        error={error}
        setError={setError}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={mailerLiteConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditMailerLite
