/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useRef, useEffect } from 'react'
import validateForm from '../../user-frontend/validation'
import { observeElement, select } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'

export default function TextArea({ fieldKey, attr, onBlurHandler, resetFieldValue, formID }) {
  const [value, setvalue] = useState(attr.val)
  const textAreaRef = useRef(null)
  useEffect(() => {
    if (attr.val !== undefined && !attr.userinput) {
      setvalue(attr.val)
    } else if (!attr.val && !attr.userinput) {
      setvalue('')
    } else if (attr.conditional) {
      setvalue(attr.val)
    }
  }, [attr.val, attr.userinput, attr.conditional])
  useEffect(() => {
    if (resetFieldValue) {
      setvalue('')
    }
  }, [resetFieldValue])
  useEffect(() => {
    if (attr.hasWorkflow && attr.val === value && onBlurHandler && !attr.userinput) {
      const { current } = textAreaRef
      onBlurHandler(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onChangeHandler = (event) => {
    setvalue(event.target.value)
  }

  useEffect(() => {
    const textFld = select(`#${fieldKey}`)
    if (textFld) {
      observeElement(textFld, 'value', (oldVal, newVal) => setvalue(newVal))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBlur = e => {
    validateForm({ input: e.target })
  }

  return (
    <InputWrapper
      formID={formID}
      fieldKey={fieldKey}
      fieldData={attr}
    >
      <div>
        <textarea
          id={fieldKey}
          className={`fld fld-${formID} no-drg textarea`}
          style={{ height: 'calc(100% - 30px)' }}
          ref={textAreaRef}
          {...'ph' in attr && { placeholder: attr.ph }}
          {...'ac' in attr && { autoComplete: attr.ac }}
          {...'req' in attr.valid && { required: attr.valid.req }}
          {...'disabled' in attr.valid && { readOnly: attr.valid.disabled }}
          {...'name' in attr && { name: attr.name }}
          {...onBlurHandler && { onInput: onBlurHandler }}
          onBlur={handleBlur}
          {...{ value }}
          onChange={onChangeHandler}
        />
      </div>
    </InputWrapper>
  )
}
