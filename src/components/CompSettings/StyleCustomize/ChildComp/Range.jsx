import { useState } from 'react'

Range.defaultProps = {
  unit: '',
  master: true,
  minRange: 0,
  step: 1,
}

export default function Range({ className, value, step, onChange, maxRange, minRange, info, unit, master }) {
  // eslint-disable-next-line no-param-reassign
  value = value.replace(/px|em|rem|!important|%/g, '').split(' ')
  const [masterRangeVal, setmasterRangeVal] = useState(value.reduce((total, num) => num - total) === 0 ? value[0] : '')
  const handleVal = (v, ind) => {
    // eslint-disable-next-line no-param-reassign
    value[ind] = v
    onChange(value.join(`${unit} `) + unit)
    setmasterRangeVal('')
  }

  const handleMaster = e => {
    value.fill(e.target.value)
    onChange(value.join(`${unit} `) + unit)
    setmasterRangeVal(e.target.value)
  }

  const parseNumber = (num) => {
    if (step && parseFloat(step) % 1 !== 0) {
      return parseFloat(num).toFixed(2)
    }
    return parseInt(num, 10)
  }

  return (
    <div className={className}>
      {value && master && (
        <RSlider
          step={step}
          icn={info[info.length - 1].icn}
          lbl={info[info.length - 1].lbl}
          action={handleMaster}
          rVal={parseNumber(masterRangeVal)}
          unit={unit}
          max={maxRange}
          min={minRange}
          parseNumber={parseNumber}
        />
      )}
      {value && value.length > 0 && value.map((itm, i) => (
        <RSlider
          key={info[i].lbl}
          icn={info[i].icn}
          lbl={info[i].lbl}
          action={e => handleVal(e.target.value, i)}
          rVal={parseNumber(itm)}
          unit={unit}
          max={maxRange}
          min={minRange}
          parseNumber={parseNumber}
          step={step}
        />
      ))}
    </div>
  )
}

const RSlider = ({ icn, lbl, action, rVal, unit, max, min, parseNumber, step }) => (
  <div className="flx flx-between mt-1 inp-grp">
    <span className="icn tooltip pos-rel br-50 flx mr-1" style={{ '--tooltip-txt': `"${lbl}"`, '--tt-left': '100%' }}>{icn}</span>
    <input step={step} title={`${lbl} ${rVal} ${unit}`} onChange={action} className="btc-range mr-1" type="range" min={min} max={max} value={rVal} />
    <input step={step} onChange={action} className="ml-1" type="number" placeholder="auto" value={parseNumber(rVal)} min="0" />
  </div>
)
