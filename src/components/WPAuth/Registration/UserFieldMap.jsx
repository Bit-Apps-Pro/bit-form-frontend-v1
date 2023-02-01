import { useState } from 'react'
import produce from 'immer'
import { __ } from '../../../Utils/i18nwrap'
import Cooltip from '../../Utilities/Cooltip'
import { userFields } from '../../../Utils/StaticData/userField'
import FieldMap from './FieldMap'
import { addFieldMap } from './UserHelperFunction'
import SnackMsg from '../../Utilities/SnackMsg'
import TableCheckBox from '../../Utilities/TableCheckBox'
import EmailNotification from '../EmailNotification'
import EditIcn from '../../../Icons/EditIcn'
import RedirectEmailVerified from './RedirectEmailVerified'

export default function UserFieldMap({ formFields, userConf, setUserConf, pages, roles, type }) {
  const [snack, setSnackbar] = useState({ show: false })
  const [showMdl, setshowMdl] = useState(false)
  const [customRedirectMdl, setCustomRedirectMdl] = useState(false)

  const handleInput = e => {
    setUserConf(tmpConf => produce(tmpConf, draft => {
      const { name, value } = e.target
      // eslint-disable-next-line no-param-reassign
      draft[type][name] = value
    }))
  }

  const handleCheckd = e => {
    setUserConf(tmpConf => produce(tmpConf, draft => {
      const { name, checked } = e.target
      // eslint-disable-next-line no-param-reassign
      if (checked) {
        // eslint-disable-next-line no-param-reassign
        draft[type][name] = true
      } else {
        // eslint-disable-next-line no-param-reassign
        delete draft[type][name]
      }
    }))
  }

  const handlePage = (e) => {
    setUserConf(tmpConf => produce(tmpConf, draft => {
      const { value } = e.target
      // eslint-disable-next-line no-param-reassign
      draft[type].redirect_url = value
    }))
  }

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div>
        <div>
          <div>
            <div className="mt-3 mb-1">
              <b>{__('Field Mappping', 'bitform')}</b>
            </div>
            <div className="btcd-hr" />
            <div className="flx flx-around mt-2 mb-1">
              <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
              <div className="txt-dp">
                <b>{__('User Fields', 'bitform')}</b>
              </div>
            </div>
          </div>

          {
            userConf[type]?.user_map?.map((itm, i) => (
              <FieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                type="user"
                field={itm}
                formFields={formFields}
                userConf={userConf}
                setUserConf={setUserConf}
                customFields={userFields}
                setSnackbar={setSnackbar}
                fieldType="all"
                authType="register"
              />
            ))
          }

          <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(type, 'user_map', userConf[type]?.user_map?.length, userConf, setUserConf)} className="icn-btn sh-sm" type="button">+</button></div>

        </div>

        <div className="flx">
          <div className="w-5 mt-5 flx">
            <TableCheckBox name="user_notify" onChange={handleCheckd} title={__('User Email Notification', 'bitform')} checked={!!userConf[type]?.user_notify} value={false} />
            <Cooltip width={250} icnSize={17} className="ml-1">
              <div className="txt-body">
                When this option is enabled, a welcome email will be sent from WordPress after registration.
                <br />
              </div>
            </Cooltip>
          </div>
          <div className="w-5 mt-5 flx">
            <TableCheckBox name="admin_notify" onChange={handleCheckd} title={__('Admin Email Notification', 'bitform')} checked={!!userConf[type]?.admin_notify} value={false} />
            <Cooltip width={250} icnSize={17} className="ml-1">
              <div className="txt-body">
                If this option is enabled, e-mail will be sent from WordPress to admin.
                <br />
              </div>
            </Cooltip>
          </div>

        </div>
        <br />
        <div className="flx integ-fld-wrp">
          <div className="w-5 ">
            <div className="f-m">{__('Redirect Page:', 'bitform')}</div>
            <select className="btcd-paper-inp mt-1" value={userConf[type]?.redirect_url} onChange={handlePage}>
              <option value="">{__('Custom Link', 'bitform')}</option>
              {pages && pages.map((urlDetail, ind) => (
                <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
              ))}
            </select>
          </div>
          <div className="w-5 ml-2">
            <div className="f-m fw-500">Link</div>
            <input onChange={handleInput} name="redirect_url" className="btcd-paper-inp mt-1" type="text" value={userConf[type]?.redirect_url} />
          </div>
        </div>
        <br />
        <br />

        <div className="flx integ-fld-wrp">
          <div className="w-5 ">
            <div className="f-m fw-500">{__('WP User Role', 'bitform')}</div>
            <select name="user_role" onChange={handleInput} value={userConf[type]?.user_role} className="btcd-paper-inp mt-1">
              <option disabled selected>Select User Role</option>
              {roles.map((role, index) => (
                <option key={`acf-${index * 2}`} value={role?.key}>{role?.name}</option>
              ))}
            </select>
          </div>
          <div className="w-5 ml-2">
            <div className="f-m fw-500">
              {__('Success Messages', 'bitform')}
            </div>

            <input className="btcd-paper-inp mt-1" onChange={(e) => handleInput(e)} name="succ_msg" value={userConf[type]?.succ_msg} type="text" placeholder={__('Success Message', 'bitform')} />
          </div>
        </div>
        <br />
        <div className="flx integ-fld-wrp">
          <div className="w-5">
            <div className="f-m fw-500">{__('User Approval  Method:', 'bitform')}</div>
            <select className="btcd-paper-inp mt-1" name="activation" value={userConf[type]?.activation} onChange={handleInput}>
              <option disabled selected value="">{__('select approval method', 'bitform')}</option>
              <option value="auto_approve">Auto Approve</option>
              <option value="admin_review">Require Admin Review</option>
              <option value="email_verify">Require Email Activation</option>
            </select>
          </div>

          {userConf[type]?.activation === 'auto_approve' && (
            <div className="w-5 ml-2 flx">
              <TableCheckBox name="auto_login" onChange={handleCheckd} title={__('Auto Login After Registration', 'bitform')} checked={!!userConf[type]?.auto_login} value={false} />
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  if checked Auto Login, the user login automatically after registration.
                  <br />
                </div>
              </Cooltip>
            </div>
          )}
          <EmailNotification
            dataConf={userConf}
            setDataConf={setUserConf}
            type={type}
            showMdl={showMdl}
            setshowMdl={setshowMdl}
            title="Customize  Activation Email template"
          />
        </div>
        {userConf[type]?.activation === 'email_verify' && (
          <div className="flx  integ-fld-wrp">
            {/* <div className="flx w-5  mt-4">
              <span
                role="button"
                tabIndex="-1"
                className="cp"
                onClick={() => setshowMdl(true)}
                onKeyPress={() => setshowMdl(true)}
              >
                <EditIcn size={21} />
              </span>
              <div className="f-m ml-1">{__('Customize  Activation Email template', 'bitform')}</div>
            </div>

            <div className="flx w-5 ml-2 mt-4">
              <span
                role="button"
                tabIndex="-1"
                className="cp"
                onClick={() => setCustomRedirectMdl(true)}
                onKeyPress={() => setCustomRedirectMdl(true)}
              >
                <EditIcn size={21} />
              </span>
              <div className="f-m ml-1">{__('Redirect after verification', 'bitform')}</div>
              <RedirectEmailVerified dataConf={userConf} setDataConf={setUserConf} showMdl={customRedirectMdl} setCustomRedirectMdl={setCustomRedirectMdl} pages={pages} type={type} title="Redirect after verification" />

            </div> */}

            <div className="w-5 mt-4">
              <button type="button" className="btn" onClick={() => setshowMdl(true)}>
                <EditIcn size={18} />
                          &nbsp;
                {__('Customize Email template')}
              </button>

            </div>
            <div className="ml-2 mt-4">
              <button type="button" className="btn" onClick={() => setCustomRedirectMdl(true)}>
                <EditIcn size={18} />
                            &nbsp;
                {__('Edit verification messages', 'bitform')}
              </button>
              <RedirectEmailVerified dataConf={userConf} setDataConf={setUserConf} showMdl={customRedirectMdl} setCustomRedirectMdl={setCustomRedirectMdl} pages={pages} type={type} title="Edit verification messages" />
            </div>
          </div>
        )}
      </div>

    </>
  )
}
