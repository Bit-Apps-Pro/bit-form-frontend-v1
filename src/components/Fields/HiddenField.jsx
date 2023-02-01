/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
export default function HiddenField({ attr }) {
  return (
    <div className="fld-wrp drag" btcd-fld="text-fld">
      {'lbl' in attr && <label className="fld-lbl">{attr.lbl}</label>}
      <input
        className="fld no-drg"
        type={attr.typ}
        {...'req' in attr.valid && { required: attr.valid.req }}
        {...'ph' in attr && { placeholder: attr.ph }}
        {...'mn' in attr && { min: attr.mn }}
        {...'mx' in attr && { max: attr.mx }}
        {...'val' in attr && { defaultValue: attr.val }}
        {...'val' in attr && 'userinput' in attr && attr.userinput && { value: attr.val }}
        {...'ac' in attr && { autoComplete: attr.ac }}
        {...'name' in attr && { name: attr.name }}
      />
    </div>
  )
}
