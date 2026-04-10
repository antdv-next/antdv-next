export function shouldShowBeian(hostname: string): boolean {
  const normalizedHostname = hostname.trim().toLowerCase().replace(/\.$/, '')

  if (!normalizedHostname) {
    return false
  }

  return normalizedHostname === 'localhost'
    || normalizedHostname === '127.0.0.1'
    || normalizedHostname === 'antdv-next.cn'
    || normalizedHostname.endsWith('.antdv-next.cn')
}
