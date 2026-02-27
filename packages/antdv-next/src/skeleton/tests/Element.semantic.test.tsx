import { describe, expect, it } from 'vitest'
import { SkeletonAvatar, SkeletonButton, SkeletonImage, SkeletonInput, SkeletonNode } from '..'
import Element from '../Element'
import { mount } from '/@tests/utils'

describe('skeleton.element.semantic', () => {
  it('should support classes/styles on Element', () => {
    const wrapper = mount(() => (
      <Element
        prefixCls="ant-skeleton-element-test"
        classes={{ root: 'el-root', content: 'el-content' }}
        styles={{ root: { padding: '2px' }, content: { color: 'rgb(255, 0, 0)' } }}
        class="el-attr"
        style={{ color: 'rgb(0, 0, 255)' }}
      />
    ))

    const element = wrapper.find('.ant-skeleton-element-test')
    expect(element.classes()).toContain('el-root')
    expect(element.classes()).toContain('el-content')
    expect(element.classes()).toContain('el-attr')
    expect(element.attributes('style')).toContain('padding: 2px')
    expect(element.attributes('style')).toContain('color: rgb(0, 0, 255)')
  })

  it('should support semantic root/content for Skeleton.Avatar', () => {
    const wrapper = mount(SkeletonAvatar, {
      props: {
        classes: { root: 'avatar-root', content: 'avatar-content' },
        styles: { root: { marginTop: '3px' }, content: { color: 'rgb(255, 0, 0)' } },
      },
      attrs: {
        class: 'avatar-attr',
        style: { color: 'rgb(0, 0, 255)', width: '44px' },
        'data-testid': 'avatar',
      },
    })

    const root = wrapper.find('.ant-skeleton')
    const content = wrapper.find('.ant-skeleton-avatar')
    expect(root.classes()).toContain('avatar-root')
    expect(root.classes()).toContain('avatar-attr')
    expect(root.attributes('style')).toContain('margin-top: 3px')
    expect(root.attributes('data-testid')).toBe('avatar')
    expect(content.classes()).toContain('avatar-content')
    expect(content.attributes('style')).toContain('color: rgb(0, 0, 255)')
    expect(content.attributes('style')).toContain('width: 44px')
  })

  it('should support semantic root/content for Skeleton.Input', () => {
    const wrapper = mount(SkeletonInput, {
      props: {
        classes: { root: 'input-root', content: 'input-content' },
        styles: { root: { marginTop: '4px' }, content: { color: 'rgb(255, 0, 0)' } },
      },
      attrs: {
        class: 'input-attr',
        style: { color: 'rgb(0, 0, 255)', width: '120px' },
      },
    })

    const root = wrapper.find('.ant-skeleton')
    const content = wrapper.find('.ant-skeleton-input')
    expect(root.classes()).toContain('input-root')
    expect(root.classes()).toContain('input-attr')
    expect(root.attributes('style')).toContain('margin-top: 4px')
    expect(content.classes()).toContain('input-content')
    expect(content.attributes('style')).toContain('color: rgb(0, 0, 255)')
    expect(content.attributes('style')).toContain('width: 120px')
  })

  it('should support semantic root/content for Skeleton.Node and Skeleton.Image', () => {
    const nodeWrapper = mount(SkeletonNode, {
      props: {
        classes: { root: 'node-root', content: 'node-content' },
        styles: { root: { marginTop: '5px' }, content: { width: '90px' } },
      },
      attrs: {
        class: 'node-attr',
        style: { height: '22px' },
      },
      slots: {
        default: () => 'node',
      },
    })

    const nodeRoot = nodeWrapper.find('.ant-skeleton')
    const nodeContent = nodeWrapper.find('.ant-skeleton-node')
    expect(nodeRoot.classes()).toContain('node-root')
    expect(nodeRoot.classes()).toContain('node-attr')
    expect(nodeRoot.attributes('style')).toContain('margin-top: 5px')
    expect(nodeContent.classes()).toContain('node-content')
    expect(nodeContent.attributes('style')).toContain('width: 90px')
    expect(nodeContent.attributes('style')).toContain('height: 22px')

    const imageWrapper = mount(SkeletonImage, {
      props: {
        classes: { root: 'image-root', content: 'image-content' },
        styles: { root: { marginTop: '6px' }, content: { width: '160px' } },
      },
      attrs: {
        class: 'image-attr',
        style: { height: '100px' },
      },
    })

    const imageRoot = imageWrapper.find('.ant-skeleton')
    const imageContent = imageWrapper.find('.ant-skeleton-image')
    expect(imageRoot.classes()).toContain('image-root')
    expect(imageRoot.classes()).toContain('image-attr')
    expect(imageRoot.attributes('style')).toContain('margin-top: 6px')
    expect(imageContent.classes()).toContain('image-content')
    expect(imageContent.attributes('style')).toContain('width: 160px')
    expect(imageContent.attributes('style')).toContain('height: 100px')
    expect(imageWrapper.find('.ant-skeleton-image-svg').exists()).toBe(true)
  })

  it('should keep attrs.style on Skeleton.Button content and support style string', () => {
    const wrapper = mount(SkeletonButton, {
      props: {
        classes: { root: 'button-root', content: 'button-content' },
        styles: { root: { marginTop: '7px' }, content: { color: 'rgb(255, 0, 0)' } },
      },
      attrs: {
        class: 'button-attr',
        style: 'color: rgb(0, 0, 255); border: 1px solid red;',
        'data-testid': 'button',
      },
    })

    const root = wrapper.find('.ant-skeleton')
    const content = wrapper.find('.ant-skeleton-button')
    expect(root.classes()).toContain('button-root')
    expect(root.classes()).toContain('button-attr')
    expect(root.attributes('style')).toContain('margin-top: 7px')
    expect(root.attributes('data-testid')).toBe('button')
    expect(content.classes()).toContain('button-content')
    expect(content.attributes('style')).toContain('color: rgb(0, 0, 255)')
    expect(content.attributes('style')).toContain('border: 1px solid red')
  })
})
