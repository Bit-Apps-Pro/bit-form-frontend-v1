import produce from 'immer'
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $fieldsArr } from '../../../GlobalStates'
import MailOpenIcn from '../../../Icons/MailOpenIcn'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TinyMCE from '../../Utilities/TinyMCE'
import { handleInput, refreshTemplateDetails, refreshTemplates } from './ZohoSignCommonFunc'

export default function ZohoSignIntegLayout({ formID, formFields, signConf, setSignConf, isLoading, setisLoading, setSnackbar }) {
  const fieldsArr = useRecoilValue($fieldsArr)
  const [actionMdl, setActionMdl] = useState({ show: false })

  if (signConf.template && signConf?.default?.templateDetails?.[signConf?.template] && (!signConf?.templateActions || (signConf.templateActions.length !== signConf?.default?.templateDetails?.[signConf?.template]?.actions?.length))) {
    // eslint-disable-next-line no-param-reassign
    signConf.templateActions = signConf.default.templateDetails[signConf.template].actions.map(action => ({
      action_id: action.action_id,
      action_type: action.action_type,
      language: action.language,
      private_notes: action.private_notes,
      recipient_countrycode: action.recipient_countrycode,
      recipient_email: action.recipient_email,
      recipient_name: action.recipient_name,
      recipient_phonenumber: action.recipient_phonenumber,
      in_person_name: action.in_person_name || '',
      in_person_email: action.in_person_email || '',
      role: action.role,
      verify_recipient: action.verify_recipient,
      verification_type: action.verification_type || '',
    }))
    // eslint-disable-next-line no-param-reassign
    signConf.notes = signConf.default.templateDetails[signConf.template].notes || ''
  }

  const handleAction = (indx, typ, val) => {
    setSignConf(oldState => {
      const tmp = deepCopy(oldState)
      if (indx === 'notes') {
        tmp.notes = val
      } else {
        tmp.templateActions[indx][typ] = val
      }
      return tmp
    })
  }

  const handleNote = val => {
    setSignConf(prevState => produce(prevState, draft => {
      draft.notes = val
    }))
  }

  const privateMsgField = val => {
    setSignConf(oldState => {
      const tmp = deepCopy(oldState)
      tmp.templateActions[actionMdl.indx].private_notes += val
      return tmp
    })
  }

  const openPrivateMsgMdl = indx => {
    setActionMdl({ show: 'private_notes', indx })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  return (
    <>
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <div className="flx">
        <b className="wdt-100">{__('Templates:', 'bitform')}</b>
        <select className="btcd-paper-inp w-4" onChange={(e) => handleInput(e, signConf, setSignConf, formID, setisLoading, setSnackbar)} name="template" value={signConf.template}>
          <option value="">{__('Select Template', 'bitform')}</option>
          {signConf?.default?.templates && Object.values(signConf.default.templates).map(template => <option key={template.templateId} value={template.templateId}>{template.templateName}</option>)}
        </select>
        <button onClick={() => refreshTemplates(formID, signConf, setSignConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Sign Templates', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <br />
      <br />
      <b className="wdt-100">{__('Recipients:', 'bitform')}</b>
      <button onClick={() => refreshTemplateDetails(formID, signConf, setSignConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Template Details', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      {signConf?.templateActions?.map((action, i) => (
        <div key={action.role}>
          <div className="flx mt-2">
            <input type="text" value={i + 1} readOnly className="btcd-paper-inp mr-1" style={{ width: 40 }} />
            <input className="btcd-paper-inp w-3" type="text" value={action.role} readOnly />
          </div>
          {action.action_type === 'INPERSONSIGN' && (
            <div className="flx mt-2" style={{ marginLeft: 45 }}>
              <input type="text" value="Signer" readOnly className="btcd-paper-inp mr-1 mt-4 w-1" />

              <div className="mr-2 w-4">
                <div className="mb-1">{__('In Person Email (Optional)', 'bitform')}</div>
                <MultiSelect
                  className="msl-wrp-options btcd-paper-drpdwn w-10"
                  defaultValue={action.in_person_email}
                  options={formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))}
                  onChange={e => handleAction(i, 'in_person_email', e)}
                  placeholder={__('In Person Email', 'bitform')}
                  singleSelect
                  customValue
                />
              </div>
              <div className="mr-2 w-4">
                <div className="mb-1">{__('In Person Name', 'bitform')}</div>
                <MultiSelect
                  className="msl-wrp-options btcd-paper-drpdwn w-10"
                  defaultValue={action.in_person_name}
                  options={formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))}
                  onChange={e => handleAction(i, 'in_person_name', e)}
                  placeholder={__('In Person Name', 'bitform')}
                  singleSelect
                  customValue
                />
              </div>
            </div>
          )}
          <div className="flx mt-2" style={{ marginLeft: 45 }}>
            {action.action_type === 'INPERSONSIGN' && <input type="text" value="Host" readOnly className="btcd-paper-inp mr-1 mt-4 w-1" />}
            <div className="mr-2 w-3">
              <div className="mb-1">{__('Recipient Email', 'bitform')}</div>
              <MultiSelect
                className="msl-wrp-options btcd-paper-drpdwn w-10"
                defaultValue={action.recipient_email}
                options={formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))}
                onChange={e => handleAction(i, 'recipient_email', e)}
                placeholder={__('Recipient Email', 'bitform')}
                singleSelect
                customValue
              />
            </div>
            <div className="mr-2 w-3">
              <div className="mb-1">{__('Recipient Name', 'bitform')}</div>
              <MultiSelect
                className="msl-wrp-options btcd-paper-drpdwn w-10"
                defaultValue={action.recipient_name}
                options={formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))}
                onChange={e => handleAction(i, 'recipient_name', e)}
                placeholder={__('Recipient Email', 'bitform')}
                singleSelect
                customValue
              />
            </div>

            <div className="mr-2 w-1">
              <div className="mb-1">{__('Language', 'bitform')}</div>
              <select onChange={e => handleAction(i, 'language', e.target.value)} className="btcd-paper-inp" value={action.language}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="pl">Polish</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="es">Spanish</option>
                <option value="sv">Swedish</option>
              </select>
            </div>

            <div className="mr-1 w-2">
              <div className="mb-1">{__('Role', 'bitform')}</div>
              <input type="text" value={action.action_type} readOnly className="btcd-paper-inp" />
            </div>
            <button onClick={() => openPrivateMsgMdl(i)} className="icn-btn mr-1 mt-3 tooltip" style={{ '--tooltip-txt': `'${__('Private Note', 'bitform')}'` }} aria-label="Private Message" type="button"><MailOpenIcn size="21" /></button>
          </div>
        </div>
      ))}

      <div className="mt-5">
        <b className="wdt-100">{__('Leave a Note:', 'bitform')}</b>
        {/* <select className="btcd-paper-inp w-2 ml-4" onChange={e => notesField(e.target.value)}>
          <option value="">{__('Field', 'bitform')}</option>
          {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
        </select> */}
        {/* <textarea rows="5" className="btcd-paper-inp mt-2 w-7" onChange={e => handleAction('notes', 'notes', e.target.value)} value={signConf.notes} /> */}
        <TinyMCE
          id="body-content"
          formFields={fieldsArr}
          value={signConf.notes}
          onChangeHandler={handleNote}
        />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'private_notes'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Private Note', 'bitform')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <select className="btcd-paper-inp w-5" onChange={e => privateMsgField(e.target.value)}>
          <option value="">{__('Field', 'bitform')}</option>
          {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
        </select>
        <textarea rows="5" className="btcd-paper-inp mt-2" onChange={e => handleAction(actionMdl.indx, 'private_notes', e.target.value)} value={signConf.templateActions?.[actionMdl.indx]?.private_notes} />
      </ConfirmModal>
    </>
  )
}
