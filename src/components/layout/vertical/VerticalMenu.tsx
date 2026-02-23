// MUI Imports
import { useContext, useEffect, useState, useCallback } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu } from '@menu/vertical-menu'

import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

import { SettingsContext } from '@core/contexts/settingsContext'

// Menu Data Imports
import menuData from '@/data/navigation/verticalMenuData'
import type { VerticalMenuDataType } from '@/types/menuTypes'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

interface MenuItem {
  permission?: string
  children?: MenuItem[]
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const [verticalMenus, setVerticalMenus] = useState<VerticalMenuDataType[]>([])
  const { permissions = [] } = useContext(SettingsContext)!.settings

  const filterMenu = useCallback((permissions: string[], menus: VerticalMenuDataType[]): VerticalMenuDataType[] => {
    const filteredMenus = menus.filter((menu: MenuItem) => {
      if (menu.children) {
        menu.children = filterMenu(permissions, menu.children as VerticalMenuDataType[])

        return menu.children.length > 0
      }

      

      return !menu.permission || permissions.includes(menu.permission)
    })

    setVerticalMenus(filteredMenus)

    return filteredMenus
  }, [])

  useEffect(() => {
    filterMenu(permissions, menuData(dictionary))
  }, [permissions, dictionary, filterMenu])

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      {
        <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <GenerateVerticalMenu menuData={verticalMenus} />
        </Menu>
      }
    </ScrollWrapper>
  )
}

export default VerticalMenu
