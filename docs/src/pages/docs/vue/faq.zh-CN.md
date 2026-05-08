---
title: FAQ
---

## 多个组件放一排时没有垂直对齐怎么办？

尝试使用 [Space](/components/space-cn) 组件来使他们对齐。

## 我的组件默认语言是英文的？如何切回中文的。

请尝试使用 [ConfigProvider](/components/config-provider-cn#config-provider-demo-locale) 组件来包裹你的应用。

如果日期组件的国际化仍未生效，请配置 `dayjs.locale('zh-cn')` 并**检查你本地的 `dayjs` 版本和 `antdv-next` 依赖的 `dayjs` 版本是否一致**。

## 为什么时间类组件的国际化 locale 设置不生效？

请检查是否正确设置了 dayjs 语言包。

```js
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
```

如果还有问题，请检查是否有两个版本的 dayjs 共存？

```jsx
npm ls dayjs
```

一般来说，如果项目中依赖的 dayjs 版本和 antdv-next 依赖的 dayjs 版本 无法兼容（semver 无法匹配，比如项目中的 dayjs 版本写死且较低），则会导致使用两个不同版本的 dayjs 实例，这样也会导致国际化失效。
