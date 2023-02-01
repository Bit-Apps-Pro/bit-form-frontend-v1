// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SendinBlueAuthorization from './SendinBlueAuthorization'
import { checkMappedFields } from './SendinBlueCommonFunc'
import SendinBlueIntegLayout from './SendinBlueIntegLayout'

function SendinBlue({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [error, setError] = useState({ templateId: '', RedirectionUrl: '' })
  const [sendinBlueConf, setSendinBlueConf] = useState({
    name: 'SendinBlue API',
    type: 'SendinBlue',
    lists: [],
    api_key: process.env.NODE_ENV === 'development' ? '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' : '',
    field_map: [
      { formField: '', sendinBlueField: '' },
    ],
    actions: {},
  })
  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (sendinBlueConf.templateId === '' || sendinBlueConf.redirectionUrl === '') {
        setError({
          templateId: !sendinBlueConf.templateId ? __('Template name cann\'t be empty', 'bitform') : '',
          redirectionUrl: !sendinBlueConf.redirectionUrl ? __('Redirection url name cann\'t be empty', 'bitform') : '',
        })
        return
      }
      if (!checkMappedFields(sendinBlueConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (sendinBlueConf.name !== '' && sendinBlueConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <SendinBlueAuthorization
        formID={formID}
        sendinBlueConf={sendinBlueConf}
        setSendinBlueConf={setSendinBlueConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, minHeight: step === 2 && `${900}px` }}>

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
        <button
          onClick={() => nextPage(3)}
          disabled={sendinBlueConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, sendinBlueConf, history)}
      />
    </div>
  )
}

export default SendinBlue
