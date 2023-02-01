/* eslint-disable no-useless-escape */
/* eslint-disable object-property-newline */
/* eslint-disable no-undef */

import { memo, useMemo } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { __ } from '../../Utils/i18nwrap'
import CheckBoxIcn from '../../Icons/CheckBoxIcn'
import DateIcn from '../../Icons/DateIcn'
import DateTimeIcn from '../../Icons/DateTimeIcn'
import DropDownIcn from '../../Icons/DropDownIcn'
import FileUploadIcn from '../../Icons/FileUploadIcn'
import MailIcn from '../../Icons/MailIcn'
import MonthIcn from '../../Icons/MonthIcn'
import NumberIcn from '../../Icons/NumberIcn'
import PasswordIcn from '../../Icons/PasswordIcn'
import PaypalIcn from '../../Icons/PaypalIcn'
import RadioIcn from '../../Icons/RadioIcn'
import TextareaIcn from '../../Icons/TextareaIcn'
import TextIcn from '../../Icons/TextIcn'
import UserIcn from '../../Icons/UserIcn'
import WeekIcn from '../../Icons/WeekIcn'
import TimeIcn from '../../Icons/TimeIcn'
import UrlIcn from '../../Icons/UrlIcn'
import Tools from './Tools'
import ColorPickerIcn from '../../Icons/ColorPickerIcn'
import ReCaptchaIcn from '../../Icons/ReCaptchaIcn'
import DecisionBoxIcn from '../../Icons/DecisionBoxIcn'
import CodeSnippetIcn from '../../Icons/CodeSnippetIcn'
import RazorPayIcn from '../../Icons/RazorPayIcn'
import BtnIcn from '../../Icons/BtnIcn'
import countries from '../../Utils/StaticData/countries.json'
import FlagIcn from '../../Icons/FlagIcn'

function Toolbar({ tolbarSiz, setNewData, setTolbar }) {
  const tools = [
    {
      name: __('Text', 'bitform'),
      icn: <TextIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'text',
        lbl: __('Text Field', 'bitform'),
        ph: __('Placeholder Text...', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('User Name', 'bitform'),
      icn: <UserIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'username',
        lbl: __('User Name', 'bitform'),
        ph: __('Placeholder Text...', 'bitform'),
        valid: {},
        err: { entryUnique: { dflt: 'That User Name is taken. Try another.', show: true } },
      },
    },
    {
      name: __('Multiline Text', 'bitform'),
      icn: <TextareaIcn size="23" />,
      pos: { h: 3, w: 6, i: 'block-5', minH: 3 },
      elm: {
        typ: 'textarea',
        lbl: __('Multi-Line Text', 'bitform'),
        ph: __('Placeholder Text...', 'bitform'),
        valid: {},
        err: {},
      },
    },
    /* {
      name: 'Blank Block',
      icn: blank,
      pos: { h: 2, w: 3, i: 'block-5' },
      elm: {
        typ: 'blank',
      },
    }, */
    {
      name: __('Check Box', 'bitform'),
      icn: <CheckBoxIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2 },
      elm: {
        typ: 'check',
        lbl: __('Check Boxs', 'bitform'),
        opt: [
          { lbl: __('Option 1', 'bitform') },
          { lbl: __('Option 2', 'bitform') },
          { lbl: __('Option 3', 'bitform') },
        ],
        valid: {},
        err: {},
      },
    },
    {
      name: __('Radio Button', 'bitform'),
      icn: <RadioIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2 },
      elm: {
        typ: 'radio',
        lbl: __('Radio', 'bitform'),
        round: true,
        opt: [
          { lbl: __('Option 1', 'bitform') },
          { lbl: __('Option 2', 'bitform') },
          { lbl: __('Option 3', 'bitform') },
        ],
        valid: {},
        err: {},
      },
    },
    {
      name: __('Number', 'bitform'),
      icn: <NumberIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'number',
        lbl: __('Number Field', 'bitform'),
        ph: __('Number Input', 'bitform'),
        valid: {},
        err: { invalid: { dflt: 'Number is invalid', show: true } },
      },
    },
    {
      name: __('Dropdown', 'bitform'),
      icn: <DropDownIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2 },
      elm: {
        typ: 'select',
        lbl: __('Drop-Down', 'bitform'),
        mul: false,
        opt: [
          { label: 'Option 1', value: 'Option 1' },
          { label: 'Option 2', value: 'Option 2' },
          { label: 'Option 3', value: 'Option 3' },
        ],
        valid: {},
        err: {},
      },
    },
    {
      name: __('Country', 'bitform'),
      icn: <FlagIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2 },
      elm: {
        typ: 'select',
        lbl: __('Select Country', 'bitform'),
        mul: false,
        opt: countries,
        valid: {},
      },
    },
    {
      name: __('Password', 'bitform'),
      icn: <PasswordIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'password',
        lbl: __('Password Field', 'bitform'),
        ph: __('Placeholder...', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('Email', 'bitform'),
      icn: <MailIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'email',
        lbl: __('Email Field', 'bitform'),
        ph: __('example@mail.com', 'bitform'),
        pattern: '^[^$_bf_$s@]+@[^$_bf_$s@]+$_bf_$.[^$_bf_$s@]+$',
        valid: {},
        err: { invalid: { dflt: 'Email is invalid', show: true } },
      },
    },
    {
      name: __('URL', 'bitform'),
      icn: <UrlIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'url',
        attr: {
          title: 'https://www.example.com  or  www.example.com',
          // eslint-disable-next-line max-len
          pattern: '^(?:(?:https?|ftp):$_bf_$/$_bf_$/)?(?:(?!(?:10|127)(?:$_bf_$.$_bf_$d{1,3}){3})(?!(?:169$_bf_$.254|192$_bf_$.168)(?:$_bf_$.$_bf_$d{1,3}){2})(?!172$_bf_$.(?:1[6-9]|2$_bf_$d|3[0-1])(?:$_bf_$.$_bf_$d{1,3}){2})(?:[1-9]$_bf_$d?|1$_bf_$d$_bf_$d|2[01]$_bf_$d|22[0-3])(?:$_bf_$.(?:1?$_bf_$d{1,2}|2[0-4]$_bf_$d|25[0-5])){2}(?:$_bf_$.(?:[1-9]$_bf_$d?|1$_bf_$d$_bf_$d|2[0-4]$_bf_$d|25[0-4]))|(?:(?:[a-z$_bf_$u00a1-$_bf_$uffff0-9]-*)*[a-z$_bf_$u00a1-$_bf_$uffff0-9]+)(?:$_bf_$.(?:[a-z$_bf_$u00a1-$_bf_$uffff0-9]-*)*[a-z$_bf_$u00a1-$_bf_$uffff0-9]+)*(?:$_bf_$.(?:[a-z$_bf_$u00a1-$_bf_$uffff]{2,})))(?::$_bf_$d{2,5})?(?:$_bf_$/$_bf_$S*)?$',
        },
        lbl: __('URL Field', 'bitform'),
        ph: __('https://www.example.com', 'bitform'),
        valid: {},
        err: { invalid: { dflt: 'URL is invalid', show: true } },
      },
    },
    {
      name: __('File Upload', 'bitform'),
      icn: <FileUploadIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2, minW: 2 },
      elm: {
        typ: 'file-up',
        lbl: __('File Upload', 'bitform'),
        upBtnTxt: 'Attach File',
        valid: {},
        err: {},
      },
    },
    {
      name: __('Date', 'bitform'),
      icn: <DateIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'date',
        lbl: __('Date Input', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('Time', 'bitform'),
      icn: <TimeIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'time',
        lbl: __('Time Input', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('Date-Time', 'bitform'),
      icn: <DateTimeIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'datetime-local',
        lbl: __('Date-Time Input', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('Month', 'bitform'),
      icn: <MonthIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'month',
        lbl: __('Month Input', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('Week', 'bitform'),
      icn: <WeekIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'week',
        lbl: __('Week Input', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('Color Picker', 'bitform'),
      icn: <ColorPickerIcn w="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2 },
      elm: {
        typ: 'color',
        lbl: __('Color Picker', 'bitform'),
        valid: {},
        err: {},
      },
    },
    {
      name: __('reCaptcha v2', 'bitform'),
      icn: <ReCaptchaIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', maxH: 2, minH: 2, minW: 2 },
      elm: {
        typ: 'recaptcha',
        theme: 'light',
        lbl: __('ReCaptcha', 'bitform'),
        valid: {},
      },
    },
    {
      name: __('Decision Box', 'bitform'),
      icn: <DecisionBoxIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 1 },
      elm: {
        typ: 'decision-box',
        adminLbl: __('Decision Box', 'bitform'),
        lbl: `<p><span style="font-size: 12pt">${__('Decision Box', 'bitform')}</span></p>`,
        msg: {
          checked: 'Accepted',
          unchecked: 'Not Accepted',
        },
        valid: { req: true },
        err: { req: { dflt: 'This field is required', show: true } },
      },
    },
    {
      name: 'HTML',
      icn: <CodeSnippetIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk' },
      elm: {
        typ: 'html',
        lbl: 'HTML Content',
        content: '<b>Html Field</b><p><span style="font-size: 12pt">Add html content on editor</span></p>',
        valid: {},
      },
    },
    {
      name: 'Button',
      icn: <BtnIcn size="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2, maxH: 2 },
      elm: {
        typ: 'button',
        btnTyp: 'button',
        btnSiz: 'md',
        txt: __('Button'),
        icn: {
          pos: '',
          url: '',
        },
        valid: {},
      },
    },
    {
      name: __('Paypal', 'bitform'),
      icn: <PaypalIcn w="23" />,
      pos: { h: 5, w: 6, i: 'n_blk', minH: 3, maxH: 7, minW: 2 },
      elm: {
        typ: 'paypal',
        currency: 'USD',
        lbl: __('PayPal', 'bitform'),
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        },
        valid: {},
      },
    },
    {
      name: __('Razorpay', 'bitform'),
      icn: <RazorPayIcn w="17" h="23" />,
      pos: { h: 2, w: 6, i: 'n_blk', minH: 2, maxH: 7, minW: 2 },
      elm: {
        typ: 'razorpay',
        lbl: __('Razorpay', 'bitform'),
        btnSiz: 'md',
        fulW: false,
        align: 'left',
        btnTxt: 'Pay with Razorpay',
        options: {
          currency: 'INR',
          theme: {},
          modal: {},
          prefill: {},
          notes: {},
        },
        valid: {},
      },
    },
  ]

  const FIELDS_EXTRA_ATTR = {
    paypal: { pro: true, onlyOne: true, checkDefaultConfig: true },
    razorpay: { pro: true, onlyOne: true, checkDefaultConfig: true },
    recaptcha: { onlyOne: true },
  }

  return (
    <div className="toolBar-wrp" style={{ width: tolbarSiz && 58 }}>
      <div className="btcd-toolbar-title">
        {!tolbarSiz && 'Tool Bar'}
        <button className="icn-btn" onClick={setTolbar} type="button" aria-label="Toggle Toolbar"><span className={`btcd-icn icn-${tolbarSiz ? 'chevron-right' : 'chevron-left'}`} /></button>
      </div>
      {useMemo(() => (
        <Scrollbars autoHide style={{ maxWidth: 400 }}>
          <div className="toolBar">
            {tools.map(tool => (
              <Tools key={tool.name} setNewData={setNewData} value={{ fieldData: tool.elm, fieldSize: tool.pos }}>
                <span className="mr-1">{tool.icn}</span>
                {!tolbarSiz && tool.name}
              </Tools>
            ))}
          </div>
        </Scrollbars>
        // eslint-disable-next-line react-hooks/exhaustive-deps
      ), [tolbarSiz])}
    </div>
  )
}
export default memo(Toolbar)
