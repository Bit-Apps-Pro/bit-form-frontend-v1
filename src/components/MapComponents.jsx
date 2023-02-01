import { memo } from 'react'
import ReCaptcha from './Fields/Recaptcha'
import TextField from './Fields/TextField'
import TextArea from './Fields/TextArea'
import CheckBox from './Fields/CheckBox'
import DecisionBox from './Fields/DecisionBox'
import Html from './Fields/Html'
import RadioBox from './Fields/RadioBox'
import DropDown from './Fields/DropDown'
import FileUp from './Fields/FileUp'
import HiddenField from './Fields/HiddenField'
import SubmitBtn from './Fields/SubmitBtn'
import Button from './Fields/Button'
import Paypal from './Fields/Paypal'
import RazorPay from './Fields/RazorPay'
// import NewDropDown from './Fields/NewDropDown'
/*
typ: input type
lbl: label
cls: class
ph: placeholder
mn: min
mx: mix
val: default value
ac: autocomplete on/off
req: required
mul: multiple
*/

function MapComponents(props) {
  switch (props?.atts?.typ) {
    case 'text':
    case 'number':
    case 'password':
    case 'username':
    case 'email':
    case 'url':
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week':
    case 'color':
      return <TextField fieldKey={props.fieldKey} formID={props.formID} attr={props.atts} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    case 'textarea':
      return <TextArea fieldKey={props.fieldKey} formID={props.formID} attr={props.atts} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    case 'check':
      return <CheckBox formID={props.formID} attr={props.atts} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    case 'radio':
      return <RadioBox formID={props.formID} attr={props.atts} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    case 'select':
      return <DropDown isBuilder={props.isBuilder} formID={props.formID} attr={props.atts} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    // case 'dropdown':
    //   return <NewDropDown isBuilder={props.isBuilder} formID={props.formID} attr={props.atts} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    case 'file-up':
      return <FileUp formID={props.formID} attr={props.atts} entryID={props.entryID} resetFieldValue={props.resetFieldValue} />
    case 'submit':
      return <SubmitBtn formID={props.formID} attr={props.atts} buttonDisabled={props.buttonDisabled} handleReset={props.handleReset} />
    case 'hidden':
      return <HiddenField formID={props.formID} attr={props.atts} />
    case 'recaptcha':
      return <ReCaptcha formID={props.formID} attr={props.atts} />
    case 'decision-box':
      return <DecisionBox formID={props.formID} attr={props.atts} fieldData={props.fieldData} onBlurHandler={props.onBlurHandler} resetFieldValue={props.resetFieldValue} />
    case 'html':
      return <Html formID={props.formID} attr={props.atts} fieldData={props.fieldData} resetFieldValue={props.resetFieldValue} />
    case 'button':
      return <Button formID={props.formID} attr={props.atts} fieldData={props.fieldData} buttonDisabled={props.buttonDisabled} handleReset={props.handleReset} />
    case 'paypal':
      return <Paypal isBuilder={props.isBuilder} fieldKey={props.fieldKey} formID={props.formID} attr={props.atts} contentID={props.contentID} fieldData={props.fieldData} resetFieldValue={props.resetFieldValue} handleFormValidationErrorMessages={props.handleFormValidationErrorMessages} />
    case 'razorpay':
      return <RazorPay fieldKey={props.fieldKey} contentID={props.contentID} formID={props.formID} attr={props.atts} buttonDisabled={props.buttonDisabled} resetFieldValue={props.resetFieldValue} handleFormValidationErrorMessages={props.handleFormValidationErrorMessages} />
    case 'blank':
      return <div className="blnk-blk drag" />
    default:
      break
  }
  return <div>Loading</div>
}

export default memo(MapComponents)
