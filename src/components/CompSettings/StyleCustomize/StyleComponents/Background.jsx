/* eslint-disable no-undef */
import { useState, useEffect } from 'react'

import { __ } from '../../../../Utils/i18nwrap'
import StyleAccordion from '../ChildComp/StyleAccordion'
import BtnGrp from '../ChildComp/BtnGrp'
import ColorPicker from '../ChildComp/ColorPicker'
import usePseudo from '../ChildComp/usePseudo'
import ResponsiveBtns from '../ChildComp/ResponsiveBtns'
import Range from '../ChildComp/Range'
import TableCheckBox from '../../../Utilities/TableCheckBox'
import ColorIcn from '../../../../Icons/ColorIcn'
import NoneIcn from '../../../../Icons/NoneIcn'
import XYordinateIcn from '../../../../Icons/XYordinateIcn'
import HWordinateIcn from '../../../../Icons/HWordinateIcn'
import BlurIcn from '../../../../Icons/BlurIcn'

export default function Background({ style, cls, styleConfig, styleDispatch, brkPoint, setResponsiveView }) {
  const [pseudo, pcls, setPseudo] = usePseudo(cls)
  let bgClr = style?.[pcls]?.['background-color'] || style?.[cls]?.['background-color']
  if (style?.[pcls]?.['background-image'] && style?.[pcls]?.['background-image'].indexOf('gradient')) {
    bgClr = style?.[pcls]?.['background-image']
  } else if (style?.[cls]?.['background-image'] && style?.[cls]?.['background-image'].indexOf('gradient')) {
    bgClr = style?.[cls]?.['background-image']
  }
  const bgTyp = bgClr ? 'Color' : 'None'
  const blendMode = style?.[pcls]?.['background-blend-mode'] || style?.[cls]?.['background-blend-mode']
  const bgRepeat = style?.[pcls]?.['background-repeat'] || style?.[cls]?.['background-repeat']
  const bgPos = style?.[pcls]?.['background-position'] || style?.[cls]?.['background-position'] || '0% 0%'
  const bgSiz = style?.[pcls]?.['background-size'] || style?.[cls]?.['background-size'] || 'auto auto'
  const bgFilter = style?.[pcls]?.['backdrop-filter'] || style?.[cls]?.['backdrop-filter'] || ''

  const [bgSrcTyp, setbgSrcTyp] = useState('')
  const [bgSrc, setbgSrc] = useState('')
  const [ImgWarn, setImgWarn] = useState('')

  useEffect(() => {
    let srcTyp = 'None'
    if (style?.[cls]?.['background-image']) {
      setbgSrc(style[cls]['background-image'].replace(/^url\(|\)$/g, ''))
      if (style[cls]?.['background-image'].match(new RegExp(window.origin, 'g'))) {
        srcTyp = 'Upload'
      } else {
        srcTyp = 'Link'
      }
    }
    setbgSrcTyp(srcTyp)
  }, [cls, style])
  const setBG = colr => {
    let property = 'background-color'
    const value = styleConfig.important ? `${colr.style}!important` : colr.style
    if ('type' in colr) {
      property = 'background-image'
    }
    styleDispatch({ apply: [{ cls: pcls, property, delProp: false, value }], brkPoint })
  }

  const setBgTyp = typ => {
    const actn = { apply: [{ cls: pcls, property: 'background-color', delProp: false, value: 'rgba(242, 246, 249, 1)' }], brkPoint }
    if (typ === 'None') {
      actn.apply[0].delProp = true
      // chek any gradien exist then delete
      if (style[cls]?.['background-image']?.match(/gradient/g)) {
        actn.apply.push({ cls: pcls, property: 'background-image', delProp: true, value: 'rgba(242, 246, 249, 1)' })
      }
    }
    styleDispatch(actn)
  }

  const handlebgSrcTyp = (typ) => {
    if (typ === 'None' && style[cls]?.['background-image']) {
      styleDispatch({ apply: [{ cls: pcls, property: 'background-image', delProp: true, value: '' }], brkPoint })
      setbgSrcTyp(typ)
    } else {
      setbgSrcTyp(typ)
    }
  }

  const handleImgLink = e => {
    const img = new Image()
    img.src = e.target.value
    img.addEventListener('load', () => {
      setImgWarn('⚠ Larger size image might slow down this form load time')
    })
    const imgUrl = `url(${e.target.value})`
    styleDispatch({ apply: [{ cls: pcls, property: 'background-image', delProp: false, value: imgUrl }], brkPoint })
  }

  const setBgImg = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        title: 'Media',
        button: { text: 'Select picture' },
        library: { type: 'image' },
        multiple: false,
      })
      imgSelectionFrame.on('select', () => {
        const attachment = imgSelectionFrame.state().get('selection').first().toJSON()
        const imageUrlStr = `url('${attachment.url}')`
        if (attachment.filesizeInBytes > 512000) {
          setImgWarn('⚠ Larger size image might slow down this form load time')
        }
        styleDispatch({ apply: [{ cls, property: 'background-image', delProp: false, value: imageUrlStr }], brkPoint })
      })

      imgSelectionFrame.open()
    }
  }

  const setBgProperty = (property, value) => {
    const actn = { apply: [{ cls: pcls, property, delProp: false, value }], brkPoint }
    if (value === 'None') {
      actn.apply[0].delProp = true
    }
    styleDispatch(actn)
  }

  const setFilter = (e, val) => {
    const existingFilter = bgFilter
    let fil = existingFilter
    let delProp = false
    if (e.target.checked) {
      fil += ` ${val}`
    } else {
      fil = fil.replace(new RegExp(`${e.target.value.toLowerCase()}\\(\\d+(px|%)\\)`, 'g'), '')
      fil = fil.trim()
      if (fil === '' || fil === undefined) {
        delProp = true
      }
    }
    styleDispatch({
      apply: [
        { cls: pcls, property: 'backdrop-filter', delProp, value: fil },
        { cls: pcls, property: '-webkit-backdrop-filter', delProp, value: fil },
      ],
      brkPoint,
    })
  }

  const handleFilterVal = (filter, value) => {
    const newVal = `${filter}(${value})`
    let fil = bgFilter
    fil = fil.replace(new RegExp(`${filter}\\(\\d+(px|%)\\)`, 'g'), newVal)
    styleDispatch({
      apply: [
        { cls: pcls, property: 'backdrop-filter', delProp: false, value: fil },
        { cls: pcls, property: '-webkit-backdrop-filter', delProp: false, value: fil },
      ],
      brkPoint,
    })
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Background', 'bitform')}>
      {('hover' in styleConfig
        || 'focus' in styleConfig
        || 'responsive' in styleConfig)
        && (
          <div className="flx flx-between">
            {'responsive' in styleConfig && <ResponsiveBtns brkPoint={brkPoint} setResponsiveView={setResponsiveView} />}

            {('hover' in styleConfig
              || 'focus' in styleConfig)
              && (
                <BtnGrp
                  className="txt-center"
                  value={pseudo}
                  onChange={setPseudo}
                  btns={[
                    { lbl: 'Default', icn: 'Default' },
                    ...('hover' in styleConfig ? [{ lbl: 'On Mouse Over', icn: 'Hover' }] : []),
                    ...('focus' in styleConfig ? [{ lbl: 'On Focus', icn: 'Focus' }] : []),
                  ]}
                />
              )}
          </div>
        )}
      <div className="flx flx-between mt-2">
        <span className="f-5">{__('Background Color', 'bitform')}</span>
        <BtnGrp
          value={bgTyp}
          onChange={setBgTyp}
          btns={[
            { lbl: 'Color', icn: <ColorIcn /> },
            { lbl: 'None', icn: <NoneIcn /> },
          ]}
        />
      </div>
      {bgTyp !== 'None' && (
        <div className="flx flx-between mt-2">
          <span className="f-5">{__('Color Fill', 'bitform')}</span>
          <ColorPicker value={bgClr} onChange={setBG} />
        </div>
      )}
      {'picture' in styleConfig && (
        <>
          <div className="flx flx-between mt-2">
            <span className="f-5">{__('Picture', 'bitform')}</span>
            <BtnGrp
              value={bgSrcTyp}
              onChange={handlebgSrcTyp}
              btns={[
                { lbl: 'Upload', icn: 'Upload' },
                { lbl: 'Link', icn: 'Link' },
                { lbl: 'None', icn: 'None' },
              ]}
            />
          </div>

          {bgSrcTyp === 'Upload' && (
            <div>
              <div className="flx flx-between mt-2">
                <span className="f-5">{__('Picture Upload', 'bitform')}</span>
                <button onClick={setBgImg} className="btn" type="button">{__('Browse...', 'bitform')}</button>
              </div>
              {ImgWarn !== '' && <small className="txt-center" style={{ color: '#efbb28' }}>{ImgWarn}</small>}
            </div>
          )}
          {bgSrcTyp === 'Link' && (
            <div>
              <div className="flx flx-between mt-2">
                <span className="f-5">
                  {__('Link:', 'bitform')}
                  {' '}
                </span>
                <input defaultValue={bgSrc} onChange={handleImgLink} className="btcd-paper-inp ml-1" type="text" placeholder={__('Image Link....', 'bitform')} />
              </div>
              {ImgWarn !== '' && <small className="txt-center" style={{ color: '#efbb28' }}>{ImgWarn}</small>}
            </div>
          )}

          <div className="flx flx-between mt-2">
            <span className="f-5">{__('Background Blend Mode', 'bitform')}</span>
            <select value={blendMode} onChange={e => setBgProperty('background-blend-mode', e.target.value)} className="btcd-paper-inp w-5">
              <option value="None">{__('None', 'bitform')}</option>
              <option value="multiply">{__('Multiply', 'bitform')}</option>
              <option value="screen">{__('Screen', 'bitform')}</option>
              <option value="overlay">{__('Overlay', 'bitform')}</option>
              <option value="darken">{__('Darken', 'bitform')}</option>
              <option value="lighten">{__('Lighten', 'bitform')}</option>
              <option value="color=dodge">{__('Color-dodge', 'bitform')}</option>
              <option value="saturation">{__('Saturation', 'bitform')}</option>
              <option value="color">{__('Color', 'bitform')}</option>
              <option value="luminosity">{__('Luminosity', 'bitform')}</option>
            </select>
          </div>

          <div className="flx flx-between mt-2">
            <span className="f-5">{__('Background Img Repeat', 'bitform')}</span>
            <select value={bgRepeat} onChange={e => setBgProperty('background-repeat', e.target.value)} className="btcd-paper-inp w-5">
              <option value="None">{__('None', 'bitform')}</option>
              <option value="repeat">{__('Repeat', 'bitform')}</option>
              <option value="repeat-x">{__('Repeat-X', 'bitform')}</option>
              <option value="repeat-y">{__('Repeat-Y', 'bitform')}</option>
              <option value="no-repeat">{__('Np Repeat', 'bitform')}</option>
              <option value="space">{__('Space', 'bitform')}</option>
              <option value="round">{__('Round', 'bitform')}</option>
            </select>
          </div>

          <div className="mt-2">
            <span className="f-5">{__('Background Img Position', 'bitform')}</span>
            <Range
              info={[
                { icn: <i className="font-w-m">X</i>, lbl: 'BG Position X' },
                { icn: <i className="font-w-m">Y</i>, lbl: 'BG Position Y' },
                { icn: <XYordinateIcn />, lbl: 'XY Both' },
              ]}
              className="btc-range"
              unit="%"
              maxRange={100}
              minRange={-10}
              value={bgPos}
              onChange={val => setBgProperty('background-position', val)}
            />
          </div>

          <div className="mt-2">
            <span className="f-5">{__('Background Img Size', 'bitform')}</span>
            <Range
              info={[
                { icn: <i className="font-w-m">H</i>, lbl: __('BG Width', 'bitform') },
                { icn: <i className="font-w-m">w</i>, lbl: __('BG Height', 'bitform') },
                { icn: <HWordinateIcn />, lbl: __('BG Height/Width', 'bitform') },
              ]}
              className="btc-range"
              unit="%"
              maxRange={100}
              value={bgSiz}
              onChange={val => setBgProperty('background-size', val)}
            />
          </div>
        </>
      )}

      {'backdropFilter' in styleConfig && (
        <div className="mt-2">
          <span className="f-5">{__('Background Filter', 'bitform')}</span>
          <div className="mt-2 col-2" style={{ columnWidth: 110 }}>
            <TableCheckBox onChange={e => setFilter(e, 'blur(5px)')} checked={bgFilter.match(/blur/g) !== null} value="Blur" className="mr-1 mt-1" title={__('Blur', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'brightness(120%)')} checked={bgFilter.match(/brightness/g) !== null} value="Brightness" className="mr-1 mt-1" title={__('Brightness', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'contrast(10%)')} checked={bgFilter.match(/contrast/g) !== null} value="Contrast" className="mr-1 mt-1" title={__('Contrast', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'grayscale(50%)')} checked={bgFilter.match(/grayscale/g) !== null} value="Grayscale" className="mr-1 mt-1" title={__('Grayscale', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'invert(10%)')} checked={bgFilter.match(/invert/g) !== null} value="Invert" className="mr-1 mt-1" title={__('Invert', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'opacity(10%)')} checked={bgFilter.match(/opacity/g) !== null} value="Opacity" className="mr-1 mt-1" title={__('Opacity', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'sepia(10%)')} checked={bgFilter.match(/sepia/g) !== null} value="Sepia" className="mr-1 mt-1" title={__('Sepia', 'bitform')} />
            <TableCheckBox onChange={e => setFilter(e, 'saturate(110%)')} checked={bgFilter.match(/saturate/g) !== null} value="Saturate" className="mr-1 mt-1" title={__('Saturate', 'bitform')} />
          </div>
          {bgFilter?.match(/blur/g) && (
            <Range
              info={[{ icn: <BlurIcn />, lbl: 'Blur' }]}
              className="btc-range"
              unit="px"
              master={false}
              maxRange={50}
              value={bgFilter.match(/blur\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('blur', val)}
            />
          )}
          {bgFilter?.match(/brightness/g) && (
            <Range
              info={[{ icn: <b>B</b>, lbl: 'Brightness' }]}
              className="btc-range"
              unit="%"
              master={false}
              maxRange={200}
              value={bgFilter.match(/brightness\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('brightness', val)}
            />
          )}
          {bgFilter?.match(/contrast/g) && (
            <Range
              info={[{ icn: <b>C</b>, lbl: 'contrast' }]}
              className="btc-range"
              master={false}
              unit="%"
              maxRange={200}
              value={bgFilter.match(/contrast\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('contrast', val)}
            />
          )}
          {bgFilter?.match(/grayscale/g) && (
            <Range
              info={[{ icn: <b>G</b>, lbl: 'grayscale' }]}
              className="btc-range"
              unit="%"
              master={false}
              maxRange={100}
              value={bgFilter.match(/grayscale\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('grayscale', val)}
            />
          )}
          {bgFilter?.match(/invert/g) && (
            <Range
              info={[{ icn: <b>I</b>, lbl: 'invert' }]}
              className="btc-range"
              unit="%"
              master={false}
              maxRange={100}
              value={bgFilter.match(/invert\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('invert', val)}
            />
          )}
          {bgFilter?.match(/opacity/g) && (
            <Range
              info={[{ icn: <b>O</b>, lbl: 'opacity' }]}
              className="btc-range"
              master={false}
              unit="%"
              maxRange={200}
              value={bgFilter.match(/opacity\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('opacity', val)}
            />
          )}
          {bgFilter?.match(/sepia/g) && (
            <Range
              info={[{ icn: <b>S</b>, lbl: 'sepia' }]}
              className="btc-range"
              master={false}
              unit="%"
              maxRange={100}
              value={bgFilter.match(/sepia\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('sepia', val)}
            />
          )}
          {bgFilter?.match(/saturate/g) && (
            <Range
              info={[{ icn: <b>S</b>, lbl: 'saturate' }]}
              className="btc-range"
              master={false}
              unit="%"
              maxRange={200}
              value={bgFilter.match(/saturate\(\d+(px|%)\)/g)[0].match(/\d+/g)[0]}
              onChange={val => handleFilterVal('saturate', val)}
            />
          )}
        </div>
      )}

    </StyleAccordion>
  )
}
