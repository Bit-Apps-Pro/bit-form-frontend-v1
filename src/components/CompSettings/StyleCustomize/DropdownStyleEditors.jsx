/* eslint-disable no-underscore-dangle */
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import BorderIcn from '../../../Icons/BorderIcn'
import HeightIcn from '../../../Icons/HeightIcn'
import ColorPicker from './ChildComp/ColorPicker'
import Range from './ChildComp/Range'
import StyleAccordion from './ChildComp/StyleAccordion'
import StyleEditor from './StyleEditor'

export default function DropdownStyleEditors({ editorLabel, style, styleDispatch, brkPoint, setResponsiveView, styleEditorConfig, formID }) {
  const history = useHistory()
  const goBackUrl = () => {
    if (history.location.pathname.match(/style\/fl\/.+/g)) return history.location.pathname.replace(/style\/fl\/.+/g, 'style/fl')
    return history.location.pathname.replace(/style\/.+/g, 'style')
  }

  const [controlAccordion, setcontrolAccordion] = useState(false)

  const borderRadius = style?.[`.fld-${formID}.dpd`]?.['--border-radius'] || '5px 5px 5px 5px'
  const fontSize = style?.[`.fld-${formID}.dpd`]?.['--font-size'] || '16px'
  const lineHeight = style?.[`.fld-${formID}.dpd`]?.['--line-height'] || '1.4'
  const minHeight = style?.[`.fld-${formID}.dpd .msl`]?.['min-height'] || '40px'
  const activeMenuBgColor = style?.[`.fld-${formID}.dpd`]?.['--active-menu-background'] || 'rgba(255, 255, 255, 1)'
  const activeMenuRadius = style?.[`.fld-${formID}.dpd`]?.['--active-menu-radius'] || borderRadius

  const setValueByProperty = (value, property, clas) => {
    const cls = clas || `.fld-${formID}.dpd`
    styleDispatch({ apply: [{ cls, property, delProp: false, value }], brkPoint })
  }

  return (
    <div className="mt-2">
      <Link to={`${goBackUrl()}`}>
        <h4 className="w-9 m-a flx txt-dp">
          <button className="icn-btn" type="button" aria-label="back btn"><BackIcn /></button>
          <div className="flx w-10">
            <span>Back</span>
            <div className="txt-center w-10 f-5">{editorLabel}</div>
          </div>
        </h4>
        <div className="btcd-hr m-a" />
        <div className="btcd-hr m-a" />
      </Link>

      <StyleAccordion
        open={controlAccordion === 1}
        onOpen={() => setcontrolAccordion(1)}
        title={<span className="txt-blue" style={{ fontSize: 16 }}>Dropdown Input Style</span>}
        className="style-acc"
      >
        <StyleEditor noBack compStyle={style} cls={`.fld-${formID}.dpd .msl`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.dropdown} formID={formID} />

        <StyleAccordion title="Min Height" className="style-acc w-9">
          <Range
            info={[{ icn: <HeightIcn h="20" />, lbl: 'Minimum Height' }]}
            className="btc-range"
            unit="px"
            master={false}
            maxRange={80}
            minRange={0}
            value={minHeight}
            onChange={(val) => setValueByProperty(val, 'min-height', `.fld-${formID}.dpd .msl`)}
          />
        </StyleAccordion>
        <div className="btcd-hr m-a" />

        <StyleAccordion title="Border Radius" className="style-acc w-9">
          <Range
            info={[
              { icn: <BorderIcn borderRadius="6px 1px 1px 1px" />, lbl: 'Radius Top Left' },
              { icn: <BorderIcn borderRadius="1px 6px 1px 1px" />, lbl: 'Radius Top Right' },
              { icn: <BorderIcn borderRadius="1px 1px 6px 1px" />, lbl: 'Radius Bottom Right' },
              { icn: <BorderIcn borderRadius="1px 1px 1px 6px" />, lbl: 'Radius Bottom Left' },
              { icn: <BorderIcn />, lbl: 'All Side' },
            ]}
            className="btc-range"
            unit="px"
            maxRange={20}
            minRange={0}
            value={borderRadius}
            onChange={(val) => setValueByProperty(val, '--border-radius')}
          />
        </StyleAccordion>
        <div className="btcd-hr m-a" />

        <StyleAccordion title="Font Size" className="style-acc w-9">
          <Range
            info={[
              { icn: <b>T</b>, lbl: 'Font Size' },
            ]}
            className="btc-range"
            unit="px"
            master={false}
            maxRange={50}
            minRange={0}
            value={fontSize}
            onChange={(val) => setValueByProperty(val, '--font-size')}
          />
        </StyleAccordion>
        <div className="btcd-hr m-a" />

        <StyleAccordion title="Line Height" className="style-acc w-9">
          <Range
            info={[{
              icn: (
                <span>
                  <b>T</b>
                  <HeightIcn h="12" />
                </span>),
              lbl: 'Text Line Height',
            }]}
            className="btc-range"
            master={false}
            maxRange={8}
            minRange={0}
            value={lineHeight}
            step={0.1}
            onChange={(val) => setValueByProperty(val, '--line-height')}
          />
        </StyleAccordion>
        <div className="btcd-hr m-a" />

      </StyleAccordion>
      <div className="btcd-hr m-a" />

      <StyleAccordion open={controlAccordion === 2} onOpen={() => setcontrolAccordion(2)} title={<span className="txt-blue" style={{ fontSize: 16 }}>Dropdowns Active Menu</span>} className="style-acc">
        <div className="flx flx-between w-9 p-2 m-a">
          <b>Background Color</b>
          <ColorPicker value={activeMenuBgColor} onChange={val => setValueByProperty(val.style, '--active-menu-background', `.fld-${formID}.dpd`)} />
        </div>
        <div className="btcd-hr m-a" />

        <StyleAccordion title="Border Radius" className="style-acc w-9">
          <Range
            info={[
              { icn: <BorderIcn borderRadius="6px 1px 1px 1px" />, lbl: 'Radius Top Left' },
              { icn: <BorderIcn borderRadius="1px 6px 1px 1px" />, lbl: 'Radius Top Right' },
              { icn: <BorderIcn borderRadius="1px 1px 6px 1px" />, lbl: 'Radius Bottom Right' },
              { icn: <BorderIcn borderRadius="1px 1px 1px 6px" />, lbl: 'Radius Bottom Left' },
              { icn: <BorderIcn />, lbl: 'All Side' },
            ]}
            className="btc-range"
            unit="px"
            maxRange={20}
            minRange={0}
            value={activeMenuRadius}
            onChange={(val) => setValueByProperty(val, '--active-menu-radius', `.fld-${formID}.dpd`)}
          />
        </StyleAccordion>
        <div className="btcd-hr m-a" />
      </StyleAccordion>
      <div className="btcd-hr m-a" />

      <StyleAccordion open={controlAccordion === 3} onOpen={() => setcontrolAccordion(3)} title={<span className="txt-blue" style={{ fontSize: 16 }}>Dropdowns Options Style</span>} className="style-acc">
        <StyleEditor noBack compStyle={style} cls={`.fld-${formID}.dpd .msl-option`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.dropdownOptions} formID={formID} />
      </StyleAccordion>
      <div className="btcd-hr m-a" />

      <StyleAccordion open={controlAccordion === 4} onOpen={() => setcontrolAccordion(4)} title={<span className="txt-blue" style={{ fontSize: 16 }}>Dropdowns Chips Style</span>} className="style-acc">
        <StyleEditor noBack compStyle={style} cls={`.fld-${formID}.dpd .msl-chip`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.dropdownChip} formID={formID} />
        <StyleEditor title="Chip Delete Button" noBack compStyle={style} cls={`.fld-${formID}.dpd .msl-chip div[aria-label="delete-value"]`} styleDispatch={styleDispatch} brkPoint={brkPoint} setResponsiveView={setResponsiveView} styleConfig={styleEditorConfig.dropdownChipButton} formID={formID} />
      </StyleAccordion>
      <div className="btcd-hr m-a" />

    </div>
  )
}
