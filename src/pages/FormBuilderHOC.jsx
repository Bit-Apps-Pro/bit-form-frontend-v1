/* eslint-disable no-param-reassign */
import { useParams } from 'react-router-dom'
import merge from 'deepmerge-alt'
import { useRecoilValue } from 'recoil'
import { createRef, memo, useCallback, useEffect, useReducer, useState } from 'react'
import { Bar, Container, Section } from 'react-simple-resizer'
import { __ } from '../Utils/i18nwrap'
import css2json from '../Utils/css2json'
import j2c from '../Utils/j2c.es6'
import GridLayout from '../components/GridLayout'
import CompSettings from '../components/CompSettings/CompSettings'
import { defaultTheme } from '../components/CompSettings/StyleCustomize/ThemeProvider'
import GridLayoutLoader from '../components/Loaders/GridLayoutLoader'
import ToolBar from '../components/Toolbars/Toolbar'
import { propertyValueSumX } from '../Utils/FormBuilderHelper'
import { $newFormId, $bits } from '../GlobalStates'
import { bitCipher, multiAssign } from '../Utils/Helpers'

const styleReducer = (style, action) => {
  if (action.brkPoint === 'lg') {
    multiAssign(style, action.apply)
    sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(style)))
    return { ...style }
  }
  if (action.brkPoint === 'md') {
    const st = style['@media only screen and (max-width:600px)'] || style['@media only screen and (max-width: 600px)']
    multiAssign(st, action.apply)
    sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(style)))
    return { ...style }
  }
  if (action.brkPoint === 'sm') {
    const st = style['@media only screen and (max-width:400px)'] || style['@media only screen and (max-width: 400px)']
    multiAssign(st, action.apply)
    sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(style)))
    return { ...style }
  }
  if (action.type === 'init') {
    return action.style
  }
  return style
}

const FormBuilder = memo(({ formType, formID: pramsFormId, isLoading }) => {
  // const formSettings = {}
  // const { formType, formID: pramsFormId } = {}
  // const { formType, formID pramsFormId } = { formType: 'edit', formID: 2 }
  // const isLoading = false
  const newFormId = useRecoilValue($newFormId)
  // const [fields, setFields] = useRecoilState($fields)
  const formID = formType === 'new' ? newFormId : pramsFormId
  const { toolbarOff } = JSON.parse(localStorage.getItem('bit-form-config') || '{}')
  const [tolbarSiz, setTolbarSiz] = useState(toolbarOff)
  const [gridWidth, setGridWidth] = useState(window.innerWidth - 468)
  const [newData, setNewData] = useState(null)
  const [brkPoint, setbrkPoint] = useState('lg')
  const [style, styleDispatch] = useReducer(styleReducer, defaultTheme(formID))
  const [styleSheet, setStyleSheet] = useState(j2c.sheet(style))
  const [styleLoading, setstyleLoading] = useState(true)
  const [debounce, setDebounce] = useState(null)
  const bits = useRecoilValue($bits)
  const conRef = createRef(null)
  const notIE = !window.document.documentMode
  console.log('render formbuilder')
  useEffect(() => {
    if (formType === 'new') {
      sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(defaultTheme(formID))))
      setstyleLoading(false)
    } else {
      setExistingStyle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (brkPoint === 'md') {
      const st = style['@media only screen and (max-width:600px)'] || style['@media only screen and (max-width: 600px)']
      setStyleSheet(j2c.sheet(merge(style, st)))
    } else if (brkPoint === 'sm') {
      const st = style['@media only screen and (max-width:400px)'] || style['@media only screen and (max-width: 400px)']
      setStyleSheet(j2c.sheet(merge(style, st)))
    } else if (brkPoint === 'lg') {
      setStyleSheet(j2c.sheet(style))
    }
  }, [brkPoint, style])

  const styleProvider = () => {
    if (brkPoint === 'md') {
      const st = style['@media only screen and (max-width:600px)'] || style['@media only screen and (max-width: 600px)']
      return merge(style, st)
    }
    if (brkPoint === 'sm') {
      const st = style['@media only screen and (max-width:400px)'] || style['@media only screen and (max-width: 400px)']
      return merge(style, st)
    }
    return style
  }

  const setExistingStyle = () => {
    const headers = new Headers()
    headers.append('pragma', 'no-cache')
    headers.append('cache-control', 'no-cache')
    const styleUrl = new URL(bits.styleURL)
    if (styleUrl.protocol !== window.location.protocol) {
      styleUrl.protocol = window.location.protocol
    }

    const latestTimefetch = new Date().getTime()
    fetch(`${styleUrl}/bitform-${formID}.css?ver=${latestTimefetch}`, { cache: 'no-store', headers })
      .then(response => {
        if (response.ok) {
          return response.text()
        }
        setstyleLoading(false)
        return Promise.reject(response.statusText)
      })
      .then(oldStyleText => {
        const oldStyle = css2json(oldStyleText)
        styleDispatch({ type: 'init', style: oldStyle })
        setstyleLoading(false)
        recheckStyleById(oldStyleText)
      })
      .catch(() => {
        const dfThm = defaultTheme(formID)
        styleDispatch({ type: 'init', style: dfThm })
        sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(dfThm)))
      })
  }

  const recheckStyleById = (oldStyleText) => {
    if (!new RegExp(`._frm-bg-${formID}|._frm-${formID}`, 'g').test(oldStyleText)
      || oldStyleText.match(/._frm-bg-\d+/g)?.[0] !== `._frm-bg-${formID}`) {
      let replaceId
      if (/._frm-bg-Blank/gi.test(oldStyleText)) {
        replaceId = 'Blank'
      } else {
        replaceId = oldStyleText.match(/._frm-bg-\d+/g)?.[0].replace(/._frm-bg-/g, '')
      }
      if (replaceId !== undefined) {
        oldStyleText = oldStyleText.replaceAll(new RegExp(`-${replaceId}`, 'g'), `-${formID}`)
      }
    }
    const modifiedStyle = css2json(oldStyleText)
    styleDispatch({ type: 'init', style: modifiedStyle })
    sessionStorage.setItem('btcd-fs', bitCipher(oldStyleText))
  }

  const setTolbar = useCallback(() => {
    const res = conRef.current.getResizer()
    if (res.getSectionSize(0) >= 160) {
      res.resizeSection(0, { toSize: 50 })
      setTolbarSiz(true)
      localStorage.setItem('bit-form-config', JSON.stringify({ toolbarOff: true }))
    } else {
      res.resizeSection(0, { toSize: 160 })
      setTolbarSiz(false)
      localStorage.setItem('bit-form-config', JSON.stringify({ toolbarOff: false }))
    }
    conRef.current.applyResizer(res)
  }, [conRef])

  // const updateFields = useCallback(updatedElm => {
  //   const tmp = { ...fields }
  //   tmp[updatedElm.id] = updatedElm.data
  //   setFields(tmp)
  // }, [fields, setFields])

  const addNewData = useCallback(ndata => {
    setNewData(ndata)
  }, [])

  const onResize = useCallback(resizer => {
    if (resizer.isBarActivated(1)) {
      resizer.resizeSection(0, { toSize: resizer.getSectionSize(2) - 135 })
    }
  }, [])

  const onResizeActivate = useCallback(() => {
    document.querySelector('.tool-sec').style.transition = 'flex-grow 0ms'
  }, [])

  const afterResizing = useCallback(() => {
    document.querySelector('.tool-sec').style.transition = 'flex-grow 500ms'
  }, [])

  const setResponsiveView = useCallback(view => {
    const resizer = conRef.current.getResizer()
    const leftBarWidth = toolbarOff ? 50 : 165
    const rightBarWidth = 307
    const mobileSize = 400
    const tabletSize = 590
    if (view === 'lg') {
      setbrkPoint('lg')
      resizer.resizeSection(0, { toSize: leftBarWidth })
      resizer.resizeSection(2, { toSize: rightBarWidth })
    } else if (view === 'md') {
      setbrkPoint('md')
      const dividedWidth = (window.innerWidth - tabletSize) / 2
      const s0 = dividedWidth - leftBarWidth
      const s2 = dividedWidth - rightBarWidth
      resizer.resizeSection(0, { toSize: leftBarWidth + s0 })
      resizer.resizeSection(2, { toSize: rightBarWidth + s2 })
    } else if (view === 'sm') {
      setbrkPoint('sm')
      const dividedWidth = (window.innerWidth - mobileSize) / 2
      const s0 = dividedWidth - leftBarWidth
      const s2 = dividedWidth - rightBarWidth
      resizer.resizeSection(0, { toSize: leftBarWidth + s0 })
      resizer.resizeSection(2, { toSize: rightBarWidth + s2 })
    }
    conRef.current.applyResizer(resizer)
  }, [conRef])

  const setGrWidth = (paneWidth) => {
    clearTimeout(debounce)
    setDebounce(setTimeout(() => {
      setGridWidth(paneWidth)
      let w = 0
      if (style[`._frm-${formID}`]?.['border-width']) { w += propertyValueSumX(style[`._frm-${formID}`]['border-width']) }
      if (style[`._frm-${formID}`]?.padding) { w += propertyValueSumX(style[`._frm-${formID}`].padding) }
      if (style[`._frm-${formID}`]?.margin) { w += propertyValueSumX(style[`._frm-${formID}`].margin) }
      if (style[`._frm-bg-${formID}`]?.['border-width']) { w += propertyValueSumX(style[`._frm-bg-${formID}`]['border-width']) }
      if (style[`._frm-bg-${formID}`]?.padding) { w += propertyValueSumX(style[`._frm-bg-${formID}`].padding) }
      if (style[`._frm-bg-${formID}`]?.margin) { w += propertyValueSumX(style[`._frm-bg-${formID}`].margin) }
      const gw = Math.round(paneWidth - 33 - w) // inner left-right padding
      if (gw <= 510) {
        setbrkPoint('sm')
      } else if (gw > 420 && gw <= 700) {
        setbrkPoint('md')
      } else if (gw > 700) {
        setbrkPoint('lg')
      }
    }, 100))
  }

  return (
    <Container
      ref={conRef}
      style={{ height: '100vh' }}
      beforeApplyResizer={onResize}
      afterResizing={afterResizing}
      onActivate={onResizeActivate}
    >
      <style>{styleSheet}</style>
      <Section
        className="tool-sec"
        defaultSize={toolbarOff ? 50 : 165}
        minSize={notIE && 58}
      >
        <ToolBar
          setNewData={addNewData}
          className="tile"
          tolbarSiz={tolbarSiz}
          setTolbar={setTolbar}
        />
      </Section>
      <Bar className="bar bar-l" />

      <Section
        onSizeChanged={setGrWidth}
        minSize={notIE && 320}
        defaultSize={gridWidth}
      >
        {!isLoading && !styleLoading ? (
          <>
            <div className="btcd-device-btn flx">
              {[
                { lbl: 'sm', icn: 'phone_android', tip: __('Phone View', 'bitform') },
                { lbl: 'md', icn: 'tablet_android', tip: __('Tablet View', 'bitform') },
                { lbl: 'lg', icn: 'laptop_mac', tip: __('Laptop View', 'bitform') },
              ]
                .map(itm => <button key={itm.icn} onClick={() => setResponsiveView(itm.lbl)} className={`flx pos-rel tooltip phone ${brkPoint === itm.lbl && 'active'}`} style={{ '--tooltip-txt': `"${itm.tip}"` }} aria-label="responsive butoon" type="button"><span className={`btcd-icn icn-${itm.icn}`} /></button>)}
            </div>
            <GridLayout
              // theme={theme}
              style={styleProvider()}
              gridWidth={gridWidth}
              newData={newData}
              setNewData={setNewData}
              formType={formType}
              formID={formID}
            // formSettings={formSettings}
            />
          </>
        ) : <GridLayoutLoader />}

      </Section>

      <Bar className="bar bar-r" />
      <Section id="settings-menu" defaultSize={300}>
        <CompSettings
          brkPoint={brkPoint}
          style={styleProvider()}
          setResponsiveView={setResponsiveView}
          styleDispatch={styleDispatch}
          formID={formID}
        // fields={fields}
        // elm={elmSetting}
        // updateData={updateFields}
        // setSubmitConfig={setSubmitConfig}
        // lay={lay}
        // setLay={setLay}
        />
      </Section>
    </Container>
  )
})

export default function FormBuilderHOC({ isLoading }) {
  const { formType, formID } = useParams()
  return <FormBuilder {...{ formType, formID, isLoading }} />
}
