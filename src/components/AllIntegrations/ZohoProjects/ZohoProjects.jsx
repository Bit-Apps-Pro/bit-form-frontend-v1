import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoProjectsAuthorization from './ZohoProjectsAuthorization'
import { checkAllRequired, handleInput } from './ZohoProjectsCommonFunc'
import ZohoProjectsIntegLayout from './ZohoProjectsIntegLayout'

function ZohoProjects({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [projectsConf, setProjectsConf] = useState({
    name: 'Zoho Projects API',
    type: 'Zoho Projects',
    clientId: process.env.NODE_ENV === 'development' ? '1000.01ZB6YV7B8BEIXGPX6821NIK29K0HZ' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '79d6d0bf4b8104aea4c167a2e2e10d78a916af7c6b' : '',
    portalId: '',
    event: '',
    field_map: {},
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoProjects')
  }, [])

  const nextPage = val => {
    if (val === 3) {
      if (!checkAllRequired(projectsConf, setSnackbar)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bitform') })
        return
      }
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      {/* <IntegrationStepOne
        step={step}
        confTmp={projectsConf}
        handleInput={(e) => handleInput(e, projectsConf, setProjectsConf, formID, setisLoading, setSnackbar, true, error, setError)}
        error={error}
        setSnackbar={setSnackbar}
        handleAuthorize={() => handleAuthorize('zohoProjects', 'zprojects', scopes, projectsConf, setProjectsConf, setError, setisAuthorized, setisLoading, setSnackbar)}
        isLoading={isLoading}
        isAuthorized={isAuthorized}
        nextPage={nextPage}
      /> */}
      <ZohoProjectsAuthorization
        formID={formID}
        projectsConf={projectsConf}
        setProjectsConf={setProjectsConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <ZohoProjectsIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, projectsConf, setProjectsConf, formID, setisLoading, setSnackbar)}
          projectsConf={projectsConf}
          setProjectsConf={setProjectsConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={projectsConf.portalId === '' || projectsConf.event === ''}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, projectsConf, history)}
      />
    </div>
  )
}

export default ZohoProjects
