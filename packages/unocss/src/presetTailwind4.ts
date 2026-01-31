import type { Preset } from 'unocss'
import type { BasePresetOptions } from './common'
import { definePreset } from 'unocss'
import {
  buildColorsTheme,
  buildPalettes,
  buildRadiusTheme,
  buildShadowTheme,
  buildSpacingTheme,
  buildTextTheme,
  createAutocompleteTemplates,
  createBorderRules,
  createColorRules,
  createRoundedRules,
  createShadowRules,
  createSpacingRules,
  createTextRules,
} from './common'

export type { ColorName } from './common'

export interface AntdPresetTailwind4Options extends BasePresetOptions {}

export const presetAntdTailwind4 = definePreset((options?: AntdPresetTailwind4Options): Preset => {
  const prefix = options?.prefix || 'a'
  const antPrefix = options?.antPrefix || 'ant'

  // 根据 antPrefix 动态生成调色板
  const builtPalettes = buildPalettes(antPrefix)

  return {
    name: 'preset-antd-tailwind4',
    theme: {
      colors: buildColorsTheme(antPrefix, builtPalettes),
      spacing: buildSpacingTheme(antPrefix),
      radius: buildRadiusTheme(antPrefix),
      text: buildTextTheme(antPrefix),
      shadow: buildShadowTheme(antPrefix),
      // Tailwind 4 新增的 defaults 配置
      defaults: {},
    },

    // 自定义规则
    rules: ([
      ...createColorRules(prefix),
      ...createBorderRules(prefix),
      ...createSpacingRules(prefix),
      ...createTextRules(prefix, 'text'),
      ...createRoundedRules(prefix, 'radius'),
      ...createShadowRules(prefix, 'shadow'),
    ] as any),
    autocomplete: {
      templates: createAutocompleteTemplates({
        prefix,
        themeKeys: {
          rounded: 'radius',
          shadow: 'shadow',
          text: 'text',
        },
      }),
    },
  }
})

export default presetAntdTailwind4
