import { memo, useRef, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilState, useRecoilValue } from 'recoil'
import CloseIcn from '../Icons/CloseIcn'
import bitsFetch from '../Utils/bitsFetch'
import { deepCopy } from '../Utils/Helpers'
import { __ } from '../Utils/i18nwrap'
import ConfirmModal from './Utilities/ConfirmModal'
import Accordions from './Utilities/Accordions'
import Button from './Utilities/Button'
import SnackMsg from './Utilities/SnackMsg'
import { $confirmations, $fieldsArr } from '../GlobalStates'
import TrashIcn from '../Icons/TrashIcn'

function WebHooks({ removeIntegration }) {
  const [confMdl, setConfMdl] = useState({ show: false, action: null })
  const [snack, setSnackbar] = useState({ show: false })
  const [allConf, setAllConf] = useRecoilState($confirmations)
  const fieldsArr = useRecoilValue($fieldsArr)
  const testResponseRef = useRef([])

  const addToRefs = el => {
    if (el && !testResponseRef.current.includes(el)) {
      testResponseRef.current.push(el)
    }
  }

  const handleHookTitle = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[idx].title = e.target.value
    setAllConf(confirmation)
  }

  const splitParamsFromUrl = url => {
    const matchedParams = url.match(/(\?|&)([^=]+)=([^&]+|)/gi)
    const allparams = []
    if (matchedParams) {
      for (let j = 0; j < matchedParams.length; j += 1) {
        const param = matchedParams[j].split('=')
        allparams.push({ key: param[0].substring(1), value: param[1] })
      }
    }
    return allparams
  }

  const handleLink = (val, i) => {
    const confirmation = deepCopy(allConf)
    setAllConf(confirmation)
    confirmation.type.webHooks[i].url = val
    confirmation.type.webHooks[i].params = splitParamsFromUrl(val)
  }

  const handleMethod = (val, i) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[i].method = val
    setAllConf(confirmation)
  }

  const handleParam = (typ, val, hookIndx, paramIndx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[hookIndx].params[paramIndx][typ] = val
    confirmation.type.webHooks[hookIndx].url = getUrlWithParams(hookIndx)
    setAllConf(confirmation)
  }

  const delParam = (hookIndx, paramIndx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[hookIndx].params.splice(paramIndx, 1)
    confirmation.type.webHooks[hookIndx].url = getUrlWithParams(hookIndx)
    setAllConf(confirmation)
  }

  const addParam = hookIndx => {
    const confirmation = deepCopy(allConf)
    if (!confirmation.type.webHooks[hookIndx]?.params) {
      confirmation.type.webHooks[hookIndx].params = []
    } else if (confirmation.type.webHooks[hookIndx]?.params) {
      const { url } = confirmation.type.webHooks[hookIndx]
      confirmation.type.webHooks[hookIndx].params = splitParamsFromUrl(url)
    }
    confirmation.type.webHooks[hookIndx].params.push({ key: 'key', value: 'value' })
    confirmation.type.webHooks[hookIndx].url = getUrlWithParams(hookIndx)
    setAllConf(confirmation)
  }

  const addMoreHook = () => {
    const confirmation = deepCopy(allConf)
    if (confirmation?.type?.webHooks) {
      confirmation.type.webHooks.push({ title: `Web Hook ${confirmation.type.webHooks.length + 1}`, url: '', method: 'GET' })
    } else {
      // eslint-disable-next-line no-param-reassign
      confirmation.type = { webHooks: [], ...confirmation.type }
      confirmation.type.webHooks.push({ title: `Web Hook ${confirmation.type.webHooks.length + 1}`, url: '', method: 'GET' })
    }
    setAllConf(confirmation)
  }

  const rmvHook = async i => {
    const confirmation = deepCopy(allConf)
    const tmpData = confirmation.type.webHooks[i]
    confirmation.type.webHooks.splice(i, 1)
    setAllConf(confirmation)
    confMdl.show = false
    setConfMdl({ ...confMdl })
    if (tmpData.id !== undefined) {
      const status = await removeIntegration(tmpData.id, 'hook')
      if (!status) {
        confirmation.type.webHooks.splice(i, 0, tmpData)
        setAllConf(confirmation)
      }
    }
  }

  const closeMdl = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
  }

  const showDelConf = (i) => {
    confMdl.show = true
    confMdl.action = () => rmvHook(i)
    setConfMdl({ ...confMdl })
  }

  const parseWebhookResponse = response => {
    try {
      return JSON.stringify(response, null, 2)
    } catch (e) {
      return response
    }
  }

  const testWebhook = webHookId => {
    const confirmation = deepCopy(allConf)
    bitsFetch({ hookDetails: confirmation.type.webHooks[webHookId] }, 'bitforms_test_webhook').then(response => {
      if (response && response.success) {
        if ((response.data.response).length === 0) {
          testResponseRef.current[webHookId].innerHTML = __('No response from the server')
        } else {
          testResponseRef.current[webHookId].innerHTML = `<pre>${parseWebhookResponse(response.data.response)}</pre>`
        }
        setSnackbar({ show: true, msg: __(response.data.msg) })
      } else if (response && response.data) {
        const msg = typeof response.data === 'string' ? response.data : 'Unknown error'
        setSnackbar({ show: true, msg: `${msg}. ${__('please try again', 'bitform')}` })
      } else {
        setSnackbar({ show: true, msg: __('Webhook tests failed. please try again', 'bitform') })
      }
    })
  }

  const getUrlWithParams = hookIndx => {
    const confirmation = deepCopy(allConf)
    let { url } = confirmation.type.webHooks[hookIndx]
    const { params } = confirmation.type.webHooks[hookIndx]
    url = url.replaceAll(/\?.*/gi, '')
    if (params) {
      const lngth = params.length
      for (let j = 0; j < lngth; j += 1) {
        if (j === 0 && url.match(/\?/g) === null) {
          url += `?${params[j].key}=${params[j].value}`
        } else {
          url += `&${params[j].key}=${params[j].value}`
        }
      }
    }
    return url
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        action={confMdl.action}
        show={confMdl.show}
        body={__('Are you sure to delete this web hook?', 'bitform')}
        btnTxt={__('Delete', 'bitform')}
        close={closeMdl}
      />
      {allConf?.type?.webHooks
        ? allConf.type.webHooks.map((itm, i) => (
          <div key={`f-u-${i + 1}`} className="flx">
            <Accordions
              title={itm.title}
              titleEditable
              cls="mt-2 mr-2 w-9"
              onTitleChange={e => handleHookTitle(e, i)}
            >
              <br />
              <div className="flx">
                <div className="w-7 mr-2">
                  <div className="f-m">{__('Link:', 'bitform')}</div>
                  <input onChange={e => handleLink(e.target.value, i)} className="btcd-paper-inp mt-1" type="text" value={itm.url} />
                </div>

                <div className="w-3">
                  <div className="f-m">{__('Method:', 'bitform')}</div>
                  <select onChange={e => handleMethod(e.target.value, i)} defaultValue={itm.method} className="btcd-paper-inp mt-1">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="OPTION">OPTION</option>
                    <option value="DELETE">DELETE</option>
                    <option value="TRACE">TRACE</option>
                    <option value="CONNECT">CONNECT</option>
                  </select>
                </div>
              </div>
              <Button onClick={() => testWebhook(i)} className="btn btcd-btn-o-blue">{__('Test Webhook', 'bitform')}</Button>
              <br />
              <div className="wh-resp-box">
                <div className="f-m wh-resp-box-title">{__('Response:', 'bitform')}</div>
                <div className="wh-resp-box-content" ref={addToRefs}>Test Webhook to see the response.</div>
              </div>
              <br />
              <div className="f-m">{__('Add Url Parameter: (optional)', 'bitform')}</div>
              <div className="btcd-param-t-wrp mt-1">
                <div className="btcd-param-t">
                  <div className="tr">
                    <div className="td">{__('Key', 'bitform')}</div>
                    <div className="td">{__('Value', 'bitform')}</div>
                  </div>
                  {itm?.params && itm.params.map(({ key, value }, childIdx) => (
                    <div key={`url-p-${childIdx + 11}`} className="tr">
                      <div className="td">
                        <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('key', e.target.value, i, childIdx)} type="text" value={key} />
                      </div>
                      <div className="td">
                        <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('value', e.target.value, i, childIdx)} type="text" value={value} />
                      </div>
                      <div className="flx p-atn">
                        <Button onClick={() => delParam(i, childIdx)} icn>
                          <TrashIcn size={16} />
                        </Button>
                        <MultiSelect
                          options={fieldsArr.map(f => ({ label: f.name, value: `\${${f.key}}` }))}
                          className="btcd-paper-drpdwn wdt-200 ml-2"
                          singleSelect
                          onChange={val => handleParam('value', val, i, childIdx)}
                          defaultValue={value}
                        />
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => addParam(i)} className="add-pram" icn><CloseIcn size="14" stroke="3" className="icn-rotate-45" /></Button>
                </div>
              </div>
            </Accordions>
            <Button onClick={() => showDelConf(i)} icn className="sh-sm white mt-2"><TrashIcn size={16} /></Button>
          </div>
        )) : (
          <div className="txt-center btcd-empty">
            <span className="btcd-icn icn-stack" />
            {__('Empty', 'bitform')}
          </div>
        )}
      <div className="txt-center">
        <Button onClick={addMoreHook} icn className="sh-sm blue tooltip mt-2" style={{ '--tooltip-txt': `'${__('Add More Hook', 'bitform')}'` }}>
          <CloseIcn size="14" stroke="3" className="icn-rotate-45" />
        </Button>
      </div>
    </div>
  )
}

export default memo(WebHooks)
