// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ActiveCampaignActions from './ActiveCampaignActions'
import { refreshActiveCampaingHeader, refreshActiveCampaingList, refreshActiveCampaingTags } from './ActiveCampaignCommonFunc'
import ActiveCampaignFieldMap from './ActiveCampaignFieldMap'

export default function ActiveCampaignIntegLayout({ formID, formFields, activeCampaingConf, setActiveCampaingConf, isLoading, setIsLoading, setSnackbar }) {
  const setTags = (val) => {
    const newConf = { ...activeCampaingConf }
    if (val) {
      newConf.tagIds = val ? val.split(',') : []
    } else {
      delete newConf.tagIds
    }
    setActiveCampaingConf({ ...newConf })
  }

  const handleInput = (e) => {
    const listid = e.target.value
    const newConf = { ...activeCampaingConf }
    if (listid) {
      newConf.listId = listid
    } else {
      delete newConf.listId
    }
    refreshActiveCampaingHeader(newConf, setActiveCampaingConf, setIsLoading, setSnackbar)
  }

  const activeCampaignLists = activeCampaingConf?.default?.activeCampaignLists

  useEffect(() => {
    activeCampaignLists && refreshActiveCampaingTags(activeCampaingConf, setActiveCampaingConf, setIsLoading, setSnackbar)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaignLists])

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('List:', 'bitform')}</b>
      <select value={activeCampaingConf?.listId} name="listId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select List', 'bitform')}</option>
        {
          activeCampaingConf?.default?.activeCampaignLists && Object.keys(activeCampaingConf.default.activeCampaignLists).map(listname => (
            <option key={`${listname + 1}`} value={activeCampaingConf.default.activeCampaignLists[listname].listId}>
              {activeCampaingConf.default.activeCampaignLists[listname].listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshActiveCampaingList(activeCampaingConf, setActiveCampaingConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Activecapmaign list"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <div className="d-flx">
        <b style={{ marginTop: '15px' }} className="wdt-200 d-in-b">{__('Tags: ', 'bitform')}</b>
        <MultiSelect
          defaultValue={activeCampaingConf?.tagIds}
          className="btcd-paper-drpdwn w-5"
          options={activeCampaingConf?.default?.activeCampaignTags && Object.keys(activeCampaingConf.default.activeCampaignTags).map(tag => ({ label: activeCampaingConf.default.activeCampaignTags[tag].tagName, value: activeCampaingConf.default.activeCampaignTags[tag].tagId }))}
          onChange={val => setTags(val)}
        />
        <button onClick={() => refreshActiveCampaingTags(activeCampaingConf, setActiveCampaingConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Activecapmaign Tags', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <br />
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

      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
        <button onClick={() => refreshActiveCampaingHeader(activeCampaingConf, setActiveCampaingConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Activecapmaign Field', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {
        (activeCampaingConf?.listId || activeCampaingConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-1">
              <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
              <div className="txt-dp"><b>{__('ActiveCampaign Fields', 'bitform')}</b></div>
            </div>

            {activeCampaingConf.field_map.map((itm, i) => (
              <ActiveCampaignFieldMap
                key={`Activecampaign-m-${i + 9}`}
                i={i}
                field={itm}
                activeCampaingConf={activeCampaingConf}
                formFields={formFields}
                setActiveCampaingConf={setActiveCampaingConf}
              />
            ))}
            <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(activeCampaingConf.field_map.length, activeCampaingConf, setActiveCampaingConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
            <div className="btcd-hr mt-1" />
            <ActiveCampaignActions
              activeCampaingConf={activeCampaingConf}
              setActiveCampaingConf={setActiveCampaingConf}
            />
          </>
        )
      }

    </>
  )
}
