/* eslint-disable no-param-reassign */

import produce from 'immer'
import { NavLink, Redirect, useHistory, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $bits, $fieldsArr, $mailTemplates } from '../GlobalStates'
import BackIcn from '../Icons/BackIcn'
import { deepCopy } from '../Utils/Helpers'
import { __ } from '../Utils/i18nwrap'
import { SmartTagField } from '../Utils/StaticData/SmartTagField'
import TinyMCE from './Utilities/TinyMCE'

function EmailTemplateEdit() {
  console.log('%c $render EmailTemplateEdit', 'background:purple;padding:3px;border-radius:5px;color:white')
  const { formType, formID, id } = useParams()
  const history = useHistory()
  const [mailTemp, setMailTem] = useRecoilState($mailTemplates)
  const formFields = useRecoilValue($fieldsArr)

  const bits = useRecoilValue($bits)
  const { isPro } = bits

  const handleTitle = e => {
    const mailTem = deepCopy(mailTemp)
    mailTem[id].title = e.target.value
    setMailTem(mailTem)
  }

  const handleSubject = e => {
    const mailTem = deepCopy(mailTemp)
    mailTem[id].sub = e.target.value
    setMailTem(mailTem)
  }

  const handleBody = val => {
    setMailTem(prevState => produce(prevState, draft => {
      draft[id].body = val
    }))
  }

  const addFieldToSubject = e => {
    const mailTem = deepCopy(mailTemp)
    mailTem[id].sub += e.target.value
    setMailTem(mailTem)
  }

  const save = () => {
    const newMailTem = produce(mailTemp, draft => {
      draft.push({ updateTem: 1 })
    })
    setMailTem(newMailTem)
    history.push(`/form/settings/${formType}/${formID}/email-templates`)
  }

  return (
    mailTemp.length < 1 ? <Redirect to={`/form/settings/edit/${formID}/email-templates`} /> : (
      <div style={{ width: 900 }}>
        <NavLink to={`/form/settings/${formType}/${formID}/email-templates`} className="btn btcd-btn-o-gray">
          <BackIcn className="mr-1" />
          {__('Back', 'bitform')}
        </NavLink>

        <button id="secondary-update-btn" onClick={save} className="btn blue f-right" type="button">{__('Update Template', 'bitform')}</button>

        <div className="mt-3 flx">
          <b style={{ width: 102 }}>
            {__('Template Name:', 'bitform')}
          </b>
          <input onChange={handleTitle} type="text" className="btcd-paper-inp w-9" placeholder="Name" value={mailTemp[id].title} />
        </div>
        <div className="mt-3 flx">
          <b style={{ width: 100 }}>{__('Subject:', 'bitform')}</b>
          <input onChange={handleSubject} type="text" className="btcd-paper-inp w-7" placeholder={__('Email Subject Here', 'bitform')} value={mailTemp[id].sub} />
          <select onChange={addFieldToSubject} className="btcd-paper-inp ml-2" style={{ width: 150 }}>
            <option value="">{__('Add field', 'bitform')}</option>
            <optgroup label="Form Fields">
              {formFields !== null && formFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
            </optgroup>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="mt-3">
          <div><b>{__('Body:', 'bitform')}</b></div>

          <label htmlFor={`t-m-e-${id}-${formID}`} className="mt-2 w-10">
            <TinyMCE
              id={`mail-tem-${formID}`}
              formFields={formFields}
              value={mailTemp[id].body}
              onChangeHandler={handleBody}
              width="100%"
            />
          </label>
        </div>

      </div>
    )
  )
}

export default EmailTemplateEdit
