export default function SingleToggle({ className, title, isChecked, name, action, disabled }) {
  return (
    <div className={`flx flx-between ${className}`}>
      <span className="font-w-m">{title}</span>
      <label htmlFor={`s-ck-${title || name}-${isChecked}`} className="btcd-label">
        <div className="btcd-toggle">
          <input
            id={`s-ck-${title || name}-${isChecked}`}
            onChange={action}
            className="btcd-toggle-state"
            type="checkbox"
            name={name || 'check'}
            value="check"
            checked={isChecked}
            disabled={disabled}
          />
          <div className="btcd-toggle-inner">
            <div className="btcd-indicator" />
          </div>
          <div className="btcd-active-bg" />
        </div>
        <div className="btcd-label-text" />
      </label>
    </div>
  )
}
