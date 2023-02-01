/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import produce from 'immer'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import UserMetaField from './UserMetaField'
import UserFieldMap from './UserFieldMap'
import { userFields } from '../../../Utils/StaticData/userField'
import bitsFetch from '../../../Utils/bitsFetch'

export default function Registration({ formFields, dataConf, setDataConf, pages, type, status }) {
  const { formID } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const [roles, setRoles] = useState([])

  useEffect(() => {
    bitsFetch({}, 'bitforms_get_wp_roles').then((res) => {
      if (res?.success && res !== undefined) {
        setRoles(Object.values(res?.data))
      }
    })
    const tmpConf = produce(dataConf, draft => {
      if (!draft[type]?.user_map?.[0]?.userField) {
        draft[type].user_map = userFields.filter(fld => fld.required).map(fl => ({ formField: '', userField: fl.key, required: fl.required }))
      }
    })

    setDataConf(tmpConf)
  }, [])

  return (
    <div style={{ width: 900, opacity: status === 0 && 0.6 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div>
        <UserFieldMap
          formFields={formFields}
          formID={formID}
          userConf={dataConf}
          setUserConf={setDataConf}
          pages={pages}
          roles={roles}
          type={type}
        />
      </div>
      <div>
        <UserMetaField
          formFields={formFields}
          formID={formID}
          userConf={dataConf}
          setUserConf={setDataConf}
          type={type}
        />
        <br />
      </div>
      <p className="p-1 f-m">
        <strong>Note</strong>
        {' '}
        : If the Username and Password fields are blank then the user will take the value of the email field as the field and the password will be auto-generated.
      </p>

    </div>
  )
}
