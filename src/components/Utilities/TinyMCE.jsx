/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { loadScript } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import { SmartTagField } from '../../Utils/StaticData/SmartTagField'

export default function TinyMCE({ formFields, id, value, onChangeHandler, toolbarMnu, menubar, height, width, disabled, plugins }) {
  const [loaded, setLoaded] = useState(0)
  useEffect(() => { loadTinyMceScript() }, [])

  const loadTinyMceScript = async () => {
    if (typeof tinymce === 'undefined') {
      const res = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.11/tinymce.min.js', 'tinymceCDN')
      if (!res) {
        // eslint-disable-next-line no-console
        console.warn('Is your internet working properly to load script?')
        loadTinyMceScript()
      }
      setLoaded(1)
    }
  }

  useEffect(() => {
    if (typeof tinymce === 'undefined' || disabled) document.getElementById(`${id}-settings`).value = value || ''
    else {
      tinymce.remove(`textarea#${id}-settings`)
      timyMceInit()
      tinymce.get(`${id}-settings`)?.setContent(value || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields, id, disabled, loaded])

  const timyMceInit = () => {
    if (typeof tinymce !== 'undefined') {
      // if (formFields) {
      //   const s = document.querySelectorAll('.form-fields-em')
      //   for (let i = 0; i < s.length; i += 1) {
      //     s[i].style.display = 'none'
      //   }
      // }
      // eslint-disable-next-line no-undef

      tinymce.init({
        selector: `textarea#${id}-settings`,
        menubar,
        height: height || 150,
        width: width || '100%',
        branding: false,
        resize: 'verticle',
        convert_urls: false,
        theme: 'modern',
        plugins: plugins || `directionality fullscreen image link media charmap hr lists textcolor colorpicker ${!loaded ? 'wordpress' : ''}`,
        toolbar: toolbarMnu || 'formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code | addFormField | addSmartField',
        image_advtab: true,
        default_link_target: '_blank',
        setup(editor) {
          editor.on('Paste Change input Undo Redo', () => {
            onChangeHandler(editor.getContent())
          })

          formFields && editor.addButton('addFormField', {
            text: 'Form Fields ',
            tooltip: 'Add Form Field Value in Message',
            type: 'menubutton',
            icon: false,
            menu: formFields?.map(i => !i.type.match(/^(file-up|recaptcha)$/) && ({ text: i.name, onClick() { editor.insertContent(`\${${i.key}}`) } })),
          })
          SmartTagField && editor.addButton('addSmartField', {
            text: 'Smart Tag Fields',
            tooltip: 'Add Smart Tag Field Value in Message',
            type: 'menubutton',
            icon: false,
            menu: SmartTagField?.map(i => ({ text: i.label, onClick() { editor.insertContent(`\${${i.name}}`) } })),
          })

          editor.addButton('toogleCode', {
            text: '</>',
            tooltip: __('Toggle preview', 'bitform'),
            icon: false,
            onclick(e) {
              const { $ } = e.control
              const myTextarea = $(`#${id}-settings`)
              const myIframe = $(editor.iframeElement)
              myTextarea.value = editor.getContent({ source_view: true })
              myIframe.toggleClass('btcd-mce-tinymce-hidden')
              myTextarea.toggleClass('btcd-mce-tinymce-visible')
              if ($('iframe.btcd-mce-tinymce-hidden').length > 0) {
                myTextarea.prependTo('.mce-edit-area')
              } else {
                editor.setContent(document.getElementById(`${id}-settings`).value)
              }
            },
          })
        },
      })
    }
  }

  return (

    <textarea
      id={`${id}-settings`}
      className="btcd-paper-inp mt-1 w-10"
      rows="5"
      value={value}
      onChange={(ev) => onChangeHandler(ev.target.value)}
      style={{ width: '95.5%', height: 'auto' }}
      disabled={disabled}
    />
  )
}
