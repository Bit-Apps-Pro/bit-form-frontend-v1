/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'

import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import OneDriveAuthorization from './OneDriveAuthorization'
import OneDriveIntegLayout from './OneDriveIntegLayout'

function OneDrive({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [oneDriveConf, setOneDriveConf] = useState({
    name: 'OneDrive',
    type: 'OneDrive',
    clientId: process.env.NODE_ENV === 'development' ? '199b3457-1778-47a7-bc49-e319cd426e25' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? 'gjI7Q~GQy9LxqgdznSUsrrDiCFMFKGpOepjbf' : '',
    field_map: [{ formField: '', OneDriveFormField: '' }],
    folder: '',
    folderMap: [],
    foldersList: [],
    actions: {},
  })
  useEffect(() => {
    window.opener && setGrantTokenResponse('oneDrive')
  }, [])

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, oneDriveConf, history)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <OneDriveAuthorization
        flowID={flowID}
        oneDriveConf={oneDriveConf}
        setOneDriveConf={setOneDriveConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: `${100}%`,
            overflow: 'visible',
          }),
        }}
      >
        <OneDriveIntegLayout
          flowID={flowID}
          formFields={formFields}
          oneDriveConf={oneDriveConf}
          setOneDriveConf={setOneDriveConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => setStep(3)}
          disabled={!oneDriveConf.actions.attachments || !oneDriveConf.folder}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bitform')}
          {' '}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
      />
    </div>
  )
}

export default OneDrive
