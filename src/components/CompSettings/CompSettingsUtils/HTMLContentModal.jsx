import produce from 'immer'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../../GlobalStates'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Modal from '../../Utilities/Modal'
import TinyMCE from '../../Utilities/TinyMCE'

export default function HTMLContentModal({ labelModal, setLabelModal }) {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const content = fieldData.content || fieldData?.info?.content
  const [value, setValue] = useState(content)

  useEffect(() => {
    if (labelModal) setValue(content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelModal])

  const setContent = val => {
    setFields(prevState => produce(prevState, draft => {
      draft[fldKey].content = val
    }))
  }

  const cancelModal = () => {
    fieldData.content = value
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
        value={content}
        onChangeHandler={setContent}
      />
      <div className="mt-2 f-right">
        <button type="button" className="btn mr-2" onClick={cancelModal}>Cancel</button>
        <button type="button" className="btn blue" onClick={() => setLabelModal(false)}>Save</button>
      </div>
    </Modal>
  )
}
