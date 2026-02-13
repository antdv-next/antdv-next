import { presetAntd } from '@antdv-next/unocss'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  outputToCssLayers: true,
  safelist: [
  ],
  theme: {
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetAntd(),
  ],
  shortcuts: [
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
