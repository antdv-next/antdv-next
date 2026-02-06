import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { computed, defineComponent, nextTick, watch } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig } from '../config-provider/context.ts'
import { useAnchorContext } from './context.ts'

export interface AnchorLinkBaseProps extends ComponentBaseProps {
  href: string
  target?: string
  title: VueNode
  replace?: boolean
}

export interface AnchorLinkEmits {
  click: (e: MouseEvent, params: { title: any, href: any }) => any
}

export type AnchorLinkProps = AnchorLinkBaseProps

const AnchorLink = defineComponent<
  AnchorLinkProps,
  AnchorLinkEmits,
  string
>(
  (props, { slots, attrs }) => {
    const { registerLink, direction, unregisterLink, activeLink, scrollTo, onClick, classes: mergedClassNames, styles: mergedStyles } = useAnchorContext() ?? {}
    const { prefixCls } = useBaseConfig('anchor', props)
    watch(
      () => props.href,
      async (href, _, onCleanup) => {
        await nextTick()
        registerLink?.(href)
        onCleanup(() => {
          unregisterLink?.(href)
        })
      },
      {
        immediate: true,
      },
    )

    const handleClick = (e: MouseEvent) => {
      const { href, replace } = props
      const title = getSlotPropsFnRun(slots, props, 'title')

      onClick?.(e, { title, href })
      scrollTo?.(href)
      // Support clicking on an anchor does not record history.
      if (e.defaultPrevented) {
        return
      }
      const isExternalLink = href.startsWith('http://') || href.startsWith('https://')
      // Support external link
      if (isExternalLink) {
        if (replace) {
          e.preventDefault()
          window.location.replace(href)
        }
      }
      // Handling internal anchor link
      e.preventDefault()
      const historyMethod = replace ? 'replaceState' : 'pushState'
      window.history[historyMethod](null, '', href)
    }
    const active = computed(() => activeLink?.value === props.href)
    return () => {
      const { href, target } = props
      const wrapperClassName = classNames(
        `${prefixCls.value}-link`,
        (attrs as any).class,
        mergedClassNames?.value?.item,
        {
          [`${prefixCls.value}-link-active`]: active.value,
        },
      )

      const titleClassName = classNames(
        `${prefixCls.value}-link-title`,
        mergedClassNames?.value?.itemTitle,
        {
          [`${prefixCls.value}-link-title-active`]: active.value,
        },
      )
      const title = getSlotPropsFnRun(slots, props, 'title')

      return (
        <div class={[wrapperClassName]} style={mergedStyles?.value?.item}>
          <a
            class={titleClassName}
            style={mergedStyles?.value?.itemTitle}
            href={href}
            title={typeof title === 'string' ? title : ''}
            target={target}
            onClick={handleClick}
          >
            {title}
          </a>
          {direction?.value !== 'horizontal' ? slots?.default?.() : null}
        </div>
      )
    }
  },
  {
    inheritAttrs: false,
  },
)

export default AnchorLink
