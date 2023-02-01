import InputWrapper from '../InputWrapper'
import LoaderSm from '../Loaders/LoaderSm'

/* eslint-disable react/jsx-props-no-spreading */
export default function Button({ attr, buttonDisabled, handleReset, formID, data }) {
  return (
    <InputWrapper
      formID={formID}
      fieldData={attr}
      noLabel
    >
      <div className={`btcd-frm-sub ${attr.align === 'center' && 'j-c-c'} ${attr.align === 'right' && 'j-c-e'}`}>
        <button
          className={`btcd-sub-btn ${attr.btnTyp === 'reset' ? 'btcd-rst' : 'btcd-sub'} ${attr.btnSiz === 'md' && 'btcd-btn-md'} ${attr.fulW && 'ful-w'}`}
          disabled={buttonDisabled || attr?.valid?.disabled}
          // eslint-disable-next-line react/button-has-type
          type={attr.btnTyp}
          {...attr.btnTyp === 'reset' && { onClick: handleReset }}
        >
          {attr.txt}
          {buttonDisabled && <LoaderSm clr="currentColor" size={12} style={{ display: 'inline-block', marginLeft: 5 }} />}
        </button>
      </div>
    </InputWrapper>
  )
}
