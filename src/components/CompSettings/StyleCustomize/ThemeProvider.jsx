export const defaultTheme = (formId) => ({
  [`._frm-bg-${formId}`]: {
    'border-radius': '10px 10px 10px 10px',
    'background-size': '100% 100%',
    'background-color': 'rgba(255, 255, 255, 1)',
  },
  [`._frm-g-${formId}`]: {},
  [`._frm-${formId}`]: {
    margin: '0px 0px 0px 0px',
    padding: '15px 15px 15px 15px',
  },
  [`.fld-wrp-${formId}`]: { padding: '10px 10px 10px 10px' },
  [`.fld-lbl-${formId}`]: {
    'font-size': '16px',
    color: 'rgba(42, 49, 99, 1)!important',
    'line-height': '1.4!important',
  },
  [`input.fld-${formId},textarea.fld-${formId}`]: {
    'background-color': 'rgba(0, 0, 0, 0)!important',
    'border-color': 'rgba(199, 212, 221, 1)!important',
    'border-radius': '6px 6px 6px 6px!important',
    'border-style': 'solid!important',
    'border-width': '1px 1px 1px 1px!important',
    'font-size': '15px!important',
    color: 'rgba(0, 0, 0, 1)!important',
    margin: '5px 0 0 0!important',
    padding: '10px 8px 10px 8px!important',
    'line-height': '1.4!important',
  },
  [`input.fld-${formId}:focus,textarea.fld-${formId}:focus`]: {
    'box-shadow': '0px 0px 0px 3px rgba(151, 203, 252, 0.38) !important',
    'border-color': 'rgba(29, 158, 249, 1)!important',
  },
  [`.fld-${formId}>.btcd-ck-wrp span:first-child`]: { color: 'rgba(0, 0, 0, 1) !important' },
  [`input.fld-${formId}::placeholder,textarea.fld-${formId}::placeholder`]: { color: 'rgba(213, 212, 221, 1)!important' },
  [`input.fld-${formId}::-webkit-input-placeholder,textarea.fld-${formId}::-webkit-input-placeholder`]: { color: 'rgba(213, 212, 221, 1)!important' },
  [`input.fld-${formId}::-ms-input-placeholder,textarea.fld-${formId}::-ms-input-placeholder`]: { color: 'rgba(213, 212, 221, 1)!important' },
  [`input.fld-${formId}:-ms-input-placeholder,textarea.fld-${formId}:-ms-input-placeholder`]: { color: 'rgba(213, 212, 221, 1)!important' },
  [`input.fld-${formId}:hover,textarea.fld-${formId}:hover`]: { 'border-color': 'rgba(29, 158, 249, 1)!important' },
  // dropdown style start
  [`.fld-${formId}.dpd`]: { '--border-radius': '8px' },
  [`.fld-${formId}.dpd .msl`]: { 'border-color': 'rgba(199, 212, 221, 1)!important' },
  // dropdown style end
  // media queries
  '@media only screen and (max-width:600px)': {},
  '@media only screen and (max-width:400px)': {},
})
export const them = {}
