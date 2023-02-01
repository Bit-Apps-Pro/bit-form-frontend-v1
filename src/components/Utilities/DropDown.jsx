import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'

function DropDown({ options, placeholder, action, className, isMultiple, allowCustomOpt, value, addable, titleClassName, title, jsonValue }) {
  const [val, setVal] = useState(value)
  useEffect(() => {
    setVal('')

    setTimeout(() => {
      setVal(value)
    }, 1)
  }, [value, options, jsonValue])

  return (
    <div className={`${titleClassName}`}>
      <span>{title}</span>
      <MultiSelect
        width="100%"
        defaultValue={val}
        className={`btcd-paper-drpdwn msl-wrp-options ${className}`}
        onChange={action}
        singleSelect={!isMultiple}
        customValue={allowCustomOpt || addable}
        placeholder={placeholder}
        jsonValue={jsonValue}
        options={options || []}
      />
    </div>
  )
}

export default (DropDown)
