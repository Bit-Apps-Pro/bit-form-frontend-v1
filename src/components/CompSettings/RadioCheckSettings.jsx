/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import { memo, useEffect, useState } from 'react'
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

function RadioCheckSettings() {
  console.log('%c $render RadioCheckSettings', 'background:royalblue;padding:3px;border-radius:5px;color:white')
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const options = deepCopy(fields[fldKey].opt)
  const adminLabel = fieldData.adminLbl || ''
  const isRound = fieldData.round || false
  const isRadioRequired = fieldData.valid.req || false
  const isOptionRequired = fieldData.opt.find(opt => opt.req)
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const dataSrc = fieldData?.customType?.type || 'fileupload'
  let fieldObject = null
  let disabled = false
  if (fieldData?.customType?.type) {
    disabled = true
    fieldObject = fieldData?.customType
  }
  const [importOpts, setImportOpts] = useState({})
  useEffect(() => setImportOpts({ dataSrc, fieldObject, disabled }), [fldKey])
  function setAdminLabel(e) {
    if (e.target.value === '') {
      delete fieldData.adminLbl
    } else {
      fieldData.adminLbl = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setRound(e) {
    if (e.target.checked) {
      fieldData.round = true
    } else {
      delete fieldData.round
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function rmvOpt(ind) {
    options.splice(ind, 1)
    fieldData.opt = options
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function addOpt() {
    options.push({ lbl: `Option ${options.length + 1}` })
    fieldData.opt = options
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setCheck(e, i) {
    if (fieldData.typ === 'radio') {
      for (let ind = 0; ind < options.length; ind += 1) {
        delete options[ind].check
      }
    }

    if (e.target.checked) {
      const tmp = { ...options[i] }
      tmp.check = true
      options[i] = tmp
    } else {
      delete options[i].check
    }
    fieldData.opt = options
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setReq(e, i) {
    if (e.target.checked) {
      const tmp = { ...options[i] }
      tmp.req = true
      options[i] = tmp
    } else {
      delete options[i].req
    }
    fieldData.opt = options
    const reqOpts = options.filter(opt => opt.req).map(op => op.lbl).join(', ')
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err.req) fieldData.err.req = {}
    fieldData.err.req.dflt = reqOpts ? `<p>${reqOpts} is required</p>` : '<p>This field is required</p>'
    fieldData.err.req.show = true

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setRadioRequired = e => {
    if (e.target.checked) {
      fieldData.valid.req = true
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

  function setOptLbl(e, i) {
    const tmp = { ...options[i] }
    tmp.lbl = e.target.value
    tmp.val = tmp.lbl.replace(/,/g, '_')
    options[i] = tmp
    fieldData.opt = options
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
      setRadioRequired({ target: { checked: false } })
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = `<p>Minimum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}<p>`
      fieldData.err.mn.show = true
      if (!isOptionRequired) setRadioRequired({ target: { checked: true } })
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
    <div className="mr-4 ml-2">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">Field Type : </span>
        {fieldData.typ === 'check' ? 'Check Box' : 'Radio'}
      </div>
      <div className="flx">
        <span className="font-w-m w-4">{__('Field Key : ', 'bitform')}</span>
        <CopyText value={fldKey} className="field-key-cpy m-0" />
      </div>
      <FieldLabelSettings />
      <SingleInput inpType="text" title={__('Admin Label:', 'bitform')} value={adminLabel} action={setAdminLabel} />
      <SingleToggle title={__('Required:', 'bitform')} action={setRadioRequired} isChecked={isRadioRequired || isOptionRequired} disabled={isOptionRequired} className="mt-3" />
      {(isRadioRequired || isOptionRequired) && (
        <ErrorMessageSettings
          type="req"
          title="Error Message"
          tipTitle="By enabling this feature, user will see the error message when required option is not checked"
        />
      )}
      <SingleToggle title={__('Rounded:', 'bitform')} action={setRound} isChecked={isRound} className="mt-3" />
      {
        fieldData.typ === 'check' && (
          <>
            <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Minimum:', 'bitform')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set minimum number to be selected for checkbox option', 'bitform')}</div>
                </Cooltip>
                {!bits.isPro && <span className="pro-badge ml-2">{__('Pro', 'bitform')}</span>}
              </div>
              <input className="btcd-paper-inp" type="number" value={min} onChange={setMin} disabled={!isPro} />
            </div>

            {fieldData.mn && (
              <ErrorMessageSettings
                type="mn"
                title="Min Error Message"
                tipTitle={`By enabling this feature, user will see the error message when selected checkbox is less than ${fieldData.mn}`}
              />
            )}

            <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Maximum:', 'bitform')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set maximum number to be selected for checkbox option', 'bitform')}</div>
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
                  tipTitle={`By enabling this feature, user will see the error message when selected checkbox is greater than ${fieldData.mx}`}
                />
                <SingleToggle title={__('Disable if maximum selected:', 'bitform')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!isPro} className="mt-3 mb-2" />
              </>
            )}
          </>
        )
      }
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
          defaultMsg="The value is already taken. Try another."
        />
      </div>
      <button onClick={openImportModal} className="btn" type="button">
        <DownloadIcon size="16" />
        &nbsp;
        {__('Import Options', 'bitform')}
      </button>
      <div className="opt mt-1">
        <span className="font-w-m">{__('Options:', 'bitform')}</span>
        {options.map((itm, i) => (
          <div key={`opt-${i + 8}`} className="flx flx-between">
            <SingleInput inpType="text" value={itm.lbl} action={e => setOptLbl(e, i)} width={140} className="mt-0" />
            <div className="flx mt-1">
              {fieldData.typ === 'check'
                && (
                  <label className="btcd-ck-wrp tooltip m-0" style={{ '--tooltip-txt': `'${__('Required', 'bitform')}'` }}>
                    <input onChange={(e) => setReq(e, i)} type="checkbox" checked={itm.req !== undefined} disabled={isRadioRequired} />
                    <span className="btcd-mrk ck br-50 " />
                  </label>
                )}
              <label className="btcd-ck-wrp tooltip m-0" style={{ '--tooltip-txt': `'${__('Check by Default', 'bitform')}'` }}>
                <input onChange={(e) => setCheck(e, i)} type="checkbox" checked={itm.check !== undefined} />
                <span className="btcd-mrk ck br-50 " />
              </label>
              <button onClick={() => rmvOpt(i)} className="btn cls-btn" type="button" aria-label="close"><CloseIcn size="12" /></button>
            </div>
          </div>
        ))}
        <button onClick={addOpt} className="btn blue" type="button">
          {__('Add More +', 'bitform')}
        </button>
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
            lblKey="lbl"
            valKey="val"
            customType={fieldData}
          />
        </div>
      </Modal>
    </div>
  )
}

export default memo(RadioCheckSettings)
