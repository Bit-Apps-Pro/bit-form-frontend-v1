import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoSheetActions from './ZohoSheetActions'
import { refreshWorkbooks, refreshWorksheetHeaders, refreshWorksheets } from './ZohoSheetCommonFunc'
import ZohoSheetFieldMap from './ZohoSheetFieldMap'

export default function ZohoSheetIntegLayout({ formID, formFields, handleInput, sheetConf, setSheetConf, isLoading, setisLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-150 d-in-b">{__('Workbook:', 'bitform')}</b>
      <select onChange={handleInput} name="workbook" value={sheetConf.workbook} className="btcd-paper-inp w-7">
        <option value="">{__('Select Workbook', 'bitform')}</option>
        {
          sheetConf?.default?.workbooks && Object.keys(sheetConf.default.workbooks).map(workbookApiName => (
            <option key={workbookApiName} value={sheetConf.default.workbooks[workbookApiName].workbookId}>
              {sheetConf.default.workbooks[workbookApiName].workbookName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshWorkbooks(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Sheet Workbooks"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <b className="wdt-150 d-in-b">Worksheet:</b>
      <select onChange={handleInput} name="worksheet" value={sheetConf.worksheet} className="btcd-paper-inp w-7">
        <option value="">{__('Select Worksheet', 'bitform')}</option>
        {
          sheetConf?.default?.worksheets?.[sheetConf.workbook] && sheetConf.default.worksheets[sheetConf.workbook].map(worksheetApiName => (
            <option key={worksheetApiName} value={worksheetApiName}>
              {worksheetApiName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshWorksheets(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Sheet Worksheets"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <b className="wdt-150 d-in-b">{__('Header Row:', 'bitform')}</b>
      <input type="number" min="1" className="btcd-paper-inp w-4" placeholder="Header Row" onChange={handleInput} value={sheetConf.headerRow} name="headerRow" />
      <button onClick={() => refreshWorksheetHeaders(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Worksheet Headers"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <small className="mt-3 d-blk" style={{ marginLeft: 155, lineHeight: 1.8 }}>{__('By default, first row of the worksheet is considered as header row. This can be used if tabular data starts from any row other than the first row.', 'bitform')}</small>
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
      {sheetConf.default?.worksheets?.headers?.[sheetConf.worksheet]?.[sheetConf.headerRow]
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-1">
              <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
              <div className="txt-dp"><b>{__('Zoho Fields', 'bitform')}</b></div>
            </div>

            {sheetConf.field_map.map((itm, i) => (
              <ZohoSheetFieldMap
                key={`sheet-m-${i + 9}`}
                i={i}
                field={itm}
                sheetConf={sheetConf}
                formFields={formFields}
                setSheetConf={setSheetConf}
              />
            ))}
            <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(sheetConf.field_map.length, sheetConf, setSheetConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />

          </>
        )}
      {sheetConf.workbook && (
        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
          <div className="btcd-hr mt-1" />
          <ZohoSheetActions
            sheetConf={sheetConf}
            setSheetConf={setSheetConf}
            formFields={formFields}
          />
        </>
      )}
    </>
  )
}
