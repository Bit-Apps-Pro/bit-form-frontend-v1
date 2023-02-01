/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveIntegConfig } from '../IntegrationHelpers/MailChimpIntegrationHelpers'
import { handleInput } from './SendinBlueCommonFunc'
import SendinBlueIntegLayout from './SendinBlueIntegLayout'

function EditSendinBlue({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [sendinBlueConf, setSendinBlueConf] = useState({ ...integrations[id] })
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [error, setError] = useState({ templateId: '', RedirectionUrl: '' })
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-6" onChange={e => handleInput(e, sendinBlueConf, setSendinBlueConf)} name="name" value={sendinBlueConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <SendinBlueIntegLayout
        formID={formID}
        formFields={formFields}
        sendinBlueConf={sendinBlueConf}
        setSendinBlueConf={setSendinBlueConf}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
        error={error}
        setError={setError}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, sendinBlueConf, history, id, 1)}
        disabled={sendinBlueConf.listId === '' || sendinBlueConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditSendinBlue
