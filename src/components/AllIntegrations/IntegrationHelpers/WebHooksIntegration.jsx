import { useRef, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import BackIcn from '../../../Icons/BackIcn'
import CloseIcn from '../../../Icons/CloseIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Button from '../../Utilities/Button'

export default function WebHooksLayouts({ formID, formFields, webHooks, setWebHooks, step, setstep, setSnackbar, create, isInfo }) {
  const getUrlParams = url => url?.match(/(\?|&)([^=]+)=([^&]+|)/gi)
  const [isLoading, setIsLoading] = useState(false)
  const method = ['GET', 'POST', 'PUT', 'PATCH', 'OPTION', 'DELETE', 'TRACE', 'CONNECT']
  const testResponseRef = useRef(null)

  const parseWebhookResponse = response => {
    try {
      return JSON.stringify(response, null, 2)
    } catch (e) {
      return response
    }
  }

  const testWebHook = (webHooksDetaila) => {
    setIsLoading(true)
    bitsFetch({ hookDetails: webHooksDetaila }, 'bitforms_test_webhook').then(response => {
      if (response && response.success) {
        testResponseRef.current.innerHTML = `<pre>${parseWebhookResponse(response.data.response)}</pre>`
        setSnackbar({ show: true, msg: __(response.data.msg) })
        setIsLoading(false)
      } else if (response && response.data) {
        const msg = typeof response.data === 'string' ? response.data : 'Unknown error'
        setSnackbar({ show: true, msg: `${msg}. ${__('please try again', 'bitform')}` })
        setIsLoading(false)
      } else {
        setSnackbar({ show: true, msg: __('Webhook tests failed. please try again', 'bitform') })
        setIsLoading(false)
      }
    })
  }
  const handleParam = (typ, val, pram) => {
    const tmpConf = { ...webHooks }
    if (val !== '') {
      if (typ === 'key') {
        tmpConf.url = tmpConf.url.replace(pram, `${pram.charAt(0)}${val}=${pram.split('=')[1]}`)
      } else {
        tmpConf.url = tmpConf.url.replace(pram, `${pram.split('=')[0]}=${val}`)
      }
    } else if (pram.match(/\?/g) === null) {
      tmpConf.url = tmpConf.url.replace(pram, '')
    } else {
      tmpConf.url = tmpConf.url.replace(`${pram}&`, '?')
    }
    setWebHooks(tmpConf)
  }

  const handleInput = (e) => {
    const tmpConfConf = { ...webHooks }
    tmpConfConf[e.target.name] = e.target.value
    setWebHooks({ ...tmpConfConf })
  }

  const setFromField = (val, param) => {
    const tmpConf = { ...webHooks }
    const a = param.split('=')
    a[1] = val
    tmpConf.url = tmpConf.url.replace(param, a.join('='))
    setWebHooks(tmpConf)
  }
  const addParam = () => {
    const tmpConf = { ...webHooks }
    if (tmpConf.url.match(/\?/g) !== null) {
      tmpConf.url += '&key=value'
    } else {
      tmpConf.url += '?key=value'
    }
    setWebHooks(tmpConf)
  }
  const delParam = (param) => {
    const tmpConf = { ...webHooks }
    tmpConf.url = tmpConf.url.replace(param, '')
    setWebHooks(tmpConf)
  }
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
  }
  return (
    <>
      <div style={{ ...{ width: isInfo && 900 } }}>
        <div className="flx ">
          <div className="w-7 mr-2 mb-4">
            <div className="f-m">{__('Integration name', 'bitform')}</div>
            <input name="name" onChange={e => handleInput(e, webHooks, setWebHooks)} className="btcd-paper-inp mt-1" type="text" value={webHooks.name} disabled={isInfo} />
          </div>
        </div>
        <div className="flx">
          <div className="w-7 mr-2">
            <div className="f-m">{__('Link:', 'bitform')}</div>
            <input name="url" onChange={e => handleInput(e, webHooks, setWebHooks)} className="btcd-paper-inp mt-1" type="text" value={webHooks.url} disabled={isInfo} />
            {webHooks?.apiConsole && (
              <small className="d-blk mt-2">
                {__('To got Webhook , Please Visit', 'bitform')}
                {' '}
                <a className="btcd-link" href={webHooks.apiConsole} target="_blank" rel="noreferrer">{__(`${webHooks.type} Dashboard`, 'bitform')}</a>
              </small>
            )}
          </div>

          <div className="w-3">
            <div className="f-m">{__('Method:', 'bitform')}</div>
            <select name="method" onChange={e => handleInput(e, webHooks, setWebHooks)} defaultValue={webHooks.method} className="btcd-paper-inp mt-1" disabled={isInfo}>
              {method.map((itm, indx) => (<option key={`method-${indx * 2}`} value={itm}>{itm}</option>))}
            </select>
          </div>
        </div>
        {!isInfo && (
          <Button onClick={() => testWebHook(webHooks, setIsLoading, setSnackbar)} className="btn btcd-btn-o-blue" disabled={isLoading}>
            {__('Test Webhook', 'bitform')}
            {isLoading && <LoaderSm size={14} clr="#022217" className="ml-2" />}
          </Button>
        )}
        <br />
        <div className="wh-resp-box">
          <div className="f-m wh-resp-box-title">{__('Response:', 'bitform')}</div>
          <div className="wh-resp-box-content" ref={testResponseRef}>Test Webhook to see the response.</div>
        </div>
        <br />
        <div className="f-m">{__('Add Url Parameter: (optional)', 'bitform')}</div>
        <div className="btcd-param-t-wrp mt-1">
          <div className="btcd-param-t">
            <div className="tr">
              <div className="td">{__('Key', 'bitform')}</div>
              <div className="td">{__('Value', 'bitform')}</div>
            </div>
            {getUrlParams(webHooks.url) !== null && getUrlParams(webHooks.url)?.map((itm, childindx) => (
              <div className="tr" key={`fu-1${childindx * 3}`}>
                <div className="td">
                  <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('key', e.target.value, itm, webHooks, setWebHooks)} type="text" value={itm.split('=')[0].substr(1)} disabled={isInfo} />
                </div>
                <div className="td">
                  <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('val', e.target.value, itm, webHooks, setWebHooks)} type="text" value={itm.split('=')[1]} disabled={isInfo} />
                </div>
                {!isInfo && (
                  <div className="flx p-atn">
                    <Button onClick={() => delParam(itm, webHooks, setWebHooks)} icn><TrashIcn size={16} /></Button>
                    <MultiSelect
                      options={formFields.map(f => ({ label: f.name, value: `\${${f.key}}` }))}
                      className="btcd-paper-drpdwn wdt-200 ml-2"
                      singleSelect
                      onChange={val => setFromField(val, itm, webHooks, setWebHooks)}
                      defaultValue={itm.split('=')[1]}
                    />
                  </div>
                )}
              </div>
            ))}
            {!isInfo && (
              <Button onClick={() => addParam(webHooks, setWebHooks)} className="add-pram" icn><CloseIcn size="14" className="icn-rotate-45" /></Button>
            )}
          </div>
        </div>
        {create && (
          <button onClick={() => nextPage()} className="btn btcd-btn-lg green sh-sm flx" type="button">
            {__('Next', 'bitform')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        )}
      </div>
    </>
  )
}
