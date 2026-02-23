export const routePermissions: Record<string, string> = {
  '/en/products/form': 'create:product',
  '/en/users': 'can-view-users'

  // Add more routes and their required permissions here
}

export function getRequiredPermission(pathname: string): string | undefined {
  // Exact match first
  if (routePermissions[pathname]) return routePermissions[pathname]

  // Optionally, add pattern matching here for dynamic routes
  return undefined
}
