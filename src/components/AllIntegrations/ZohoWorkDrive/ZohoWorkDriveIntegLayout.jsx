import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ZohoWorkDriveActions from './ZohoWorkDriveActions'
import { handleInput, refreshSubFolders, refreshTeamFolders, refreshTeams } from './ZohoWorkDriveCommonFunc'

export default function ZohoWorkDriveIntegLayout({ formID, formFields, workDriveConf, setWorkDriveConf, isLoading, setisLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('Team:', 'bitform')}</b>
      <select onChange={(e) => handleInput(e, workDriveConf, setWorkDriveConf, formID, setisLoading, setSnackbar)} name="team" value={workDriveConf.team} className="btcd-paper-inp w-7">
        <option value="">{__('Select Team', 'bitform')}</option>
        {
          workDriveConf?.default?.teams && Object.values(workDriveConf.default.teams).map(teamApi => (
            <option key={teamApi.teamId} value={teamApi.teamId}>
              {teamApi.teamName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshTeams(formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh WorkDrive Teams', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <b className="wdt-100 d-in-b">Folder:</b>
      <select onChange={(e) => handleInput(e, workDriveConf, setWorkDriveConf, formID, setisLoading, setSnackbar, 0)} name="folder" value={workDriveConf.folderMap[0] || workDriveConf.folder} className="btcd-paper-inp w-7">
        <option value="">{__('Select Folder', 'bitform')}</option>
        {
          workDriveConf?.default?.teamFolders?.[workDriveConf.team] && Object.values(workDriveConf.default.teamFolders[workDriveConf.team]).map(teamFolderApi => (
            <option key={teamFolderApi.teamFolderId} value={teamFolderApi.teamFolderId}>
              {teamFolderApi.teamFolderName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshTeamFolders(formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh WorkDrive Team Folders', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      {workDriveConf.folderMap.map((folder, i) => (
        <div key={folder}>
          <br />
          <div className="flx">
            <b className="wdt-100 d-in-b" />
            <div className="d-in-b" style={{ width: (i + 1) * 10, marginLeft: 1, marginRight: 2, height: 58, marginTop: -60 }}>
              <div className="sub-tree" />
            </div>
            <div className="flx sub-folder w-7">
              <select onChange={(e) => handleInput(e, workDriveConf, setWorkDriveConf, formID, setisLoading, setSnackbar, i + 1)} name="folder" value={workDriveConf.folderMap[i + 1] || workDriveConf.folder} className="btcd-paper-inp">
                <option value={workDriveConf.folderMap[i]}>/ root</option>
                {
                  workDriveConf?.default?.folders?.[folder] && workDriveConf.default.folders[folder].map(folderApi => (
                    <option key={folderApi.folderId} value={folderApi.folderId}>
                      {folderApi.folderName}
                    </option>
                  ))
                }
              </select>
              <button onClick={() => refreshSubFolders(formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar, i)} className="d-non icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Sub Folders', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          </div>
        </div>
      ))}
      <br />
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
      {workDriveConf.folder && (
        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
          <div className="btcd-hr mt-1" />
          <ZohoWorkDriveActions
            workDriveConf={workDriveConf}
            setWorkDriveConf={setWorkDriveConf}
            formFields={formFields}
            formID={formID}
            setisLoading={setisLoading}
            setSnackbar={setSnackbar}
          />
        </>
      )}
    </>
  )
}
