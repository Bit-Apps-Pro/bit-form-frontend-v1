/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksLayouts from '../IntegrationHelpers/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHooksStepTwo'

function EditZapier({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()

  const [zapier, setZapier] = useState({ ...integrations[id] })
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="mt-3">
        <WebHooksLayouts
          formID={formID}
          formFields={formFields}
          webHooks={zapier}
          setWebHooks={setZapier}
          setSnackbar={setSnackbar}
        />
      </div>

      <WebHooksStepTwo
        edit
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, zapier, history, id, 1)}
      />
      <br />
    </div>
  )
}

export default EditZapier
