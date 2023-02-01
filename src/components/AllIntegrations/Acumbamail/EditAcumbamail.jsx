/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/MailChimpIntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './AcumbamailCommonFunc'
import AcumbamailIntegLayout from './AcumbamailIntegLayout'

function EditAcumbamail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [acumbamailConf, setAcumbamailConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, acumbamailConf, setAcumbamailConf)} name="name" value={acumbamailConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />

      <AcumbamailIntegLayout
        formFields={formFields}
        handleInput={(e) => handleInput(e, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar, formID)}
        acumbamailConf={acumbamailConf}
        setAcumbamailConf={setAcumbamailConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, acumbamailConf, history, id, 1)}
        disabled={!acumbamailConf.mainAction || !checkMappedFields(acumbamailConf)}
      />
      <br />
    </div>
  )
}

export default EditAcumbamail
