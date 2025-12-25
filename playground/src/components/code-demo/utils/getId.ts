export function getId(src: string) {
  let _src = src
  const componentsArr = _src.split('/')
  const demoIndex = componentsArr.reverse().findIndex(dir => dir.toLowerCase() === 'demo')
  const componentDemoPathArr = componentsArr.slice(0, demoIndex + 2)
  _src = componentDemoPathArr.reverse().join('/')
  if (_src.startsWith('/')) {
    _src = _src.slice(1)
  }
  if (_src.endsWith('.vue')) {
    _src = _src.slice(0, -4)
  }
  return _src.replace(/[/\\.]/g, '-')
}
