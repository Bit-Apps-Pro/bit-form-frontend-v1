import produce from 'immer'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../../GlobalStates'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Modal from '../../Utilities/Modal'
import TinyMCE from '../../Utilities/TinyMCE'

export default function DecisionBoxLabelModal({ labelModal, setLabelModal }) {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const lbl = fieldData.lbl || fieldData?.info?.lbl
  const [value, setValue] = useState(lbl)

  useEffect(() => {
    if (labelModal) setValue(lbl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelModal])

  const setLbl = val => {
    setFields(prevState => produce(prevState, draft => {
      draft[fldKey].lbl = val
    }))
  }

  const cancelModal = () => {
    fieldData.lbl = value
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
    setLabelModal(false)
  }

  return (
    <Modal
      md
      show={labelModal}
      setModal={cancelModal}
      title={__('Edit Decision Box Label', 'bitform')}
    >
      <TinyMCE
        id={fldKey}
        value={lbl}
        onChangeHandler={setLbl}
      />
      <div className="mt-2 f-right">
        <button type="button" className="btn mr-2" onClick={cancelModal}>Cancel</button>
        <button type="button" className="btn blue" onClick={() => setLabelModal(false)}>Save</button>
      </div>
    </Modal>
  )
}
