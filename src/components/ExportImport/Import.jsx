import { useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $bits } from '../../GlobalStates'
import Modal from '../Utilities/Modal'
import ImportStepOne from './ImportStepOne'
import ImportStepTwo from './ImportStepTwo'

export default function Import({ cols, formID, close, showImportMdl }) {
  const columns = cols.filter((col) => col.Header !== '#' && typeof col.Header !== 'object')
  const bits = useRecoilValue($bits)
  const formName = bits?.allForms?.find(form => form.id === formID)?.form_name
  const formRef = useRef(null)
  const [fileResponses, setResponses] = useState([])
  const [filecolumns, setFilieColumns] = useState([])
  const [step, setStep] = useState(1)
  const handleSubmit = (event) => {
    event.preventDefault()
    const file = document.getElementById('file').files
    if (file.length === 0) {
      alert('Please select a file')
      return false
    }
    // eslint-disable-next-line default-case
    switch (step) {
      case 1:
        setResponses(sessionStorage.getItem('file_data'))
        setFilieColumns(sessionStorage.getItem('file_header')?.split(','))
        setStep(2)
    }
  }
  return (
    <div>
      <Modal lg show={showImportMdl} setModal={close} title={`Import Data for ${formName} [Step ${step} of 2]`}>
        {step === 1 && (
          <form
            ref={formRef}
            method="POST"
            onSubmit={handleSubmit}
          >
            <ImportStepOne />
          </form>
        )}
        {step === 2 && (
          <form>
            <ImportStepTwo
              fileResponses={fileResponses}
              fileColumns={filecolumns}
              tableColumns={columns}
            />
          </form>
        )}
      </Modal>
    </div>
  )
}
