export default function ReCaptchaIcn({ size, className, stroke = 2.5 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 30 30">
      <polyline className="svg-icn" strokeWidth={stroke} points="5.49 24.65 5.58 21.03 9.19 21.13" />
      <polyline className="svg-icn" strokeWidth={stroke} points="8.3 4.27 11.67 5.54 10.41 8.93" />
      <polyline className="svg-icn" strokeWidth={stroke} points="26 11.63 24.41 14.87 21.18 13.28" />
      <path className="svg-icn" strokeWidth={stroke} d="M14.85,5.51A10.1,10.1,0,0,1,24,14" />
      <path className="svg-icn" strokeWidth={stroke} d="M4.3,18.06A10,10,0,0,1,4,15.61a10.12,10.12,0,0,1,7.08-9.67" />
      <path className="svg-icn" strokeWidth={stroke} d="M19,24.47A10,10,0,0,1,5.63,21.12" />
    </svg>
  )
}
