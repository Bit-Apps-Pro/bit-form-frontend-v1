import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoWorkDriveIntegLayout from './ZohoWorkDriveIntegLayout'
import ZohoWorkDriveAuthorization from './ZohoWorkDriveAuthorization'
import BackIcn from '../../../Icons/BackIcn'

function ZohoWorkDrive({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [workDriveConf, setWorkDriveConf] = useState({
    name: 'Zoho WorkDrive API',
    type: 'Zoho WorkDrive',
    clientId: process.env.NODE_ENV === 'development' ? '1000.BWH0YC45BQ9PQMTZGKW5J3VUKUO18N' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? 'a01e54cfa1bb3de6283fbbb4d0d5ccee7404b29847' : '',
    team: '',
    folder: '',
    folderMap: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoWorkDrive')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (workDriveConf.team !== '' && workDriveConf.folder !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoWorkDriveAuthorization
        formID={formID}
        workDriveConf={workDriveConf}
        setWorkDriveConf={setWorkDriveConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <ZohoWorkDriveIntegLayout
          formID={formID}
          formFields={formFields}
          workDriveConf={workDriveConf}
          setWorkDriveConf={setWorkDriveConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={workDriveConf.team === '' || workDriveConf.folder === ''}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bitform')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, workDriveConf, history)}
      />
    </div>
  )
}

export default ZohoWorkDrive
