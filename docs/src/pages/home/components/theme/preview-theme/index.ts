import type { ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { useLocale } from '@/composables/use-locale'
import useBlossomTheme from './blossom-theme'
import blossomThemeSource from './blossom-theme.ts?raw'
import useBootstrapTheme from './bootstrap-theme'
import bootstrapThemeSource from './bootstrap-theme.ts?raw'
import useCartoonTheme from './cartoon-theme'
import cartoonThemeSource from './cartoon-theme.ts?raw'
import useGeekTheme from './geek-theme'
import geekThemeSource from './geek-theme.ts?raw'
import useGlassTheme from './glass-theme'
import glassThemeSource from './glass-theme.ts?raw'
import useIllustrationTheme from './illustration-theme'
import illustrationThemeSource from './illustration-theme.ts?raw'
import useLarkTheme from './lark-theme'
import larkThemeSource from './lark-theme.ts?raw'
import useMuiTheme from './mui-theme'
import muiThemeSource from './mui-theme.ts?raw'
import useShadcnTheme from './shadcn-theme'
import shadcnThemeSource from './shadcn-theme.ts?raw'
import useV4Theme from './v4-theme'
import v4ThemeSource from './v4-theme.ts?raw'

export interface PreviewThemeConfig {
  name: string
  key?: string
  props?: ConfigProviderProps
  bgImg?: string
  bgImgDark?: true
  copyCode?: string
  icon?: string
  colors?: string[]
}

export type UseTheme = () => ConfigProviderProps

export const DEFAULT_COLOR = '#1677FF'
export const PINK_COLOR = '#ED4192'

const previewThemeComponents: Record<string, any> = {
  Layout: {
    bodyBg: '#f5f8ff',
    footerBg: '#f5f8ff',
    headerBg: '#ffffff',
    headerColor: 'rgba(0, 0, 0, 0.88)',
    siderBg: '#ffffff',
    triggerBg: '#f0f5ff',
    triggerColor: 'rgba(0, 0, 0, 0.88)',
  },
  Menu: {
    activeBarBorderWidth: 0,
    itemBg: 'transparent',
    subMenuItemBg: 'transparent',
  },
  Button: {},
  Alert: {},
  Modal: {},
  Card: {},
  Tooltip: {},
  Checkbox: {},
  Radio: {},
  Select: {},
  Input: {},
  Switch: {},
  Progress: {
    circleTextColor: 'rgba(0, 0, 0, 0.88)',
    defaultColor: DEFAULT_COLOR,
    remainingColor: 'rgba(0, 0, 0, 0.06)',
  },
  Steps: {},
  Slider: {},
  ColorPicker: {},
  Notification: {},
}

const darkPreviewLayoutToken: Record<string, any> = {
  bodyBg: '#050505',
  footerBg: '#050505',
  headerBg: '#111111',
  headerColor: 'rgba(255, 255, 255, 0.88)',
  siderBg: '#050505',
  triggerBg: '#111111',
  triggerColor: 'rgba(255, 255, 255, 0.88)',
}

const darkPreviewMenuToken: Record<string, any> = {
  darkItemBg: 'transparent',
  darkItemColor: 'rgba(255, 255, 255, 0.68)',
  darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
  darkItemHoverColor: '#fff',
  darkItemSelectedBg: 'rgba(22, 119, 255, 0.28)',
  darkItemSelectedColor: '#fff',
  darkSubMenuItemBg: 'transparent',
}

const darkPreviewProgressToken: Record<string, any> = {
  circleTextColor: 'rgba(255, 255, 255, 0.88)',
  defaultColor: DEFAULT_COLOR,
  remainingColor: 'rgba(255, 255, 255, 0.12)',
}

function isDarkAlgorithm(algorithm: any): boolean {
  const algorithms = Array.isArray(algorithm) ? algorithm : algorithm ? [algorithm] : []
  return algorithms.includes(theme.darkAlgorithm)
}

function getBasePreviewThemeProps(algorithm: any): ConfigProviderProps {
  return {
    theme: {
      algorithm,
      components: isDarkAlgorithm(algorithm)
        ? {
            ...previewThemeComponents,
            Layout: darkPreviewLayoutToken,
            Menu: darkPreviewMenuToken,
            Progress: darkPreviewProgressToken,
          }
        : previewThemeComponents,
    },
    wave: {},
    app: {},
    card: {},
    modal: {},
    button: {},
    alert: {},
    colorPicker: {},
    checkbox: {},
    dropdown: {},
    select: {},
    datePicker: {},
    input: {},
    inputNumber: {},
    popover: {},
    tooltip: {},
    notification: {},
    switch: {},
    radio: {},
    segmented: {},
    progress: {},
  }
}

export function usePreviewThemes() {
  const { t } = useLocale()

  const blossomTheme = useBlossomTheme()
  const cartoonTheme = useCartoonTheme()
  const illustrationTheme = useIllustrationTheme()
  const geekTheme = useGeekTheme()
  const glassTheme = useGlassTheme()
  const larkTheme = useLarkTheme()
  const muiTheme = useMuiTheme()
  const shadcnTheme = useShadcnTheme()
  const bootstrapTheme = useBootstrapTheme()
  const v4Theme = useV4Theme()

  return computed<PreviewThemeConfig[]>(() => [
    {
      icon: 'https://www.antdv-next.com/assets/antdv-next-Cum7m2ZU.svg',
      name: t('homePage.previewThemes.default'),
      key: 'light',
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*T8IlRaNez08AAAAARwAAAAgAegCCAQ/original',
      props: getBasePreviewThemeProps(theme.defaultAlgorithm),
    },
    {
      icon: 'https://mui.com/static/favicon.svg',
      name: t('homePage.previewThemes.mui'),
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*IFkZRpIKEEkAAAAAQzAAAAgAegCCAQ/original',
      props: muiTheme.value,
      copyCode: muiThemeSource,
    },
    {
      icon: 'https://ui.shadcn.com/favicon.ico',
      name: t('homePage.previewThemes.shadcn'),
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*56tPQbwgFyEAAAAARuAAAAgAegCCAQ/original',
      props: shadcnTheme.value,
      copyCode: shadcnThemeSource,
    },
    {
      icon: 'https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg',
      name: t('homePage.previewThemes.bootstrap'),
      props: bootstrapTheme.value,
      copyCode: bootstrapThemeSource,
    },
    {
      name: t('homePage.previewThemes.cartoon'),
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*fLjhR5tqNIwAAAAAN9AAAAgAegCCAQ/original',
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tgpBT7vYIUsAAAAAQ-AAAAgAegCCAQ/original',
      props: cartoonTheme.value,
      copyCode: cartoonThemeSource,
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rjPZR5DHPO0AAAAAQBAAAAgAegCCAQ/original',
      name: t('homePage.previewThemes.dark'),
      key: 'dark',
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*ETkNSJ-oUGwAAAAAQ_AAAAgAegCCAQ/original',
      bgImgDark: true,
      props: getBasePreviewThemeProps(theme.darkAlgorithm),
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Tm6ESY5h6ZgAAAAAQBAAAAgAegCCAQ/original',
      name: t('homePage.previewThemes.illustration'),
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*HuVGQKqOER0AAAAARsAAAAgAegCCAQ/original',
      props: illustrationTheme.value,
      copyCode: illustrationThemeSource,
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*GF9US7qG8tAAAAAAQCAAAAgAegCCAQ/original',
      name: t('homePage.previewThemes.glass'),
      props: glassTheme.value,
      copyCode: glassThemeSource,
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*MsjGSYbZ6xkAAAAAQCAAAAgAegCCAQ/original',
      name: t('homePage.previewThemes.geek'),
      bgImg:
        'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*fzA2T4ms154AAAAARtAAAAgAegCCAQ/original',
      bgImgDark: true,
      props: geekTheme.value,
      copyCode: geekThemeSource,
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/3e899b2b-4eb4-4771-a7fc-14c7ff078aed.svg',
      name: t('homePage.previewThemes.lark'),
      bgImg:
        'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iM6CQ496P3oAAAAAAAAAAAAADrJ8AQ/fmt.webp',
      props: larkTheme.value,
      copyCode: larkThemeSource,
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/ed9b04e8-9b8d-4945-8f8a-c8fc025e846f.svg',
      name: t('homePage.previewThemes.blossom'),
      bgImg:
        'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*s5OdR6wZZIkAAAAAAAAAAAAADrJ8AQ/fmt.webp',
      props: blossomTheme.value,
      copyCode: blossomThemeSource,
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bOiWT4-34jkAAAAAAAAAAAAADrJ8AQ/original',
      name: t('homePage.previewThemes.v4'),
      props: v4Theme.value,
      copyCode: v4ThemeSource,
    },
  ])
}

export default usePreviewThemes
