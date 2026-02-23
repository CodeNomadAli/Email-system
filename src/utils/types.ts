import type {
  Products,
  Roles,
  User,
  Location,
  UserRole,
  Customers,
  UserLocation,
  Categories,
  Companies,
  CompaniesTypes,
  Countries,
  CustomerProducts
} from '@prisma/client'

import type { CustomAvatarProps } from '@core/components/mui/Avatar'
import type { ThemeColor } from '@core/types'

export interface ExtendedCompanies extends Companies {
  companiesTypes: CompaniesTypes | null
}

export interface ExtendedProducts extends Products {
  categories: Categories | null
}
export interface ExtendedCustomers extends Customers {
  countries: Countries | null
  companies: ExtendedCompanies | null
  customerProducts: (CustomerProducts & { products: Products })[]
}

export interface ExtendedRole extends UserRole {
  role: Roles
}

export interface ExtendedLocation extends UserLocation {
  location: Location
}

export interface ExtendedUser extends User {
  roles: ExtendedRole[] | null
  locations: ExtendedLocation[] | null
}

export interface RolesExtended extends Roles {
  users: User[]
}

export type NotificationsType = {
  id: string
  title: string
  subtitle: string
  time: string
  read: boolean
  url?: string
  image_url?: string
} & (
  | {
      avatarImage?: string
      avatarIcon?: never
      avatarText?: never
      avatarColor?: never
      avatarSkin?: never
    }
  | {
      avatarIcon?: string
      avatarColor?: ThemeColor
      avatarSkin?: CustomAvatarProps['skin']
      avatarImage?: never
      avatarText?: never
    }
  | {
      avatarText?: string
      avatarColor?: ThemeColor
      avatarSkin?: CustomAvatarProps['skin']
      avatarImage?: never
      avatarIcon?: never
    }
)
