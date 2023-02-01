/* eslint-disable no-nested-ternary */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import BrushIcn from '../../../Icons/BrushIcn'
import { deepCopy } from '../../../Utils/Helpers'
import BackIcn from '../../../Icons/BackIcn'
import { $fields, $layouts, $selectedFieldId } from '../../../GlobalStates'

export default function PaypalStyleEditor() {
  const { formID, formType } = useParams()
  const [lay, setLay] = useRecoilState($layouts)
  const setSelectedFieldId = useSetRecoilState($selectedFieldId)
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [customHeight, setCustomHeight] = useState(fieldData?.style?.height || '')
  const [, setCustomWidth] = useState(fieldData?.style?.width || '')

  const checkPaypalExist = (flds) => {
    const formFields = Object.entries(flds)
    const paypalFields = formFields.filter(field => field[1].typ === 'paypal')
    return paypalFields.length
  }

  if (fields && checkPaypalExist(fields) && fldKey === null) {
    const formFields = Object.entries(fields)
    const paypalFields = formFields.filter(field => field[1].typ === 'paypal')
    paypalFields.length && setSelectedFieldId(paypalFields[0][0])
  }

  const handleInput = (name, value) => {
    if (value) {
      fieldData.style[name] = value
    } else {
      delete fieldData.style[name]
    }

    if (name === 'layout') {
      const tmpLay = deepCopy(lay)
      const lgIndx = tmpLay.lg.findIndex(layout => layout.i === fldKey)
      const mdIndx = tmpLay.md.findIndex(layout => layout.i === fldKey)
      const smIndx = tmpLay.sm.findIndex(layout => layout.i === fldKey)
      const lgLayout = tmpLay.lg[lgIndx]
      const mdLayout = tmpLay.md[mdIndx]
      const smLayout = tmpLay.sm[smIndx]
      if (value === 'vertical') {
        // lg Layout
        lgLayout.h = 4
        lgLayout.minH = 3
        lgLayout.maxH = 7
        lgLayout.w = 2
        lgLayout.minW = 2

        // md layout
        mdLayout.h = 5
        mdLayout.minH = 3
        mdLayout.maxH = 7
        mdLayout.w = 4
        mdLayout.minW = 2

        // sm layout
        smLayout.h = 4
        smLayout.minH = 4
        smLayout.maxH = 6
        smLayout.w = 2
        smLayout.minW = 2
      } else if (value === 'horizontal') {
        lgLayout.h = 2
        lgLayout.minH = 2
        lgLayout.maxH = 4
        lgLayout.w = 3
        lgLayout.minW = 3

        // md layout
        mdLayout.h = 2
        mdLayout.minH = 2
        mdLayout.maxH = 4
        mdLayout.w = 3
        mdLayout.minW = 3

        // sm layout
        smLayout.h = 1
        smLayout.minH = 1
        smLayout.maxH = 2
        smLayout.w = 2
        smLayout.minW = 2
      } else if (value === 'standalone') {
        lgLayout.h = 1
        lgLayout.minH = 1
        lgLayout.maxH = 2
        lgLayout.w = 2
        lgLayout.minW = 2

        // md layout
        mdLayout.h = 1
        mdLayout.minH = 1
        mdLayout.maxH = 2
        mdLayout.w = 2
        mdLayout.minW = 2

        // sm layout
        smLayout.h = 1
        smLayout.minH = 1
        smLayout.maxH = 2
        smLayout.w = 2
        smLayout.minW = 2
      }

      tmpLay.lg.splice(lgIndx, 1, lgLayout)
      tmpLay.md.splice(mdIndx, 1, mdLayout)
      tmpLay.sm.splice(smIndx, 1, smLayout)

      setLay(tmpLay)
    }

    if (name === 'layout' && value === 'standalone') {
      fieldData.style.payBtn = 'PAYPAL'
    }
    if (name === 'payBtn' && value === 'CARD') {
      fieldData.style.color = 'white'
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setHeight = val => {
    if (val >= 25 && val <= 55) {
      fieldData.style.height = val
      setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
    }
    setCustomHeight(val)
  }

  const setHeightOnBlur = val => {
    if (val >= 25 && val <= 55) {
      fieldData.style.height = val
      setCustomHeight(val)
    } else if (val < 25) {
      fieldData.style.height = 25
      setCustomHeight(25)
    } else {
      fieldData.style.height = 55
      setCustomHeight(55)
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setWidth = val => {
    if (val >= 150 && val <= 750) {
      fieldData.style.width = val
      setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
    }
    setCustomWidth(val)
  }

  const setWidthOnBlur = val => {
    if (val >= 150 && val <= 750) {
      fieldData.style.width = val
      setCustomWidth(val)
    } else if (val < 150) {
      fieldData.style.width = 150
      setCustomWidth(150)
    } else {
      fieldData.style.width = 750
      setCustomWidth(750)
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  return (
    <div className="mt-2">
      <Link to={`/form/builder/${formType}/${formID}/style/fl`}>
        <h4 className="w-9 m-a flx txt-dp">
          <button className="icn-btn" type="button" aria-label="back btn"><BackIcn /></button>
          <div className="flx w-10">
            <span>{__('Back', 'bitform')}</span>
            <div className="txt-center w-10 f-5">{__('Paypal Style', 'bitform')}</div>
          </div>
        </h4>
      </Link>
      <div className="w-9 m-a">
        {fields === null || !checkPaypalExist(fields)
          ? (
            <div className="mt-2">{__('There is no paypal field in your form.', 'bitform')}</div>
          )
          : fldKey === null && checkPaypalExist(fields) > 1
            ? (
              <div className="mt-2" style={{ fontSize: 16, lineHeight: 1.5 }}>
                {__('There is more than one paypal field in your form. please select the style icon', 'bitform')}
                <BrushIcn style={{ height: 15, width: 20 }} />
                &nbsp;
                {__('in paypal field to customize the style.', 'bitform')}
              </div>
            )
            : (
              <>
                <div className="mt-2">
                  <label htmlFor="recap-thm">
                    <b>{__('Layout', 'bitform')}</b>
                    <select onChange={e => handleInput(e.target.name, e.target.value)} name="layout" value={fieldData?.style?.layout} className="btcd-paper-inp mt-1">
                      <option value="vertical">{__('Vertical', 'bitform')}</option>
                      <option value="horizontal">{__('Horizontal', 'bitform')}</option>
                      <option value="standalone">{__('Standalone', 'bitform')}</option>
                    </select>
                  </label>
                </div>
                {
                  fieldData?.style?.layout === 'standalone' && (
                    <div className="mt-2">
                      <label htmlFor="recap-thm">
                        <b>{__('Pay Button', 'bitform')}</b>
                        <select onChange={e => handleInput(e.target.name, e.target.value)} name="payBtn" value={fieldData.payBtn} className="btcd-paper-inp mt-1">
                          <option value="PAYPAL">{__('PAYPAL', 'bitform')}</option>
                          <option value="PAYLATER">{__('PAYLATER', 'bitform')}</option>
                          <option value="CARD">{__('CARD', 'bitform')}</option>
                        </select>
                      </label>
                    </div>
                  )
                }
                <div className="mt-2">
                  <label htmlFor="recap-thm">
                    <b>{__('Color', 'bitform')}</b>
                    <select onChange={e => handleInput(e.target.name, e.target.value)} name="color" value={fieldData?.style?.color} className="btcd-paper-inp mt-1">
                      {fieldData?.style?.payBtn !== 'CARD' && (
                        <>
                          <option value="gold">{__('Gold', 'bitform')}</option>
                          <option value="blue">{__('Blue', 'bitform')}</option>
                          <option value="silver">
                            {__('Silver', 'bitform')}
                            {' '}
                          </option>
                        </>
                      )}
                      <option value="white">{__('White', 'bitform')}</option>
                      <option value="black">{__('Black', 'bitform')}</option>
                    </select>
                  </label>
                </div>

                <div className="mt-2">
                  <label htmlFor="recap-thm">
                    <b>{__('Shape', 'bitform')}</b>
                    <select onChange={e => handleInput(e.target.name, e.target.value)} name="shape" value={fieldData?.style?.shape} className="btcd-paper-inp mt-1">
                      <option value="rect">{__('Rectangle', 'bitform')}</option>
                      <option value="pill">{__('Pill', 'bitform')}</option>
                    </select>
                  </label>
                </div>
                <div className="mt-2">
                  <label htmlFor="recap-thm">
                    <b>{__('Paypal Button Text', 'bitform')}</b>
                    <select onChange={e => handleInput(e.target.name, e.target.value)} name="label" value={fieldData?.style?.label} className="btcd-paper-inp mt-1">
                      <option value="paypal">{__('Paypal', 'bitform')}</option>
                      <option value="checkout">{__('Paypal Checkout', 'bitform')}</option>
                      <option value="buynow">{__('Paypal Buy Now', 'bitform')}</option>
                      <option value="pay">{__('Pay with Paypal', 'bitform')}</option>
                    </select>
                  </label>
                </div>
                <div className="mt-2">
                  <div className="flx flx-between mt-1 inp-grp">
                    <b className="icn br-50 mr-1">{__('Height', 'bitform')}</b>
                    <input
                      title={__('Height', 'bitform')}
                      className="btc-range mr-1"
                      type="range"
                      min="25"
                      max="55"
                      onChange={e => setHeight(e.target.value)}
                      value={fieldData?.style?.height || ''}
                    />
                    <input
                      className="ml-1 btcd-paper-inp"
                      type="number"
                      placeholder="auto"
                      onBlur={e => setHeightOnBlur(e.target.value)}
                      onChange={e => setHeight(e.target.value)}
                      min="25"
                      max="55"
                      value={customHeight}
                    />
                  </div>
                </div>
                {/* <div className="mt-2">
                <div className="flx flx-between mt-1 inp-grp">
                  <b className="icn br-50 mr-1">{__('Width', 'bitform')}</b>
                  <input
                   title={__('Width', 'bitform')}
                    className="btc-range mr-1"
                    type="range"
                    min="150"
                    max="750"
                    onChange={e => setWidth(e.target.value)}
                    value={fieldData?.style?.width || ''}
                  />
                  <input
                    className="ml-1 btcd-paper-inp"
                    type="number"
                    placeholder="auto"
                    onBlur={e => setWidthOnBlur(e.target.value)}
                    onChange={e => setWidth(e.target.value)}
                    step="50"
                    min="150"
                    max="750"
                    value={customWidth}
                  />
                </div>
              </div> */}
              </>
            )}

      </div>
    </div>
  )
}
