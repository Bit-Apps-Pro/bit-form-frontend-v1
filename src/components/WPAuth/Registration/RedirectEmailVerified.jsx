import produce from 'immer'
import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Cooltip from '../../Utilities/Cooltip'
import Modal from '../../Utilities/Modal'
import TinyMCE from '../../Utilities/TinyMCE'
import Scrollbars from 'react-custom-scrollbars-2'

export default function RedirectEmailVerified({ dataConf, setDataConf, showMdl, setCustomRedirectMdl, pages, title, type = '' }) {
  const data = type ? dataConf[type] : dataConf
  const handleInput = (e) => {
    const { name, value } = e.target
    console.log('name value', name, typeof value)
    setDataConf(tmpConf => produce(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      const tmp = type ? draft[type] : draft
      tmp[name] = value
    }))
    console.log('dataconf', dataConf)
  }

  const tinymceHandle = (val, name) => {
    setDataConf(tmpConf => produce(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      const tmp = type ? draft[type] : draft
      tmp[name] = val
    }))
  }

  useEffect(() => {
    if (!dataConf?.custom_redirect) {
      setDataConf(tmpConf => produce(tmpConf, draft => {
        // eslint-disable-next-line no-param-reassign
        const tmp = type ? draft[type] : draft
        tmp.custom_redirect = 0
      }))
    }
  }, [])

  return (
    <div>
      <Modal md show={showMdl} setModal={setCustomRedirectMdl} title={title} style={{ minWidth: 800, minHeight: 400, maxHeight: 600, display: 'block' }} className="o-a">
        <Scrollbars autoHide>
          <div className="mr-2">
            <div className="mt-2">
              <label htmlFor="status">
                <b>{__('', 'bitform')}</b>
                <CheckBox radio name="custom_redirect" onChange={handleInput} checked={data?.custom_redirect?.toString() === '0'} title={<small className="txt-dp"><b>Messgae</b></small>} value={0} />
                <CheckBox radio name="custom_redirect" onChange={handleInput} checked={data?.custom_redirect?.toString() === '1'} title={<small className="txt-dp"><b>Redirect Page</b></small>} value={1} />
              </label>
            </div>
            {data?.custom_redirect?.toString() === '1' && (
              <div className="mt-3 ml-2">
                <div className="flx ">
                  <div className="w-5 ">
                    <div className="f-m fw-500 ml-1">
                      {__('Success redirect Page:')}
                      <Cooltip icnSize={14} className="ml-1">
                        <div className="txt-body">
                          This page will show when the verification is successful.
                          <br />
                        </div>
                      </Cooltip>
                    </div>

                    <select className="btcd-paper-inp mt-1" name="succ_url" value={data?.succ_url} onChange={handleInput}>
                      <option value="">{__('Custom Link', 'bitform')}</option>
                      {pages && pages.map((urlDetail, ind) => (
                        <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                      ))}
                    </select>

                  </div>
                  <div className="w-5 ml-2">
                    <div className="f-m fw-500">Link</div>
                    <input placeholder="success page link" onChange={handleInput} name="succ_url" className="btcd-paper-inp mt-1" type="text" value={data?.succ_url} />
                  </div>
                </div>

                <div className="flx mt-3">
                  <div className="w-5 ">
                    <div className="f-m fw-500">
                      {__('Redirect page (already activated):')}
                      <Cooltip icnSize={14} className="ml-1">
                        <div className="txt-body">
                          This page will show if the account had already been activated.
                          {' '}
                          <br />
                        </div>
                      </Cooltip>
                    </div>
                    <select className="btcd-paper-inp mt-1" name="already_activated_url" value={data?.already_activated_url} onChange={handleInput}>
                      <option value="">{__('Custom Link', 'bitform')}</option>
                      {pages && pages.map((urlDetail, ind) => (
                        <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-5 ml-2">
                    <div className="f-m fw-500">Link</div>
                    <input placeholder="already  activated page link" onChange={handleInput} name="already_activated_url" className="btcd-paper-inp mt-1" type="text" value={data?.already_activated_url} />
                  </div>
                </div>

                <div className="flx mt-3">
                  <div className="w-5 ">
                    <div className="f-m fw-500">
                      {__('Invalid redirect page:')}
                      <Cooltip icnSize={14} className="ml-1">
                        <div className="txt-body">
                          This page will show if the account activation fails or if the activation URL is invalid.
                          {' '}
                          {' '}
                          <br />
                        </div>
                      </Cooltip>
                    </div>
                    <select className="btcd-paper-inp mt-1" name="invalid_key_url" value={data?.invalid_key_url} onChange={handleInput}>
                      <option value="">{__('Custom Link', 'bitform')}</option>
                      {pages && pages.map((urlDetail, ind) => (
                        <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-5 ml-2">
                    <div className="f-m fw-500">Link</div>
                    <input placeholder="invalid page link" onChange={handleInput} name="invalid_key_url" className="btcd-paper-inp mt-1" type="text" value={data?.invalid_key_url} />
                  </div>
                </div>
              </div>
            )}
            {data?.custom_redirect?.toString() === '0' && (
              <div className="ml-2">
                <div className="mt-4">
                  {/* <div className="f-m fw-500">{__('Activation success', 'bitform')}</div>
                  <input className="btcd-paper-inp mt-1" onChange={handleInput} name="acti_succ_msg" value={data?.acti_succ_msg} type="text" placeholder={__('Activation Success Message', 'bitform')} /> */}
                  <b>{__('Activation success', 'bitform')}</b>
                  <label htmlFor="mail-tem-acti_succ_msg" className="mt-2">
                    <TinyMCE
                      id="acti_succ_msg"
                      value={data?.acti_succ_msg}
                      onChangeHandler={val => tinymceHandle(val, 'acti_succ_msg')}
                      // width="100%"
                      height="5px"
                      toolbarMnu="formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "
                    />
                  </label>
                </div>
                <div className="mt-4">
                  {/* <div className="f-m fw-500">{__('Already activated account', 'bitform')}</div>
                  <input className="btcd-paper-inp mt-1" onChange={handleInput} name="already_activated_msg" value={data?.already_activated_msg} type="text" placeholder={__('Already account activation message', 'bitform')} /> */}
                  <b>{__('Already activated account', 'bitform')}</b>
                  <label htmlFor="already_activated_msg" className="mt-2">
                    <TinyMCE
                      id="already_activated_msg"
                      value={data?.already_activated_msg}
                      onChangeHandler={val => tinymceHandle(val, 'already_activated_msg')}
                      // width="100%"
                      height="5px"
                      toolbarMnu="formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "

                    />
                  </label>
                </div>
                <div className="mt-4">
                  {/* <div className="f-m fw-500">{__('Invalid activation key', 'bitform')}</div>
                  <input className="btcd-paper-inp mt-1" onChange={handleInput} name="invalid_key_msg" value={data?.invalid_key_msg} type="text" placeholder={__('Invalid url or fail activation message', 'bitform')} /> */}
                  <b>{__('Invalid activation key', 'bitform')}</b>
                  <label htmlFor="invalid_key_msg" className="mt-2">
                    <TinyMCE
                      id="invalid_key_msg"
                      value={data?.invalid_key_msg}
                      onChangeHandler={val => tinymceHandle(val, 'invalid_key_msg')}
                      // width="100%"
                      height="5px"
                      toolbarMnu="formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "
                    />
                  </label>
                </div>
                <br />
              </div>
            )}
          </div>
        </Scrollbars>
      </Modal>
    </div>
  )
}
