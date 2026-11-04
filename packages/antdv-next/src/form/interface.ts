import type { Options } from 'scroll-into-view-if-needed'

export type ScrollFocusOptions = Options & {
  focus?: boolean
}

export type ScrollOptions = ScrollFocusOptions // alias
/**
 * Note: `left` and `right` are deprecated and will be removed in v7. Please use `start` and `end` instead.
 */
export type FormLabelAlign = 'start' | 'end' | 'left' | 'right'
