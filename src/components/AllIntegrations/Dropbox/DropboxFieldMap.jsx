import { sortByField } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap } from './IntegrationHelpers'

export default function DropboxFieldMap({ i, formFields, field, dropboxConf, setDropboxConf }) {
  const handleFieldMapping = (event, index) => {
    const newConf = { ...dropboxConf }
    newConf.field_map[index][event.target.name] = event.target.value
    setDropboxConf({ ...newConf })
  }

  return (
    <div className="flx mt-2 mr-1">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
            <option value="">{__('Select Field', 'bitform')}</option>
            {
              formFields?.filter(fld => fld.type === 'file-up').map(f => (
                <option key={`ff-rm-${f.key}`} value={f.key}>
                  {f.name}
                </option>
              ))
            }
          </select>

          <select className="btcd-paper-inp" name="dropboxFormField" value={field.dropboxFormField} onChange={(ev) => handleFieldMapping(ev, i)}>
            <option value="">{__('Select Folder', 'bitform')}</option>
            {
              sortByField(dropboxConf.foldersList, 'lower_path', 'ASC').map(({ name, lower_path }) => (
                <option key={lower_path} value={lower_path}>
                  {lower_path.substring(1).split('/').map(f => f.replace('/', '>')).join(' > ')}
                </option>
              ))
            }
          </select>
        </div>
        <button
          onClick={() => addFieldMap(i, dropboxConf, setDropboxConf)}
          className="icn-btn sh-sm ml-2 mr-1"
          type="button"
        >
          +
        </button>
        <button onClick={() => delFieldMap(i, dropboxConf, setDropboxConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
          <span className="btcd-icn icn-trash-2" />
        </button>
      </div>
    </div>
  )
}
