import { computed, provide, shallowRef } from 'vue'

export interface Frontmatter {
  title?: string
  subtitle?: string
  description?: string
  tag?: string
  demo?: {
    cols?: number
  }
  [key: string]: any
}

export interface HeaderItem {
  level: 2
  title: string
  slug: string
  link: string
  children?: HeaderItem[]
}

export interface DocPage {
  frontmatter?: Frontmatter
  title?: string
  headers?: HeaderItem[]
}

export function useDocPage() {
  const pageData = shallowRef<DocPage>()
  const demosMap = new Map<string, any>()
  provide('__pageData__', (data: DocPage) => {
    pageData.value = data
  })

  provide('__demosMap__', (key: string, demo: any) => {
    demosMap.set(key, demo)
  })
  const anchorItems = computed<any[]>(() => {
    const formatHeaders = (headers: HeaderItem[]) => {
      return headers.map((header) => {
        const item: Record<string, any> = {
          key: header.slug,
          title: header.title,
          href: header.link ?? `#${header.slug}`,
        }
        if (header.children && header.children.length) {
          item.children = formatHeaders(header.children)
        }
        return item
      })
    }
    return formatHeaders(pageData.value?.headers ?? [])
  })
  return {
    pageData,
    anchorItems,
  }
}
