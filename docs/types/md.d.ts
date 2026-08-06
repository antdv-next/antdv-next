declare module 'virtual:demos' {
  interface DemoLocale {
    html?: string
    title?: string
  }

  export interface DemoSourceData {
    source: string
    jsSource: string
  }

  export interface DemoModule {
    component?: () => Promise<unknown>
    locales?: Record<string, DemoLocale>
    sourceVersion: number
    loadSource: (signal?: AbortSignal) => Promise<DemoSourceData>
  }

  const demos: Record<string, DemoModule>
  export default demos
}
