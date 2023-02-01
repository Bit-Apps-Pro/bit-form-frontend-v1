import { useRef } from 'react'

export default function InputWrapper({ formID, fieldKey, fieldData, children, noLabel, isBuilder }) {
  const err = fieldData.error || ''
  const fldWrapperElm = useRef(null)

  const isElementInViewport = elm => {
    const rect = elm.getBoundingClientRect()

    return (
      rect.top >= 0
      && rect.left >= 0
      && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  if (err && fldWrapperElm) {
    const fld = fldWrapperElm.current
    const bodyRect = document.body.getBoundingClientRect()
    const fldRect = fld.getBoundingClientRect()
    const offsetTop = fldRect.top - bodyRect.top
    if (!isElementInViewport(fld)) window.scroll({ top: offsetTop, behavior: 'smooth' })
  }

  const generateBackslashPattern = str => (str || '').split('$_bf_$').join('\\')

  return (
    <div ref={fldWrapperElm} className={`fld-wrp fld-wrp-${formID} drag ${isBuilder ? 'o-h' : ''} ${fieldData?.valid?.hide ? 'vis-n' : ''}`}>
      {(!noLabel && !fieldData?.valid?.hideLbl && 'lbl' in fieldData) && (
        <label title={fieldData.lbl} className={`fld-lbl fld-lbl-${formID}`} htmlFor={fieldKey}>
          {generateBackslashPattern(fieldData.lbl)}
          {fieldData.valid?.req && (
            <>
              {' '}
              <span className="fld-req-symbol">*</span>
            </>
          )}
        </label>
      )}
      {children}
      {(err || fieldData?.err) && (
        <div className={`error-wrapper ${err && 'err-msg'}`}>
          <div id={`${fieldKey}-error`} className="error-txt">
            {err}
          </div>
        </div>
      )}
    </div>
  )
}
