import { __ } from '../../../Utils/i18nwrap'

export default function WebHooksStepTwo({ step, saveConfig, edit, disabled }) {
  return (
    edit
      ? (
        <div className="txt-center w-9 mt-3">
          <button onClick={saveConfig} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={disabled}>
            {__('Save', 'bitform')}
          </button>
        </div>
      )
      : (
        <div className="txt-center" style={{ marginLeft: 210 }}>
          <h2 className="ml-3">{__('Successfully Integrated', 'bitform')}</h2>
          <button onClick={saveConfig} className="btn btcd-btn-lg green sh-sm" type="button">
            {__('Finish & Save ', 'bitform')}
            ✔
          </button>
        </div>
      )
  )
}
