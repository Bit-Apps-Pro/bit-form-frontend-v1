import LoaderSm from '../Loaders/LoaderSm'

/* eslint-disable react/jsx-props-no-spreading */
export default function SubmitBtn({ attr, buttonDisabled, handleReset, formID }) {
  return (
    <div className={`fld-wrp fld-wrp-${formID}`} btcd-fld="submit">
      <div className={`btcd-frm-sub ${attr.align === 'center' && 'j-c-c'} ${attr.align === 'right' && 'j-c-e'}`}>
        <button
          className={`btcd-sub-btn btcd-sub ${attr.btnSiz === 'md' && 'btcd-btn-md'} ${attr.fulW && 'ful-w'}`}
          disabled={buttonDisabled}
          type="submit"
        >
          {attr.subBtnTxt}
          {buttonDisabled && <LoaderSm clr="currentColor" size={12} style={{ display: 'inline-block', marginLeft: 5 }} />}
        </button>
        {'rstBtnTxt' in attr && (
          <button
            className={`btcd-sub-btn btcd-rst ${attr.btnSiz === 'md' && 'btcd-btn-md'} ${attr.fulW && 'ful-w'}`}
            type="button"
            {...handleReset && { onClick: handleReset }}
          >
            {attr.rstBtnTxt}
          </button>
        )}
      </div>
    </div>
  )
}
