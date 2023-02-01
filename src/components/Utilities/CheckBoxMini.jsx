/* eslint-disable react/jsx-props-no-spreading */
export default function CheckBoxMini({ className, cls, id, name, refer, onChange, checked, value, title }) {
  const checkId = id || Math.random()
  return (
    <div className={`form-check ${className}`}>
      <input
        type="checkbox"
        className={`form-check-input ${cls}`}
        id={checkId}
        name={name}
        ref={refer}
        onChange={onChange}
        checked={checked}
        value={value}
      />
      <label className="form-check-label" htmlFor={checkId}>{title}</label>
    </div>
  )
}
