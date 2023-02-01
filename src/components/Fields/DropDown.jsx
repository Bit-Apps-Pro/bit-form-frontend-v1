/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, memo } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import InputWrapper from '../InputWrapper'

function DropDown({ attr, onBlurHandler, resetFieldValue, formID, isBuilder }) {
  let defaultValue
  if ('val' in attr && attr.val && attr.val.length > 0) {
    if (typeof attr.val === 'string') {
      if (attr.val[0] === '[') {
        defaultValue = JSON.parse(attr.val)
      } else {
        defaultValue = attr.val.split(',')
      }
    } else if (Array.isArray(attr.val)) {
      if (attr.val.length > 0) {
        defaultValue = attr.val.filter(option => option)
      } else {
        defaultValue = []
      }
    }
  } else {
    defaultValue = []
  }

  const [value, setvalue] = useState(defaultValue || [])

  useEffect(() => {
    if (!isBuilder && defaultValue && !attr.userinput && JSON.stringify(value) !== JSON.stringify(defaultValue)) {
      setvalue(defaultValue)
    } else if (defaultValue && attr.conditional) {
      setvalue(defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr.val, attr.userinput, attr.conditional, defaultValue, value])

  useEffect(() => {
    if (resetFieldValue) {
      setvalue([])
    }
  }, [resetFieldValue])

  useEffect(() => {
    if (attr.hasWorkflow && JSON.stringify(defaultValue) === JSON.stringify(value) && onBlurHandler && !attr.userinput) {
      const eventLikeData = { name: 'mul' in attr ? `${attr.name}` : attr.name, value, type: 'dropdown', multiple: 'mul' in attr && attr.mul }
      onBlurHandler(eventLikeData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onChangeHandler = (event) => {
    let val = []
    if (event && event.target && event.target.multiple && value) {
      const selectedValue = []
      event.target.childNodes.forEach((option => { option.selected && option.value && selectedValue.push(option.value) }))
      val = [...selectedValue]
    } else {
      if (onBlurHandler) {
        const eventLikeData = { name: 'mul' in attr ? `${attr.name}` : attr.name, value: event.split(','), type: 'dropdown', multiple: 'mul' in attr && attr.mul, userinput: true }
        onBlurHandler(eventLikeData)
      }
      val = event.split(',')
    }

    if (!attr.valid.disableOnMax || (attr.valid.disableOnMax && val.length <= Number(attr.mx))) {
      setvalue(val)
    }
  }

  const getOptions = () => {
    const opt = []
    attr.opt.map(option => {
      if (option.lbl) {
        opt.push({ label: option.lbl, value: option.lbl })
        if (option.prefix_img) {
          opt.push({
            ...option,
            title: (option.label || option.lbl),
            label: (
              <div>
                <img src="http://bitcode.io/wp-content/plugins/BitForm/static/countries/af.png" alt="" />
                {option.label || option.lbl}
              </div>),
          })
        }
      } else if (option.prefix_img) {
        let assetsURL = ''
        if (typeof bits === 'undefined' && typeof bitFormsFront !== 'undefined') {
          // eslint-disable-next-line no-undef
          assetsURL = bitFormsFront.assetUrl
        } else {
          // eslint-disable-next-line no-undef
          assetsURL = bits.assetsURL
        }
        opt.push({
          ...option,
          title: (option.label || option.lbl),
          label: (
            <div className="btcd-flx">
              <img className="dpd-prefix" src={`${assetsURL}${option.prefix_img}`} alt={option.label} />
              {option.label || option.lbl}
            </div>),
        })
      } else {
        opt.push(option)
      }
    })
    return opt
  }

  return (
    <InputWrapper
      formID={formID}
      fieldKey={attr.name}
      fieldData={attr}
    >
      <MultiSelect
        className={`fld fld-${formID} dpd no-drg`}
        {...'req' in attr.valid && { required: attr.valid.req }}
        {...'disabled' in attr.valid && { disabled: attr.valid.disabled }}
        {...'ph' in attr && { placeholder: attr.ph }}
        {...'name' in attr && { name: 'mul' in attr ? `${attr.name}` : attr.name }}
        // {...'val' in attr && attr.val.length > 0 && { defaultValue: typeof attr.val === 'string' && attr.val.length > 0 && attr.val[0] === '[' ? JSON.parse(attr.val) : attr.val !== undefined && attr.val.split(',') }}
        singleSelect={!attr.mul}
        customValue={attr.customOpt}
        options={getOptions()}
        onChange={onChangeHandler}
        defaultValue={value}
      />
    </InputWrapper>
  )
}

export default memo(DropDown)
