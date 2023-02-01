/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import MailerLiteAuthorization from './MailerLiteAuthorization'
import { checkMappedFields, handleInput } from './MailerLiteCommonFunc'
import MailerLiteIntegLayout from './MailerLiteIntegLayout'

function MailerLite({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })




  const [mailerLiteConf, setMailerLiteConf] = useState({
    name: 'MailerLite',
    type: 'MailerLite',
    auth_token: process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOWJjZGI3OGFlZjI0OTI5MDMzZDdkNzI2Y2E1MGJhYzk2MDA5NDc5Njk5ZTA5NjdkMmNjMmUzZTVkNzZmMDRlZTFlYzgyNWJjM2ZiZTkxN2IiLCJpYXQiOjE2NTI1MDUxNTIuNjkwNzIyLCJuYmYiOjE2NTI1MDUxNTIuNjkwNzI1LCJleHAiOjQ4MDgxNzg3NTIuNjg1OTQ5LCJzdWIiOiI2MTc2MCIsInNjb3BlcyI6W119.HYB_lZIqWrNaBd8kK6ntAQYfcmSq1cuD5wc1isK1KWLvDdQL6E130xu0rEIP6wgmwgYV1_BGo1ERsqccvilGL1pVai6iNzC1_R_69ffbOgJpAbX94mpi0LR-AGVsdsILbzL2jje44et6-byH8Sum-XSTHOKNerArbAo3OzrLJ72MkccB-I7QFn4_PTCl7OqG7Oz8PeiKfJdjGouuZ9z67dN0wsSu6gLjY0BzTCgpQ3iOs2pLwzpuINcdhR30lqkvWVmNcStAXY3xZdJ1IlEuEpI8AL3f5JaLvghAM6z3J__Fck7bLil4nyLTdgyj-Ftk6PD3QmB_zcpo77e0GtXq64qaaIxE5T1Vc2C2y4_-AauauxauFhkfgzHlRu7SqJ4cHgtl-OPIeu7GdBEJpdSbj6jZNdICJl0Eq1AxSR5i-rFr0DD0fbeNdS1LTaFVl_Hf_1pspzwdlTWrpuCmXAV9WzuxasX1dgs2MBTnBrYhYyn3wdWs76dwK-L3VvEpvnBxiumXPllfqWqLR0eQX-EK6PScmnC8GZRqpOSwi3FIta10F08yhLXgqVKCD0F_-0EGhq2Z3Pt8kWOeA9QJrWK65sB1Q3_WqhUn-qP5jujggxaagB4JVQ7wyZsDRdZbatMcI3TOVNklVrE7LPMrDjCj8TWM4LeTqz_IJub6YeKak0g' : '',
    field_map: [
      { formField: '', mailerLiteFormField: 'email' },
    ],
    mailer_lite_type: '',
    mailerLiteFields: [],
    groups: [],
    group_ids: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(integrations, setIntegration, allIntegURL, mailerLiteConf, history, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        history.push(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }
  const nextPage = (pageNo) => {
    if (!checkMappedFields(mailerLiteConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    mailerLiteConf.field_map.length > 0 && setstep(pageNo)
    document.querySelector('.btcd-s-wrp').scrollTop = 0
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}

      <MailerLiteAuthorization
        mailerLiteConf={mailerLiteConf}
        setMailerLiteConf={setMailerLiteConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overintegrations: 'visible' }) }}>

        <MailerLiteIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, mailerLiteConf, setMailerLiteConf, setIsLoading, setSnackbar)}
          mailerLiteConf={mailerLiteConf}
          setMailerLiteConf={setMailerLiteConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bitform')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}

      />
    </div>
  )
}

export default MailerLite
