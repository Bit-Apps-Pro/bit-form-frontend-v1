/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, createRef } from 'react'
import { setPrevData, handleFile, delItem } from '../../resource/js/file-upload'
import InputWrapper from '../InputWrapper'

export default function FileUp({ attr, formID, entryID, resetFieldValue }) {
  const delBtnRef = createRef()
  const [filelist, setfilelist] = useState(attr.val !== undefined && JSON.parse(attr.val))

  useEffect(() => {
    if (resetFieldValue) {
      const element = document.getElementsByName('mul' in attr ? `${attr.name}[]` : attr.name)[0]
      element.value = null
      element.nextElementSibling.innerHTML = ''
      element.previousElementSibling.children[1].innerHTML = 'No File Chosen'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetFieldValue])

  const onFileChange = e => {
    handleFile(e)
    // set del action
    if (e.target.files.length) {
      for (let i = 0; i < delBtnRef.current.children.length; i += 1) {
        delBtnRef.current.children[i].children[2].addEventListener('click', ev => {
          delItem(ev.target)
        })
      }
    }
  }

  const rmvFile = (idx) => {
    const tmp = [...filelist]
    tmp.splice(idx, 1)
    setfilelist(tmp)
  }

  return (
    <InputWrapper
      formID={formID}
      fieldKey={attr.name}
      fieldData={attr}
    >
      <div className="btcd-f-input">
        <div className="btcd-f-wrp">
          <div className="btn-wrp">
            <button className="btcd-inpBtn" type="button">
              <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M13.5 7.5l-5.757 5.757a4.243 4.243 0 01-6-6l5.929-5.929a2.828 2.828 0 014 4l-5.758 5.758a1.414 1.414 0 01-2-2L9.5 3.5" stroke="currentColor" /></svg>
              <span>{` ${attr.upBtnTxt}`}</span>
            </button>
            <div className="btcd-f-title">No File Chosen</div>
            <small className="f-max">{'mxUp' in attr && ` (Max ${attr.mxUp} ${attr.unit || 'MB'})`}</small>
          </div>
          <input
            {...'req' in attr.valid && { required: attr.valid.req }}
            {...'disabled' in attr.valid && { disabled: attr.valid.disabled }}
            {...'mul' in attr && { multiple: true }}
            {...'exts' in attr && { accept: attr.exts }}
            {...'name' in attr && { name: 'mul' in attr ? `${attr.name}[]` : attr.name }}
            type="file"
            onClick={setPrevData}
            onChange={e => onFileChange(e)}
          />
          {attr.val !== undefined && (
            <div className="btcd-old-file">
              <input type="hidden" name={`${attr.name}_old`} value={filelist.toString()} />
              {filelist !== false && filelist.length !== 0 && (
                <div className="mt-2">
                  <small>
                    {filelist.length}
                    {' '}
                    Old File
                  </small>
                </div>
              )}
              {filelist.map((itm, i) => (
                <div key={`ol-f-${i + 3}`} className="flx ">
                  <a href={typeof bits !== 'undefined' ? `${bits.baseDLURL}formID=${formID}&entryID=${entryID}&fileID=${itm}` : ''} target="_blank" rel="noopener noreferrer">
                    <span className="btcd-icn icn-file" />
                    {' '}
                    {itm}
                  </a>
                  <button onClick={() => rmvFile(i)} type="button" className="icn-btn">&times;</button>
                </div>
              ))}
            </div>
          )}
          <div ref={delBtnRef} className="btcd-files" />
        </div>
      </div>
    </InputWrapper>
  )
}
