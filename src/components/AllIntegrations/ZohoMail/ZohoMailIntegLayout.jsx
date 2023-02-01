import produce from 'immer'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $bits, $fieldsArr } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import TinyMCE from '../../Utilities/TinyMCE'
import ZohoMailActions from './ZohoMailActions'

export default function ZohoMailIntegLayout({ formFields, mailConf, setMailConf }) {
  const bits = useRecoilValue($bits)
  const fieldsArr = useRecoilValue($fieldsArr)

  const mailOptions = () => {
    const mail = []
    if (bits.userMail && Array.isArray(bits.userMail)) {
      mail.push(...bits.userMail)
    }
    const flds = []

    formFields.map(fld => {
      if (fld.type === 'email') {
        flds.push({ label: fld.name, value: `\${${fld.key}}` })
      }
    })
    mail.push({ title: 'Form Fields', type: 'group', childs: flds })
    return mail
  }

  const handleInput = (val, typ) => {
    setMailConf(prevState => {
      const tmp = { ...prevState }
      tmp[typ] = val
      return tmp
    })
  }

  const handleMailBody = val => {
    setMailConf(prevState => produce(prevState, draft => {
      draft.body = val
    }))
  }

  const addFieldToSubject = e => {
    const newConf = { ...mailConf }
    newConf.subject += e.target.value
    setMailConf({ ...newConf })
    e.target.value = ''
  }

  return (
    <div style={{ width: 875 }}>
      <div className="flx">
        <b style={{ width: 100 }}>{__('Type:', 'bitform')}</b>
        <select onChange={(e) => handleInput(e.target.value, 'mailType')} className="btcd-paper-inp" style={{ width: 150 }} value={mailConf.mailType}>
          <option value="">{__('Select type', 'bitform')}</option>
          <option value="send">{__('Send Email', 'bitform')}</option>
          <option value="draft">{__('Save as Draft', 'bitform')}</option>
        </select>
      </div>

      <div className="flx">
        <b style={{ width: 100 }}>To:</b>
        <MultiSelect
          className="w-7 mt-2 btcd-paper-drpdwn"
          defaultValue={mailConf.to}
          placeholder={__('Add Email Receiver', 'bitform')}
          onChange={(e) => handleInput(e, 'to')}
          options={mailOptions()}
          customValue
        />
      </div>

      <div className="flx">
        <b style={{ width: 100 }}>{__('CC:', 'bitform')}</b>
        <MultiSelect
          className="w-7 mt-2 btcd-paper-drpdwn"
          defaultValue={mailConf.cc}
          placeholder={__('Add Email CC', 'bitform')}
          onChange={(e) => handleInput(e, 'cc')}
          options={mailOptions()}
          customValue
        />
      </div>

      <div className="flx">
        <b style={{ width: 100 }}>{__('BCC:', 'bitform')}</b>
        <MultiSelect
          className="w-7 mt-2 btcd-paper-drpdwn"
          defaultValue={mailConf.bcc}
          placeholder={__('Add Email BCC', 'bitform')}
          onChange={(e) => handleInput(e, 'bcc')}
          options={mailOptions()}
          customValue
        />
      </div>

      <div className="mt-2 flx">
        <b style={{ width: 100 }}>{__('Subject:', 'bitform')}</b>
        <input type="text" onChange={(e) => handleInput(e.target.value, 'subject')} className="btcd-paper-inp w-7" placeholder={__('Email Subject Here', 'bitform')} value={mailConf.subject || ''} />
        <select onChange={addFieldToSubject} className="btcd-paper-inp ml-2" style={{ width: 150 }}>
          <option value="">{__('Add form field', 'bitform')}</option>
          {formFields !== null && formFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
        </select>
      </div>

      <div className="mt-3">
        <div className="flx flx-between">
          <b>{__('Body:', 'bitform')}</b>
        </div>
        <TinyMCE
          id="body-content"
          formFields={fieldsArr}
          value={mailConf.body || ''}
          onChangeHandler={handleMailBody}
        />
      </div>
      <br />
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
      <div className="btcd-hr mt-1" />
      <ZohoMailActions
        mailConf={mailConf}
        setMailConf={setMailConf}
        formFields={formFields}
      />
    </div>
  )
}
