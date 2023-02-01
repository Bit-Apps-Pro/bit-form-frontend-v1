/* eslint-disable no-param-reassign */

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ElasticEmailCommonFunc'
import ElasticEmailIntegLayout from './ElasticEmailIntegLayout'

function EditElasticEmail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [elasticEmailConf, setElasticEmailConf] = useState({ ...integrations[id] })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(elasticEmailConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bitform') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, elasticEmailConf, history, id, 1)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, elasticEmailConf, setElasticEmailConf)} name="name" value={elasticEmailConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />

      <ElasticEmailIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, elasticEmailConf, setElasticEmailConf, setIsLoading, setSnackbar)}
        elasticEmailConf={elasticEmailConf}
        setElasticEmailConf={setElasticEmailConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={elasticEmailConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditElasticEmail
