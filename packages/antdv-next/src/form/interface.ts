import type { Options } from 'scroll-into-view-if-needed'

export type ScrollFocusOptions = Options & {
  focus?: boolean
}

export type ScrollOptions = ScrollFocusOptions // alias
export type FormLabelAlign = 'left' | 'right'
