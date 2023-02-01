export default function SingleInput({ className, cls, width, title, inpType, action, value, placeholder, name, list, disabled }) {
  return (
    <div className={`mt-3 setting-inp ${className}`} style={{ ...(width && { width }) }}>
      <span>{title}</span>
      <input className={`btcd-paper-inp ${cls}`} type={inpType} onChange={action} value={value} placeholder={placeholder} name={name} list={list} disabled={disabled} />
    </div>
  )
}
