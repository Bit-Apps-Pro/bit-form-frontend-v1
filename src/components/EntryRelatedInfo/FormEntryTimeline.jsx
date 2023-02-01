import { memo, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $bits, $fieldLabels } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { dateTimeFormatter } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import CopyText from '../Utilities/CopyText'

function FormEntryTimeline({ formID, entryID, integrations }) {
  const bits = useRecoilValue($bits)
  const allLabels = useRecoilValue($fieldLabels)
  const dateTimeFormat = `${bits.dateFormat} ${bits.timeFormat}`
  const [log, setLog] = useState([])
  const [integLogs, setIntegLogs] = useState([])
  const [logShowMore, setLogShowMore] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    bitsFetch({ formID, entryID }, 'bitforms_form_log_history').then((res) => {
      if (res !== undefined && res.success) {
        setLog(res.data)
        setIntegLogs(res.integrations)
      }
      setIsLoading(false)
    })

    return () => setLog([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const replaceFieldWithLabel = str => {
    const pattern = /\${\w[^ ${}]*}/g
    const pattern2 = /[\]["]/g
    const key = str.match(pattern)?.[0] || ''
    const field = key ? allLabels.find(label => `$\{${label.key}}` === key) : ''
    const fieldName = field ? field.adminLbl : ''
    const replacedField = fieldName ? str.replace(pattern, fieldName) : ''
    return replacedField ? replacedField.replace(pattern2, '') : 'Field Deleted'
  }

  const truncate = (str, n) => ((str?.length > n) ? `${str.substr(0, n - 1)}&hellip;` : str)

  const showMore = id => {
    logShowMore.push(id)
    setLogShowMore([...logShowMore])
  }

  const showLess = id => {
    const newLogShowMore = [...logShowMore]
    newLogShowMore.splice(newLogShowMore.indexOf(id), 1)
    setLogShowMore([...newLogShowMore])
  }

  const renderLog = data => {
    const logShow = logShowMore.find(logs => logs === data.id)
    const integInfo = {}
    integLogs.map(integ => {
      let integName = integrations.find(integration => integration.id === integ.integration_id)?.name
      if (integName) {
        if (!integInfo[integName]) integInfo[integName] = []
        if (data.id === integ.log_id) integInfo[integName].push(integ)
      } else if (Number(integ.integration_id) && data.id === integ.log_id) {
        const apiType = JSON.parse(integ.api_type)
        integName = `${apiType.type_name} ${apiType.type}`
        if (integName === 'ReCaptcha v3') {
          integInfo[integName] = [integ]
        }
      }
    })

    const showLogs = () => {
      if (data.content === null && data.action_type === 'update') {
        return <p>{__('No field data change', 'bitform')}</p>
      } if (data.content === null && data.action_type === 'create') {
        return <p>{__('Form Submitted', 'bitform')}</p>
      }
      return data.content.split('b::f').map(str => (
        <p key={str}>
          {' '}
          <span
            className="btcd-icn icn-document-edit"
            style={{ fontSize: 16 }}
          />
          {replaceFieldWithLabel(str)}
        </p>
      ))
    }

    return (
      <div>
        {showLogs()}
        {
          !!Object.keys(integInfo)?.length && (
            <>
              {!logShow && data.integration && <small role="button" tabIndex="0" className="btcd-link cp" onClick={() => showMore(data.id)} onKeyDown={() => showMore(data.id)}>{__('Show Integration Logs', 'bitform')}</small>}
              {logShow && data.integration && <small role="button" tabIndex="0" className="btcd-link cp" onClick={() => showLess(data.id)} onKeyDown={() => showLess(data.id)}>{__('Hide Integration Logs', 'bitform')}</small>}
              {logShow && data.integration && renderIntegLog(integInfo)}
            </>
          )
        }
      </div>
    )
  }

  const renderIntegLog = integInfo => Object.keys(integInfo).map(integKey => (
    <div>
      <h5>{`${integKey} - `}</h5>
      <div className="m-0 ml-6">
        {
          integInfo[integKey].map(integ => {
            const apiType = JSON.parse(integ.api_type)
            return (
              <div className="flx">
                <p className="mr-2">
                  {`${apiType.type_name} ${apiType.type} ${integ.response_type}`}
                </p>
                <CopyText value={integ.response_obj} className="field-key-cpy w-0 ml-0" readOnly />
              </div>
            )
          })
        }
      </div>
    </div>
  ))

  const renderNoteLog = data => {
    const logShow = logShowMore.find(lg => lg === data.id)
    const note = JSON.parse(data.content)
    if (data.content !== null) {
      return (
        <>
          <p>
            {__('Note', 'bitform')}
            {' '}
            {data.action_type === 'create' && __('Added', 'bitform')}
            {data.action_type === 'update' && __('Updated', 'bitform')}
            {data.action_type === 'delete' && __('Deleted', 'bitform')}
            :
          </p>
          {note.title && <h4>{note.title}</h4>}
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: logShow ? (note.content || '') : truncate(note.content || '', 20) }}
          />
          {(!logShow && (note.content || '').length > 20) && <small role="button" tabIndex="0" className="btcd-link cp" onClick={() => showMore(data.id)} onKeyDown={() => showMore(data.id)}>{__('Read More', 'bitform')}</small>}
          {logShow && <small role="button" tabIndex="0" className="btcd-link cp" onClick={() => showLess(data.id)} onKeyDown={() => showLess(data.id)}>{__('Show Less', 'bitform')}</small>}
        </>
      )
    } if (data.content === null && data.action_type === 'update') {
      return <p>{__('Note no change', 'bitform')}</p>
    }
  }

  return (
    <>
      {
        isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              transform: 'scale(0.7)',
            }}
            />
          )
          : log.map((data) => (
            <div key={data.id}>
              <br />
              <span>
                {dateTimeFormatter(data.created_at, dateTimeFormat)}
              </span>
              <div>
                {data.log_type === 'entry' ? renderLog(data) : renderNoteLog(data)}
              </div>
            </div>
          ))
      }
    </>
  )
}

export default memo(FormEntryTimeline)
