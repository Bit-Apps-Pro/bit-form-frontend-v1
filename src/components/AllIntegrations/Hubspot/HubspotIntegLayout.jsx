/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import HubspotFieldMap from './HubspotFieldMap'
import { getAllPipelines } from './HubspotCommonFunc'
import HubspotActions from './HubspotActions'

export default function HubspotIntegLayout({ formFields, handleInput, hubspotConf, setHubspotConf, isLoading, setIsLoading, setSnackbar }) {
  const contactFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'firstname', label: 'First Name', required: false },
    { key: 'lastname', label: 'Last Name', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'jobtitle', label: 'Job Title', required: false },
  ]
  const dealFields = [
    { key: 'dealname', label: 'Deal Name', required: true },
    { key: 'amount', label: 'Amount', required: false },
    { key: 'closedate', label: 'Close Date', required: false },
  ]
  const ticketFields = [
    { key: 'subject', label: 'Ticket Name', required: true },
    { key: 'content', label: 'Ticket description', required: false },
  ]

  let stagesTmp = []
  const action = [
    { label: 'Contact Create', value: 'contact-create' },
    { label: 'Deal Create', value: 'deal-create' },
    { label: 'Ticket Create', value: 'ticket-create' },
  ]
  const getFields = (e) => {
    let hubspotFields = []
    if (hubspotConf?.actionName === 'contact-create') {
      hubspotFields = hubspotConf?.contactFields || []
    } else if (hubspotConf?.actionName === 'deal-create') {
      hubspotFields = hubspotConf?.dealFields || []
    } else if (hubspotConf?.actionName === 'ticket-create') {
      hubspotFields = hubspotConf?.ticketFields || []
    }
    return hubspotFields
  }
  const handleInputP = (e) => {
    const newConf = { ...hubspotConf }
    const { name, value } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
    } else {
      delete newConf[name]
    }
    if (name === 'pipeline') {
      // if (hubspotConf?.default?.pipelines) {
      stagesTmp = hubspotConf?.default?.pipelines.filter(({ pipelineId }) => pipelineId === value).map(({ stages }) => stages)
      newConf.stageTmp = stagesTmp
      setHubspotConf({ ...newConf })
      // }
    } else if (name === 'actionName') {
      const apiKey = hubspotConf?.api_key
      const tmp = {
        name: 'Hubspot',
        type: 'Hubspot',
        api_key: apiKey,
        field_map: [
          { formField: '', hubspotField: '' },
        ],
        actionName: value,
        actions: {},
        contactFields,
        dealFields,
        ticketFields,
      }
      if (value === 'deal-create' || value === 'ticket-create') {
        getAllPipelines(tmp, setHubspotConf, setIsLoading)
      } else {
        setHubspotConf(tmp)
      }
    }
  }
  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bitform')}</b>

        <select onChange={handleInputP} name="actionName" value={hubspotConf?.actionName} className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bitform')}</option>
          {
            action.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>
      <br />
      <br />
      {(hubspotConf?.actionName === 'deal-create' || hubspotConf.actionName === 'ticket-create' ) && (
        <>
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Pipeline:', 'bitform')}</b>

            <select onChange={handleInputP} name="pipeline" value={hubspotConf?.pipeline} className="btcd-paper-inp w-5">
              <option value="">{__('Select Pipeline', 'bitform')}</option>
              {hubspotConf?.default?.pipelines.map(({ pipelineId, pipelineName }) => (
                <option key={pipelineId} value={pipelineId}>
                  {pipelineName}
                </option>
              ))}
            </select>
          </div>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Stage:', 'bitform')}</b>

            <select onChange={handleInput} name="stage" value={hubspotConf?.stage} className="btcd-paper-inp w-5">
              <option value="">{__('Select Stage', 'bitform')}</option>
              {hubspotConf?.stageTmp?.[0]?.map(({ stageId, stageName }) => (
                <option key={stageId} value={stageId}>
                  {stageName}
                </option>
              ))}
            </select>
          </div>

        </>
      )}
      <br />
      {((hubspotConf?.actionName === 'contact-create') || (hubspotConf?.pipeline && hubspotConf?.stage))
      && (
        <>
          <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bitform')}</b></div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
            <div className="txt-dp"><b>{__('Hubspot Fields', 'bitform')}</b></div>
          </div>
        </>
      )}
      {((hubspotConf?.actionName === 'contact-create') || (hubspotConf?.pipeline && hubspotConf?.stage)) && hubspotConf?.field_map.map((itm, i) => (
        <HubspotFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          hubspotConf={hubspotConf}
          formFields={formFields}
          setHubspotConf={setHubspotConf}
          setSnackbar={setSnackbar}
          actionName={hubspotConf?.actionName}
          hubspotFields={getFields()}
        />
      ))}
      <div className="txt-center mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(hubspotConf.field_map.length, hubspotConf, setHubspotConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
      <br />
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
      <div className="btcd-hr mt-1" />
      <HubspotActions
        hubspotConf={hubspotConf}
        setHubspotConf={setHubspotConf}
        formFields={formFields}
      />

    </>
  )
}
