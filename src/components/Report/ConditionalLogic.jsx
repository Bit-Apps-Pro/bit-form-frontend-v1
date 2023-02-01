/* eslint-disable max-len */
import CloseIcn from '../../Icons/CloseIcn'
import { deepCopy } from '../../Utils/Helpers'
import Button from '../Utilities/Button'
import LogicBlock from './LogicBlock'
import LogicChip from '../Utilities/LogicChip'
import { disabledLogicType, stringToArray } from './helper'

function ConditionalLogic({ formFields, dataConf, setDataConf, reportInd }) {
  const disabledLogics = disabledLogicType
  const changeLogicChip = (e, lgcInd) => {
    setDataConf(prvSt => {
      const prv = deepCopy(prvSt)
      prv[reportInd].details.conditions[lgcInd] = e
      return prv
    })
  }

  const changeFormField = (val, lgcInd) => {
    setDataConf(prvSt => {
      const prv = deepCopy(prvSt)
      prv[reportInd].details.conditions[lgcInd].field = val
      prv[reportInd].details.conditions[lgcInd].val = ''
      return prv
    })
  }

  const changeValue = (val, lgcInd, type = null) => {
    setDataConf(prvSt => {
      const prv = deepCopy(prvSt)
      prv[reportInd].details.conditions[lgcInd].val = stringToArray(type, val)
      return prv
    })
  }

  const changeLogic = (val, lgcInd) => {
    setDataConf(prvSt => {
      const prv = deepCopy(prvSt)
      prv[reportInd].details.conditions[lgcInd].val = ''
      if (disabledLogics.includes(val)) {
        prv[reportInd].details.conditions[lgcInd].val = val
      }
      prv[reportInd].details.conditions[lgcInd].logic = val
      return prv
    })
  }

  const delLogic = (lgcInd) => {
    if (dataConf[reportInd]?.details?.conditions?.length > 1) {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        if (lgcInd !== 0) {
          prv[reportInd].details.conditions.splice(lgcInd - 1, 2)
        } else {
          prv[reportInd].details.conditions.splice(lgcInd, 2)
        }
        return prv
      })
    }
  }

  const addLogic = (typ) => {
    if (typ === 'and') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv[reportInd].details.conditions.push('and')
        prv[reportInd].details.conditions.push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv[reportInd].details.conditions.push('or')
        prv[reportInd].details.conditions.push({ field: '', logic: '', val: '' })
        return prv
      })
    }
  }

  const addSubLogic = (typ, ind) => {
    if (typ === 'and') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv[reportInd].details.conditions[ind].push('and')
        prv[reportInd].details.conditions[ind].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv[reportInd].details.conditions[ind].push('or')
        prv[reportInd].details.conditions[ind].push({ field: '', logic: '', val: '' })
        return prv
      })
    }
  }

  const addSubSubLogic = (typ, ind, subInd) => {
    if (typ === 'and') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv[reportInd].details.conditions[ind][subInd].push('and')
        prv[reportInd].details.conditions[ind][subInd].push({ field: '', logic: '', val: '' })
        return prv
      })
    } else if (typ === 'or') {
      setDataConf(prvSt => {
        const prv = deepCopy(prvSt)
        prv[reportInd].details.conditions[ind][subInd].push('or')
        prv[reportInd].details.conditions[ind][subInd].push({ field: '', logic: '', val: '' })
        return prv
      })
    }
  }

  const setValue = (val, lgcInd) => {
    setDataConf(prvSt => {
      const prv = deepCopy(prvSt)
      prv[reportInd].details.conditions[lgcInd].val = val
      return prv
    })
  }

  return (
    <div style={{ width: 800 }}>
      <div>
        {
          dataConf[reportInd]?.details?.conditions?.map((logic, ind) => (
            <span key={`logic-${ind + 44}`}>
              {typeof logic === 'object' && !Array.isArray(logic) && <LogicBlock fieldVal={logic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={logic.logic} changeLogic={changeLogic} delLogic={delLogic} lgcInd={ind} value={logic.val} formFields={formFields} setValue={setValue} />}
              {typeof logic === 'string' && <LogicChip logic={logic} onChange={e => changeLogicChip(e.target.value, ind)} className="logic-chip-custom" />}
              {Array.isArray(logic) && (
                <div className="p-2 pl-6 br-10 btcd-logic-grp">

                  {logic.map((subLogic, subInd) => (
                    <span key={`subLogic-${subInd * 7}`}>
                      {typeof subLogic === 'object' && !Array.isArray(subLogic) && <LogicBlock fieldVal={subLogic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={subLogic.logic} changeLogic={changeLogic} delLogic={delLogic} lgcInd={ind} subLgcInd={subInd} value={subLogic.val} formFields={formFields} setValue={setValue} />}
                      {typeof subLogic === 'string' && <LogicChip logic={subLogic} nested onChange={e => changeLogicChip(e.target.value, ind, subInd)} className="logic-chip-custom" />}
                      {Array.isArray(subLogic) && (
                        <div className="p-2 pl-6 br-10 btcd-logic-grp">

                          {subLogic.map((subSubLogic, subSubLgcInd) => (
                            <span key={`subsubLogic-${subSubLgcInd + 90}`}>
                              {typeof subSubLogic === 'object' && !Array.isArray(subSubLogic) && <LogicBlock fieldVal={subSubLogic.field} changeFormField={changeFormField} changeValue={changeValue} logicValue={subSubLogic.logic} changeLogic={changeLogic} delLogic={delLogic} lgcInd={ind} subLgcInd={subInd} subSubLgcInd={subSubLgcInd} value={subSubLogic.val} formFields={formFields} setValue={setValue} />}
                              {typeof subSubLogic === 'string' && <LogicChip logic={subSubLogic} nested onChange={e => changeLogicChip(e.target.value, ind, subInd, subSubLgcInd)} className="logic-chip-custom" />}
                            </span>
                          ))}
                          <div className="btcd-workFlows-btns">
                            <div className="flx">
                              <Button icn className="blue"><CloseIcn size="14" className="icn-rotate-45" /></Button>
                              <Button onClick={() => addSubSubLogic('and', ind, subInd)} className="blue ml-2">
                                <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                                AND
                                {' '}
                              </Button>
                              <Button onClick={() => addSubSubLogic('or', ind, subInd)} className="blue ml-2">
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
                      <Button onClick={() => addSubLogic('and', ind)} className="gray ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        AND
                      </Button>
                      <Button onClick={() => addSubLogic('or', ind)} className="gray ml-2">
                        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
                        OR
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </span>
          ))
        }
      </div>

      <div className="btcd-workFlows-btns">
        <div className="flx">
          <Button onClick={() => addLogic('and')} className="blue ml-2">
            <CloseIcn size="10" className="icn-rotate-45 mr-1" />
            AND
          </Button>
          <Button onClick={() => addLogic('or')} className="blue ml-2">
            <CloseIcn size="10" className="icn-rotate-45 mr-1" />
            OR
          </Button>
        </div>
      </div>

    </div>
  )
}

export default ConditionalLogic
