// Next Imports
import { headers } from 'next/headers'

import Script from 'next/script'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'EH- Email Hub',
  description:
    'DDB is a platform that allows you to create, manage, and promote events. It is a one-stop solution for all your event management needs.'
}

const RootLayout = ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const headersList = headers()
  const direction = i18n.langDirection[params.lang]

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction}>
        <head>
          <Script src='/websdk/websdk.client.bundle.min.js' strategy='beforeInteractive' />
        </head>
        <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
