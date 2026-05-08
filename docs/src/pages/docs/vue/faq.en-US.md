---
title: FAQ
---

## Components are not vertically aligned when placed in single row.

Try [Space](https://ant.design/components/space/) component to make them aligned.

## Date-related components locale is not working?

Please check whether you have imported dayjs locale correctly.

```jsx
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
```

Please check whether there are two versions of dayjs installed.

```jsx
npm ls dayjs
```

If you are using a mismatched version of dayjs with antdv-next dependent dayjs in your project. That would be a problem cause locale not working.
