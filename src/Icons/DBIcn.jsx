export default function DBIcn({ size, stroke = 2 }) {
  const style = { marginBottom: '-3px' }
  return (
    <svg width={size} height={size} style={style} viewBox="0 0 30 30">
      <ellipse className="svg-icn" strokeWidth={stroke} strokeMiterlimit="10" cx="15" cy="7.25" rx="9.97" ry="3.32" />
      <path className="svg-icn" strokeWidth={stroke} strokeMiterlimit="10" d="M25,15c0,1.84-4.43,3.32-10,3.32S5,16.84,5,15" />
      <path className="svg-icn" strokeWidth={stroke} strokeMiterlimit="10" d="M5,7.25v15.5c0,1.84,4.43,3.32,10,3.32s10-1.48,10-3.32V7.25" />
    </svg>
  )
}
