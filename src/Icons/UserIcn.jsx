export default function UserIcn({ size }) {
  const style = {
    fill: 'none',
    stroke: 'currentColor',
    strokeMiterlimit: 10,
    strokeWidth: '2px',
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width={size} height={size} data-name="Layer 1" viewBox="0 0 30 30">
      <circle cx="15" cy="8.2" r="5.5" style={style} />
      <path d="M24.6 27.3H5.4a1 1 0 01-1-1.2 10.7 10.7 0 014.2-7.5 8.3 8.3 0 015-1.5h2.9a8.3 8.3 0 015 1.5 10.7 10.7 0 014.2 7.5 1.1 1.1 0 01-1.1 1.2z" style={style} />
    </svg>
  )
}
