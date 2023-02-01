/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useRef, useEffect } from 'react'
import validateForm from '../../user-frontend/validation'
import InputWrapper from '../InputWrapper'

export default function DecisionBox({ attr, onBlurHandler, resetFieldValue, formID }) {
  let { checked } = attr.valid
  const decisionBoxHiddenRef = useRef(null)
  const checkBoxRef = useRef(null)
  const defaultValue = attr.val || (checked ? attr.msg.checked : attr.msg.unchecked)
  const [value, setvalue] = useState(defaultValue)
  if (value === attr.msg.unchecked) {
    checked = false
  } else if (value === attr.msg.checked) {
    checked = true
  }
  useEffect(() => {
    if (resetFieldValue) {
      setvalue(defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetFieldValue])
  useEffect(() => {
    if (attr.hasWorkflow && onBlurHandler && !attr.userinput) {
      const { current } = decisionBoxHiddenRef
      onBlurHandler(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  const onChangeHandler = (event) => {
    if (attr.valid.disabled) {
      return
    }
    if (event.target.checked) {
      setvalue(attr.msg.checked)
    } else {
      setvalue(attr.msg.unchecked)
    }

    const { form } = event.target
    validateForm({ input: { name: attr.name, form, value: event.target.checked ? attr.msg.checked : attr.msg.unchecked } })
  }

  return (
    <InputWrapper
      formID={formID}
      fieldKey={attr.name}
      fieldData={attr}
      noLabel
    >
      <div className={`no-drg fld fld-${formID} btcd-ck-con ${attr.round && 'btcd-round'}`}>
        <label className={`btcd-ck-wrp btcd-ck-wrp-${formID}`}>
          <span
            className="decision-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: attr.lbl || attr?.info?.lbl }}
          />
          <input ref={decisionBoxHiddenRef} type="hidden" value={value} {...'name' in attr && { name: attr.name }} />
          <input
            style={{
              height: attr.valid.req && 1,
              width: attr.valid.req && 1,
            }}
            type="checkbox"
            ref={checkBoxRef}
            disabled={attr?.valid?.disabled}
            readOnly={attr?.valid?.readonly}
            {...attr.valid.req && { required: true }}
            {...{ checked }}
            value={value}
            onChange={onChangeHandler}
          />
          <span className="btcd-mrk ck" />
        </label>
      </div>
    </InputWrapper>
  )
}
