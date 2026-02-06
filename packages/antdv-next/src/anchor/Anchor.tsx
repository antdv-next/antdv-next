import type { Key } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType, VNodeChild } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { SlotsDefineType } from '../_util/type.ts'
import type { AffixProps } from '../affix'
import type { ComponentBaseProps } from '../config-provider/context'
import type { AnchorLinkBaseProps } from './AnchorLink'
import { classNames } from '@v-c/util'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { filterEmpty } from '@v-c/util/dist/props-util'
import scrollIntoView from 'scroll-into-view-if-needed'
import { computed, defineComponent, nextTick, ref, shallowRef, watch, watchEffect } from 'vue'
import getScroll from '../_util/getScroll'
import {
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import scrollTo from '../_util/scrollTo'
import { clsx, toPropsRefs } from '../_util/tools.ts'
import { Affix } from '../affix'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import AnchorLink from './AnchorLink'
import { useAnchorProvider } from './context.ts'
import useStyle from './style'

export type AnchorContainer = HTMLElement | Window

export interface AnchorLinkItemProps extends AnchorLinkBaseProps {
  key: Key
  children?: AnchorLinkItemProps[]
}

const sharpMatcherRegex = /#([\S ]+)$/

interface Section {
  link: string
  top: number
}

export type AnchorDirection = 'vertical' | 'horizontal'

export interface AnchorSemanticClassNames {
  root?: string
  item?: string
  itemTitle?: string
  indicator?: string
}

export interface AnchorSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemTitle?: CSSProperties
  indicator?: CSSProperties
}

export type AnchorClassNamesType = SemanticClassNamesType<AnchorProps, AnchorSemanticClassNames>

export type AnchorStylesType = SemanticStylesType<AnchorProps, AnchorSemanticStyles>

export interface AnchorProps extends ComponentBaseProps {
  classes?: AnchorClassNamesType
  styles?: AnchorStylesType
  offsetTop?: number
  bounds?: number
  affix?: boolean | Omit<AffixProps, 'offsetTop' | 'target'>
  showInkInFixed?: boolean
  getContainer?: () => AnchorContainer
  /** Return customize highlight anchor */
  getCurrentAnchor?: (activeLink: string) => string
  /** Scroll to target offset value, if none, it's offsetTop prop value or 0. */
  targetOffset?: number
  items?: AnchorLinkItemProps[]
  direction?: AnchorDirection
  replace?: boolean
}

export interface AnchorEmits {
  click: (e: MouseEvent, link: { title: VNodeChild, href: string }) => any
  change: (currentActiveLink: string) => any
}

export type AnchorSlots = SlotsDefineType<{
  item: (item: AnchorLinkItemProps) => any
}>

export interface AntAnchor {
  registerLink: (link: string) => void
  unregisterLink: (link: string) => void
  activeLink: string | null
  scrollTo: (link: string) => void
  onClick: (e: MouseEvent, link: { title: VNodeChild, href: string }) => void
  direction: AnchorDirection
}

const defaultProps = {
  affix: true,
  direction: 'vertical',
} as any

function getDefaultContainer() {
  return window
}

function getOffsetTop(element: HTMLElement, container: AnchorContainer): number {
  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      return rect.top - element.ownerDocument!.documentElement!.clientTop
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top
  }

  return rect.top
}
const Anchor = defineComponent<
  AnchorProps,
  AnchorEmits,
  string,
  SlotsType<AnchorSlots>
>(
  (props = defaultProps, { slots, emit, attrs }) => {
    const links = ref<string[]>([])
    const activeLink = shallowRef()
    const _activeLink = shallowRef(activeLink.value)
    const activeLinkRef = computed({
      get: () => _activeLink.value,
      set: (val) => {
        _activeLink.value = val
      },
    })

    const wrapperRef = shallowRef<HTMLElement>()
    const spanLinkNode = shallowRef<HTMLSpanElement>()
    const animating = shallowRef(false)
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      getTargetContainer,
    } = useComponentBaseConfig('anchor', props)
    const { direction: anchorDirection, classes, styles } = toPropsRefs(props, 'direction', 'classes', 'styles')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const getCurrentContainer = () => props?.getContainer?.() ?? getTargetContainer?.() ?? getDefaultContainer?.()

    const dependencyListItem = computed(() => JSON.stringify(links.value))

    const registerLink: AntAnchor['registerLink'] = (link) => {
      if (!links.value.includes(link)) {
        links.value.push(link)
      }
    }

    const unregisterLink: AntAnchor['unregisterLink'] = (link) => {
      links.value = links.value.filter(item => item !== link)
    }

    const updateInk = () => {
      const linkNode = wrapperRef.value?.querySelector<HTMLElement>(`.${prefixCls.value}-link-title-active`)
      if (linkNode && spanLinkNode.value) {
        const { style: inkStyle } = spanLinkNode.value
        const horizontalAnchor = props.direction === 'horizontal'
        inkStyle.top = horizontalAnchor ? '' : `${linkNode.offsetTop + linkNode.clientHeight / 2}px`
        inkStyle.height = horizontalAnchor ? '' : `${linkNode.clientHeight}px`
        inkStyle.left = horizontalAnchor ? `${linkNode.offsetLeft}px` : ''
        inkStyle.width = horizontalAnchor ? `${linkNode.clientWidth}px` : ''
        if (horizontalAnchor) {
          scrollIntoView(linkNode, {
            scrollMode: 'if-needed',
            block: 'nearest',
          })
        }
      }
    }

    const getInternalCurrentAnchor = (_links: string[], _offsetTop = 0, _bounds = 5): string => {
      const linkSections: Section[] = []
      const container = getCurrentContainer()
      _links.forEach((link) => {
        const sharpLinkMatch = sharpMatcherRegex.exec(link?.toString())
        if (!sharpLinkMatch) {
          return
        }
        const target = document.getElementById(sharpLinkMatch[1]!)
        if (target) {
          const top = getOffsetTop(target, container)
          if (top <= _offsetTop + _bounds) {
            linkSections.push({ link, top })
          }
        }
      })

      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev))
        return maxSection.link
      }
      return ''
    }

    const setCurrentActiveLink = (link: string) => {
      // FIXME: Seems a bug since this compare is not equals
      // `activeLinkRef` is parsed value which will always trigger `onChange` event.
      if (activeLinkRef.value === link) {
        return
      }
      // https://github.com/ant-design/ant-design/issues/30584
      const getCurrentAnchor = props.getCurrentAnchor
      const newLink = typeof getCurrentAnchor === 'function' ? getCurrentAnchor(link) : link

      activeLink.value = newLink
      activeLinkRef.value = newLink

      // onChange should respect the original link (which may caused by
      // window scroll or user click), not the new link
      emit('change', link)
    }

    const handleScroll = () => {
      if (animating.value) {
        return
      }
      const currentActiveLink = getInternalCurrentAnchor(
        links.value,
        props.targetOffset !== undefined ? props.targetOffset : props.offsetTop || 0,
        props.bounds,
      )
      setCurrentActiveLink(currentActiveLink)
    }
    const handleScrollTo = (link: string) => {
      const { offsetTop, targetOffset } = props
      setCurrentActiveLink(link)
      const sharpLinkMatch = sharpMatcherRegex.exec(link)
      if (!sharpLinkMatch) {
        return
      }
      const targetElement = document.getElementById(sharpLinkMatch[1]!)
      if (!targetElement) {
        return
      }

      const container = getCurrentContainer()
      const scrollTop = getScroll(container)
      const eleOffsetTop = getOffsetTop(targetElement, container)
      let y = scrollTop + eleOffsetTop
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0
      animating.value = true
      scrollTo(y, {
        getContainer: getCurrentContainer,
        callback() {
          animating.value = false
        },
      })
    }

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        direction: anchorDirection.value,
      }
    })
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      AnchorClassNamesType,
      AnchorStylesType,
      AnchorProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    useAnchorProvider({
      unregisterLink,
      registerLink,
      scrollTo: handleScrollTo,
      onClick: (e, link) => {
        emit('click', e, link)
      },
      activeLink,
      classes: mergedClassNames,
      styles: mergedStyles,
      direction: anchorDirection,
    })

    watch(
      dependencyListItem,
      async (_n, _o, onCleanup) => {
        if (!canUseDom()) {
          return
        }
        await nextTick()
        const scrollContainer = getCurrentContainer()
        handleScroll()
        scrollContainer?.addEventListener('scroll', handleScroll)
        onCleanup(() => {
          scrollContainer?.removeEventListener('scroll', handleScroll)
        })
      },
      {
        immediate: true,
      },
    )

    watchEffect(() => {
      if (typeof props.getCurrentAnchor === 'function') {
        setCurrentActiveLink(props?.getCurrentAnchor(activeLinkRef.value || ''))
      }
    })
    watch(
      [() => props.direction, () => props.getCurrentAnchor, dependencyListItem, activeLink],
      async () => {
        await nextTick()
        updateInk()
      },
      {
        immediate: true,
      },
    )

    return () => {
      const { rootClass, affix, showInkInFixed, offsetTop } = props
      const wrapperClass = clsx(
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        rootClass,
        `${prefixCls.value}-wrapper`,
        {
          [`${prefixCls.value}-wrapper-horizontal`]: anchorDirection.value === 'horizontal',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        (attrs as any).class,
        contextClassName.value,
        mergedClassNames.value?.root,
      )

      const anchorClass = classNames(prefixCls.value, {
        [`${prefixCls.value}-fixed`]: !affix && !showInkInFixed,
      })
      const inkClass = classNames(
        `${prefixCls.value}-ink`,
        mergedClassNames.value?.indicator,
        {
          [`${prefixCls.value}-ink-visible`]: activeLink.value,
        },
      )

      const wrapperStyle = [
        {
          maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
        },
        mergedStyles.value.root,
        contextStyle.value,
        (attrs as any).style,
      ]

      const createNestedLink = (options?: AnchorLinkItemProps[]) => {
        return Array.isArray(options)
          ? options.map((item) => {
              const _item = filterEmpty(slots?.item?.(item)) || []
              return (
                <AnchorLink
                  replace={props.replace}
                  {...item}
                  title={_item.length ? _item as any : item.title}
                  key={item.key}
                >
                  {anchorDirection.value === 'vertical' && createNestedLink(item.children)}
                </AnchorLink>
              )
            })
          : null
      }

      const anchorContent = (
        <div ref={wrapperRef} class={wrapperClass} style={wrapperStyle}>
          <div class={anchorClass}>
            <span class={inkClass} ref={spanLinkNode} style={mergedStyles.value.indicator} />
            {createNestedLink(props.items)}
          </div>
        </div>
      )
      const affixProps = affix && typeof affix === 'object' ? affix : undefined

      return (
        <>
          {affix
            ? (
                <Affix offsetTop={props.offsetTop} target={getCurrentContainer} {...affixProps}>
                  {anchorContent}
                </Affix>
              )
            : anchorContent}
        </>
      )
    }
  },
  {
    name: 'AAnchor',
    inheritAttrs: false,
  },
)

;(Anchor as any).install = (app: App) => {
  app.component(Anchor.name!, Anchor)
}

export default Anchor
