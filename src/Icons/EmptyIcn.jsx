export default function EmptyIcn({ size, stroke = 2 }) {
  const style = { marginBottom: '-3px' }
  return (
    <svg width={size} height={size} style={style} viewBox="0 0 30 30">
      <ellipse className="svg-icn" strokeWidth={stroke} strokeMiterlimit="10" cx="15" cy="17" rx="5.27" ry="5.25" />
      <line className="svg-icn" strokeWidth={stroke} strokeMiterlimit="10" x1="18.7" y1="13.37" x2="11.3" y2="20.63" />
      <path className="svg-icn" strokeWidth={stroke} strokeMiterlimit="10" d="M16.24,2.78H7.59A2.45,2.45,0,0,0,5.12,5.22V24.78a2.45,2.45,0,0,0,2.47,2.44H22.41a2.45,2.45,0,0,0,2.47-2.44V11.33Z" />
    </svg>
  )
}
