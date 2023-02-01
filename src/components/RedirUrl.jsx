import { memo, useEffect, useState } from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../Utils/i18nwrap'
import Accordions from './Utilities/Accordions'
import Button from './Utilities/Button'
import bitsFetch from '../Utils/bitsFetch'
import ConfirmModal from './Utilities/ConfirmModal'
import { deepCopy } from '../Utils/Helpers'
import CloseIcn from '../Icons/CloseIcn'
import { $confirmations, $fieldsArr } from '../GlobalStates'
import TrashIcn from '../Icons/TrashIcn'

function RedirUrl({ removeIntegration }) {
  const [confMdl, setConfMdl] = useState({ show: false, action: null })
  const [redirectUrls, setredirectUrls] = useState(null)
  const [allConf, setAllConf] = useRecoilState($confirmations)
  const fieldsArr = useRecoilValue($fieldsArr)

  useEffect(() => {
    bitsFetch(null, 'bitforms_get_all_wp_pages')
      .then(res => {
        if (res?.success && res?.data) {
          setredirectUrls(res.data)
        }
      })
  }, [])

  const handleUrlTitle = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[idx].title = e.target.value
    setAllConf(confirmation)
  }

  const handlePage = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[idx].url = e.target.value
    setAllConf(confirmation)
  }

  const handleLink = (val, i) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[i].url = val
    setAllConf(confirmation)
  }

  const getUrlParams = url => url.match(/(\?|&)([^=]+)=([^&]+|)/gi)

  const handleParam = (typ, val, pram, i) => {
    const confirmation = deepCopy(allConf)
    if (val !== '') {
      if (typ === 'key') {
        confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(pram, `${pram.charAt(0)}${val}=${pram.split('=')[1]}`)
      } else {
        confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(pram, `${pram.split('=')[0]}=${val}`)
      }
    } else if (pram.match(/\?/g) === null) {
      confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(pram, '')
    } else {
      confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(`${pram}&`, '?')
    }
    setAllConf(confirmation)
  }

  const delParam = (i, param) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(param, '')
    setAllConf(confirmation)
  }

  const addParam = i => {
    const confirmation = deepCopy(allConf)
    if (confirmation.type.redirectPage[i].url.match(/\?/g) !== null) {
      confirmation.type.redirectPage[i].url += '&key=value'
    } else {
      confirmation.type.redirectPage[i].url += '?key=value'
    }
    setAllConf(confirmation)
  }

  const setFromField = (val, i, param) => {
    const confirmation = deepCopy(allConf)
    const a = param.split('=')
    a[1] = val
    confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(param, a.join('='))
    setAllConf(confirmation)
  }

  const addMoreUrl = () => {
    const confirmation = deepCopy(allConf)
    if (confirmation?.type?.redirectPage) {
      confirmation.type.redirectPage.push({ title: `Redirect Url ${confirmation.type.redirectPage.length + 1}`, url: '' })
    } else {
      // eslint-disable-next-line no-param-reassign
      confirmation.type = { redirectPage: [], ...confirmation.type }
      confirmation.type.redirectPage.push({ title: `Redirect Url ${confirmation.type.redirectPage.length + 1}`, url: '' })
    }
    setAllConf(confirmation)
  }

  const rmvUrl = async i => {
    const confirmation = deepCopy(allConf)
    const tmpData = confirmation.type.redirectPage[i]
    confirmation.type.redirectPage.splice(i, 1)
    setAllConf(confirmation)
    confMdl.show = false
    setConfMdl({ ...confMdl })
    if (tmpData.id !== undefined) {
      const status = await removeIntegration(tmpData.id, 'url')
      if (!status) {
        confirmation.type.redirectPage.splice(i, 0, tmpData)
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
    confMdl.action = () => rmvUrl(i)
    setConfMdl({ ...confMdl })
  }

  return (
    <div>
      <ConfirmModal
        action={confMdl.action}
        show={confMdl.show}
        body={__('Are you sure to delete this URL ?', 'bitform')}
        btnTxt={__('Delete', 'bitform')}
        close={closeMdl}
      />
      {allConf?.type?.redirectPage ? allConf.type.redirectPage.map((itm, i) => (
        <div key={`f-u-${i + 1}`} className="flx">
          <Accordions
            title={itm.title}
            titleEditable
            cls="mt-2 mr-2 w-9"
            onTitleChange={e => handleUrlTitle(e, i)}
          >
            <div className="f-m">{__('Select A Page:', 'bitform')}</div>
            <select className="btcd-paper-inp mt-1" onChange={e => handlePage(e, i)}>
              <option value="">{__('Custom Link', 'bitform')}</option>
              {redirectUrls
                && redirectUrls.map((urlDetail, ind) => (
                  <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                ))}
            </select>
            <br />
            <br />
            <div className="f-m">Link:</div>
            <input onChange={e => handleLink(e.target.value, i)} className="btcd-paper-inp mt-1" type="text" value={itm.url} />
            <br />
            <br />
            <div className="f-m">{__('Add Url Parameter: (optional)', 'bitform')}</div>
            <div className="btcd-param-t-wrp mt-1">
              <div className="btcd-param-t">
                <div className="tr">
                  <div className="td">{__('Key', 'bitform')}</div>
                  <div className="td">{__('Value', 'bitform')}</div>
                </div>
                {getUrlParams(itm.url) !== null && getUrlParams(itm.url).map((item, childIdx) => (
                  <div key={`url-p-${childIdx + 21}`} className="tr">
                    <div className="td"><input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('key', e.target.value, item, i)} type="text" value={item.split('=')[0].substr(1)} /></div>
                    <div className="td">
                      <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('val', e.target.value, item, i)} type="text" value={item.split('=')[1]} />
                    </div>
                    <div className="flx p-atn">
                      <Button onClick={() => delParam(i, item)} icn><TrashIcn size={16} /></Button>
                      <span className="tooltip" style={{ '--tooltip-txt': `'${__('set Form Field', 'bitform')}'`, position: 'relative' }}>
                        <select className="btcd-paper-inp p-i-sm mt-1" onChange={e => setFromField(e.target.value, i, item)} defaultValue={item.split('=')[1]}>
                          <option value="">{__('Select Form Field', 'bitform')}</option>
                          {fieldsArr !== null && fieldsArr.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
                        </select>
                      </span>
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
      <div className="txt-center"><Button onClick={addMoreUrl} icn className="sh-sm blue tooltip mt-2" style={{ '--tooltip-txt': `'${__('Add More Alternative URl', 'bitform')}'` }}><CloseIcn size="14" stroke="3" className="icn-rotate-45" /></Button></div>
    </div>
  )
}

export default memo(RedirUrl)
