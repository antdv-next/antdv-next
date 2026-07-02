import type { CSSProperties } from 'vue'
import { expect } from 'vitest'

/**
 * Shared fixture for verifying root semantic style priority.
 * sync ant-design#58474
 *
 * Priority (low -> high): ConfigProvider `styles.root` < ConfigProvider `style`
 * < component `styles.root` < component inline `style`.
 */
export const semanticRootStylePriority = {
  // ConfigProvider `<comp>.styles.root`
  contextStyles: {
    root: {
      backgroundColor: 'rgb(255, 0, 0)',
      marginTop: '1px',
      paddingTop: '1px',
      borderTopWidth: '1px',
    } as CSSProperties,
  },
  // ConfigProvider `<comp>.style`
  contextStyle: {
    backgroundColor: 'rgb(0, 0, 255)',
    marginTop: '2px',
    paddingTop: '2px',
  } as CSSProperties,
  // component `styles.root`
  styles: {
    root: {
      backgroundColor: 'rgb(0, 128, 0)',
      marginTop: '3px',
    } as CSSProperties,
  },
  // component inline `style`
  style: {
    backgroundColor: 'rgb(255, 255, 0)',
  } as CSSProperties,
}

export function expectSemanticRootStylePriority(element: Element | null) {
  const style = (element as HTMLElement | null)?.style
  expect(style?.backgroundColor).toBe(semanticRootStylePriority.style.backgroundColor)
  expect(style?.marginTop).toBe(semanticRootStylePriority.styles.root.marginTop)
  expect(style?.paddingTop).toBe(semanticRootStylePriority.contextStyle.paddingTop)
  expect(style?.borderTopWidth).toBe(semanticRootStylePriority.contextStyles.root.borderTopWidth)
}
