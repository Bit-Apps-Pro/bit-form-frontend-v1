/* eslint-disable no-param-reassign */
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import GetgistIntegLayout from './GetgistIntegLayout'
import { checkMappedFields, handleInput } from './GetgistCommonFunc'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'

function EditGetgist({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()
  const [getgistConf, setGetgistConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(getgistConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, getgistConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, getgistConf, setGetgistConf)} name="name" value={getgistConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />

      <GetgistIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, getgistConf, setGetgistConf, setIsLoading)}
        getgistConf={getgistConf}
        setGetgistConf={setGetgistConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={getgistConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditGetgist
