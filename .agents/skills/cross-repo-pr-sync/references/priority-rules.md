# 同步优先级规则详解

## 优先级体系

本规则专为 React 组件库 → Vue3 移植场景设计，
以 ant-design → antdv-next 为典型案例，也可适用于其他跨框架同步场景。

---

## P0 🔴 紧急（当天处理）

**判断条件（满足任意一条）**：
- Labels 含 `Security` / `security`
- 标题或 body 含关键词：`XSS`, `CSRF`, `injection`, `security`, `vulnerability`
- 标题含：`crash`, `fatal`, `data loss`, `corruption`
- 影响用户数据的严重 bug

**处理原则**：
- 不等下次版本周期，单独发 patch
- 可以简化 review 流程，但至少 1 人审核

---

## P1 🟠 高优先级（本迭代内完成）

**判断条件（满足任意一条）**：
- Labels 含 `bug` 且影响核心交互组件：
  - Form / FormItem（表单提交、校验逻辑）
  - Table（渲染、分页、排序）
  - Select / AutoComplete（选项、搜索）
  - Modal / Drawer（开关状态、层级）
  - Upload（文件处理）
- 标题含：`regression`, `broken`, `not working`
- PR 关联的 issue 有大量 👍 反应（>10）
- commit message 含 `!`（breaking change marker）

**处理原则**：
- 排入当前 sprint
- 需要完整测试覆盖

---

## P2 🟡 中优先级（下个迭代）

**判断条件（大多数 PR 属于此类）**：
- 普通 bug fix（非核心组件，或影响面较小）
- `feat` 类型：新增 prop、新增功能
- 体验优化（动画、过渡、响应速度）
- TypeScript 类型完善（有实际影响的）
- 无障碍（a11y）改进

**处理原则**：
- 按组件分批同步
- 可以批量处理同一组件的多个 P2

---

## P3 🟢 低优先级（有空再做）

**判断条件**：
- `docs` 类型：仅文档更新
- 样式微调（px 级别的间距调整）
- 废弃警告（deprecation notice）
- 内部重构（对外 API 无变化）
- 纯 TypeScript 类型的细微修复（无运行时影响）

**处理原则**：
- 积累后批量处理
- 文档类可直接由 AI 辅助生成对应 Vue3 文档

---

## ⚪ Skip（跳过，不同步）

**判断条件（满足任意一条则跳过）**：
- 文件变更仅包含：
  - `site/` - 演示站点
  - `.github/` - GitHub Actions / issue 模板
  - `scripts/` - 构建脚本（React 特有）
  - `*.test.tsx` only - 仅测试文件（需对应写 Vue 测试）
- 标题明确包含：`[React 18]`, `[SSR]`, `[Next.js]`
- 变更内容是 React 特有 API，Vue3 没有等价实现且不需要：
  - `React.Suspense` / `React.lazy` 相关
  - `ReactDOM.createPortal`（Vue3 有 Teleport 替代，记录为 Medium 难度）
  - Server Components 相关

**注意**：Skip 不代表永远不处理，而是当前阶段不主动同步。
表格中仍然列出，人工复核后可降级为 P3。

---

## 同步难度评估

### Low（直接移植，1-2小时）

- 纯 CSS/Less 变量修改
- 计算逻辑修复（不涉及渲染）
- 新增一个 prop（类型简单，无副作用）
- 事件 handler 逻辑修复

### Medium（需要适配，半天到1天）

- JSX → Template/Render Function 转换
- `props.children` → `slots`
- `useRef` → `ref` / `defineExpose`
- `React.cloneElement` → 需要重构为 slot 方案
- Context → provide/inject 重构
- `useEffect` → watch/watchEffect/onMounted

### High（需要架构讨论，1-3天）

- 深度使用 React Hooks 的组件逻辑重写
- HOC（高阶组件）模式 → Vue3 组合式重构
- 状态管理方案差异导致的架构调整
- 渲染性能优化（React 特有，如 memo/useMemo）

---

## 优先级覆盖规则

当自动判断的优先级与实际情况不符时，可手动覆盖：

```markdown
<!-- 在 PR checklist 顶部添加 -->
**优先级覆盖**: P2 → P1
**覆盖原因**: 社区反馈强烈，issues #xxx 有 50+ 反馈
```

---

## 组件重要性排序（供 P1 判断参考）

**Tier 1（核心，bug 直接升 P1）**：
Form, Table, Select, Input, Button, Modal, DatePicker, Upload, Tree

**Tier 2（重要，bug 保持 P2）**：
Drawer, Tabs, Menu, Pagination, Checkbox, Radio, Switch

**Tier 3（辅助，bug 可降 P3）**：
Tag, Badge, Avatar, Tooltip, Popover, Divider, Breadcrumb
