/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getAllCompany, getAllContacts, getAllOwners } from './HubspotCommonFunc'

export default function HubspotActions({ hubspotConf, setHubspotConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const [snack, setSnackbar] = useState({ show: false })
  const actionHandler = (e, type) => {
    const newConf = { ...hubspotConf }
    if (e.target.checked) {
      if (type === 'contact_owner') {
        getAllOwners(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)
      } else if (type === 'company') {
        getAllCompany(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)
      } else if (type === 'contact') {
        getAllContacts(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)
      }
      newConf.actions[type] = true
      setActionMdl({ show: type })
    } else {
      setActionMdl({ show: false })
      delete newConf.actions[type]
    }
    setHubspotConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }
  const setChanges = (val, type) => {
    const newConf = { ...hubspotConf }
    newConf[type] = val
    setHubspotConf({ ...newConf })
  }
  const lifecycleStage = [
    { value: 'subscriber', label: 'Subscriber' },
    { value: 'lead', label: 'Lead' },
    { value: 'marketingqualifiedlead', label: 'Marketing Qualified Lead' },
    { value: 'salesqualifiedlead', label: 'Sales Qualified Lead' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'evangelist', label: 'Evangelist' },
    { value: 'other', label: 'Other' },
    { value: 'customer', label: 'Customer' },
  ]
  const leadStatus = [
    { value: 'OPEN', label: 'Open' },
    { value: 'NEW', label: 'New' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'OPEN_DEAL', label: 'Open Deal' },
    { value: 'UNQUALIFIED', label: 'Unqualified' },
    { value: 'ATTEMPTED_TO_CONTACT', label: 'Attempted to contact' },
    { value: 'CONNECTED', label: 'Connected' },
    { value: 'BAD_TIMING', label: 'Bad timing' },
  ]
  const dealType = [
    { value: 'newbusiness', label: 'New Business' },
    { value: 'existingbusiness', label: 'Existing Business' },
  ]
  const priority = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]

  return (

    <div className="pos-rel d-flx w-8">
      {hubspotConf?.actionName && <TableCheckBox checked={hubspotConf?.actions?.contact_owner || false} onChange={(e) => actionHandler(e, 'contact_owner')} className="wdt-200 mt-4 mr-2" value="contact_owner" title={__('Contact Owner', 'bit-integrations')} subTitle={__('Add a contact owner', 'bit-integrations')} />}
      {hubspotConf?.actionName === 'contact-create' && <TableCheckBox checked={hubspotConf?.actions?.lifecycle_stage || false} onChange={(e) => actionHandler(e, 'lifecycle_stage')} className="wdt-200 mt-4 mr-2" value="lifecycle_stage" title={__('Lifecycle Stage', 'bit-integrations')} subTitle={__('Add a lifecycle stage', 'bit-integrations')} />}
      {hubspotConf?.actionName === 'contact-create' && <TableCheckBox checked={hubspotConf?.actions?.lead_status || false} onChange={(e) => actionHandler(e, 'lead_status')} className="wdt-200 mt-4 mr-2" value="lead_status" title={__('Lead Status', 'bit-integrations')} subTitle={__('Add lead status', 'bit-integrations')} />}
      {hubspotConf?.actionName === 'deal-create' && <TableCheckBox checked={hubspotConf?.actions?.contact || false} onChange={(e) => actionHandler(e, 'contact')} className="wdt-200 mt-4 mr-2" value="contact" title={__('Contact', 'bit-integrations')} subTitle={__('Associate deal with contacts', 'bit-integrations')} />}
      {hubspotConf?.actionName === 'deal-create' && <TableCheckBox checked={hubspotConf?.actions?.company || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Company', 'bit-integrations')} subTitle={__('Associate deal with company', 'bit-integrations')} />}
      {hubspotConf?.actionName === 'deal-create' && <TableCheckBox checked={hubspotConf?.actions?.deal_type || false} onChange={(e) => actionHandler(e, 'deal_type')} className="wdt-200 mt-4 mr-2" value="deal_type" title={__('Deal Type', 'bit-integrations')} subTitle={__('Add type to deal', 'bit-integrations')} />}
      {hubspotConf?.actionName !== 'contact-create' && <TableCheckBox checked={hubspotConf?.actions?.priority || false} onChange={(e) => actionHandler(e, 'priority')} className="wdt-200 mt-4 mr-2" value="deal_type" title={__('Priority', 'bit-integrations')} subTitle={__('Add priority to deal', 'bit-integrations')} />}
      {/* {hubspotConf?.actionName === 'ticket-create' && <TableCheckBox checked={hubspotConf?.actions?.priority || false} onChange={(e) => actionHandler(e, 'priority')} className="wdt-200 mt-4 mr-2" value="deal_type" title={__('Priority', 'bit-integrations')} subTitle={__('Add priority to deal', 'bit-integrations')} />} */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'contact_owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contact Owner', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {/* <small>{__('Add a contacts owner', 'bit-integrations')}</small> */}
        {/* <div className="mt-2">{__('Contact Owner', 'bit-integrations')}</div> */}
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.contact_owner}
                options={hubspotConf.default?.owners?.map(list => ({ label: list.ownerName, value: list.ownerId.toString() }))}
                onChange={val => setChanges(val, 'contact_owner')}
                customValue
                singleSelect
              />
              <button onClick={() => getAllOwners(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Owners', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}

      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lifecycle_stage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lifecycle Stage', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {/* <small>{__('Add a contacts owner', 'bit-integrations')}</small> */}
        {/* <div className="mt-2">{__('Contact Owner', 'bit-integrations')}</div> */}
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.lifecycle_stage}
                options={lifecycleStage?.map(list => ({ label: list.label, value: list.value.toString() }))}
                onChange={val => setChanges(val, 'lifecycle_stage')}
                customValue
                singleSelect
              />
              {/* <button onClick={() => getAllTags(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button> */}
            </div>
          )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lead_status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lead Status', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {/* <small>{__('Add a contacts owner', 'bit-integrations')}</small> */}
        {/* <div className="mt-2">{__('Contact Owner', 'bit-integrations')}</div> */}
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.lead_status}
                options={leadStatus?.map(list => ({ label: list.label, value: list.value.toString() }))}
                onChange={val => setChanges(val, 'lead_status')}
                customValue
                singleSelect
              />
              {/* <button onClick={() => getAllTags(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button> */}
            </div>
          )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'contact'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contacts', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {/* <small>{__('Add a contacts owner', 'bit-integrations')}</small> */}
        {/* <div className="mt-2">{__('Contact Owner', 'bit-integrations')}</div> */}
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.contact}
                options={hubspotConf?.default?.contacts?.map(list => ({ label: list.contactName, value: list.contactId.toString() }))}
                onChange={val => setChanges(val, 'contact')}
                customValue
                singleSelect
              />
              {/* <button onClick={() => getAllTags(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button> */}
            </div>
          )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Company', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {/* <small>{__('Add a contacts owner', 'bit-integrations')}</small> */}
        {/* <div className="mt-2">{__('Contact Owner', 'bit-integrations')}</div> */}
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.company}
                options={hubspotConf?.default?.companies?.map(list => ({ label: list.companyName, value: list.companyId.toString() }))}
                onChange={val => setChanges(val, 'company')}
                customValue
                singleSelect
              />
              <button onClick={() => getAllCompany(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'deal_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Deal Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {/* <small>{__('Add a contacts owner', 'bit-integrations')}</small> */}
        {/* <div className="mt-2">{__('Contact Owner', 'bit-integrations')}</div> */}
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.deal_type}
                options={dealType?.map(list => ({ label: list.label, value: list.value.toString() }))}
                onChange={val => setChanges(val, 'deal_type')}
                customValue
                singleSelect
              />
              {/* <button onClick={() => getAllTags(hubspotConf, setHubspotConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button> */}
            </div>
          )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'priority'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Priority', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={hubspotConf?.priority}
                options={priority?.map(list => ({ label: list.label, value: list.value.toString() }))}
                onChange={val => setChanges(val, 'priority')}
                customValue
                singleSelect
              />
            </div>
          )}
      </ConfirmModal>
    </div>
  )
}
