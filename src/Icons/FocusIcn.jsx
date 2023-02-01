/* eslint-disable max-len */
export default function FocusIcn({ size, stroke = 2 }) {
  const style = { marginBottom: '-3px' }
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 30 30">
      <ellipse className="svg-icn" strokeWidth={stroke} cx="15" cy="15" rx="10.02" ry="9.9" />
      <ellipse className="svg-icn" strokeWidth={stroke} cx="15" cy="15" rx="3.24" ry="3.19" />
      <line className="svg-icn" strokeWidth={stroke} x1="15" y1="2.69" x2="15" y2="5.1" />
      <line className="svg-icn" strokeWidth={stroke} x1="2.53" y1="15" x2="4.98" y2="15" />
      <line className="svg-icn" strokeWidth={stroke} x1="15" y1="27.31" x2="15" y2="24.9" />
      <line className="svg-icn" strokeWidth={stroke} x1="27.47" y1="15" x2="25.02" y2="15" />
    </svg>
  )
}
