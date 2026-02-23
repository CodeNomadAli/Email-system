// React Imports
import type { ImgHTMLAttributes } from 'react'

const Logo = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src='/images/logos/only-logo.png' alt='logo' width={45} {...props} />
}

export default Logo
