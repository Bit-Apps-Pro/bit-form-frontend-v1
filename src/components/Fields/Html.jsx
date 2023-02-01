/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */

import InputWrapper from '../InputWrapper'

export default function HtmlField({ attr, formID }) {
  return (
    <InputWrapper
      formID={formID}
      fieldData={attr}
      noLabel
    >
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: attr.content || attr?.info?.content }}
      />
    </InputWrapper>
  )
}
