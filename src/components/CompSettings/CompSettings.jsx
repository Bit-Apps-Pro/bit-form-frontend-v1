import { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Link, NavLink, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { __ } from '../../Utils/i18nwrap'
import BrushIcn from '../../Icons/BrushIcn'
import CheckBoxIcn from '../../Icons/CheckBoxIcn'
import ColorPickerIcn from '../../Icons/ColorPickerIcn'
import DateIcn from '../../Icons/DateIcn'
import DateTimeIcn from '../../Icons/DateTimeIcn'
import DecisionBoxIcn from '../../Icons/DecisionBoxIcn'
import CodeSnippetIcn from '../../Icons/CodeSnippetIcn'
import DropDownIcn from '../../Icons/DropDownIcn'
import FieldIcn from '../../Icons/FieldIcn'
import FileUploadIcn from '../../Icons/FileUploadIcn'
import FormIcn from '../../Icons/FormIcn'
import ImageIcn from '../../Icons/ImageIcn'
import ItemBlockIcn from '../../Icons/ItemBlockIcn'
import MailIcn from '../../Icons/MailIcn'
import MonthIcn from '../../Icons/MonthIcn'
import NumberIcn from '../../Icons/NumberIcn'
import PasswordIcn from '../../Icons/PasswordIcn'
import PaypalIcn from '../../Icons/PaypalIcn'
import RadioIcn from '../../Icons/RadioIcn'
import RazorPayIcn from '../../Icons/RazorPayIcn'
import ReCaptchaIcn from '../../Icons/ReCaptchaIcn'
import TextareaIcn from '../../Icons/TextareaIcn'
import TextIcn from '../../Icons/TextIcn'
import UserIcn from '../../Icons/UserIcn'
import TimeIcn from '../../Icons/TimeIcn'
import UrlIcn from '../../Icons/UrlIcn'
import WeekIcn from '../../Icons/WeekIcn'
import DecisionBoxSettings from './DecisionBoxSettings'
import HtmlFieldSettings from './HtmlFieldSettings'
import ButtonSettings from './ButtonSettings'
import FileUpSettings from './FileUpSettings'
import PaypalSettings from './PaypalSettings'
import RadioCheckSettings from './RadioCheckSettings'
import RazorpaySettings from './RazorpaySettings'
import ReCaptchaSettigns from './ReCaptchaSettigns'
import SelectSettings from './SelectSettings'
import DropdownStyleEditors from './StyleCustomize/DropdownStyleEditors'
import PaypalStyleEditor from './StyleCustomize/PaypalStyleEditor'
import StyleEditor from './StyleCustomize/StyleEditor'
import styleEditorConfig from './StyleCustomize/StyleEditorConfig'
import TextFieldSettings from './TextFieldSettings'
import BtnIcn from '../../Icons/BtnIcn'
import { $fields, $selectedFieldId } from '../../GlobalStates'
import BackIcn from '../../Icons/BackIcn'

function CompSettings({ style, styleDispatch, brkPoint, setResponsiveView }) {
  const { path } = useRouteMatch()
  const { formType, formID } = useParams()
  const [scrollTopShadow, setScrollTopShadow] = useState(false)

  const TabLink = ({ title, sub, icn, link }) => (
    <NavLink to={`/form/builder/${formType}/${formID}/${link}`} activeClassName="s-t-l-active" className="btcd-s-tab-link active flx w-5 ">
      {typeof icn === 'string' ? <span className={`btcd-icn icn-${icn} mr-2`} /> : icn}
      <div className="d-in-b">
        <div className="title">{title}</div>
        <div className="sub">{sub}</div>
      </div>
    </NavLink>
  )

  const onSettingScroll = ({ target: { scrollTop } }) => {
    scrollTop > 20 ? setScrollTopShadow(true) : setScrollTopShadow(false)
  }

  return (
    <div className="elm-settings">
      <div className="elm-settings-title pos-rel flx" style={{ ...scrollTopShadow && { boxShadow: '0 0px 16px 2px #b0b7d8' } }}>
        <TabLink title={__('Field', 'bitform')} sub={__('Settings', 'bitform')} icn="settings" link="fs" />
        <TabLink title={__('Style', 'bitform')} sub={__('Customize', 'bitform')} icn={<i className="mr-2"><BrushIcn height="22" width="22" /></i>} link="style" />
      </div>
      <div className="btcd-hr" />
      <div className="settings">
        <Scrollbars onScroll={onSettingScroll} autoHide>
          <Switch>
            <Route path={`${path}/fs`}><RenderSettings /></Route>

            <Route exact path={`${path}/style`}>
              <Link to={`/form/builder/${formType}/${formID}/style/bg`}>
                <FieldOptionBtn icn={<ImageIcn w="20" />} title={__('Background Customize', 'bitform')} />
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/f`}>
                <FieldOptionBtn icn={<FormIcn w="20" />} title={__('Form Customize', 'bitform')} />
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/fb`}>
                <FieldOptionBtn icn={<ItemBlockIcn w="20" />} title={__('Field Block Customize', 'bitform')} />
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/fl`}>
                <FieldOptionBtn icn={<FieldIcn w="20" />} title={__('Field Customize', 'bitform')} />
              </Link>
            </Route>
            <Route path={`${path}/style/bg`}>
              <StyleEditor editorLabel={__('Form Background', 'bitform')} compStyle={style} cls={`._frm-bg-${formID}`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.formbg} formID={formID} />
            </Route>
            <Route path={`${path}/style/f`}>
              <StyleEditor editorLabel={__('Form style', 'bitform')} compStyle={style} cls={`._frm-${formID}`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.form} formID={formID} />
            </Route>
            <Route path={`${path}/style/fb`}>
              <StyleEditor editorLabel={__('Field Block', 'bitform')} compStyle={style} cls={`.fld-wrp-${formID}`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.field_block} formID={formID} />
            </Route>
            <Route exact path={`${path}/style/fl`}>
              <Link to={`/form/builder/${formType}/${formID}/style`}>
                <h4 className="w-9 mt-2 m-a flx txt-dp">
                  <button className="icn-btn" type="button" aria-label="back btn">
                    <BackIcn />
                  </button>
                  <div className="flx w-10">
                    <span>{__('Back', 'bitform')}</span>
                    <div className="txt-center w-10 f-5">{__('Field Customize', 'bitform')}</div>
                  </div>
                </h4>
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/fl/fld`}>
                <FieldOptionBtn icn={<FieldIcn w="20" />} title={__('Field Style', 'bitform')} />
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/fl/dpd`}>
                <FieldOptionBtn icn={<DropDownIcn w="20" />} title="Dropdown Style" />
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/fl/ppl`}>
                <FieldOptionBtn icn={<PaypalIcn w="20" />} title={__('Paypal Style', 'bitform')} />
              </Link>
              <Link to={`/form/builder/${formType}/${formID}/style/fl/btn`}>
                <FieldOptionBtn icn={<BtnIcn size="24" />} title="Button Style" />
              </Link>
            </Route>
            <Route path={`${path}/style/fl/fld`}>
              <StyleEditor editorLabel={__('Field Style', 'bitform')} title={__('Label Style', 'bitform')} compStyle={style} cls={`.fld-lbl-${formID}`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.field_label} formID={formID} />
              <StyleEditor title={__('Field Style', 'bitform')} noBack compStyle={style} cls={`input.fld-${formID},textarea.fld-${formID}`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.field} formID={formID} />
            </Route>
            <Route path={`${path}/style/fl/ppl`}>
              <PaypalStyleEditor />
            </Route>
            <Route path={`${path}/style/fl/dpd`}>
              <DropdownStyleEditors
                editorLabel="Dropdown Style"
                {...{ style, styleDispatch, brkPoint, setResponsiveView, styleEditorConfig, formID }}
              />
            </Route>
            <Route path={`${path}/style/fl/btn`}>
              <StyleEditor
                title={`${__('Button Style', 'bitform')}`}
                noBack
                compStyle={style}
                cls=".btcd-sub-btn"
                styleDispatch={styleDispatch}
                brkPoint={brkPoint}
                setResponsiveView={setResponsiveView}
                styleConfig={styleEditorConfig.button}
                formID={formID}
              />
            </Route>
          </Switch>
          <div className="mb-50" />
        </Scrollbars>
      </div>
    </div>
  )
}
export default CompSettings

const RenderSettings = () => {
  const fields = useRecoilValue($fields)
  const selectedFieldId = useRecoilValue($selectedFieldId)
  const seletedFieldType = fields?.[selectedFieldId]?.typ
  switch (seletedFieldType) {
    case 'text':
    case 'username':
    case 'number':
    case 'password':
    case 'email':
    case 'url':
    case 'textarea':
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week':
    case 'color':
      return <TextFieldSettings />
    case 'check':
    case 'radio':
      return <RadioCheckSettings />
    case 'select':
    case 'dropdown':
      return <SelectSettings />
    case 'file-up':
      return <FileUpSettings />
    case 'recaptcha':
      return <ReCaptchaSettigns />
    case 'decision-box':
      return <DecisionBoxSettings />
    case 'html':
      return <HtmlFieldSettings />
    case 'button':
      return <ButtonSettings />
    case 'paypal':
      return <PaypalSettings />
    case 'razorpay':
      return <RazorpaySettings />
    default:
      return <FieldList />
  }
}

function FieldList() {
  const fields = useRecoilValue($fields)
  const setSelectedFieldId = useSetRecoilState($selectedFieldId)
  const arr = []
  for (const fld in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, fld)) {
      // eslint-disable-next-line prefer-const
      let { typ, lbl, adminLbl } = fields[fld]
      if (fields[fld].typ === 'decision-box') {
        lbl = fields[fld].adminLbl
      }
      arr.push(
        <FieldOptionBtn key={fld} icn={fields[fld].typ} title={lbl || adminLbl || typ} sub={fld} action={() => setSelectedFieldId(fld)} />,
      )
    }
  }
  return arr
}

const FieldIcon = icn => {
  switch (icn) {
    case 'text':
      return <TextIcn size="23" />
    case 'username':
      return <UserIcn size="23" />
    case 'textarea':
      return <TextareaIcn size="23" />
    case 'check':
      return <CheckBoxIcn w="23" />
    case 'radio':
      return <RadioIcn size="23" />
    case 'number':
      return <NumberIcn w="23" />
    case 'select':
      return <DropDownIcn w="23" />
    case 'password':
      return <PasswordIcn size="23" />
    case 'email':
      return <MailIcn size="23" />
    case 'url':
      return <UrlIcn w="23" />
    case 'file-up':
      return <FileUploadIcn w="23" />
    case 'date':
      return <DateIcn w="23" />
    case 'time':
      return <TimeIcn size="23" />
    case 'datetime-local':
      return <DateTimeIcn w="23" />
    case 'month':
      return <MonthIcn w="23" />
    case 'week':
      return <WeekIcn size="23" />
    case 'color':
      return <ColorPickerIcn w="23" />
    case 'recaptcha':
      return <ReCaptchaIcn size="23" />
    case 'decision-box':
      return <DecisionBoxIcn size="23" />
    case 'button':
      return <BtnIcn size="26" />
    case 'html':
      return <CodeSnippetIcn size="23" />
    case 'paypal':
      return <PaypalIcn w="23" />
    case 'razorpay':
      return <RazorPayIcn w="17" h="23" />
    default:
      return false
  }
}

function FieldOptionBtn({ icn, title, sub, action }) {
  const extraProps = {}
  if (action !== undefined) {
    extraProps.role = 'button'
    extraProps.tabIndex = 0
    extraProps.onKeyPress = action
    extraProps.onClick = action
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="btc-s-l mt-2" {...extraProps}>
      <div className="flx flx-between ">
        <div className="flx w-9">
          <span className="lft-icn mr-2 btcd-icn-lg flx br-50">
            {typeof icn === 'string' ? FieldIcon(icn) : icn}
          </span>
          <div className="w-nwrp o-h">
            <div className="txt-o o-h mb-1">{title}</div>
            {sub && (
              <small>
                {__('Key:', 'bitform')}
                {` ${sub}`}
              </small>
            )}
          </div>
        </div>
        <span className="btcd-icn icn-chevron-right btc-icn-md" />
      </div>
    </div>
  )
}
