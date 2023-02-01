import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import BackIcn from '../../../Icons/BackIcn'
import { $bits } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import GroundhoggAuthorization from './GroundhoggAuthorization'
import { handleInput, checkMappedFields, checkMetaMappedFields } from './GroundhoggCommonFunc'
import GroundhoggIntegLayout from './GroundhoggIntegLayout'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'

function Groundhogg({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const bits = useRecoilValue($bits)
  const { isPro } = bits

  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const contactsFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: false },
    { key: 'user_id', label: 'User Id', required: false },
    { key: 'owner_id', label: 'Owner Id', required: false },
    { key: 'optin_status', label: 'Optin Status', required: false },

  ]

  const contactMetaFields = [
    { key: 'primary_phone', label: 'Primary Phone', required: false },
    { key: 'street_address_1', label: 'Street Address 1', required: false },
    { key: 'street_address_2', label: 'Street Address 2', required: false },
    { key: 'postal_zip', label: 'Postal Zip', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'country', label: 'Country', required: false },

  ]

  const allActions = [
    { key: '1', label: 'Create Contact' },
    { key: '2', label: 'Add tag to user' },
  ]
  const [groundhoggConf, setGroundhoggConf] = useState({
    name: 'Groundhogg',
    type: 'Groundhogg',
    token: process.env.NODE_ENV === 'development' ? 'f780f1d763894f019d9cac7878263337' : '',
    public_key: process.env.NODE_ENV === 'development' ? '400a145fb0b07ab660d69d625bdb83af' : '',
    id: '',
    mainAction: '',
    addTagToUser: '',
    emailAddress: '',
    domainName: bits.siteURL,
    showMeta: false,
    field_map: [
      { formField: '', GroundhoggMapField: '' },
    ],
    field_map_meta: [
      { formField: '', GroundhoggMetaMapField: '' },
    ],
    contactsFields,
    contactMetaFields,
    allActions,
    address_field: [],
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (groundhoggConf.mainAction === '1' && !checkMappedFields(groundhoggConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (groundhoggConf.showMeta && !checkMetaMappedFields(groundhoggConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (groundhoggConf.listId !== '') {
      setstep(3)
    }
  }
  const isDisabled = !((groundhoggConf.mainAction === '2' && groundhoggConf.addTagToUser !== ''))

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, groundhoggConf, history)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <GroundhoggAuthorization
        formID={formID}
        groundhoggConf={groundhoggConf}
        setGroundhoggConf={setGroundhoggConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <GroundhoggIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, groundhoggConf, setGroundhoggConf, formID, setIsLoading, setSnackbar)}
          groundhoggConf={groundhoggConf}
          setGroundhoggConf={setGroundhoggConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={(groundhoggConf.mainAction === '2' ? isDisabled : (!((groundhoggConf.field_map?.length >= 1)))) || isLoading}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
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

export default Groundhogg
