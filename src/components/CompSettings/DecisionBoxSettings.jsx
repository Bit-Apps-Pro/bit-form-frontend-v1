import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../GlobalStates'
import EditIcn from '../../Icons/EditIcn'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Cooltip from '../Utilities/Cooltip'
import CopyText from '../Utilities/CopyText'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import Back2FldList from './Back2FldList'
import DecisionBoxLabelModal from './CompSettingsUtils/DecisionBoxLabelModal'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'

export default function DecisionBoxSettings() {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [labelModal, setLabelModal] = useState(false)

  function setAdminLabel(e) {
    if (e.target.value === '') {
      delete fieldData.adminLbl
    } else {
      fieldData.adminLbl = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setRequired(e) {
    if (e.target.checked) {
      const tmp = { ...fieldData.valid }
      tmp.req = true
      fieldData.valid = tmp
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.req) fieldData.err.req = {}
      fieldData.err.req.dflt = '<p>This field is required</p>'
      fieldData.err.req.show = true
    } else {
      delete fieldData.valid.req
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setChecked(e) {
    if (e.target.checked) {
      const tmp = { ...fieldData.valid }
      tmp.checked = true
      fieldData.valid = tmp
    } else {
      delete fieldData.valid.checked
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setMsg = (val, typ) => {
    fieldData.msg[typ] = val

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  return (
    <div className="mr-4 ml-2">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">Field Type :</span>
        {' '}
        {fieldData.typ.charAt(0).toUpperCase() + fieldData.typ.slice(1)}
      </div>
      <div className="flx">
        <span className="font-w-m w-4">{__('Field Key : ', 'bitform')}</span>
        <CopyText value={fldKey} className="field-key-cpy m-0" />
      </div>
      <div className="mt-3">
        <div className="flx flx-between">
          <div className="flx">
            <b>Label: </b>
            <Cooltip width={250} icnSize={17} className="ml-2">
              <div className="txt-body">{__('Edit your decision box label by clicking on edit icon', 'bitform')}</div>
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
          dangerouslySetInnerHTML={{ __html: fieldData.lbl || fieldData?.info?.lbl }}
          className="err-msg-box mt-2"
        />
      </div>
      <DecisionBoxLabelModal labelModal={labelModal} setLabelModal={setLabelModal} />
      <SingleInput inpType="text" title={__('Admin Label:', 'bitform')} value={fieldData.adminLbl || ''} action={setAdminLabel} />
      <SingleToggle title={__('Required:', 'bitform')} action={setRequired} isChecked={fieldData.valid.req} className="mt-3" />
      {
        fieldData?.valid?.req && (
          <ErrorMessageSettings
            type="req"
            title="Error Message"
            tipTitle="By enabling this feature, user will see the error message if decision box is not checked"
          />
        )
      }
      <SingleInput inpType="text" title={__('Checked Value:', 'bitform')} value={fieldData.msg.checked || ''} action={e => setMsg(e.target.value, 'checked')} />
      <SingleInput inpType="text" title={__('Unchecked Value:', 'bitform')} value={fieldData.msg.unchecked || ''} action={e => setMsg(e.target.value, 'unchecked')} />
      <SingleToggle title={__('Checked by Default:', 'bitform')} action={setChecked} isChecked={fieldData.valid.checked} className="mt-3" />

    </div>
  )
}
