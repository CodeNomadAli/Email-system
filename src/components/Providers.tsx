import { BackdropProvider } from '@core/contexts/BackdropContext'

import { getAuthUser } from '@/utils/backend-helper'

import type { ChildrenType, Direction } from '@core/types'

import prisma from '@/db'

// Context Imports
import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import ReduxProvider from '@/redux-store/ReduxProvider'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports

import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  direction: Direction
}
interface Role {
  role: {
    permissions: LocalPermission[]
  }
}

interface LocalPermission {
  permission: {
    name: string
  }
}

const Providers = async (props: Props) => {
  const { children, direction } = props

  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  let userData = null

  try {
    userData = await getAuthUser()
  } catch (error) {
    console.error('Authentication error:', error)
  }

  const plainPermissions = (roles: Role[]) => {
    try {
      const permissions = roles.map((role: Role) => role.role).flat()

      const permissionNames: string[] = permissions
        .map((permission: { permissions: LocalPermission[] }) =>
          permission.permissions.map((p: LocalPermission) => p.permission.name)
        )
        .flat()

      return permissionNames
    } catch (error) {
      console.info(error)

      return []
    }
  }

  const fetchPermissions = async () => {
    try {
      if (!userData?.id) {
        return []
      }

      const user = await prisma.user.findUnique({
        where: { id: userData.id },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (!user) {
        console.error('User not found')

        return []
      }

      return plainPermissions(user.roles)
    } catch (error) {
      console.error('Error fetching permissions:', error)

      return []
    }
  }

  const permissions = await fetchPermissions()

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <BackdropProvider>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode} permisisons={permissions}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              <ReduxProvider>{children}</ReduxProvider>
              <AppReactToastify direction={direction} hideProgressBar />
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </BackdropProvider>
    </NextAuthProvider>
  )
}

export default Providers
