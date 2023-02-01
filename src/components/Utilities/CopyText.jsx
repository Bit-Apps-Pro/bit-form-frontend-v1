import { useRef } from 'react'
import toast from 'react-hot-toast'
import CopyIcn from '../../Icons/CopyIcn'
import { __ } from '../../Utils/i18nwrap'

export default function CopyText({ value, className, readOnly }) {
  const copyInput = useRef(null)

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value)
    }
    copyInput.current.focus()
    copyInput.current.select()
    return new Promise((res, rej) => {
      if (document.execCommand('copy')) res()
      else rej()
    })
  }

  const copyText = () => {
    copyToClipboard()
      .then(() => toast.success(__('Copied on clipboard.', 'bitform')))
      .catch(() => toast.error(__('Failed to Copy, Try Again.', 'bitform')))
  }

  return (
    <div className={className}>
      <label htmlFor="copy-input-fld" className="flx">
        <input id="copy-input-fld" ref={copyInput} className={`w-10 ${readOnly && 'readonly'}`} value={value} readOnly />
        <button onClick={copyText} className="tooltip" style={{ '--tooltip-txt': '"Copy"' }} aria-label="Copy" type="button"><CopyIcn size="14" /></button>
      </label>
    </div>
  )
}
