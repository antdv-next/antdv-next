import type { App, SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context'
import type { SkeletonAvatarProps as AvatarProps } from './Avatar'
import type { SkeletonParagraphProps } from './Paragraph'
import type { SkeletonTitleProps } from './Title'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context'
import SkeletonAvatar from './Avatar'
import SkeletonButton from './Button'
import Element from './Element'
import SkeletonImage from './Image'
import SkeletonInput from './Input'
import SkeletonNode from './Node'
import Paragraph from './Paragraph'
import useStyle from './style'
import Title from './Title'

/* This only for skeleton internal. */
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>

export interface SkeletonProps extends ComponentBaseProps {
  active?: boolean
  loading?: boolean
  avatar?: SkeletonAvatarProps | boolean
  title?: SkeletonTitleProps | boolean
  paragraph?: SkeletonParagraphProps | boolean
  round?: boolean
}

export interface SkeletonSlots {
  default?: () => any
}

function getComponentProps<T>(prop?: T | boolean): T | Record<string, never> {
  if (prop && typeof prop === 'object') {
    return prop
  }
  return {}
}

function getAvatarBasicProps(hasTitle: boolean, hasParagraph: boolean): SkeletonAvatarProps {
  if (hasTitle && !hasParagraph) {
    // Square avatar
    return { size: 'large', shape: 'square' }
  }

  return { size: 'large', shape: 'circle' }
}

function getTitleBasicProps(hasAvatar: boolean, hasParagraph: boolean): SkeletonTitleProps {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' }
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' }
  }

  return {}
}

function getParagraphBasicProps(hasAvatar: boolean, hasTitle: boolean): SkeletonParagraphProps {
  const basicProps: SkeletonParagraphProps = {}

  // Width
  if (!hasAvatar || !hasTitle) {
    basicProps.width = '61%'
  }

  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3
  }
  else {
    basicProps.rows = 2
  }

  return basicProps
}

const defaults = {
  avatar: false,
  title: true,
  paragraph: true,
  loading: undefined,
} as any

const Skeleton = defineComponent<SkeletonProps, EmptyEmit, string, SlotsType<SkeletonSlots>>(
  (props = defaults, { attrs, slots }) => {
    const { prefixCls, direction } = useBaseConfig('skeleton', props)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const {
        loading,
        rootClass,
        avatar = false,
        title = true,
        paragraph = true,
        active,
        round,
      } = props

      if (loading || loading === undefined) {
        const hasAvatar = !!avatar
        const hasTitle = !!title
        const hasParagraph = !!paragraph

        // Avatar
        let avatarNode: any
        if (hasAvatar) {
          const avatarProps: SkeletonAvatarProps = {
            prefixCls: `${prefixCls.value}-avatar`,
            ...getAvatarBasicProps(hasTitle, hasParagraph),
            ...getComponentProps(avatar),
          }
          // We direct use SkeletonElement as avatar in skeleton internal.
          avatarNode = (
            <div class={`${prefixCls.value}-header`}>
              <Element {...avatarProps} />
            </div>
          )
        }

        let contentNode: any
        if (hasTitle || hasParagraph) {
          // Title
          let $title: any
          if (hasTitle) {
            const titleProps: SkeletonTitleProps = {
              prefixCls: `${prefixCls.value}-title`,
              ...getTitleBasicProps(hasAvatar, hasParagraph),
              ...getComponentProps(title),
            }

            $title = <Title {...titleProps} />
          }

          // Paragraph
          let paragraphNode: any
          if (hasParagraph) {
            const paragraphProps: SkeletonParagraphProps = {
              prefixCls: `${prefixCls.value}-paragraph`,
              ...getParagraphBasicProps(hasAvatar, hasTitle),
              ...getComponentProps(paragraph),
            }

            paragraphNode = <Paragraph {...paragraphProps} />
          }

          contentNode = (
            <div class={`${prefixCls.value}-content`}>
              {$title}
              {paragraphNode}
            </div>
          )
        }

        const cls = classNames(
          prefixCls.value,
          {
            [`${prefixCls.value}-with-avatar`]: hasAvatar,
            [`${prefixCls.value}-active`]: active,
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            [`${prefixCls.value}-round`]: round,
          },
          (attrs as any)?.class,
          rootClass,
          hashId.value,
          cssVarCls.value,
        )

        return wrapCSSVar(
          <div class={cls} {...omit(attrs, ['class'])}>
            {avatarNode}
            {contentNode}
          </div>,
        )
      }
      return slots.default?.() ?? null
    }
  },
  {
    name: 'ASkeleton',
    inheritAttrs: false,
  },
)

;(Skeleton as any).install = (app: App) => {
  app.component(Skeleton.name, Skeleton)
  app.component(SkeletonButton.name, SkeletonButton)
  app.component(SkeletonAvatar.name, SkeletonAvatar)
  app.component(SkeletonInput.name, SkeletonInput)
  app.component(SkeletonImage.name, SkeletonImage)
  app.component(SkeletonNode.name, SkeletonNode)
}

export type SkeletonType = typeof Skeleton & {
  Button: typeof SkeletonButton
  Avatar: typeof SkeletonAvatar
  Input: typeof SkeletonInput
  Image: typeof SkeletonImage
  Node: typeof SkeletonNode
}

const SkeletonWithSubComponents = Skeleton as SkeletonType

SkeletonWithSubComponents.Button = SkeletonButton
SkeletonWithSubComponents.Avatar = SkeletonAvatar
SkeletonWithSubComponents.Input = SkeletonInput
SkeletonWithSubComponents.Image = SkeletonImage
SkeletonWithSubComponents.Node = SkeletonNode

export default SkeletonWithSubComponents

export {
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonInput,
  SkeletonNode,
}
