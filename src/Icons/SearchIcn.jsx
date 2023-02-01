/* eslint-disable max-len */
export default function SearchIcn({ size, stroke = 2 }) {
  return (

    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      className="svg-icn"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>

  )
}
