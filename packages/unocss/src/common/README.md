# Common 模块

这个目录包含了 `presetAntd` 和 `presetAntdTailwind4` 两个预设的公共代码。

## 文件结构

```
common/
├── index.ts           # 统一导出
├── types.ts           # 公共类型定义
├── colors.ts          # 颜色相关工具函数
├── theme.ts           # 主题配置生成函数
├── rules.ts           # 规则生成函数
└── autocomplete.ts    # 自动补全模板生成函数
```

## 模块说明

### types.ts
- `BasePresetOptions` - 基础预设配置接口
- `colorNames` - 颜色名称常量
- `ColorName` - 颜色名称类型

### colors.ts
- `generatePalette()` - 生成单个颜色调色板
- `buildPalettes()` - 构建完整的调色板

### theme.ts
- `buildColorsTheme()` - 构建颜色主题
- `buildSpacingTheme()` - 构建间距主题
- `buildBorderRadiusTheme()` - 构建边框圆角主题（Wind3 风格）
- `buildRadiusTheme()` - 构建边框圆角主题（Tailwind 4 风格）
- `buildFontSizeTheme()` - 构建字体大小主题（Wind3 风格）
- `buildTextTheme()` - 构建文本主题（Tailwind 4 风格）
- `buildShadowTheme()` - 构建阴影主题

### rules.ts
- `createColorRules()` - 创建颜色类规则
- `createBorderRules()` - 创建边框颜色规则
- `createSpacingRules()` - 创建间距规则（Margin / Padding）
- `createTextRules()` - 创建文本规则（支持 fontSize 和 text 两种模式）
- `createRoundedRules()` - 创建圆角规则（支持 borderRadius 和 radius 两种模式）
- `createShadowRules()` - 创建阴影规则（支持 boxShadow 和 shadow 两种模式）

### autocomplete.ts
- `createAutocompleteTemplates()` - 创建自动补全模板

## 使用示例

### 在 presetAntd 中使用

```typescript
import {
  buildBorderRadiusTheme,
  buildColorsTheme,
  buildFontSizeTheme,
  buildPalettes,
  buildShadowTheme,
  buildSpacingTheme,
  createAutocompleteTemplates,
  createBorderRules,
  createColorRules,
  createRoundedRules,
  createShadowRules,
  createSpacingRules,
  createTextRules,
} from './common'

export const presetAntd = definePreset((options?: AntdPresetOptions): Preset => {
  const prefix = options?.prefix || 'a'
  const antPrefix = options?.antPrefix || 'ant'
  const builtPalettes = buildPalettes(antPrefix)

  return {
    name: 'preset-antd',
    theme: {
      colors: buildColorsTheme(antPrefix, builtPalettes),
      spacing: buildSpacingTheme(antPrefix),
      borderRadius: buildBorderRadiusTheme(antPrefix),
      fontSize: buildFontSizeTheme(antPrefix),
      boxShadow: buildShadowTheme(antPrefix),
    },
    rules: ([
      ...createColorRules(prefix),
      ...createBorderRules(prefix),
      ...createSpacingRules(prefix),
      ...createTextRules(prefix, 'fontSize'),
      ...createRoundedRules(prefix, 'borderRadius'),
      ...createShadowRules(prefix, 'boxShadow'),
    ] as any),
    autocomplete: {
      templates: createAutocompleteTemplates({
        prefix,
        themeKeys: {
          rounded: 'borderRadius',
          shadow: 'boxShadow',
          text: 'fontSize',
        },
      }),
    },
  }
})
```

### 在 presetAntdTailwind4 中使用

```typescript
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

export const presetAntdTailwind4 = definePreset((options?: AntdPresetTailwind4Options): Preset => {
  const prefix = options?.prefix || 'a'
  const antPrefix = options?.antPrefix || 'ant'
  const builtPalettes = buildPalettes(antPrefix)

  return {
    name: 'preset-antd-tailwind4',
    theme: {
      colors: buildColorsTheme(antPrefix, builtPalettes),
      spacing: buildSpacingTheme(antPrefix),
      radius: buildRadiusTheme(antPrefix),
      text: buildTextTheme(antPrefix),
      shadow: buildShadowTheme(antPrefix),
      defaults: {},
    },
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
```

## 设计原则

1. **代码复用** - 将两个 preset 的公共部分提取到 common 目录，减少重复代码
2. **灵活性** - 通过参数支持不同的主题键名（如 borderRadius vs radius）
3. **可维护性** - 模块化设计，每个文件职责明确
4. **类型安全** - 完整的 TypeScript 类型定义
5. **向后兼容** - 保持原有的 API 不变

## 优势

- ✅ **减少重复** - 约 90% 的代码被复用
- ✅ **易于维护** - 修改一处，两个 preset 同时生效
- ✅ **清晰的模块划分** - 每个模块职责单一
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **扩展性强** - 容易添加新的主题或规则
