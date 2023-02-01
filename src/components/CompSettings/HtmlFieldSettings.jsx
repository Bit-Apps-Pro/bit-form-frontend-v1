import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../GlobalStates'
import EditIcn from '../../Icons/EditIcn'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Cooltip from '../Utilities/Cooltip'
import Back2FldList from './Back2FldList'
import HTMLContentModal from './CompSettingsUtils/HTMLContentModal'

export default function HtmlFieldSettings() {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [labelModal, setLabelModal] = useState(false)

  const setContent = val => {
    const fdata = deepCopy(fieldData)
    fdata.content = val
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fdata } }))
  }

  return (
    <div className="mr-4 ml-2">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">Field Type :</span>
        {' '}
        {fieldData.typ.charAt(0).toUpperCase() + fieldData.typ.slice(1)}
      </div>
      <div className="mt-3">
        <div className="flx flx-between">
          <div className="flx">
            <b>Content: </b>
            <Cooltip width={250} icnSize={17} className="ml-2">
              <div className="txt-body">{__('Edit the HTML field content by clicking on edit icon', 'bitform')}</div>
            </Cooltip>
          </div>
          <span
            role="button"
            tabIndex="-1"
            className="mr-2 cp"
            onClick={() => setLabelModal(true)}
            onKeyPress={() => setLabelModal(true)}
          >
            <EditIcn size={19} />
          </span>
        </div>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: fieldData.content }}
          className="err-msg-box mt-2"
        />
      </div>
      <HTMLContentModal labelModal={labelModal} setLabelModal={setLabelModal} />
    </div>
  )
}
