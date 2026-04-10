export function toCnPathname(pathname: string): string {
  if (pathname === '/' || pathname === '') {
    return '/index-cn'
  }

  if (pathname.startsWith('/~demos') || pathname.endsWith('-cn')) {
    return pathname
  }

  return `${pathname}-cn`
}

export function toEnPathname(pathname: string): string {
  if (pathname === '/index-cn') {
    return '/'
  }

  if (pathname.startsWith('/~demos') || !pathname.endsWith('-cn')) {
    return pathname
  }

  return pathname.slice(0, pathname.length - 3)
}
