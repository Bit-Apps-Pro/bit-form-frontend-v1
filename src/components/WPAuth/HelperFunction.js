import produce from 'immer'

export const addFieldMap = (type, fldProp, i, confTmp, setConf) => {
  setConf(tmpConf => produce(tmpConf, draft => {
    draft[type][fldProp].splice(i, 0, {})
  }))
}

export const delFieldMap = (type, fldProp, i, confTmp, setConf) => {
  setConf(tmpConf => produce(tmpConf, draft => {
    if (draft[type][fldProp].length > 1) {
      draft[type][fldProp].splice(i, 1)
    }
  }))
}

export const handleFieldMapping = (type, fldProp, event, index, conftTmp, setConf) => {
  setConf(tmpConf => produce(tmpConf, draft => {
    // eslint-disable-next-line no-param-reassign
    draft[type][fldProp][index][event.target.name] = event.target.value
  }))
}
