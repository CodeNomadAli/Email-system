import Script from 'next/script'

import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Component {...pageProps} />
      <Script src='/websdk/index.d.ts' />
    </>
  )
}
