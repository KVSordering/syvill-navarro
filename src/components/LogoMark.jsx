import logo from '../assets/logo.png'

export default function LogoMark({ className = '' }) {
  return (
    <span className={`relative inline-flex overflow-hidden rounded-md bg-ink ${className}`}>
      <img
        src={logo}
        alt="Syvill Navarro"
        className="h-full w-full scale-[1.85] object-cover"
      />
    </span>
  )
}
