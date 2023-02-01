/* eslint-disable no-undef */
import { useEffect, useReducer, useState } from 'react'
import { resetCaptcha } from '../components/Fields/Recaptcha'
import MapComponents from '../components/MapComponents'
import { loadScript } from '../Utils/globalHelpers'
import { deepCopy } from '../Utils/Helpers'
import { checkLogic, replaceWithField } from './checkLogic'
import validateForm from './validation'

const reduceFieldData = (state, action) => ({ ...state, ...action })
export default function Bitforms(props) {
  const [snack, setSnack] = useState(false)
  const [message, setMessage] = useState(null)
  const [buttonDisabled, setbuttonDisabled] = useState(false)
  const [fieldData, dispatchFieldData] = useReducer(reduceFieldData, props.data)
  const [layout] = useState(props.layout)
  const [hasError, sethasError] = useState(false)
  const [resetFieldValue, setresetFieldValue] = useState(false)
  let maxRowIndex = 0

  useEffect(() => {
    if (!props.editMode && props.gRecaptchaVersion === 'v3' && props.gRecaptchaSiteKey) {
      loadScript(`https://www.google.com/recaptcha/api.js?render=${props.gRecaptchaSiteKey}`, 'g-recaptcha-script')
    }

    setTimeout(() => revalidateNonce(), 1000)
  }, [])

  const revalidateNonce = () => {
    const form = document.getElementById(`form-${props.contentID}`)
    if (form) {
      let currentNonce = form.querySelector('input[name="bitforms_token"]')
      let bitformId = form.querySelector('input[name="bitforms_id"]')

      if (!currentNonce) {
        currentNonce = document.createElement('input')
        currentNonce.type = 'hidden'
        currentNonce.name = 'bitforms_token'
        currentNonce.value = props.nonce
        form.appendChild(currentNonce)
      }

      if (!bitformId) {
        bitformId = document.createElement('input')
        bitformId.type = 'hidden'
        bitformId.name = 'bitforms_id'
        bitformId.value = `bitforms_${props.formID}`
        form.appendChild(bitformId)
      }

      const uri = new URL(bitFormsFront.ajaxURL)
      uri.searchParams.append('action', 'bitforms_nonce_expire_check')
      const body = { nonce: currentNonce.value, formId: props.formID }
      fetch(
        uri,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        },
      )
        .then(response => response.json())
        .then(data => {
          if (data?.success !== undefined) {
            const { nonceValid, nonce } = data?.data
            if (!nonceValid) {
              let currentNonce = form.querySelector('input[name="bitforms_token"]')
              currentNonce.value = nonce
            }
          }
        })
    }
  }

  const blk = (field) => {
    const dataToPass = fieldData !== undefined && deepCopy(fieldData)
    // eslint-disable-next-line no-useless-escape
    const name = field.i
    // eslint-disable-next-line no-param-reassign
    dataToPass[field.i].name = name
    if (props.gRecaptchaSiteKey && props.gRecaptchaSiteKey !== null && dataToPass[field.i].typ === 'recaptcha') {
      dataToPass[field.i].siteKey = props.gRecaptchaSiteKey
    }
    if (props.fieldToCheck[name]) {
      dataToPass[field.i].hasWorkflow = true
    }
    maxRowIndex = maxRowIndex > field.y + field.h ? maxRowIndex : field.y + field.h
    return (
      <div
        key={field.i}
        className={`btcd-fld-itm ${field.i} ${dataToPass[field.i]?.valid?.hide ? 'vis-n' : ''}`}
      >
        <MapComponents
          editMode
          fieldKey={field.i}
          atts={dataToPass[field.i]}
          formID={props.formID}
          entryID={props.entryID}
          onBlurHandler={onBlurHandler}
          resetFieldValue={resetFieldValue}
          contentID={props.contentID}
          fieldData={fieldData}
          buttonDisabled={dataToPass[field.i].typ === 'button' && dataToPass[field.i].btnTyp === 'submit' && buttonDisabled}
          handleReset={dataToPass[field.i].typ === 'button' && dataToPass[field.i].btnTyp === 'reset' && handleReset}
          handleFormValidationErrorMessages={handleFormValidationErrorMessages}
        />
      </div>
    )
  }
  const onBlurHandler = (event) => {
    if (!event) {
      return
    }
    let maybeReset = false
    let isInteracted = false
    const dataToSet = []
    let element
    let form
    if (event.target) {
      element = event.target
      form = event.target.form
      isInteracted = true
    } else {
      element = event
      if (element.type === 'dropdown' && element.userinput) {
        isInteracted = true
      }
      form = document.getElementById(`form-${props.contentID}`)
    }
    const newData = fieldData !== undefined && JSON.parse(JSON.stringify(fieldData))
    if (resetFieldValue) {
      setresetFieldValue(false)
    }
    let targetFieldName
    const fieldValues = []
    const fieldNameToQuery = element.name
    if (element.name && element.name.indexOf('[]') !== -1 && element.name.indexOf('[]') === element.name.length - 2) {
      targetFieldName = element.name.substring(0, element.name.length - 2)
    } else {
      targetFieldName = element.name
    }
    if (newData[props.fieldsKey[targetFieldName]] && newData[props.fieldsKey[targetFieldName]].error) {
      delete newData[props.fieldsKey[targetFieldName]].error
      dataToSet[props.fieldsKey[targetFieldName]] = newData[props.fieldsKey[targetFieldName]]
      maybeReset = true
    }
    if (newData[props.fieldsKey[targetFieldName]] && !newData[props.fieldsKey[targetFieldName]].userinput && isInteracted) {
      newData[props.fieldsKey[targetFieldName]].userinput = isInteracted
      dataToSet[props.fieldsKey[targetFieldName]] = newData[props.fieldsKey[targetFieldName]]
      maybeReset = true
    }

    if (props.fieldToCheck[targetFieldName] !== undefined) {
      Object.keys(props.fieldsKey).forEach(fieldName => {
        let currentField
        if (targetFieldName === fieldName) {
          currentField = fieldNameToQuery
        } else {
          currentField = fieldName
        }
        const fieldDetails = form.querySelectorAll(`[name^='${currentField}']`)
        // const fieldDetails = document.getElementsByName(currentField)
        if (fieldDetails.length > 0) {
          let value
          let multiple
          let { type } = fieldDetails[0]
          if (fieldDetails[0].name === element.name && type !== 'checkbox') {
            value = element.value
            multiple = element.multiple
            type = element.type
          } else if (type === 'checkbox' || type === 'select-multiple' || type === 'select-one' || type === 'radio') {
            switch (type) {
              case 'checkbox':
                // eslint-disable-next-line no-case-declarations
                const checkedValue = []
                fieldDetails.forEach(option => { option.checked && option.value && checkedValue.push(option.value) })
                value = checkedValue
                multiple = true
                break

              case 'select-multiple':
                // eslint-disable-next-line no-case-declarations
                const selectedValue = []
                if (fieldDetails[0].slim) {
                  fieldDetails[0].slim.data.data.forEach((option => { option.selected && option.value && selectedValue.push(option.value) }))
                } else {
                  fieldDetails[0].childNodes.forEach((option => { option.selected && option.value && selectedValue.push(option.value) }))
                }
                value = selectedValue
                multiple = true
                break

              case 'select-one':
                value = fieldDetails[0].value
                break

              case 'radio':
                fieldDetails.forEach(option => { if (option.checked && option.value) value = option.value })
                break

              default:
                break
            }
          } else if (fieldDetails[0].type === 'hidden' && fieldDetails[0].value && fieldDetails[0].nextElementSibling && fieldDetails[0].nextElementSibling.hasAttribute('data-msl')) {
            value = fieldDetails[0].value.split(',')
            multiple = value && value.length > 0
          } else {
            value = fieldDetails[0].value
            multiple = fieldDetails[0].multiple
          }
          fieldValues[fieldName] = {
            type,
            value,
            multiple,
          }
        }
      })

      const conditionsStatus = []
      props.fieldToCheck[targetFieldName].forEach(LogicIndex => {
        const logicStatus = checkLogic(props.conditional[LogicIndex].logics, fieldValues)
        conditionsStatus.push([LogicIndex, logicStatus ? 1 : 0])
      })

      conditionsStatus.sort((a, b) => a[1] - b[1]).forEach(([LogicIndex, logicStatus]) => {
        if (logicStatus) {
          props.conditional[LogicIndex].actions.forEach(actionDetail => {
            if (actionDetail.action !== undefined && actionDetail.field !== undefined) {
              if (!newData[props.fieldsKey[actionDetail.field]].valid) {
                newData[props.fieldsKey[actionDetail.field]].valid = {}
              }
              switch (actionDetail.action) {
                case 'value':
                  if (actionDetail.val !== undefined && newData[props.fieldsKey[actionDetail.field]]) {
                    const actionValue = actionDetail.val ? replaceWithField(actionDetail.val, fieldValues) : actionDetail.val
                    if (actionDetail.field === targetFieldName && newData[props.fieldsKey[actionDetail.field]].val === actionValue && isInteracted && !newData[props.fieldsKey[actionDetail.field]].conditional) {
                      newData[props.fieldsKey[actionDetail.field]].conditional = true
                    } else {
                      newData[props.fieldsKey[actionDetail.field]].conditional = false
                    }
                    newData[props.fieldsKey[actionDetail.field]].val = actionValue
                    newData[props.fieldsKey[actionDetail.field]].userinput = false
                    maybeReset = true
                  }
                  break

                case 'hide':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.hide = true
                    maybeReset = true
                  }
                  break

                case 'disable':
                  if (newData[props.fieldsKey[actionDetail.field]]) { newData[props.fieldsKey[actionDetail.field]].valid.disabled = true; maybeReset = true }
                  break

                case 'readonly':
                  if (newData[props.fieldsKey[actionDetail.field]]) { newData[props.fieldsKey[actionDetail.field]].valid.readonly = true; maybeReset = true }
                  break

                case 'enable':
                  if (newData[props.fieldsKey[actionDetail.field]]) { newData[props.fieldsKey[actionDetail.field]].valid.disabled = false; maybeReset = true }
                  break

                case 'show':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.hide = false
                    if (newData[props.fieldsKey[actionDetail.field]].typ === 'hidden') {
                      newData[props.fieldsKey[actionDetail.field]].typ = 'text'
                    }
                    maybeReset = true
                  }
                  break
                default:
                  break
              }
              dataToSet[props.fieldsKey[actionDetail.field]] = newData[props.fieldsKey[actionDetail.field]]
            }
          })
        } else {
          props.conditional[LogicIndex].actions.forEach(actionDetail => {
            if (actionDetail.action !== undefined && actionDetail.field !== undefined) {
              if (!props.data[props.fieldsKey[actionDetail.field]].valid) {
                const fldData = props.data[props.fieldsKey[actionDetail.field]]
                fldData.valid = {}
              }
              maybeReset = true
              switch (actionDetail.action) {
                case 'value':
                  if (actionDetail.val !== undefined && newData[props.fieldsKey[actionDetail.field]] && !newData[props.fieldsKey[actionDetail.field]].userinput && actionDetail.field !== targetFieldName) {
                    newData[props.fieldsKey[actionDetail.field]].val = props.data[props.fieldsKey[actionDetail.field]].val ? replaceWithField(props.data[props.fieldsKey[actionDetail.field]].val, fieldValues) : ''
                    newData[props.fieldsKey[actionDetail.field]].userinput = false
                  }
                  break

                case 'hide':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.hide = props.data[props.fieldsKey[actionDetail.field]].valid.hide
                  }
                  break

                case 'disable':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.disabled = props.data[props.fieldsKey[actionDetail.field]].valid.disabled
                  }
                  break

                case 'readonly':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.readonly = props.data[props.fieldsKey[actionDetail.field]].valid.readonly
                  }
                  break

                case 'enable':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.disabled = props.data[props.fieldsKey[actionDetail.field]].valid.disabled
                  }
                  break

                case 'show':
                  if (newData[props.fieldsKey[actionDetail.field]]) {
                    newData[props.fieldsKey[actionDetail.field]].valid.hide = props.data[props.fieldsKey[actionDetail.field]].valid.hide
                    if (newData[props.fieldsKey[actionDetail.field]].typ === 'hidden') {
                      newData[props.fieldsKey[actionDetail.field]].typ = props.data[props.fieldsKey[actionDetail.field]].typ
                    }
                  }
                  break
                default:
                  break
              }
              dataToSet[props.fieldsKey[actionDetail.field]] = newData[props.fieldsKey[actionDetail.field]]
            }
          })
        }
      })
    }
    if (maybeReset) {
      if (props.fieldToCheck[targetFieldName] !== undefined && dataToSet[props.fieldsKey[targetFieldName]] && dataToSet[props.fieldsKey[targetFieldName]].userinput && fieldValues[targetFieldName]) {
        dataToSet[props.fieldsKey[targetFieldName]].val = fieldValues[targetFieldName].value
      }
      dispatchFieldData(dataToSet)
      if (props.editMode) props.setFields(dataToSet)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm({ form: props.contentID })) return

    setbuttonDisabled(true)
    snack && setSnack(false)
    const formData = new FormData(event.target)
    if (props.GCLID) {
      formData.set('GCLID', props.GCLID())
    }
    const hidden = []
    Object.entries(fieldData).forEach(fld => {
      if (fld[1]?.valid?.hide) {
        hidden.push(fld[0])
      }
    })

    if (hidden.length) {
      formData.append('hidden_fields', hidden)
    }
    if (props?.gRecaptchaVersion === 'v3' && props?.gRecaptchaSiteKey) {
      grecaptcha.ready(() => {
        grecaptcha.execute(props.gRecaptchaSiteKey, { action: 'submit' }).then((token) => {
          formData.append('g-recaptcha-response', token)
          const uri = new URL(bitFormsFront.ajaxURL)
          uri.searchParams.append('action', 'bitforms_submit_form')
          const submitResp = fetch(
            uri,
            {
              method: 'POST',
              body: formData,
            },
          )
          submitResponse(submitResp)
        })
      })
    } else {
      const uri = new URL(bitFormsFront.ajaxURL)
      uri.searchParams.append('action', 'bitforms_submit_form')
      const submitResp = fetch(
        uri,
        {
          method: 'POST',
          body: formData,
        },
      )
      submitResponse(submitResp)
    }
  }

  const handleFormValidationErrorMessages = result => {
    if (result.data && typeof result.data === 'string') {
      setMessage(result.data)
      sethasError(true)
      setSnack(true)
    } else if (result.data) {
      if (result.data.$form !== undefined) {
        setMessage(deepCopy(result.data.$form))
        sethasError(true)
        setSnack(true)
        // eslint-disable-next-line no-param-reassign
        delete result.data.$form
      }
      if (Object.keys(result.data).length > 0) {
        const newData = fieldData !== undefined && deepCopy(fieldData)

        Object.keys(result.data).map(element => {
          newData[props.fieldsKey[element]].error = result.data[element]
        })
        dispatchFieldData(newData)
      }
    }
  }

  const submitResponse = resp => {
    resp.then(response => new Promise((resolve, reject) => {
      if (response.status > 400) {
        response.status === 500 ? reject(new Error('Maybe Internal Server Error')) : reject(response.json())
      } else resolve(response.json())
    }))
      .then(result => {
        let responsedRedirectPage = null
        let hitCron = null
        let newNonce = ''
        if (result !== undefined && result.success) {
          handleReset()
          if (typeof result.data === 'object') {
            responsedRedirectPage = result.data.redirectPage
            if (result.data.cron) {
              hitCron = result.data.cron
            }
            if (result.data.cronNotOk) {
              hitCron = result.data.cronNotOk
            }
            console.log('new nonce', result.data)
            if (result.data.new_nonce) {
              newNonce = result.data.new_nonce
            }
            setMessage(result.data.message)
            setSnack(true)
            if (hasError) {
              sethasError(false)
            }
          } else {
            setMessage(result.data)
            setSnack(true)
          }
        } else {
          handleFormValidationErrorMessages(result)
        }
        console.log(hitCron, 'hitCron')
        if (responsedRedirectPage) {
          triggerIntegration(hitCron, newNonce)
          const timer = setTimeout(() => {
            window.location = decodeURI(responsedRedirectPage)
            if (timer) {
              clearTimeout(timer)
            }
          }, 1000)
        } else {
          triggerIntegration(hitCron, newNonce)
        }

        setbuttonDisabled(false)
      })
      .catch(error => {
        console.log('error', typeof error, error)
        const err = error?.message ? error.message : 'Unknown Error'
        setMessage(err)
        sethasError(true)
        setSnack(true)
        setbuttonDisabled(false)
      })
  }

  const triggerIntegration = (hitCron, newNonce) => {
    if (hitCron) {
      if (typeof hitCron === 'string') {
        const uri = new URL(hitCron)
        if (uri.protocol !== window.location.protocol) {
          uri.protocol = window.location.protocol
        }
        fetch(uri)
      } else {
        const uri = new URL(bitFormsFront.ajaxURL)
        uri.searchParams.append('action', 'bitforms_trigger_workflow')
        const data = { cronNotOk: hitCron, token: newNonce || props.nonce, id: props.appID }
        fetch(
          uri,
          {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          },
        )
          .then(response => response.json())
      }
    }
  }
  const handleReset = () => {
    setresetFieldValue(true)
    if (props.gRecaptchaSiteKey && props.gRecaptchaVersion === 'v2') {
      resetCaptcha()
    }
  }

  useEffect(() => {
    if (resetFieldValue) {
      setresetFieldValue(false)
      if (typeof window[props.contentID] !== 'undefined') {
        dispatchFieldData(window[props.contentID].fields)
      }
    }
    return () => {
      setresetFieldValue(false)
      if (typeof window[props.contentID] !== 'undefined') {
        dispatchFieldData(window[props.contentID].fields)
      }
    }
  }, [resetFieldValue])

  useEffect(() => {
    if (props.error) {
      if (props.error.$form !== undefined) {
        sethasError(true)
        setMessage(deepCopy(props.error.$form))
        setSnack(true)
        // eslint-disable-next-line no-param-reassign
        delete props.error.$form
      }
      if (Object.keys(props.error).length > 0) {
        const newData = fieldData !== undefined && deepCopy(fieldData)

        Object.keys(props.error).map(element => {
          newData[props.fieldsKey[element]].error = props.error[element]
        })
        dispatchFieldData(newData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.error])

  return (
    <div id={`f-${props.formId}`}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <form
        noValidate
        id={`form-${props.contentID}`}
        className={`_frm-bg-${props.formID}`}
        ref={props.refer}
        method="POST"
        encType={props.file ? 'multipart/form-data' : ''}
        onSubmit={handleSubmit}
        onKeyDown={e => {
          e.key === 'Enter'
            && e.target.tagName !== 'TEXTAREA'
            && e.preventDefault()
        }}
      >
        {!props.editMode && <input type="hidden" value={bitFormsFront && props.nonce} name="bitforms_token" />}
        {!props.editMode && <input type="hidden" value={bitFormsFront && props.appID} name="bitforms_id" />}
        {props.GCLID && <input type="hidden" name="GCLID" />}
        <div className={`_frm-${props.formID}`}>
          <div className={`_frm-g _frm-g-${props.formID}`}>
            {layout.lg.map(field => blk(field))}
          </div>
          {!props.editMode && props.buttons
            && (
              <MapComponents
                atts={props.buttons}
                entryID={props.entryID}
                buttonDisabled={buttonDisabled}
                handleReset={handleReset}
                contentID={props.contentID}
                fieldData={fieldData}
              // formID={bitFormsFront.contentID}
              // handleSubmit={handleSubmit}
              // id={`form-${props.contentID}-submit`}
              />
            )}
        </div>
      </form>
      {
        snack && (typeof message === 'string' ? <Toast msg={message} show={snack} setSnack={setSnack} error={hasError} /> : message.map((msg, index) => <Toast msg={msg} show={snack} setSnack={setSnack} error={hasError} index={index} canClose={message.length - 1 === index} editMode={props.editMode} />))
      }
    </div>
  )
}

function Toast(props) {
  const [snack, setSnack] = useState(true)
  const toatStyles = {
    userSelect: 'none',
    minWidth: !props.editMode && 150,
    background: '#383838',
    padding: '10px 15px',
    color: 'white',
    borderRadius: '8px',
    position: 'fixed',
    bottom: 20,
    right: 20,
    left: props.editMode && 20,
    marginBottom: !props.editMode && 10,
    paddingRight: 40,
    boxShadow: '1px 5px 11px -3px #0000004d',
    transition: 'right 0.5s',
    zIndex: 9999,
  }
  const closeButtonStyle = {
    position: 'absolute',
    top: props.editMode && -20,
    right: props.editMode ? -15 : 10,
    background: props.error ? 'red' : '#666',
    height: '25px',
    width: '25px',
    fontSize: '21px',
    padding: '3px 6px',
    color: 'white',
    borderRadius: '50px',
    lineHeight: '0.8',
    marginLeft: '7px',
    cursor: 'pointer',
    float: !props.editMode && 'right',
    zIndex: 9999,
  }
  if (props.index && props.index > 0) {
    toatStyles.bottom += props.index * 2 * 45
  }
  useEffect(() => {
    if (!snack && props.canClose && props.show) {
      props.setSnack(false)
    } else if (!snack && !props.index && props.show) {
      props.setSnack(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snack])
  useEffect(() => {
    const resetTime = props.error ? 10000 : 5000
    const timer = setTimeout(() => {
      if (props.show) {
        // !props.index && props.canClose === undefined && props.setSnack(false)
        // props.setSnack(false)
      }
    }, resetTime)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return snack && (
    <div className="toast btcd-flx" id={`success-${props.formId}`}>
      {
        /<\/?[a-z][\s\S]*>/i.test(props.msg)
          ? (
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: props.msg }}
            />
          )
          : props.msg
      }
      <button id="toast-close-btn" className="btcd-flx" onClick={() => setSnack(false)} type="button">&times;</button>
    </div>
  )
}
