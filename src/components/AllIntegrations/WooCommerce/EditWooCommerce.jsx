/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './WooCommerceCommonFunc'
import WooCommerceIntegLayout from './WooCommerceIntegLayout'

function EditWooCommerce({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useHistory()
  const { id } = useParams()

  const [wcConf, setWcConf] = useState({ ...integrations[id] })
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bitform')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, wcConf, setWcConf)} name="name" value={wcConf.name} type="text" placeholder={__('Integration Name...', 'bitform')} />
      </div>
      <br />
      <br />

      <WooCommerceIntegLayout
        wcConf={wcConf}
        setWcConf={setWcConf}
        formFields={formFields}
        handleInput={(e) => handleInput(e, wcConf, setWcConf, setisLoading, setSnackbar)}
        isLoading={isLoading}
        setisLoading={setisLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, wcConf, history, id, 1)}
        disabled={wcConf.workspace === '' || wcConf.table === '' || wcConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditWooCommerce
