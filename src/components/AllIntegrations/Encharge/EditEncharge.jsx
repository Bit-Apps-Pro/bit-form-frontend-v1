/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveIntegConfig } from '../IntegrationHelpers/MailChimpIntegrationHelpers'
import { handleInput } from './EnchargeCommonFunc'
import EnchargeIntegLayout from './EnchargeIntegLayout'

function EditEncharge({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [enchargeConf, setEnchargeConf] = useState({ ...integrations[id] })
  const [snack, setSnackbar] = useState({ show: false })
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, enchargeConf, setEnchargeConf)} name="name" value={enchargeConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <EnchargeIntegLayout
        formID={formID}
        formFields={formFields}
        enchargeConf={enchargeConf}
        setEnchargeConf={setEnchargeConf}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, enchargeConf, history, id, 1)}
        disabled={enchargeConf.listId === '' || enchargeConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditEncharge
