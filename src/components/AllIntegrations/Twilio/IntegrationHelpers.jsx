/* eslint-disable no-unused-expressions */
import { __ } from '../../../Utils/i18nwrap'


export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }

  newConf.field_map[index].customValue = event.target.value
  setConf({ ...newConf })
}
