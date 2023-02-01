/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $bits, $fields, $selectedFieldId } from '../../GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import DownloadIcon from '../../Icons/DownloadIcon'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Cooltip from '../Utilities/Cooltip'
import CopyText from '../Utilities/CopyText'
import Modal from '../Utilities/Modal'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import Back2FldList from './Back2FldList'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import ImportOptions from './ImportOptions'

export default function SelectSettings() {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const options = fieldData.opt
  const isRequired = fieldData.valid.req !== undefined
  const isMultiple = fieldData.mul
  const allowCustomOpt = fieldData.customOpt !== undefined
  const adminLabel = fieldData.adminLbl === undefined ? '' : fieldData.adminLbl
  const placeholder = fieldData.ph === undefined ? '' : fieldData.ph
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const dataSrc = fieldData?.customType?.type || 'fileupload'
  let fieldObject = null
  let disabled = false
  if (fieldData?.customType?.type) {
    fieldObject = fieldData?.customType
    disabled = true
  }
  const [importOpts, setImportOpts] = useState({})

  useEffect(() => setImportOpts({ dataSrc, fieldObject, disabled }), [fldKey])
  // set defaults
  if (isMultiple) {
    if ('val' in fieldData) {
      if (!Array.isArray(fieldData.val)) {
        fieldData.val = [fieldData.val]
      }
    } else {
      fieldData.val = []
    }
  }

  function setRequired(e) {
    if (e.target.checked) {
      const tmp = { ...fieldData.valid }
      tmp.req = true
      fieldData.valid = tmp
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.req) fieldData.err.req = {}
      fieldData.err.req.dflt = '<p>This field is required</p>'
      fieldData.err.req.show = true
    } else {
      delete fieldData.valid.req
      delete fieldData.mn
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setAdminLabel(e) {
    if (e.target.value === '') {
      delete fieldData.adminLbl
    } else {
      fieldData.adminLbl = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setPlaceholder(e) {
    if (e.target.value === '') {
      delete fieldData.ph
    } else {
      fieldData.ph = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setMultiple(e) {
    if (e.target.checked) {
      fieldData.mul = true
    } else {
      delete fieldData.mul
      delete fieldData.mn
      delete fieldData.mx
      if (fieldData.err) {
        delete fieldData.err.mn
        delete fieldData.err.mx
      }
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setAllowCustomOption(e) {
    if (e.target.checked) {
      fieldData.customOpt = true
    } else {
      delete fieldData.customOpt
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function rmvOpt(ind) {
    options.splice(ind, 1)
    fieldData.opt = options
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function addOpt() {
    options.push({ label: `Option ${fieldData.opt.length + 1}`, value: `Option ${fieldData.opt.length + 1}` })
    fieldData.opt = options
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setCheck(e) {
    if (e.target.checked) {
      if (isMultiple) {
        if (!Array.isArray(fieldData.val)) {
          fieldData.val = []
        }
        // fieldData.val.push(e.target.getAttribute('data-value'))
        fieldData.val = [...fieldData.val, e.target.getAttribute('data-value')]
      } else {
        fieldData.val = e.target.getAttribute('data-value')
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isMultiple) {
        fieldData.val = [...fieldData.val.filter(itm => itm !== e.target.getAttribute('data-value'))]
      } else {
        delete fieldData.val
      }
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setOptLbl(e, i) {
    const updateVal = e.target.value
    const tmp = { ...options[i] }
    tmp.label = updateVal
    tmp.value = updateVal.replace(/,/g, '_')
    fieldData.opt[i] = tmp
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const openImportModal = () => {
    importOpts.show = true
    setImportOpts({ ...importOpts })
  }

  const closeImportModal = () => {
    delete importOpts.show
    setImportOpts({ ...importOpts })
  }

  function setMin(e) {
    if (!isPro) return
    if (!Number(e.target.value)) {
      delete fieldData.mn
      setRequired({ target: { checked: false } })
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = `<p>Minimum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}<p>`
      fieldData.err.mn.show = true
      setRequired({ target: { checked: true } })
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setMax(e) {
    if (!isPro) return
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = `<p>Maximum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}</p>`
      fieldData.err.mx.show = true
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setDisabledOnMax = e => {
    if (!isPro) return
    if (e.target.checked) {
      fieldData.valid.disableOnMax = true
    } else {
      delete fieldData.valid.disableOnMax
    }

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  return (
    <div className="ml-2 mr-4">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">Field Type : </span>
        {fieldData.typ.charAt(0).toUpperCase() + fieldData.typ.slice(1)}
      </div>
      <div className="flx">
        <span className="font-w-m mr-1">{__('Field Key : ', 'bitform')}</span>
        <CopyText value={fldKey} className="field-key-cpy m-0 w-7" />
      </div>
      <FieldLabelSettings />
      <SingleInput inpType="text" title={__('Admin Label:', 'bitform')} value={adminLabel} action={setAdminLabel} />
      {fieldData.typ.match(/^(text|url|password|number|email|select)$/) && <SingleInput inpType="text" title={__('Placeholder:', 'bitform')} value={placeholder} action={setPlaceholder} />}
      <SingleToggle title={__('Required:', 'bitform')} action={setRequired} isChecked={isRequired} className="mt-3" />
      {fieldData?.valid?.req && (
        <ErrorMessageSettings
          type="req"
          title="Error Message"
          tipTitle="By enabling this feature, user will see the error message if select box is empty"
        />
      )}
      <div className="pos-rel">
        {!bits.isPro && (
          <div className="pro-blur flx" style={{ height: '100%', left: 0, width: '100%', marginTop: 14 }}>
            <div className="pro">
              {__('Available On', 'bitform')}
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Premium', 'bitform')}
                </span>
              </a>
            </div>
          </div>
        )}
        <ErrorMessageSettings
          type="entryUnique"
          title="Validate as Entry Unique"
          tipTitle="Enabling this option will check from the entry database whether its value is duplicate."
        />
      </div>
      <SingleToggle title={__('Multiple Select:', 'bitform')} action={setMultiple} isChecked={isMultiple} className="mt-3" />
      <SingleToggle title={__('Allow Other Option:', 'bitform')} action={setAllowCustomOption} isChecked={allowCustomOpt} className="mt-3 mb-2" />
      {
        fieldData.mul && (
          <>
            <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Minimum:', 'bitform')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set minimum number to be selected for dropdown option', 'bitform')}</div>
                </Cooltip>
                {!isPro && <span className="pro-badge ml-2">{__('Pro', 'bitform')}</span>}
              </div>
              <input className="btcd-paper-inp" type="number" value={min} onChange={setMin} disabled={!isPro} />
            </div>

            {fieldData.mn && (
              <ErrorMessageSettings
                type="mn"
                title="Min Error Message"
                tipTitle={`By enabling this feature, user will see the error message when selected options is less than ${fieldData.mn}`}
              />
            )}

            <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Maximum:', 'bitform')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set maximum number to be selected for dropdown option', 'bitform')}</div>
                </Cooltip>
                {!bits.isPro && <span className="pro-badge ml-2">{__('Pro', 'bitform')}</span>}
              </div>
              <input className="btcd-paper-inp" type="number" value={max} onChange={setMax} disabled={!isPro} />
            </div>
            {fieldData.mx && (
              <>
                <ErrorMessageSettings
                  type="mx"
                  title="Max Error Message"
                  tipTitle={`By enabling this feature, user will see the error message when selected options is greater than ${fieldData.mx}`}
                  defaultMsg="The value is already taken. Try another."
                />
                {/* <SingleToggle title={__('Disable if maximum selected:', 'bitform')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!isPro} className="mt-3 mb-2" /> */}
              </>
            )}
          </>
        )
      }
      <button onClick={openImportModal} className="btn" type="button">
        <DownloadIcon size="16" />
        &nbsp;
        {__('Import Options', 'bitform')}
      </button>
      <div className="opt">
        <span className="font-w-m">{__('Options:', 'bitform')}</span>
        {fieldData.opt.map((itm, i) => (
          <div key={`opt-${i + 8}`} className="flx flx-between">
            <SingleInput inpType="text" value={itm.label} action={e => setOptLbl(e, i)} width={140} className="mt-0" />
            <div className="flx mt-2">
              <label className="btcd-ck-wrp tooltip" style={{ '--tooltip-txt': `'${__('Check by Default', 'bitform')}'` }}>
                <input onChange={setCheck} type="checkbox" data-value={itm.value} checked={typeof fieldData.val === 'string' ? fieldData.val === itm.value : fieldData?.val?.some(d => d === itm.value)} />
                <span className="btcd-mrk ck br-50" />
              </label>
              <button onClick={() => rmvOpt(i)} className="btn cls-btn" type="button" aria-label="remove option"><CloseIcn size="14" /></button>
            </div>
          </div>
        ))}
        <button onClick={addOpt} className="btn blue" type="button">{__('Add More +', 'bitform')}</button>
      </div>
      <Modal
        md
        autoHeight
        show={importOpts.show}
        setModal={closeImportModal}
        className="o-v"
        title={__('Import Options', 'bitform')}
      >
        <div className="pos-rel">
          {!isPro && (
            <div className="pro-blur flx" style={{ top: -7, width: '105%', left: -17 }}>
              <div className="pro">
                {__('Available On', 'bitform')}
                <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                  <span className="txt-pro">
                    &nbsp;
                    {__('Premium', 'bitform')}
                  </span>
                </a>
              </div>
            </div>
          )}
          <ImportOptions
            importOpts={importOpts}
            setImportOpts={setImportOpts}
            lblKey="label"
            valKey="value"
          />
        </div>
      </Modal>
    </div>
  )
}
