/* eslint-disable max-len */
export default function LoginIcn({ size, stroke = 2 }) {
  const style = { marginBottom: '-3px' }
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 30 30">
      <path className="svg-icn" strokeWidth={stroke} d="M9.72,7.69V6.35a2.75,2.75,0,0,1,2.75-2.74H24.1a2.75,2.75,0,0,1,2.75,2.74v17.3a2.75,2.75,0,0,1-2.75,2.74H12.47a2.75,2.75,0,0,1-2.75-2.74V22.31" />
      <polyline className="svg-icn" strokeWidth={stroke} points="15.02 8.77 21.21 14.94 14.99 21.15" />
      <line className="svg-icn" strokeWidth={stroke} x1="3.15" y1="14.94" x2="21.21" y2="14.94" />
    </svg>
  )
}
