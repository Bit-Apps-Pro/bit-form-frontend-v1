import { __ } from '../../../Utils/i18nwrap'
import DropboxActions from './DropboxActions'
import { getAllDropboxFolders } from './DropboxCommonFunc'
import DropboxFieldMap from './DropboxFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function DropboxIntegLayout({ formID, formFields, dropboxConf, setDropboxConf, isLoading, setIsLoading }) {
  return (
    <>
      <div className="mt-5">
        <b className="wdt-100">{__('Field Map', 'bitform')}</b>
        <button onClick={() => getAllDropboxFolders(formID, dropboxConf, setDropboxConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Dropbox Folders', 'bitform')}'` }} type="button">&#x21BB;</button>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-1">
        <div className="txt-dp"><b>{__('File Input', 'bitform')}</b></div>
        <div className="txt-dp"><b>{__('Dropbox Folder', 'bitform')}</b></div>
      </div>

      {dropboxConf?.field_map.map((itm, i) => (
        <DropboxFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          formFields={formFields}
          dropboxConf={dropboxConf}
          setDropboxConf={setDropboxConf}
        />
      ))}
      <div className="txt-center  mt-2" style={{ marginRight: 85 }}>
        <button onClick={() => addFieldMap(dropboxConf.field_map.length, dropboxConf, setDropboxConf, false)} className="icn-btn sh-sm" type="button">+</button>
      </div>
      <br />
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
      <div className="btcd-hr mt-1" />
      <DropboxActions
        dropboxConf={dropboxConf}
        setDropboxConf={setDropboxConf}
      />
    </>
  )
}
