# Checklist 模板库

## 标准同步 Checklist（通用）

```markdown
---

## ✅ 同步任务：#{PR编号} - {PR标题}

> **优先级**: {🔴 P0 / 🟠 P1 / 🟡 P2 / 🟢 P3}
> **类型**: {fix / feat / perf / docs}
> **上游 PR**: https://github.com/{upstream_repo}/pull/{PR编号}
> **上游 Commit**: `{commit_sha_short}`
> **涉及组件**: {ComponentName}
> **同步难度**: {Low / Medium / High}
> **关联 Issue**: {issue_url 或 N/A}
> **预估工时**: {0.5h / 1h / 2h / 3h+}

### 📖 变更摘要
<!-- 简要描述上游 PR 解决了什么问题 -->
{摘要内容}

### 🔗 参考资源
- 上游 PR：[#{PR编号} {PR标题}]({pr_url})
- 相关 issue：{issue_url}
- 上游 diff：{diff_url}

---

### 🔍 Phase 1：Pre-sync 分析
- [ ] 阅读上游 PR 完整内容和所有 review 评论
- [ ] 阅读关联 issue，了解问题背景
- [ ] 在 antdv-next 中复现/确认同样的问题或缺失功能
- [ ] 查看上游变更的完整文件列表
- [ ] 评估 Vue3 适配工作量，确认难度估计是否准确
- [ ] 检查是否有其他依赖 PR 需要先同步

### 🛠️ Phase 2：实现
- [ ] 创建功能分支：`sync/ant-design-#{PR编号}`
- [ ] 实现对应的 fix/feat
  - [ ] 核心逻辑实现
  - [ ] 处理 React→Vue3 语法差异（见下方 Checklist）
  - [ ] 处理 CSS/样式差异（class 绑定方式等）
- [ ] 编写/更新单元测试（`.spec.ts` 或 `.test.ts`）
- [ ] 更新组件 API 文档（若有新增/修改 prop/event/slot）
- [ ] 更新 CHANGELOG（若适用）

### ⚠️ Phase 3：React→Vue3 差异检查
<!-- 根据实际情况勾选需要处理的项 -->
- [ ] `children` / `ReactNode` → `slots`（默认 slot 或具名 slot）
- [ ] `React.forwardRef` → `defineExpose` / `ref` 透传
- [ ] `useEffect(() => {}, [])` → `onMounted` / `watchEffect`
- [ ] `useCallback` / `useMemo` → `computed` / `watch`
- [ ] `useRef` → `ref()` / `shallowRef()`
- [ ] `className` → `class`（模板中）或 `:class` 绑定
- [ ] `style={{ key: value }}` → `:style="{ key: value }"`
- [ ] `onChange` → `@change` / `@update:value` + `emits` 声明
- [ ] Context API → `provide` / `inject`
- [ ] `React.cloneElement` → slot 重构或 `h()` 函数
- [ ] `React.createPortal` → `<Teleport>` 组件
- [ ] `React.memo` → 无直接等价（Vue3 本身优化较好）
- [ ] 事件修饰符差异（`.stop`, `.prevent` 等）

### 🧪 Phase 4：验证
- [ ] 本地运行单元测试套件：`pnpm test`
- [ ] 本地运行 E2E 测试（若有）
- [ ] 在 demo 环境中手动验证修复效果
- [ ] 验证修复不引入回归（测试相邻功能）
- [ ] 验证 TypeScript 类型正确（`pnpm type-check`）

### 📦 Phase 5：提交与发布
- [ ] 创建 antdv-next PR
  - 标题格式：`[sync] {type}({Component}): {描述} (ant-design#{PR编号})`
  - 示例：`[sync] fix(Button): loading state not cleared (#12345)`
- [ ] PR 描述中：
  - [ ] 链接上游 PR
  - [ ] 说明适配了哪些 Vue3 差异
  - [ ] 附上 before/after 截图（UI 变更时）
- [ ] 至少 1 位 Reviewer 完成 Code Review
- [ ] CI 所有 Job 通过
- [ ] Squash and Merge 到主分支
- [ ] 确认是否需要单独发布 patch 版本

---
**完成时间**: ________ / **实际工时**: ________ / **负责人**: ________
```

---

## Batch Checklist（批量同步多个 P3/文档类）

```markdown
## 📦 批量同步任务 - {日期} - {组件名} 文档/样式更新

| PR # | 标题 | 状态 |
|------|------|------|
| #{编号} | {标题} | ⬜ |
| #{编号} | {标题} | ⬜ |

### 执行步骤
- [ ] 创建统一分支：`sync/batch-{日期}-{主题}`
- [ ] 按表格顺序逐一处理
- [ ] 统一 PR 提交，引用所有上游 PR
- [ ] 一次性合并发布
```

---

## 团队同步会议模板

```markdown
## 🔄 上游同步周会 - {日期}

### 本期新增 PR（需同步）
{汇总表格}

### 进行中任务更新
| PR # | 负责人 | 进度 | 阻塞点 |
|------|--------|------|--------|
| | | | |

### 已完成同步
| PR # | 完成日期 | antdv-next PR |
|------|---------|--------------|
| | | |

### 决策事项
- [ ] 是否发布 patch 版本（修复了哪些 P0/P1）
- [ ] 下周重点同步哪些 PR
```
