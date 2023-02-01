/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
import { Fragment, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import toast from 'react-hot-toast'
import CloseIcn from '../Icons/CloseIcn'
import { __ } from '../Utils/i18nwrap'
import Accordions from './Utilities/Accordions'
import ActionBlock from './Utilities/ActionBlock'
import Button from './Utilities/Button'
import CheckBox from './Utilities/CheckBox'
import ConfirmModal from './Utilities/ConfirmModal'
import DropDown from './Utilities/DropDown'
import LogicBlock from './Utilities/LogicBlock'
import LogicChip from './Utilities/LogicChip'
import MtSelect from './Utilities/MtSelect'
import TableCheckBox from './Utilities/TableCheckBox'
import bitsFetch from '../Utils/bitsFetch'
import { $mailTemplates, $workflows, $bits, $integrations, $confirmations, $fieldsArr } from '../GlobalStates'
import { deepCopy } from '../Utils/Helpers'
import TrashIcn from '../Icons/TrashIcn'

function Workflow({ formID }) {
  const [confMdl, setconfMdl] = useState({ show: false })
  const [allWorkFlows, setworkFlows] = useRecoilState($workflows)
  const mailTem = useRecoilValue($mailTemplates)
  const integrations = useRecoilValue($integrations)
  const confirmations = useRecoilValue($confirmations)
  const fieldsArr = useRecoilValue($fieldsArr)
  /* eslint-disable-next-line no-undef */
  const workFlows = deepCopy(allWorkFlows)
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const mailOptions = () => {
    const mail = []
    if (emailInFormField()) {
      const flds = []

      fieldsArr.map(fld => {
        if (fld.type === 'email') {
          flds.push({ label: fld.name, value: `\${${fld.key}}` })
        }
      })
      mail.push({ title: 'Form Fields', type: 'group', childs: flds })
    }

    if (bits.userMail && Array.isArray(bits.userMail)) {
      mail.push({ title: 'WP Emails', type: 'group', childs: bits.userMail })
    }
    return mail
  }

  const getValueFromArr = (key, subkey, lgcGrpInd) => {
    const value = workFlows[lgcGrpInd].successAction.find(val => val.type === key)
    if (value !== undefined) { return value.details[subkey] }
    return ''
  }

  const checkKeyInArr = (key, lgcGrpInd) => workFlows[lgcGrpInd]?.successAction?.some(v => v.type === key)

  const ActionsTitle = type => (
    <>
      {type === 'onload' && 'On Load'}
      {type === 'oninput' && 'On Field Input'}
      {type === 'onvalidate' && 'On Form Validate'}
      {type === 'onsubmit' && 'On Form Submit'}
      {type === 'create_edit' && 'Record Create/Edit'}
      {type === 'create' && 'Record Create'}
      {type === 'edit' && 'Record Edit'}
      {type === 'delete' && 'Record Delete'}
      {type === 'always' && 'Always'}
      {type === 'cond' && 'With Condition'}
    </>
  )

  const addLogicGrp = () => {
    workFlows.unshift({
      title: `Action ${workFlows.length + 1}`,
      action_type: 'onload',
      action_run: 'create_edit',
      action_behaviour: 'cond',
      logics: [
        { field: '', logic: '', val: '' },
        'or',
        { field: '', logic: '', val: '' },
      ],
      actions: [{ field: '', action: 'value' }],
      successAction: [],
    })
    setworkFlows([...workFlows])
  }

  const delLgcGrp = val => {
    if (workFlows[val].id) {
      const prom = bitsFetch({ formID, id: workFlows[val].id }, 'bitforms_delete_workflow')
        .then(res => {
          if (res !== undefined && res.success) {
            workFlows.splice(val, 1)
            setworkFlows([...workFlows])
          }
        })

      toast.promise(prom, {
        success: 'Successfully Deleted.',
        loading: 'Deleting...',
        error: 'Error occurred, Try again.',
      })
    } else {
      workFlows.splice(val, 1)
      setworkFlows([...workFlows])
    }
  }

  const handleLgcTitle = (e, i) => {
    workFlows[i].title = e.target.value
    setworkFlows([...workFlows])
  }

  const addLogic = (typ, lgcGrpInd) => {
    if (typ === 'and') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics.push('and')
        prv[lgcGrpInd].logics.push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics.push('or')
        prv[lgcGrpInd].logics.push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'orGrp') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics.push('or')
        prv[lgcGrpInd].logics.push([{ field: '', logic: '', val: '' }, 'or', { field: '', logic: '', val: '' }])
        return prv
      })
    } else if (typ === 'andGrp') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics.push('and')
        prv[lgcGrpInd].logics.push([{ field: '', logic: '', val: '' }, 'and', { field: '', logic: '', val: '' }])
        return prv
      })
    }
  }

  const addSubLogic = (typ, lgcGrpInd, ind) => {
    if (typ === 'and') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[ind].push('and')
        prv[lgcGrpInd].logics[ind].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[ind].push('or')
        prv[lgcGrpInd].logics[ind].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'orGrp') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[ind].push('or')
        prv[lgcGrpInd].logics[ind].push([{ field: '', logic: '', val: '' }, 'or', { field: '', logic: '', val: '' }])
        return prv
      })
    } else if (typ === 'andGrp') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[ind].push('and')
        prv[lgcGrpInd].logics[ind].push([{ field: '', logic: '', val: '' }, 'and', { field: '', logic: '', val: '' }])
        return prv
      })
    }
  }

  const addSubSubLogic = (typ, lgcGrpInd, ind, subInd) => {
    if (typ === 'and') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[ind][subInd].push('and')
        prv[lgcGrpInd].logics[ind][subInd].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[ind][subInd].push('or')
        prv[lgcGrpInd].logics[ind][subInd].push({ field: '', logic: '', val: '' })
        return prv
      })
    }
  }

  const changeLogicChip = (e, lgcGrpInd, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd] = e
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd][subLgcInd] = e
        return prv
      })
    } else {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd] = e
        return prv
      })
    }
  }

  const changeLogic = (val, lgcGrpInd, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        if (val === 'null') {
          prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd].val = ''
        }
        prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd].logic = val
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        if (val === 'null') {
          prv[lgcGrpInd].logics[lgcInd][subLgcInd].val = ''
        }
        prv[lgcGrpInd].logics[lgcInd][subLgcInd].logic = val
        return prv
      })
    } else {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        if (val === 'null') {
          prv[lgcGrpInd].logics[lgcInd].val = ''
        }
        prv[lgcGrpInd].logics[lgcInd].logic = val
        return prv
      })
    }
  }

  const changeValue = (val, lgcGrpInd, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd].val = val
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd][subLgcInd].val = val
        return prv
      })
    } else {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd].val = val
        return prv
      })
    }
  }

  const changeFormField = (val, lgcGrpInd, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd].field = val
        prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd].val = ''
        return prv
      })
    } else if (subLgcInd !== undefined) {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd][subLgcInd].field = val
        prv[lgcGrpInd].logics[lgcInd][subLgcInd].val = ''
        return prv
      })
    } else {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        prv[lgcGrpInd].logics[lgcInd].field = val
        prv[lgcGrpInd].logics[lgcInd].val = ''
        return prv
      })
    }
  }

  const delLogic = (lgcGrpInd, lgcInd, subLgcInd, subSubLgcInd) => {
    if (workFlows[lgcGrpInd].logics.length > 1) {
      if (subSubLgcInd !== undefined) {
        setworkFlows(prvSt => {
          const prv = deepCopy(prvSt)
          if (prv[lgcGrpInd].logics[lgcInd][subLgcInd].length === subSubLgcInd + 1) {
            if (prv[lgcGrpInd].logics[lgcInd][subLgcInd].length === 3) {
              const tmp = prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd - 2]
              prv[lgcGrpInd].logics[lgcInd].splice(subLgcInd, 1)
              prv[lgcGrpInd].logics[lgcInd].push(tmp)
            } else {
              prv[lgcGrpInd].logics[lgcInd][subLgcInd].splice(subSubLgcInd - 1, 2)
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (prv[lgcGrpInd].logics[lgcInd][subLgcInd].length === 3) {
              const tmp = prv[lgcGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd + 2]
              prv[lgcGrpInd].logics[lgcInd].splice(subLgcInd, 1)
              prv[lgcGrpInd].logics[lgcInd].push(tmp)
            } else {
              prv[lgcGrpInd].logics[lgcInd][subLgcInd].splice(subSubLgcInd, 2)
            }
          }
          return prv
        })
      } else if (subLgcInd !== undefined) {
        setworkFlows(prvSt => {
          const prv = deepCopy(prvSt)
          if (prv[lgcGrpInd].logics[lgcInd].length === subLgcInd + 1) {
            if (prv[lgcGrpInd].logics[lgcInd].length === 3) {
              const tmp = prv[lgcGrpInd].logics[lgcInd][subLgcInd - 2]
              prv[lgcGrpInd].logics.splice(lgcInd, 1)
              prv[lgcGrpInd].logics.splice(lgcInd, 0, tmp)
            } else {
              prv[lgcGrpInd].logics[lgcInd].splice(subLgcInd - 1, 2)
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (prv[lgcGrpInd].logics[lgcInd].length === 3) {
              const tmp = prv[lgcGrpInd].logics[lgcInd][subLgcInd + 2]
              prv[lgcGrpInd].logics.splice(lgcInd, 1)
              prv[lgcGrpInd].logics.splice(lgcInd, 0, tmp)
            } else {
              prv[lgcGrpInd].logics[lgcInd].splice(subLgcInd, 2)
            }
          }
          return prv
        })
      } else {
        setworkFlows(prvSt => {
          const prv = deepCopy(prvSt)
          if (lgcInd !== 0) {
            prv[lgcGrpInd].logics.splice(lgcInd - 1, 2)
          } else {
            prv[lgcGrpInd].logics.splice(lgcInd, 2)
          }
          return prv
        })
      }
    }
  }

  const addAction = lgcGrpInd => {
    setworkFlows(prvSt => {
      const prv = deepCopy(prvSt)
      if (prv[lgcGrpInd].action_type === 'onsubmit') {
        prv[lgcGrpInd].actions.push({ field: '', action: 'value' })
      } else {
        prv[lgcGrpInd].actions.push({ field: '', action: 'disable' })
      }
      return prv
    })
  }

  const addInlineLogic = (typ, lgcGrpInd, lgcInd, subLgcInd, subSubLgcInd) => {
    if (typ === 'and') {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        if (subSubLgcInd !== undefined) {
          prv[lgcGrpInd].logics[lgcInd][subLgcInd].splice(subSubLgcInd + 1, 0, 'and', { field: '', logic: '', val: '' })
        } else if (subLgcInd !== undefined) {
          prv[lgcGrpInd].logics[lgcInd].splice(subLgcInd + 1, 0, 'and', { field: '', logic: '', val: '' })
        } else {
          prv[lgcGrpInd].logics.splice(lgcInd + 1, 0, 'and', { field: '', logic: '', val: '' })
        }
        return prv
      })
    } else {
      setworkFlows(prvSt => {
        const prv = deepCopy(prvSt)
        if (subSubLgcInd !== undefined) {
          prv[lgcGrpInd].logics[lgcInd][subLgcInd].splice(subSubLgcInd + 1, 0, 'or', { field: '', logic: '', val: '' })
        } else if (subLgcInd !== undefined) {
          prv[lgcGrpInd].logics[lgcInd].splice(subLgcInd + 1, 0, 'or', { field: '', logic: '', val: '' })
        } else {
          prv[lgcGrpInd].logics.splice(lgcInd + 1, 0, 'or', { field: '', logic: '', val: '' })
        }
        return prv
      })
    }
  }

  const changeActionType = (typ, lgcGrpInd) => {
    if (typ === 'onsubmit') {
      workFlows[lgcGrpInd].actions.map(itm => { itm.action = 'value' })
    } else if (typ === 'onvalidate') {
      workFlows[lgcGrpInd].action_behaviour = 'cond'
    }
    workFlows[lgcGrpInd].action_type = typ
    setworkFlows([...workFlows])
  }

  const changeActionRun = (typ, lgcGrpInd) => {
    if (typ === 'delete') {
      delete workFlows[lgcGrpInd].action_type
    } else if (workFlows[lgcGrpInd].action_type === undefined) {
      workFlows[lgcGrpInd].action_type = 'onload'
    }
    workFlows[lgcGrpInd].action_run = typ
    setworkFlows([...workFlows])
  }

  const changeActionBehave = (typ, lgcGrpInd) => {
    workFlows[lgcGrpInd].action_behaviour = typ
    setworkFlows([...workFlows])
  }

  const changeValidateMsg = (val, lgcGrpInd) => {
    workFlows[lgcGrpInd].validateMsg = val
    setworkFlows([...workFlows])
  }

  const setSuccessMsg = (val, lgcGrpInd) => {
    for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
      if (workFlows[lgcGrpInd].successAction[i].type === 'successMsg') {
        workFlows[lgcGrpInd].successAction[i].details.id = val
        break
      }
    }
    setworkFlows([...workFlows])
  }

  const setRedirectPage = (val, lgcGrpInd) => {
    for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
      if (workFlows[lgcGrpInd].successAction[i].type === 'redirectPage') {
        workFlows[lgcGrpInd].successAction[i].details.id = val
        break
      }
    }
    setworkFlows([...workFlows])
  }

  const setWebHooks = (val, lgcGrpInd) => {
    for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
      if (workFlows[lgcGrpInd].successAction[i].type === 'webHooks') {
        workFlows[lgcGrpInd].successAction[i].details.id = val.map(itm => itm.value)
        break
      }
    }
    setworkFlows([...workFlows])
  }

  const setInteg = (val, lgcGrpInd) => {
    for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
      if (workFlows[lgcGrpInd].successAction[i].type === 'integ') {
        workFlows[lgcGrpInd].successAction[i].details.id = val.map(itm => itm.value)
        break
      }
    }
    setworkFlows([...workFlows])
  }

  const preventDelete = (val, lgcGrpInd) => {
    workFlows[lgcGrpInd].avoid_delete = val
    setworkFlows([...workFlows])
  }

  const setEmailSetting = (typ, e, lgcGrpInd) => {
    if (typ === 'tem') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.id = e.target.value
          break
        }
      }
    } else if (typ === 'from') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.from = e
          break
        }
      }
    } else if (typ === 'to') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.to = e ? e.split(',') : []
          break
        }
      }
    } else if (typ === 'cc') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.cc = e ? e.split(',') : []
          break
        }
      }
    } else if (typ === 'bcc') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.bcc = e ? e.split(',') : []
          break
        }
      }
    } else if (typ === 'replyto') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.replyto = e ? e.split(',') : []
          break
        }
      }
    } else if (typ === 'attachment') {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (['mailNotify', 'dblOptin'].includes(workFlows[lgcGrpInd].successAction[i].type)) {
          workFlows[lgcGrpInd].successAction[i].details.attachment = e ? e.split(',') : []
          break
        }
      }
    }
    setworkFlows([...workFlows])
  }

  const enableAction = (checked, typ, lgcGrpInd) => {
    /* if (!workFlows[lgcGrpInd].successAction) {
      workFlows[lgcGrpInd].successAction = []
    } */
    if (checked) {
      if (typ === 'mailNotify') {
        workFlows[lgcGrpInd].successAction.push({ type: typ, details: {} })
      } else if (typ === 'dblOptin') {
        workFlows[lgcGrpInd].successAction.push({ type: typ, details: {} })
      } else {
        workFlows[lgcGrpInd].successAction.push({ type: typ, details: { id: '' } })
      }
    } else {
      for (let i = 0; i < workFlows[lgcGrpInd].successAction.length; i += 1) {
        if (workFlows[lgcGrpInd].successAction[i].type === typ) {
          workFlows[lgcGrpInd].successAction.splice(i, 1)
          break
        }
      }
    }
    setworkFlows([...workFlows])
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const lgcGrpDelConf = i => {
    confMdl.btnTxt = 'Delete'
    confMdl.body = 'Are you sure to delete this conditional logic?'
    confMdl.btnClass = ''
    confMdl.action = () => { delLgcGrp(i); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const emailInFormField = () => {
    for (const field of fieldsArr) {
      if (field.type === 'email') {
        return true
      }
    }
    return false
  }
  const fileInFormField = () => {
    const file = []
    for (const field of fieldsArr) {
      if (field.type === 'file-up') {
        file.push({ label: field.name, value: field.key })
      }
    }
    return file
  }

  return (
    <div className="btcd-workflow" style={{ width: 900 }}>
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      <h2>{__('Conditional Logics', 'bitform')}</h2>

      {((!isPro && !workFlows.length) || isPro) && (
        <Button className="blue" onClick={addLogicGrp}>
          <CloseIcn size="10" className="icn-rotate-45 mr-1" />
          {__('Add Conditional Logic', 'bitform')}
        </Button>
      )}

      {workFlows.length > 0 ? workFlows.map((lgcGrp, lgcGrpInd) => (
        <Fragment key={`workFlows-grp-${lgcGrpInd + 13}`}>
          <div className="workflow-grp d-flx mt-2">
            <Accordions
              title={`${lgcGrp.title}`}
              header={(
                <small className="f-right txt-dp mr-4">
                  <span className="mr-2">
                    <i className="btcd-chat-dot mr-1" />
                    {ActionsTitle(lgcGrp.action_run)}
                  </span>
                  {lgcGrp.action_type !== undefined && (
                    <span className="mr-2">
                      <i className="btcd-chat-dot mr-1" />
                      {ActionsTitle(lgcGrp.action_type)}
                    </span>
                  )}
                  <span>
                    <i className="btcd-chat-dot mr-1" />
                    {ActionsTitle(lgcGrp.action_behaviour)}
                  </span>
                </small>
              )}
              titleEditable
              onTitleChange={e => handleLgcTitle(e, lgcGrpInd)}
              notScroll
              cls={!isPro ? 'w-10' : 'w-9'}
            >
              <div className="flx">
                <b className="txt-dp"><small>Action Run When:</small></b>
                <CheckBox radio onChange={e => changeActionRun(e.target.value, lgcGrpInd)} name={`ar-${lgcGrpInd + 28}`} title={<small className="txt-dp">{__('Record Create/Edit', 'bitform')}</small>} checked={lgcGrp.action_run === 'create_edit'} value="create_edit" />
                <CheckBox radio onChange={e => changeActionRun(e.target.value, lgcGrpInd)} name={`ar-${lgcGrpInd + 28}`} title={<small className="txt-dp">{__('Record Create', 'bitform')}</small>} checked={lgcGrp.action_run === 'create'} value="create" />
                <CheckBox radio onChange={e => changeActionRun(e.target.value, lgcGrpInd)} name={`ar-${lgcGrpInd + 28}`} title={<small className="txt-dp">{__('Record Edit', 'bitform')}</small>} checked={lgcGrp.action_run === 'edit'} value="edit" />
                <CheckBox radio onChange={e => changeActionRun(e.target.value, lgcGrpInd)} name={`ar-${lgcGrpInd + 28}`} title={<small className="txt-dp">{__('Record Delete', 'bitform')}</small>} checked={lgcGrp.action_run === 'delete'} value="delete" />
              </div>
              {lgcGrp.action_run !== 'delete' && (
                <div className="flx">
                  <b className="txt-dp"><small>Action Effect:</small></b>
                  <CheckBox radio onChange={e => changeActionType(e.target.value, lgcGrpInd)} name={`at-${lgcGrpInd + 26}`} title={<small className="txt-dp">{__('On Form Load', 'bitform')}</small>} checked={lgcGrp.action_type === 'onload'} value="onload" />
                  <CheckBox radio onChange={e => changeActionType(e.target.value, lgcGrpInd)} name={`at-${lgcGrpInd + 26}`} title={<small className="txt-dp">{__('On Field Input', 'bitform')}</small>} checked={lgcGrp.action_type === 'oninput'} value="oninput" />
                  <CheckBox radio onChange={e => changeActionType(e.target.value, lgcGrpInd)} name={`at-${lgcGrpInd + 26}`} title={<small className="txt-dp">{__('On Form Validate', 'bitform')}</small>} checked={lgcGrp.action_type === 'onvalidate'} value="onvalidate" />
                  <CheckBox radio onChange={e => changeActionType(e.target.value, lgcGrpInd)} name={`at-${lgcGrpInd + 26}`} title={<small className="txt-dp">{__('On Form Submit', 'bitform')}</small>} checked={lgcGrp.action_type === 'onsubmit'} value="onsubmit" />
                </div>
              )}
              <div className="flx">
                <b className="txt-dp"><small>Action Behaviour:</small></b>
                {!lgcGrp?.action_type?.match(/^(onvalidate|oninput)$/) && <CheckBox radio onChange={e => changeActionBehave(e.target.value, lgcGrpInd)} name={`ab-${lgcGrpInd + 111}`} title={<small className="txt-dp">{__('Always', 'bitform')}</small>} checked={lgcGrp.action_behaviour === 'always'} value="always" />}
                <CheckBox radio onChange={e => changeActionBehave(e.target.value, lgcGrpInd)} name={`ab-${lgcGrpInd + 111}`} title={<small className="txt-dp">{__('Condition', 'bitform')}</small>} checked={lgcGrp.action_behaviour === 'cond'} value="cond" />
              </div>

              <div>
                {
                  lgcGrp.action_behaviour === 'cond' && lgcGrp.logics.map((logic, ind) => (
                    <span key={`logic-${ind + 44}`}>
                      {typeof logic === 'object' && !Array.isArray(logic) && <LogicBlock fieldVal={logic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={logic.logic} changeLogic={changeLogic} addInlineLogic={addInlineLogic} delLogic={delLogic} lgcGrpInd={lgcGrpInd} lgcInd={ind} value={logic.val} actionType={lgcGrp?.action_type} />}
                      {typeof logic === 'string' && <LogicChip logic={logic} onChange={e => changeLogicChip(e.target.value, lgcGrpInd, ind)} />}
                      {Array.isArray(logic) && (
                        <div className="p-2 pl-6 br-10 btcd-logic-grp">

                          {logic.map((subLogic, subInd) => (
                            <span key={`subLogic-${subInd * 7}`}>
                              {typeof subLogic === 'object' && !Array.isArray(subLogic) && <LogicBlock fieldVal={subLogic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={subLogic.logic} changeLogic={changeLogic} addInlineLogic={addInlineLogic} delLogic={delLogic} lgcGrpInd={lgcGrpInd} lgcInd={ind} subLgcInd={subInd} value={subLogic.val} actionType={lgcGrp?.action_type} />}
                              {typeof subLogic === 'string' && <LogicChip logic={subLogic} nested onChange={e => changeLogicChip(e.target.value, lgcGrpInd, ind, subInd)} />}
                              {Array.isArray(subLogic) && (
                                <div className="p-2 pl-6 br-10 btcd-logic-grp">

                                  {subLogic.map((subSubLogic, subSubLgcInd) => (
                                    <span key={`subsubLogic-${subSubLgcInd + 90}`}>
                                      {typeof subSubLogic === 'object' && !Array.isArray(subSubLogic) && <LogicBlock fieldVal={subSubLogic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={subSubLogic.logic} changeLogic={changeLogic} addInlineLogic={addInlineLogic} delLogic={delLogic} lgcGrpInd={lgcGrpInd} lgcInd={ind} subLgcInd={subInd} subSubLgcInd={subSubLgcInd} value={subSubLogic.val} actionType={lgcGrp?.action_type} />}
                                      {typeof subSubLogic === 'string' && <LogicChip logic={subSubLogic} nested onChange={e => changeLogicChip(e.target.value, lgcGrpInd, ind, subInd, subSubLgcInd)} />}
                                    </span>
                                  ))}
                                  <div className=" btcd-workFlows-btns">
                                    <div className="flx">
                                      <Button icn className="blue"><CloseIcn size="14" className="icn-rotate-45" /></Button>
                                      <Button onClick={() => addSubSubLogic('and', lgcGrpInd, ind, subInd)} className="blue ml-2">
                                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                        AND
                                        {' '}
                                      </Button>
                                      <Button onClick={() => addSubSubLogic('or', lgcGrpInd, ind, subInd)} className="blue ml-2">
                                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                        OR
                                        {' '}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </span>
                          ))}
                          <div className=" btcd-workFlows-btns">
                            <div className="flx">
                              <Button icn className="blue sh-sm"><CloseIcn size="14" className="icn-rotate-45" /></Button>
                              <Button onClick={() => addSubLogic('and', lgcGrpInd, ind)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                AND
                              </Button>
                              <Button onClick={() => addSubLogic('or', lgcGrpInd, ind)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                OR
                              </Button>
                              <Button onClick={() => addSubLogic('orGrp', lgcGrpInd, ind)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                OR Group
                              </Button>
                              <Button onClick={() => addSubLogic('andGrp', lgcGrpInd, ind)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                AND Group
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  ))
                }

                {lgcGrp.action_behaviour === 'cond' && (
                  <div className="btcd-workFlows-btns">
                    <div className="flx">
                      <Button onClick={() => addLogic('and', lgcGrpInd)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        AND
                      </Button>
                      <Button onClick={() => addLogic('or', lgcGrpInd)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        OR
                      </Button>
                      <Button onClick={() => addLogic('orGrp', lgcGrpInd)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        OR Group
                      </Button>
                      <Button onClick={() => addLogic('andGrp', lgcGrpInd)} className="blue ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        AND Group
                      </Button>
                    </div>
                  </div>
                )}

                <h3 className="txt-dp mt-3 mb-1">
                  {lgcGrp.action_behaviour === 'cond' ? 'Then ' : ''}
                  Action
                </h3>
                {(lgcGrp.action_type === 'onsubmit' || lgcGrp.action_run === 'delete') && (
                  <>
                    <div className="mb-2">
                      {lgcGrp.action_run !== 'delete' && <TableCheckBox onChange={e => enableAction(e.target.checked, 'successMsg', lgcGrpInd)} className="ml-2 mt-2" title={__('Success Message', 'bitform')} checked={checkKeyInArr('successMsg', lgcGrpInd)} />}
                      {!lgcGrp.action_run.match(/^(delete|edit)$/) && <TableCheckBox onChange={e => enableAction(e.target.checked, 'redirectPage', lgcGrpInd)} className="ml-5 mt-2" title={__('Redirect URL', 'bitform')} checked={checkKeyInArr('redirectPage', lgcGrpInd)} />}
                      <TableCheckBox onChange={e => enableAction(e.target.checked, 'webHooks', lgcGrpInd)} className="ml-5 mt-2" title={__('Web Hook', 'bitform')} checked={checkKeyInArr('webHooks', lgcGrpInd)} />
                      {lgcGrp.action_run !== 'delete' && <TableCheckBox onChange={e => enableAction(e.target.checked, 'integ', lgcGrpInd)} className="ml-5 mt-2" title={__('Integration', 'bitform')} checked={checkKeyInArr('integ', lgcGrpInd)} />}
                    </div>
                    <div className="mb-3">
                      <TableCheckBox onChange={e => enableAction(e.target.checked, 'mailNotify', lgcGrpInd)} className="ml-2 mt-2" title={__('Email Notification', 'bitform')} checked={checkKeyInArr('mailNotify', lgcGrpInd)} />
                      <TableCheckBox onChange={e => enableAction(e.target.checked, 'dblOptin', lgcGrpInd)} className="ml-4 mt-2" title={__('Double Opt-In', 'bitform')} checked={checkKeyInArr('dblOptin', lgcGrpInd)} />
                    </div>
                  </>
                )}
                {lgcGrp.action_run === 'delete' && <CheckBox onChange={e => preventDelete(e.target.checked, lgcGrpInd)} checked={workFlows[lgcGrpInd].avoid_delete} title={<small className="txt-dp">Prevent Delete</small>} />}

                {(lgcGrp.action_type === 'onsubmit' || lgcGrp.action_run === 'delete') && (
                  <>
                    <div className="ml-2">
                      {checkKeyInArr('webHooks', lgcGrpInd) && <DropDown className="mt-1" action={val => setWebHooks(val, lgcGrpInd)} jsonValue value={getValueFromArr('webHooks', 'id', lgcGrpInd)} title={<span className="f-m">{__('Web Hooks', 'bitform')}</span>} titleClassName="mt-2 w-7 mt-1" isMultiple options={confirmations?.type?.webHooks?.map((itm, i) => ({ label: itm.title, value: itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i }) }))} placeholder={__('Select Hooks to Call', 'bitform')} />}
                    </div>
                    <div className="ml-2">
                      {checkKeyInArr('integ', lgcGrpInd) && <DropDown className="mt-1" action={val => setInteg(val, lgcGrpInd)} jsonValue value={getValueFromArr('integ', 'id', lgcGrpInd)} title={<span className="f-m mt-1">{__('Integrations', 'bitform')}</span>} titleClassName="mt-2 w-7" isMultiple options={integrations?.map((itm, i) => ({ label: itm.name, value: itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i }) }))} placeholder={__('Select Integation', 'bitform')} />}
                    </div>

                    {lgcGrp.action_run !== 'delete' && (

                      <div className="ml-2">
                        <div className="mt-2">
                          {checkKeyInArr('successMsg', lgcGrpInd) && (
                            <label className="f-m ">
                              {__('Success Message:', 'bitform')}
                              <br />
                              <select className="btcd-paper-inp w-7 mt-1" onChange={e => setSuccessMsg(e.target.value, lgcGrpInd)} value={getValueFromArr('successMsg', 'id', lgcGrpInd)}>
                                <option value="">{__('Select Message', 'bitform')}</option>
                                {confirmations?.type?.successMsg?.map((itm, i) => <option key={`sm-${i + 2.3}`} value={itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i })}>{itm.title}</option>)}
                              </select>
                            </label>
                          )}
                        </div>

                        <div className="mt-2">
                          {checkKeyInArr('redirectPage', lgcGrpInd) && (
                            <label className="f-m">
                              {__('Redirect URL:', 'bitform')}
                              <br />
                              <select className="btcd-paper-inp w-7 mt-1" onChange={e => setRedirectPage(e.target.value, lgcGrpInd)} value={getValueFromArr('redirectPage', 'id', lgcGrpInd)}>
                                <option value="">{__('Select Page To Redirect', 'bitform')}</option>
                                {confirmations?.type?.redirectPage?.map((itm, i) => <option key={`sr-${i + 2.5}`} value={itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i })}>{itm.title}</option>)}
                              </select>
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-2 ml-2">
                      {checkKeyInArr('mailNotify', lgcGrpInd) && (
                        <>
                          <label className="f-m">
                            {__('Email Notification:', 'bitform')}
                            <br />
                            <select className="btcd-paper-inp w-7  mt-1" onChange={e => setEmailSetting('tem', e, lgcGrpInd)} value={getValueFromArr('mailNotify', 'id', lgcGrpInd)}>
                              <option value="">{__('Select Email Template', 'bitform')}</option>
                              {mailTem?.map((itm, i) => <option key={`sem-${i + 2.3}`} value={itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i })}>{itm.title}</option>)}
                            </select>
                          </label>
                          <DropDown
                            action={val => setEmailSetting('to', val, lgcGrpInd)}
                            value={getValueFromArr('mailNotify', 'to', lgcGrpInd)}
                            placeholder={__('Add Email Receiver', 'bitform')}
                            title={<span className="f-m">{__('To', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('mailNotify', 'to', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('from', val, lgcGrpInd)}
                            placeholder={__('Add mail from address', 'bitform')}
                            value={getValueFromArr('mailNotify', 'from', lgcGrpInd)}
                            title={<span className="f-m">{__('From', 'bitform')}</span>}
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('mailNotify', 'from', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('cc', val, lgcGrpInd)}
                            value={getValueFromArr('mailNotify', 'cc', lgcGrpInd)}
                            placeholder={__('Add Email CC', 'bitform')}
                            title={<span className="f-m">{__('CC', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('mailNotify', 'cc', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('bcc', val, lgcGrpInd)}
                            placeholder={__('Add Email BCC', 'bitform')}
                            value={getValueFromArr('mailNotify', 'bcc', lgcGrpInd)}
                            title={<span className="f-m">{__('BCC', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('mailNotify', 'bcc', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('replyto', val, lgcGrpInd)}
                            placeholder={__('Reply To', 'bitform')}
                            value={getValueFromArr('mailNotify', 'replyto', lgcGrpInd)}
                            title={<span className="f-m">{__('Reply To', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('mailNotify', 'replyto', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('attachment', val, lgcGrpInd)}
                            placeholder={__('Attachment', 'bitform')}
                            value={getValueFromArr('mailNotify', 'attachment', lgcGrpInd)}
                            title={<span className="f-m">{__('Attachment', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            options={fileInFormField()}
                          />
                        </>
                      )}
                    </div>

                    <div className="mt-2 ml-2">
                      {checkKeyInArr('dblOptin', lgcGrpInd) && (
                        <>
                          <label className="f-m ">
                            {__('Double optin tamplate:', 'bitform')}
                            <br />
                            <select className="btcd-paper-inp w-7 mt-1" onChange={e => setEmailSetting('tem', e, lgcGrpInd)} value={getValueFromArr('dblOptin', 'id', lgcGrpInd)}>
                              <option value="">{__('Select Email Template', 'bitform')}</option>
                              {mailTem?.map((itm, i) => <option key={`sem-${i + 2.3}`} value={itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i })}>{itm.title}</option>)}
                            </select>
                          </label>
                          <DropDown
                            action={val => setEmailSetting('to', val, lgcGrpInd)}
                            value={getValueFromArr('dblOptin', 'to', lgcGrpInd)}
                            placeholder={__('Add Email Receiver', 'bitform')}
                            title={<span className="f-m">{__('To', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('dblOptin', 'to', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('from', val, lgcGrpInd)}
                            placeholder={__('Add mail from address', 'bitform')}
                            value={getValueFromArr('dblOptin', 'from', lgcGrpInd)}
                            title={<span className="f-m">{__('From', 'bitform')}</span>}
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('dblOptin', 'from', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('cc', val, lgcGrpInd)}
                            value={getValueFromArr('dblOptin', 'cc', lgcGrpInd)}
                            placeholder={__('Add Email CC', 'bitform')}
                            title={<span className="f-m">{__('CC', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('dblOptin', 'cc', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('bcc', val, lgcGrpInd)}
                            placeholder={__('Add Email BCC', 'bitform')}
                            value={getValueFromArr('dblOptin', 'bcc', lgcGrpInd)}
                            title={<span className="f-m">{__('BCC', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('dblOptin', 'bcc', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('replyto', val, lgcGrpInd)}
                            placeholder={__('Reply To', 'bitform')}
                            value={getValueFromArr('dblOptin', 'replyto', lgcGrpInd)}
                            title={<span className="f-m">{__('Reply To', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            addable
                            options={mailOptions(getValueFromArr('dblOptin', 'replyto', lgcGrpInd))}
                          />
                          <DropDown
                            action={val => setEmailSetting('attachment', val, lgcGrpInd)}
                            placeholder={__('Attachment', 'bitform')}
                            value={getValueFromArr('dblOptin', 'attachment', lgcGrpInd)}
                            title={<span className="f-m">{__('Attachment', 'bitform')}</span>}
                            isMultiple
                            titleClassName="w-7 mt-2"
                            options={fileInFormField()}
                          />
                        </>
                      )}
                    </div>

                    {lgcGrp.action_run !== 'delete' && <div className="mt-2 ml-2"><b className="txt-dp">{__('Set another field value', 'bitform')}</b></div>}
                  </>
                )}

                {(lgcGrp.action_type === 'onvalidate' && lgcGrp.action_run !== 'delete') && (
                  <MtSelect onChange={e => changeValidateMsg(e.target.value, lgcGrpInd)} value={lgcGrp.validateMsg} label="Error Message" className="w-7 mt-3 ml-2">
                    <option value="">{__('Select Message', 'bitform')}</option>
                    {confirmations?.type?.successMsg?.map((itm, i) => <option key={`vm-${i + 2.7}`} value={itm.id ? JSON.stringify({ id: itm.id }) : JSON.stringify({ index: i })}>{itm.title}</option>)}
                  </MtSelect>
                )}

                {(lgcGrp.action_type !== 'onvalidate' && lgcGrp.action_run !== 'delete') && (
                  <div className="ml-2 mt-2">
                    {lgcGrp.actions.map((action, actionInd) => (
                      <span key={`atn-${actionInd + 22}`}>
                        <ActionBlock action={action} setworkFlows={setworkFlows} lgcGrpInd={lgcGrpInd} actionInd={actionInd} actionType={lgcGrp.action_type} />
                        {lgcGrp.actions.length !== actionInd + 1 && (
                          <>
                            <div style={{ height: 5 }}>
                              <svg height="60" width="50">
                                <line x1="20" y1="10" x2="20" y2="0" style={{ stroke: '#b9c5ff', strokeWidth: 1 }} />
                              </svg>
                            </div>
                            <h6 className="m-0 ml-2 mt-1 txt-gray">AND</h6>
                            <div style={{ height: 5 }}>
                              <svg height="60" width="50">
                                <line x1="20" y1="10" x2="20" y2="0" style={{ stroke: '#b9c5ff', strokeWidth: 1 }} />
                              </svg>
                            </div>
                          </>
                        )}
                      </span>
                    ))}
                    <br />
                    <Button onClick={() => addAction(lgcGrpInd)} icn className="blue sh-sm"><CloseIcn size="14" className="icn-rotate-45" /></Button>
                  </div>
                )}
              </div>
            </Accordions>
            {isPro && (
              <div className="mt-2">
                <Button onClick={() => lgcGrpDelConf(lgcGrpInd)} icn className="ml-2 sh-sm btcd-menu-btn tooltip" style={{ '--tooltip-txt': '"Delete Action"' }}>
                  <TrashIcn size="16" />
                </Button>
              </div>
            )}
          </div>
          {!isPro && (
            <div className="txt-center bg-pro p-5 mt-2">
              {__('For', 'bitform')}
              &nbsp;
              <span className="txt-pro">{__('UNLIMITED', 'bitform')}</span>
              &nbsp;
              {__('Conditional Logics', 'bitform')}
              ,&nbsp;
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer"><b className="txt-pro">{__('Buy Premium', 'bitform')}</b></a>
            </div>
          )}
        </Fragment>
      )) : (
        <div className="txt-center btcd-empty">
          <span className="btcd-icn icn-stack" />
          {__('Empty', 'bitform')}
        </div>
      )}
    </div>
  )
}

export default Workflow
