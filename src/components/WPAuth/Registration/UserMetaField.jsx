import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import FieldMap from './FieldMap'
import { addFieldMap } from './UserHelperFunction'

export default function CustomFieldMap({ formFields, userConf, setUserConf, type }) {
  const [metaFields, setMetaFields] = useState([])

  return (
    <>
      <div>

        <div>
          <div className="mt-3 mb-1">
            <b>{__('User Meta Field Mappping', 'bitform')}</b>
          </div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-1">
            <div className="txt-dp"><b>{__('Meta Value', 'bitform')}</b></div>
            <div className="txt-dp">
              <b>{__('Meta Key', 'bitform')}</b>
            </div>
          </div>
        </div>
        {
          userConf[type]?.meta_map?.map((itm, i) => (
            <FieldMap
              key={`analytics-m-${i + 9}`}
              i={i}
              type="meta"
              field={itm}
              formFields={formFields}
              userConf={userConf}
              setUserConf={setUserConf}
              customFields={metaFields}
              fieldType="meta"
              authType="register"
            />
          ))
        }

        <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(type, 'meta_map', userConf?.meta_map?.length, userConf, setUserConf)} className="icn-btn sh-sm" type="button">+</button></div>

      </div>
    </>
  )
}
